import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "Sample User",
    role: "Creator",
    avatar: "SU",
    content:
      "Fast to iterate on edits — uploading, prompting, and downloading is straightforward.",
  },
  {
    name: "Sample User",
    role: "Marketer",
    avatar: "SU",
    content:
      "Helpful for rapid mockups. Results vary, but it saves time when exploring ideas.",
  },
  {
    name: "Sample User",
    role: "Designer",
    avatar: "SU",
    content: "Nice UI and quick turnaround for common edits like background and object changes.",
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-banana-600">Feedback</h2>
          <h3 className="text-3xl font-bold text-foreground md:text-4xl">Example quotes</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            These are illustrative examples, not verified customer endorsements.
          </p>
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
                <p className="mb-6 text-muted-foreground">
                  &ldquo;{review.content}&rdquo;
                </p>
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
