"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl space-y-4 rounded-lg border border-border bg-card p-6">
            <h1 className="text-xl font-semibold">Application error</h1>
            <pre className="max-h-64 overflow-auto rounded-md border border-border bg-background p-3 text-xs whitespace-pre-wrap break-words">
              {error.message}
            </pre>
            {error.digest ? <p className="text-xs text-muted-foreground">Digest: {error.digest}</p> : null}
            <div className="flex gap-3">
              <Button onClick={reset} className="bg-banana text-banana-foreground hover:bg-banana/90">
                Try again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

