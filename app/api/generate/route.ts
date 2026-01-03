import { NextResponse } from "next/server"

export const runtime = "nodejs"

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
const MODEL_ID = "google/gemini-2.5-flash-image"

type GenerateRequestJson = {
  prompt?: string
  images?: string[]
}

type OpenRouterChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: unknown
      images?: unknown
    }
  }>
}

function extractImagesFromUnknownImagesField(imagesField: unknown): string[] {
  if (!Array.isArray(imagesField)) return []
  const urls: string[] = []
  for (const item of imagesField) {
    if (!item || typeof item !== "object") continue
    const type = (item as { type?: unknown }).type
    if (type === "image_url") {
      const url = (item as { image_url?: { url?: unknown } }).image_url?.url
      if (typeof url === "string") urls.push(url)
    }
    if (type === "image") {
      const b64 = (item as { image?: { b64_json?: unknown } }).image?.b64_json
      if (typeof b64 === "string") urls.push(`data:image/png;base64,${b64}`)
    }
  }
  return urls
}

function extractImageUrls(content: unknown): string[] {
  if (typeof content === "string") return []
  if (!Array.isArray(content)) return []

  const urls: string[] = []
  for (const part of content) {
    if (!part || typeof part !== "object") continue
    const maybeType = (part as { type?: unknown }).type
    if (maybeType === "image_url") {
      const url = (part as { image_url?: { url?: unknown } }).image_url?.url
      if (typeof url === "string") urls.push(url)
    }
    if (maybeType === "image") {
      const b64 = (part as { image?: { b64_json?: unknown } }).image?.b64_json
      if (typeof b64 === "string") urls.push(`data:image/png;base64,${b64}`)
    }
  }
  return urls
}

async function fileToDataUrl(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString("base64")
  const mimeType = file.type || "image/png"
  return `data:${mimeType};base64,${base64}`
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 })
    }

    const contentType = req.headers.get("content-type") || ""

    let prompt = ""
    let imageDataUrls: string[] = []

    if (contentType.includes("application/json")) {
      const body = (await req.json()) as GenerateRequestJson
      prompt = String(body.prompt ?? "").trim()
      imageDataUrls = Array.isArray(body.images) ? body.images.filter((v) => typeof v === "string") : []
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      prompt = String(formData.get("prompt") ?? "").trim()
      const files = formData.getAll("images").filter((v): v is File => v instanceof File)
      imageDataUrls = await Promise.all(files.slice(0, 9).map((file) => fileToDataUrl(file)))
    } else {
      return NextResponse.json({ error: "Unsupported content-type. Use JSON or multipart/form-data." }, { status: 415 })
    }

    if (!prompt && imageDataUrls.length === 0) {
      return NextResponse.json({ error: "Provide a prompt or at least one image." }, { status: 400 })
    }

    const imageParts = imageDataUrls.slice(0, 9).map((url) => ({
      type: "image_url",
      image_url: { url },
    }))

    const messages = [
      {
        role: "user",
        content: [{ type: "text", text: prompt || " " }, ...imageParts],
      },
    ]

    let res: Response
    try {
      res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(process.env.OPENROUTER_SITE_URL ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL } : {}),
          ...(process.env.OPENROUTER_APP_NAME ? { "X-Title": process.env.OPENROUTER_APP_NAME } : {}),
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages,
          modalities: ["image", "text"],
        }),
        signal: AbortSignal.timeout(60_000),
      })
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to reach OpenRouter.", detail: e instanceof Error ? e.message : String(e) },
        { status: 502 },
      )
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return NextResponse.json({ error: `OpenRouter error: ${res.status}`, detail: text }, { status: 502 })
    }

    const data = (await res.json()) as OpenRouterChatCompletionResponse
    const message = data.choices?.[0]?.message
    const imagesFromImagesField = extractImagesFromUnknownImagesField(message?.images)
    const imagesFromContent = extractImageUrls(message?.content)
    const images = [...imagesFromImagesField, ...imagesFromContent]

    if (images.length === 0) {
      return NextResponse.json(
        {
          error: "No images returned from model.",
          debug: { messageContentType: typeof message?.content, imagesFieldType: typeof message?.images },
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ images })
  } catch (e) {
    return NextResponse.json(
      { error: "Server error.", detail: e instanceof Error ? e.stack || e.message : String(e) },
      { status: 500 },
    )
  }
}
