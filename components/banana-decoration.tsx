import { cn } from "@/lib/utils"

interface BananaDecorationProps {
  className?: string
}

export function BananaDecoration({ className }: BananaDecorationProps) {
  return <div className={cn("select-none text-7xl", className)}>🍌</div>
}
