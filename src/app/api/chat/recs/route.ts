import { getOpenAI } from "@/lib/openai";
import { NextResponse } from "next/server";

interface LanguagePreferences {
  nativeLanguage: string;
  learningLanguage: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced";
}

const DEFAULT_PREFERENCES: LanguagePreferences = {
  nativeLanguage: "Portuguese",
  learningLanguage: "English",
  proficiencyLevel: "beginner",
};

const generateResponseSuggestionPrompt = (
  preferences: LanguagePreferences,
  latestMessage: string,
): string => {
  return `You are a student learning a new language with the help of an AI language teacher. Your goal is to respond naturally and concisely to the latest message from your AI teacher in your learning language and provide its translation in your native language.

Context:
- Your native language: ${preferences.nativeLanguage}
- Your learning language: ${preferences.learningLanguage}
- Your proficiency level: ${preferences.proficiencyLevel}

Guidelines:
1. Provide a natural and concise response in your learning language (${preferences.learningLanguage}).
2. Offer the translation of your response in your native language (${preferences.nativeLanguage}).
3. If the latest AI teacher message indicates the conversation is ending (e.g., 
"Thank you for choosing our shop! Your special someone will love these red roses. Have a wonderful day!" or 
"You're welcome! Have a wonderful day, and I hope the bouquet spreads love and joy. See you next time!" or 
"Goodbye! Take care and come back soon for more floral delights.", 
"Goodbye and happy flower-giving! If you need more floral advice, feel free to visit our shop again."
), 
return:
{
  "text": "end",
  "translation": "fim"
}
4. Otherwise, output the result in the following JSON format:
{
  "text": "learning_language_response",
  "translation": "translation_in_native_language"
}
**Important:** Output **only** the JSON response and nothing else.

Latest AI teacher message: "${latestMessage}"`;
};

export async function POST(request: Request) {
  const openai = getOpenAI();
  if (!openai) {
    return NextResponse.json(
      { error: "OpenAI API key is missing" },
      { status: 500 },
    );
  }

  try {
    const { latestAiMessage, preferences = DEFAULT_PREFERENCES } =
      await request.json();

    if (!latestAiMessage) {
      return NextResponse.json(
        { error: "Both latest message must be provided" },
        { status: 400 },
      );
    }

    const systemPrompt = generateResponseSuggestionPrompt(
      preferences,
      latestAiMessage,
    );

    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [{ role: "system", content: systemPrompt }];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const responseContent = completion.choices[0].message?.content;

    try {
      const parsedResponse = JSON.parse(responseContent ?? "");
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      return NextResponse.json(
        { error: "Invalid response format" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Response Suggestion API error:", error);
    return NextResponse.json(
      { error: "Error generating response suggestion" },
      { status: 500 },
    );
  }
}
