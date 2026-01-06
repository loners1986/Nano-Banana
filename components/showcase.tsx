import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import Image from "next/image"

const showcaseItems = [
  {
    image: "/majestic-mountain-landscape-with-snow-peaks-and-su.jpg",
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
  },
  {
    image: "/beautiful-zen-garden-with-cherry-blossoms-and-pond.jpg",
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using Nano Banana technology",
  },
  {
    image: "/tropical-beach-with-turquoise-water-and-palm-trees.jpg",
    title: "Real-time Beach Synthesis",
    description: "Nano Banana delivers photorealistic results at lightning speed",
  },
  {
    image: "/northern-lights-aurora-borealis-over-snowy-mountai.jpg",
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly with Nano Banana AI",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-banana-600">Showcase</h2>
          <h3 className="text-3xl font-bold text-foreground md:text-4xl">Lightning-Fast AI Creations</h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">See what Nano Banana generates in milliseconds</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="group overflow-hidden border-banana-200/50 transition-all hover:shadow-xl">
              <CardContent className="p-0">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-2 flex items-center gap-2 text-banana-300">
                      <Zap className="h-4 w-4" />
                      <span className="text-xs font-medium">Nano Banana Speed</span>
                    </div>
                    <h4 className="mb-1 text-lg font-semibold">{item.title}</h4>
                    <p className="text-sm text-white/80">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground">Experience the power of Nano Banana yourself</p>
          <Button asChild className="bg-banana-400 text-banana-900 hover:bg-banana-500">
            <a href="#generator">Try Nano Banana Generator</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
