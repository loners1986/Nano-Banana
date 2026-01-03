import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "AIArtistPro",
    role: "Digital Creator",
    avatar: "AA",
    content:
      "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
  },
  {
    name: "ContentCreator",
    role: "UGC Specialist",
    avatar: "CC",
    content:
      "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
  },
  {
    name: "PhotoEditor",
    role: "Professional Editor",
    avatar: "PE",
    content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-banana-600">User Reviews</h2>
          <h3 className="text-3xl font-bold text-foreground md:text-4xl">What creators are saying</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Card key={index} className="border-banana-200/50">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-banana-400 text-banana-400" />
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground">"{review.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-banana-100">
                    <AvatarFallback className="bg-banana-100 text-banana-700">{review.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
