"use client"

import { Lightbulb, AlertTriangle, Zap, Info, TrendingUp } from "lucide-react"
import type { ReactNode } from "react"

const CALLOUT_STYLES = {
  insight: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    icon: Lightbulb,
    iconColor: "text-blue-500",
    title: "Key Insight",
  },
  challenge: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    title: "Challenge",
  },
  decision: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    icon: Zap,
    iconColor: "text-purple-500",
    title: "Decision",
  },
  metric: {
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    icon: TrendingUp,
    iconColor: "text-green-500",
    title: "Key Metric",
  },
  note: {
    border: "border-border",
    bg: "bg-muted/10",
    icon: Info,
    iconColor: "text-muted-foreground",
    title: "Note",
  },
} as const

type CalloutType = keyof typeof CALLOUT_STYLES

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: ReactNode
}) {
  const style = CALLOUT_STYLES[type]
  const Icon = style.icon

  return (
    <div className={`my-6 rounded-lg border-l-4 ${style.border} ${style.bg} p-4 sm:p-5`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${style.iconColor}`} />
        <div className="min-w-0">
          <p className="font-medium text-foreground text-sm mb-1">
            {title || style.title}
          </p>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
