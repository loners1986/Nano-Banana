"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "AIArtistPro",
    role: "Digital Creator",
    content:
      "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
    avatar: "👨‍🎨",
  },
  {
    name: "ContentCreator",
    role: "UGC Specialist",
    content:
      "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
    avatar: "👩‍💼",
  },
  {
    name: "PhotoEditor",
    role: "Professional Editor",
    content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
    avatar: "📸",
  },
]

export function Testimonials() {
  return (
    <section id="reviews" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">User Reviews</h2>
          <p className="text-lg text-muted-foreground">What creators are saying</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-banana text-banana" />
                ))}
              </div>
              <p className="text-sm mb-6 leading-relaxed">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-banana/10 flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
