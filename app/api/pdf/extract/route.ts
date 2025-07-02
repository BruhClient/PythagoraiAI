import { Buffer } from "buffer";

export async function POST(request: Request) {
  // dynamic import of pdf-parse inside function

  const pdfParse = (await import("pdf-parse")).default;

  try {
    const { url } = await request.json();

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch PDF");

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdfParse(buffer);

    return new Response(JSON.stringify({ text: data.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: e.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
