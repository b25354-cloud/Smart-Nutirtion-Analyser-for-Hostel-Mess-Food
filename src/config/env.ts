import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('MessMate AI'),
  VITE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
  VITE_GEMINI_API_KEY: z.string().min(1),
  VITE_GEMINI_MODEL: z.string().default('gemini-1.5-flash'),
  VITE_DEFAULT_COLLEGE_CODE: z.string().default('iit_mandi'),
  VITE_ENABLE_ANALYTICS: z.enum(['true', 'false']).default('false'),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  const formatted = parsedEnv.error.issues
    .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(`Invalid environment variables.\n${formatted}`);
}

export const env = parsedEnv.data;
