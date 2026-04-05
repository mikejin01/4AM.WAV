import { NextResponse } from "next/server";
import { deepgram } from "@/lib/integrations/deepgram/server";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("audio");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("audio/")) {
    return NextResponse.json({ error: "File must be an audio type" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const response = await deepgram.listen.v1.media.transcribeFile(buffer, {
      model: "nova-3",
      smart_format: true,
    });

    let text = "";
    if ("results" in response && response.results) {
      const channels = response.results.channels;
      text = channels?.[0]?.alternatives?.[0]?.transcript ?? "";
    }

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Transcription failed" }, { status: 502 });
  }
}
