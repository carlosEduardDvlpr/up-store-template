// app/api/tts/route.ts
import { getOpenAI } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const openai = getOpenAI();
  if (!openai) {
    return NextResponse.json(
      { error: "OpenAI API key is missing" },
      { status: 500 },
    );
  }

  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Using nova for a natural female voice
      input: text,
    });

    // Get the audio data as an ArrayBuffer
    const audioData = await mp3Response.arrayBuffer();

    // Return the audio data with appropriate headers
    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "Error generating speech" },
      { status: 500 },
    );
  }
}
