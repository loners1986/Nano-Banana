"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sample User",
    role: "Creator",
    content: "Fast to iterate on edits — uploading, prompting, and downloading is straightforward.",
    avatar: "SU",
  },
  {
    name: "Sample User",
    role: "Marketer",
    content: "Helpful for rapid mockups. Results vary, but it saves time when exploring ideas.",
    avatar: "SU",
  },
  {
    name: "Sample User",
    role: "Designer",
    content: "Nice UI and quick turnaround for common edits like background and object changes.",
    avatar: "SU",
  },
]

export function Testimonials() {
  return (
    <section id="reviews" className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Feedback</h2>
          <p className="text-lg text-muted-foreground">Example quotes (illustrative)</p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-banana-400 text-banana-400" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-banana-100 text-sm font-semibold text-banana-700">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
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
