import { GoogleGenAI } from '@google/genai';

/**
 * Generates lecture summary and assessment questions from transcript text using Google Gemini API.
 * 
 * @param {string} transcriptText - Raw lecture transcript from Whisper
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

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const responseText = response.text || '';
  
  // Clean markdown code fence wrappers if present
  const cleanedText = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    const parsedData = JSON.parse(cleanedText);
    return parsedData;
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', responseText);
    throw new Error('Gemini API returned invalid JSON structure.');
  }
};
