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
          `[Gemini Transcription] Transient error (${err.status || '503'}). Retrying in ${waitTime}ms... (Attempt ${i + 1}/${retries})`
        );
        await new Promise((res) => setTimeout(res, waitTime));
      } else {
        throw err;
      }
    }
  }
};

export const transcribeAudio = async (audioBuffer, mimeType) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const audioBase64 = audioBuffer.toString('base64');

    // Strict prompt to ensure Gemini only transcribes and doesn't try to answer questions
    const prompt = `
      You are an expert transcriptionist. 
      Listen to the following audio and transcribe it exactly word-for-word. 
      Do not add any introductions, commentary, or markdown formatting. 
      Only output the exact spoken text.
    `;

    // Wrap the Gemini call in the retry utility
    const response = await retryWithBackoff(() => 
      ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'audio/webm',
                  data: audioBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
      })
    );

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Transcription Error:", error);
    throw new Error("Failed to transcribe audio with Gemini.");
  }
};
