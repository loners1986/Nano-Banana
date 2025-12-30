import { NextResponse } from "next/server"

type OpenRouterMessageContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }

function isLikelyImageUrl(value: string) {
  if (value.startsWith("data:image/")) return true
  if (!/^https?:\/\//i.test(value)) return false
  return /\.(png|jpe?g|webp|gif)(\?|#|$)/i.test(value)
}

function extractImageUrlsFromText(text: string): string[] {
  const urls: string[] = []

  const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g
  for (const match of text.matchAll(markdownImageRegex)) {
    const url = match[1]?.trim()
    if (url && isLikelyImageUrl(url)) urls.push(url)
  }

  const dataUrlRegex = /data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g
  for (const match of text.matchAll(dataUrlRegex)) {
    const url = match[0]?.trim()
    if (url) urls.push(url)
  }

  const httpUrlRegex = /https?:\/\/[^\s)"]+/g
  for (const match of text.matchAll(httpUrlRegex)) {
    const url = match[0]?.trim()
    if (url && isLikelyImageUrl(url)) urls.push(url)
  }

  return urls
}

function deepCollectImageUrls(node: unknown, maxDepth: number): string[] {
  if (maxDepth <= 0 || node == null) return []

  if (typeof node === "string") {
    if (isLikelyImageUrl(node)) return [node]
    if (node.includes("data:image/") || node.includes("http://") || node.includes("https://")) {
      return extractImageUrlsFromText(node)
    }
    return []
  }

  if (Array.isArray(node)) {
    return node.flatMap((item) => deepCollectImageUrls(item, maxDepth - 1))
  }

  if (typeof node === "object") {
    return Object.values(node as Record<string, unknown>).flatMap((value) => deepCollectImageUrls(value, maxDepth - 1))
  }

  return []
}

function extractImageUrlsFromMessage(message: unknown): string[] {
  if (!message || typeof message !== "object") return []

  const content = (message as { content?: unknown }).content
  if (typeof content === "string") return extractImageUrlsFromText(content)
  if (!Array.isArray(content)) {
    return deepCollectImageUrls(message, 6)
  }

  const parts = content as OpenRouterMessageContentPart[]
  const urls = parts
    .filter((part) => part?.type === "image_url" && typeof part.image_url?.url === "string")
    .map((part) => (part as { image_url: { url: string } }).image_url.url)
    .filter(Boolean)

  if (urls.length) return urls

  return deepCollectImageUrls(message, 6)
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENROUTER_API_KEY in environment" }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const prompt = (body as { prompt?: unknown }).prompt
  const imageDataUrl = (body as { imageDataUrl?: unknown }).imageDataUrl

  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
  }

  if (typeof imageDataUrl !== "string" || !imageDataUrl.startsWith("data:image/")) {
    return NextResponse.json({ error: "Missing imageDataUrl (data:image/...)" }, { status: 400 })
  }

  const origin = req.headers.get("origin") || req.headers.get("referer") || "http://localhost:3000"

  const promptWithOutputHint = `${prompt.trim()}\n\nReturn ONLY the final image.`

  const upstreamRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": origin,
      "X-Title": "Nano Banana",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptWithOutputHint },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    }),
  })

  let upstreamJson: any
  try {
    upstreamJson = await upstreamRes.json()
  } catch {
    upstreamJson = null
  }

  if (!upstreamRes.ok) {
    const errorMessage =
      upstreamJson?.error?.message ||
      upstreamJson?.error ||
      `OpenRouter request failed with status ${upstreamRes.status}`
    return NextResponse.json({ error: errorMessage, details: upstreamJson }, { status: upstreamRes.status })
  }

  const message = upstreamJson?.choices?.[0]?.message
  const imageUrls = uniqueStrings([
    ...extractImageUrlsFromMessage(message),
    ...deepCollectImageUrls(upstreamJson, 8),
  ])

  if (!imageUrls.length) {
    return NextResponse.json(
      {
        error: "No image returned from model",
        details: {
          message,
          choice: upstreamJson?.choices?.[0],
        },
      },
      { status: 502 },
    )
  }

  return NextResponse.json({ imageUrls })
}
