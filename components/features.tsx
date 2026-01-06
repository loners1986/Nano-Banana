import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, User, Layers, Zap, Images, Sparkles } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language Editing",
    description: "Edit images using simple text prompts. Describe the change you want and generate a new result.",
  },
  {
    icon: User,
    title: "Character Consistency",
    description: "Designed to preserve key details across edits, depending on the input and prompt.",
  },
  {
    icon: Layers,
    title: "Scene Preservation",
    description: "Helps keep the original composition while applying targeted changes.",
  },
  {
    icon: Zap,
    title: "One-Shot Editing",
    description: "Get a result quickly, iterate with prompts, and download your favorites.",
  },
  {
    icon: Images,
    title: "Multi-Image Context",
    description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows.",
  },
  {
    icon: Sparkles,
    title: "AI UGC Creation",
    description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-banana-600">Core Features</h2>
          <h3 className="text-3xl font-bold text-foreground md:text-4xl">Why Choose Nano Banana?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A fast, simple interface for AI-assisted image edits — with clear pricing and transparent policies.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-banana-200/50 transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-banana-100">
                  <feature.icon className="h-6 w-6 text-banana-600" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
