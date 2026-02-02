// app/api/transcribe/route.ts
import { NextResponse } from "next/server";
import * as fs from "fs";
import { getOpenAI } from "@/lib/openai";

export async function POST(request: Request) {
  const openai = getOpenAI();
  if (!openai) {
    return NextResponse.json(
      { error: "OpenAI API key is missing" },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;
    let language = formData.get("language") as string;

    if (!audioFile) {
      console.error("No audio file found in request");
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    if (!language) {
      console.warn("No language provided in request. Defaulting to English.");
      language = "en";
    }

    // Convert Blob to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();

    // Create a temporary file path
    const tempFilePath = `/tmp/audio-${Date.now()}.wav`;

    // Use Node's filesystem to write the buffer
    fs.writeFileSync(tempFilePath, new Uint8Array(arrayBuffer));

    try {
      const response = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: "whisper-1",
        language,
      });

      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);

      return NextResponse.json({ text: response.text });
    } catch (openaiError) {
      // Clean up the temporary file in case of error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      console.error("OpenAI API error:", openaiError);
      const errorMessage = (openaiError as Error).message;
      return NextResponse.json(
        { error: "OpenAI API error", details: errorMessage },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("General error:", error);
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: "Error processing transcription", details: errorMessage },
      { status: 500 },
    );
  }
}
