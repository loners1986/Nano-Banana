"use client"

import type React from "react"

import { useRef, useState, useCallback } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string | null) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          setPreview(result)
          onImageUpload(result)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const clearImage = useCallback(() => {
    setPreview(null)
    onImageUpload(null)
  }, [onImageUpload])

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Reference Image</label>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          isDragging ? "border-banana bg-banana/5" : "border-border hover:border-banana/50"
        }`}
      >
        {preview ? (
          <div className="relative aspect-video w-full">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="rounded-lg object-contain"
              unoptimized
            />
            <Button size="icon" variant="secondary" className="absolute top-2 right-2" onClick={clearImage}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-banana/10 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-banana" />
            </div>
            <p className="text-sm font-medium mb-1">Drop your image here or click to upload</p>
            <p className="text-xs text-muted-foreground">Max 10MB</p>
            <Button
              type="button"
              className="mt-4 bg-banana text-banana-foreground hover:bg-banana/90"
              onClick={() => inputRef.current?.click()}
            >
              Add Image
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
