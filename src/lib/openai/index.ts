// src/lib/openai/index.ts

import { env } from "@/env";
import OpenAI from "openai";

export const getOpenAI = () => {
  if (!env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not defined.");
    return null;
  }

  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
};
