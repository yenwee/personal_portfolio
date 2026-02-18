"use client"

import { ArrowRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function BeforeAfter({ before, after }: { before: string; after: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="my-8 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-stretch"
    >
      <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
        <p className="text-xs font-medium text-red-500 uppercase tracking-wider mb-2">Before</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{before}</p>
      </div>
      <div className="hidden sm:flex items-center justify-center">
        <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
      </div>
      <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
        <p className="text-xs font-medium text-green-500 uppercase tracking-wider mb-2">After</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{after}</p>
      </div>
    </motion.div>
  )
}
