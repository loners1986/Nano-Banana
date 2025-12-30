"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const showcaseItems = [
  {
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
    image: "/majestic-mountain-landscape.jpg",
  },
  {
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using Nano Banana technology",
    image: "/beautiful-garden-with-flowers.jpg",
  },
  {
    title: "Real-time Beach Synthesis",
    description: "Nano Banana delivers photorealistic results at lightning speed",
    image: "/tropical-beach-sunset.png",
  },
  {
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly with Nano Banana AI",
    image: "/images/northern-lights.png",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 bg-banana/10 text-banana-foreground rounded-full text-sm font-medium">
            Nano Banana Speed
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Showcase</h2>
          <p className="text-lg text-muted-foreground">Lightning-Fast AI Creations</p>
          <p className="text-muted-foreground mt-2">See what Nano Banana generates in milliseconds</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="inline-block mb-2 px-3 py-1 bg-banana/10 text-banana-foreground rounded-full text-xs font-medium">
                  Nano Banana Speed
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Experience the power of Nano Banana yourself</p>
          <Button size="lg" className="bg-banana text-banana-foreground hover:bg-banana/90">
            Try Nano Banana Generator
          </Button>
        </div>
      </div>
    </section>
  )
}
