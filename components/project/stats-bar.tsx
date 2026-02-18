"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"

interface Stat {
  value: string
  label: string
}

function AnimatedStat({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center text-center px-4 py-4"
    >
      <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {stat.value}
      </span>
      <span className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">
        {stat.label}
      </span>
    </motion.div>
  )
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  if (!stats || stats.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6 bg-background border border-border rounded-lg shadow-sm">
      {stats.map((stat, i) => (
        <AnimatedStat key={stat.label} stat={stat} index={i} />
      ))}
    </div>
  )
}
