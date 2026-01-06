"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon, Sparkles, X, Loader2, Download, ExternalLink } from "lucide-react"
import Image from "next/image"

type UploadedImage = {
  file: File
  previewUrl: string
}

export function EditorSection() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const imagesRef = useRef<UploadedImage[]>([])
  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(() => {
    return () => {
      for (const img of imagesRef.current) URL.revokeObjectURL(img.previewUrl)
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFiles = (files: File[]) => {
    setImages((prev) => {
      const next = [...prev]
      for (const file of files) {
        if (next.length >= 9) break
        if (!file.type.startsWith("image/")) continue
        if (file.size > 10 * 1024 * 1024) continue
        next.push({ file, previewUrl: URL.createObjectURL(file) })
      }
      return next
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index]
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleGenerate = async () => {
    if (!prompt.trim() && images.length === 0) return

    setIsGenerating(true)
    setError(null)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    try {
      const formData = new FormData()
      formData.set("prompt", prompt)
      for (const img of images) formData.append("images", img.file, img.file.name)

      const res = await fetch("/api/generate", { method: "POST", body: formData, signal: controller.signal })

      const text = await res.text()
      let data: { images?: string[]; error?: string; detail?: string } = {}
      try {
        data = JSON.parse(text) as { images?: string[]; error?: string; detail?: string }
      } catch {
        data = { error: text || `Request failed: ${res.status}` }
      }

      if (!res.ok) {
        throw new Error([data.error, data.detail].filter(Boolean).join("\n") || `Request failed: ${res.status}`)
      }

      setGeneratedImages(data.images ?? [])
    } catch (e) {
      const message =
        e instanceof Error && e.name === "AbortError"
          ? "Request timed out. Check your network and OPENROUTER_API_KEY."
          : e instanceof Error
            ? e.message
            : "Generation failed"

      setError(message)
      setGeneratedImages([])
    } finally {
      clearTimeout(timeout)
      setIsGenerating(false)
    }
  }

  const downloadImage = async (src: string, index: number) => {
    try {
      const filename = `nano-banana-${index + 1}.png`

      if (src.startsWith("data:")) {
        const a = document.createElement("a")
        a.href = src
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        return
      }

      const res = await fetch(src)
      if (!res.ok) throw new Error(`Download failed: ${res.status}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()

      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed")
    }
  }

  return (
    <section id="generator" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-banana-600">Get Started</h2>
          <h3 className="text-3xl font-bold text-foreground md:text-4xl">Try The AI Editor</h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Upload an image, describe the edit you want, and generate a new result.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Prompt Engine Card */}
          <Card className="border-banana-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-banana-500" />
                Prompt Engine
              </CardTitle>
              <p className="text-sm text-muted-foreground">Transform your image with AI-powered editing</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="img2img">
                <TabsList className="w-full">
                  <TabsTrigger value="img2img" className="flex-1">
                    Image to Image
                  </TabsTrigger>
                  <TabsTrigger value="txt2img" className="flex-1">
                    Text to Image
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="img2img" className="space-y-4 pt-4">
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Model</Label>
                    <p className="text-sm text-muted-foreground">Gemini 2.5 Flash Image (via OpenRouter)</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your images and prompts are sent to a third-party AI provider to generate outputs.
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Batch Processing</Label>
                      <span className="ml-2 rounded bg-banana-100 px-1.5 py-0.5 text-xs font-medium text-banana-700">
                        Pro
                      </span>
                    </div>
                    <Switch disabled />
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium">
                      Reference Image <span className="text-muted-foreground">{images.length}/9</span>
                    </Label>
                    <div
                      className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        dragActive
                          ? "border-banana-400 bg-banana-50"
                          : "border-muted-foreground/25 hover:border-banana-300"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {images.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {images.map((img, index) => (
                            <div key={index} className="group relative aspect-square overflow-hidden rounded-md">
                              <Image
                                src={img.previewUrl || "/placeholder.svg"}
                                alt={`Upload ${index + 1}`}
                                fill
                                sizes="(max-width: 1024px) 33vw, 200px"
                                className="object-contain"
                                unoptimized
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {images.length < 9 && (
                            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-banana-300">
                              <Upload className="h-6 w-6 text-muted-foreground" />
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileInput}
                              />
                            </label>
                          )}
                        </div>
                      ) : (
                        <label className="flex cursor-pointer flex-col items-center gap-2">
                          <div className="rounded-full bg-muted p-3">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium">Add Image</span>
                          <span className="text-xs text-muted-foreground">Max 10MB</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
                        </label>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="txt2img" className="space-y-4 pt-4">
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Model</Label>
                    <p className="text-sm text-muted-foreground">Gemini 2.5 Flash Image (via OpenRouter)</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <Label className="mb-2 block text-sm font-medium">Main Prompt</Label>
                <Textarea
                  placeholder="Describe how you want to transform the image..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-24 resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt.trim() && images.length === 0)}
                className="w-full bg-banana-400 text-banana-900 hover:bg-banana-500"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Now"
                )}
              </Button>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <p className="text-xs text-muted-foreground">
                Don&apos;t upload sensitive personal data. By generating you agree to our{" "}
                <Link className="underline underline-offset-2" href="/terms">
                  Terms
                </Link>{" "}
                and{" "}
                <Link className="underline underline-offset-2" href="/privacy">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* Output Gallery Card */}
          <Card className="border-banana-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-banana-500" />
                Output Gallery
              </CardTitle>
              <p className="text-sm text-muted-foreground">Your ultra-fast AI creations appear here instantly</p>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-bounce text-4xl">🍌</div>
                    <p className="text-sm text-muted-foreground">Generating your masterpiece...</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="grid h-full w-full grid-cols-2 gap-2 p-2">
                    {generatedImages.map((src, idx) => (
                      <div key={idx} className="group relative overflow-hidden rounded-md bg-background">
                        <Image
                          src={src || "/placeholder.svg"}
                          alt={`Generated result ${idx + 1}`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 300px"
                          className="object-contain"
                          unoptimized
                        />
                        <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => downloadImage(src, idx)}
                            className="rounded-md bg-background/90 p-2 shadow-sm"
                            aria-label={`Download image ${idx + 1}`}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <a
                            href={src}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md bg-background/90 p-2 shadow-sm"
                            aria-label={`Open image ${idx + 1} in new tab`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="text-4xl opacity-50">🍌</div>
                    <div>
                      <p className="font-medium text-foreground">Ready for instant generation</p>
                      <p className="text-sm text-muted-foreground">Enter your prompt and unleash the power</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
