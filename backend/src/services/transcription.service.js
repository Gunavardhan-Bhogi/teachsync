import { GoogleGenAI } from '@google/genai';

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

    const response = await ai.models.generateContent({
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
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Transcription Error:", error);
    throw new Error("Failed to transcribe audio with Gemini.");
  }
};
