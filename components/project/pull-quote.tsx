"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import type { ReactNode } from "react"

export function PullQuote({ children }: { children: ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.blockquote
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.6 }}
      className="my-10 pl-6 border-l-2 border-foreground/20"
    >
      <div className="text-xl sm:text-2xl font-light text-foreground/80 leading-relaxed italic">
        {children}
      </div>
    </motion.blockquote>
  )
}
