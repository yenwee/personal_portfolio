"use client"

import { Lightbulb, AlertTriangle, Zap, Info, TrendingUp, ShieldAlert, OctagonAlert, TriangleAlert } from "lucide-react"
import type { ReactNode } from "react"

const CALLOUT_STYLES = {
  insight: {
    border: "border-blue-500/30 dark:border-blue-500/40",
    bg: "bg-blue-500/10 dark:bg-blue-500/10",
    icon: Lightbulb,
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Key Insight",
  },
  challenge: {
    border: "border-amber-500/30 dark:border-amber-500/40",
    bg: "bg-amber-500/10 dark:bg-amber-500/10",
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "Challenge",
  },
  decision: {
    border: "border-purple-500/30 dark:border-purple-500/40",
    bg: "bg-purple-500/10 dark:bg-purple-500/10",
    icon: Zap,
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "Decision",
  },
  metric: {
    border: "border-green-500/30 dark:border-green-500/40",
    bg: "bg-green-500/10 dark:bg-green-500/10",
    icon: TrendingUp,
    iconColor: "text-green-600 dark:text-green-400",
    title: "Key Metric",
  },
  note: {
    border: "border-border dark:border-border/60",
    bg: "bg-muted/30 dark:bg-muted/10",
    icon: Info,
    iconColor: "text-muted-foreground dark:text-muted-foreground/80",
    title: "Note",
  },
  warning: {
    border: "border-yellow-500/30 dark:border-yellow-500/40",
    bg: "bg-yellow-500/10 dark:bg-yellow-500/10",
    icon: TriangleAlert,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    title: "Warning",
  },
  danger: {
    border: "border-red-500/30 dark:border-red-500/40",
    bg: "bg-red-500/10 dark:bg-red-500/10",
    icon: OctagonAlert,
    iconColor: "text-red-600 dark:text-red-400",
    title: "Danger",
  },
  caution: {
    border: "border-orange-500/30 dark:border-orange-500/40",
    bg: "bg-orange-500/10 dark:bg-orange-500/10",
    icon: ShieldAlert,
    iconColor: "text-orange-600 dark:text-orange-400",
    title: "Caution",
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
