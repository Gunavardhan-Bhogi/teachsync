import { GoogleGenAI } from '@google/genai';

/**
 * Helper to handle transient API spikes (e.g. 503 high demand) with exponential backoff.
 */
const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isTransient =
        err.status === 503 ||
        err.status === 429 ||
        err.message?.includes('503') ||
        err.message?.includes('high demand') ||
        err.message?.includes('UNAVAILABLE');

      if (isTransient && i < retries - 1) {
        const waitTime = delay * Math.pow(2, i);
        console.warn(
          `[Gemini] Transient error (${err.status || '503'}). Retrying in ${waitTime}ms... (Attempt ${i + 1}/${retries})`
        );
        await new Promise((res) => setTimeout(res, waitTime));
      } else {
        throw err;
      }
    }
  }
};

/**
 * Generates lecture summary and assessment questions from transcript text using Google Gemini API.
 *
 * @param {string} transcriptText - Raw lecture transcript from Whisper / Gemini Transcription
 * @param {Array<string>} formats - Question formats requested (e.g. ['mcq', 'fill_in_the_blanks', 'short_answer'])
 * @param {number} totalQuestions - Total number of questions to generate
 * @returns {Promise<Object>} Structured JSON containing topic, summary, and assessment questions.
 */
export const generateLectureAnalysis = async (transcriptText, formats = ['mcq'], totalQuestions = 5) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert educational AI assistant.
Analyze the following lecture transcript. The speech may contain multilingual code-switching (e.g., Hinglish, Spanglish, mixed classroom speech). Process all spoken content, understand the context, and provide all output strictly in ENGLISH.

Lecture Transcript:
"""
${transcriptText}
"""

Requirements:
1. Identify or summarize the main topic of the lecture into a clear, concise "topic" title.
2. Extract a list of key takeaways ("keyTakeaways") as an array of clear strings.
3. Write comprehensive, well-structured detailed lecture notes ("detailedNotes") in clean Markdown format with headers, bullet points, and key concepts covered.
4. Generate an assessment array containing exactly ${totalQuestions} questions distributed across the requested formats: ${JSON.stringify(formats)}.
   - Each question object must have:
     - questionNumber (integer starting from 1)
     - questionType (string, matching one of the requested formats)
     - question (string)
     - options (array of 4 strings for MCQ/choice questions, empty array [] for fill_in_the_blanks or short_answer)
     - correctAnswer (string)
     - explanation (string explaining why the answer is correct)

Return ONLY a valid JSON object matching this schema:
{
  "topic": "Topic Title",
  "summary": {
    "keyTakeaways": ["Point 1", "Point 2"],
    "detailedNotes": "# Detailed Notes\\n\\nMarkdown content..."
  },
  "assessment": [
    {
      "questionNumber": 1,
      "questionType": "mcq",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Detailed explanation..."
    }
  ]
}`;

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    })
  );

  const responseText = response.text || '';

  // Clean markdown code fence wrappers if present
  const cleanedText = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', responseText);
    throw new Error('Gemini API returned invalid JSON structure.');
  }
};
