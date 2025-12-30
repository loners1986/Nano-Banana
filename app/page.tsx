"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Upload, Zap, Users, Sparkles, ImageIcon, Check } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { Showcase } from "@/components/showcase"
import { Testimonials } from "@/components/testimonials"
import { Spinner } from "@/components/ui/spinner"

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [outputImages, setOutputImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<unknown>(null)

  const canGenerate = Boolean(uploadedImage && prompt.trim() && !isGenerating)

  async function handleGenerate() {
    if (!uploadedImage) {
      setError("Please add an image first.")
      return
    }
    if (!prompt.trim()) {
      setError("Please enter a prompt.")
      return
    }

    setIsGenerating(true)
    setError(null)
    setErrorDetails(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageDataUrl: uploadedImage }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorDetails(data?.details ?? null)
        throw new Error(data?.error || "Generate failed")
      }

      const imageUrls = Array.isArray(data?.imageUrls) ? (data.imageUrls as string[]) : []
      setOutputImages(imageUrls)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generate failed")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl">🍌</div>
              <span className="font-bold text-xl">Nano Banana</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#generator" className="text-muted-foreground hover:text-foreground transition-colors">
                Generator
              </a>
              <a href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
                Examples
              </a>
              <a href="#reviews" className="text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </nav>
            <Button className="bg-banana text-banana-foreground hover:bg-banana/90">Start Editing</Button>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-banana/10 border-b border-banana/20 py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm">
            <span className="font-semibold">🍌 The AI model that outperforms Flux Kontext</span>
            <a href="#generator" className="ml-2 underline hover:no-underline">
              Try Now →
            </a>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 bg-banana/10 text-banana-foreground rounded-full text-sm font-medium">
              NEW: Nano Banana Pro is now live
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
              Transform any image with simple text prompts
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Nano Banana's advanced model delivers consistent character editing and scene preservation that surpasses
              Flux Kontext. Experience the future of AI image editing.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-banana text-banana-foreground hover:bg-banana/90">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Editing
              </Button>
              <Button size="lg" variant="outline">
                View Examples
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-banana" />
                One-shot editing
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-banana" />
                Multi-image support
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-banana" />
                Natural language
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started</h2>
              <p className="text-lg text-muted-foreground">Try The AI Editor</p>
              <p className="text-muted-foreground mt-2">
                Experience the power of Nano Banana's natural language image editing. Transform any photo with simple
                text commands.
              </p>
            </div>

            <Card className="p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Prompt Engine</h3>
                  <p className="text-sm text-muted-foreground mb-6">Transform your image with AI-powered editing</p>
                </div>

                <ImageUpload onImageUpload={setUploadedImage} />

                <div>
                  <label className="block text-sm font-medium mb-2">Main Prompt</label>
                  <textarea
                    className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Describe your desired edits... e.g., 'place the subject in a snowy mountain landscape'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full bg-banana text-banana-foreground hover:bg-banana/90"
                  size="lg"
                  disabled={!canGenerate}
                  onClick={handleGenerate}
                >
                  {isGenerating ? <Spinner className="mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  {isGenerating ? "Generating..." : "Generate Now"}
                </Button>

                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                {errorDetails ? (
                  <details className="rounded-lg border border-border bg-background p-3 text-xs">
                    <summary className="cursor-pointer text-muted-foreground">Show error details</summary>
                    <pre className="mt-2 whitespace-pre-wrap break-words">{JSON.stringify(errorDetails, null, 2)}</pre>
                  </details>
                ) : null}

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Output Gallery</label>
                  {outputImages.length ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {outputImages.map((url, index) => (
                        <div
                          key={`${url}-${index}`}
                          className="relative overflow-hidden rounded-lg border border-border bg-background"
                        >
                          <div className="aspect-video w-full">
                            <img src={url} alt={`Output ${index + 1}`} className="h-full w-full object-contain" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                      Upload an image, write a prompt, then click Generate Now.
                    </div>
                  )}
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Want more powerful image generation features?{" "}
                  <a href="#" className="text-banana hover:underline">
                    Visit Full Generator →
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-muted-foreground">Why Choose Nano Banana?</p>
            <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
              Nano Banana is the most advanced AI image editor on LMArena. Revolutionize your photo editing with natural
              language understanding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-banana/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-banana" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <Showcase />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQs</h2>
              <p className="text-lg text-muted-foreground">Frequently Asked Questions</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🍌</div>
                <span className="font-bold">Nano Banana</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">© 2025 Nano Banana. Transform images with AI.</p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Sparkles,
    title: "Natural Language Editing",
    description:
      "Edit images using simple text prompts. Nano Banana AI understands complex instructions like GPT for images.",
  },
  {
    icon: Users,
    title: "Character Consistency",
    description:
      "Maintain perfect character details across edits. This model excels at preserving faces and identities.",
  },
  {
    icon: ImageIcon,
    title: "Scene Preservation",
    description: "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to Flux Kontext.",
  },
  {
    icon: Zap,
    title: "One-Shot Editing",
    description:
      "Perfect results in a single attempt. Nano Banana solves one-shot image editing challenges effortlessly.",
  },
  {
    icon: Upload,
    title: "Multi-Image Context",
    description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows.",
  },
  {
    icon: Sparkles,
    title: "AI UGC Creation",
    description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns.",
  },
]

const faqs = [
  {
    question: "What is Nano Banana?",
    answer:
      "It's a revolutionary AI image editing model that transforms photos using natural language prompts. This is currently the most powerful image editing model available, with exceptional consistency. It offers superior performance compared to Flux Kontext for consistent character editing and scene preservation.",
  },
  {
    question: "How does it work?",
    answer:
      'Simply upload an image and describe your desired edits in natural language. The AI understands complex instructions like "place the creature in a snowy mountain" or "imagine the whole face and create it". It processes your text prompt and generates perfectly edited images.',
  },
  {
    question: "How is it better than Flux Kontext?",
    answer:
      'This model excels in character consistency, scene blending, and one-shot editing. Users report it "completely destroys" Flux Kontext in preserving facial features and seamlessly integrating edits with backgrounds. It also supports multi-image context, making it ideal for creating consistent AI influencers.',
  },
  {
    question: "Can I use it for commercial projects?",
    answer:
      "Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many users leverage it for creating consistent AI influencers and product photography. The high-quality outputs are suitable for professional use.",
  },
  {
    question: "What types of edits can it handle?",
    answer:
      'The editor handles complex edits including face completion, background changes, object placement, style transfers, and character modifications. It excels at understanding contextual instructions like "place in a blizzard" or "create the whole face" while maintaining photorealistic quality.',
  },
  {
    question: "Where can I try Nano Banana?",
    answer:
      "You can try Nano Banana on LMArena or through our web interface. Simply upload your image, enter a text prompt describing your desired edits, and watch as Nano Banana AI transforms your photo with incredible accuracy and consistency.",
  },
]
