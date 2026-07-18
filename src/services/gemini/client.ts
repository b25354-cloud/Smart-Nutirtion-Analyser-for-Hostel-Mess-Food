import { env } from '@/config/env';
import type { ServiceResult } from '@/types';
import { toServiceError } from '@/utils/error';

interface GeminiRequest {
  prompt: string;
}

export interface GeminiResponse {
  text: string;
}

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export const geminiClient = {
  async generateText({ prompt }: GeminiRequest): Promise<ServiceResult<GeminiResponse>> {
    try {
      console.log("MODEL:", env.VITE_GEMINI_MODEL);

      console.log(
        "URL:",
        `${GEMINI_ENDPOINT}/${env.VITE_GEMINI_MODEL}:generateContent?key=${env.VITE_GEMINI_API_KEY}`
      );

      const response = await fetch(
        `${GEMINI_ENDPOINT}/${env.VITE_GEMINI_MODEL}:generateContent?key=${env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });
      console.log(response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log(errorText);

        return {
          ok: false,
          error: {
            code: `GEMINI_HTTP_${response.status}`,
            message: "Gemini request failed",
            details: errorText,
          },
        };
      }

      const payload = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      return {
        ok: true,
        data: {
          text: payload.candidates?.[0]?.content?.parts?.[0]?.text ?? '',
        },
      };
    } catch (error) {
      return { ok: false, error: toServiceError(error, 'Gemini request failed unexpectedly') };
    }
  },
};
