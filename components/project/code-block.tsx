"use client"

import { Check, Copy } from "lucide-react"
import { useState, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

export function CodeBlock({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const [copied, setCopied] = useState(false)
    const preRef = useRef<HTMLPreElement>(null)

    const handleCopy = async () => {
        if (preRef.current) {
            const text = preRef.current.innerText
            try {
                await navigator.clipboard.writeText(text)
                setCopied(true)
                trackEvent("copy_code_block", {})
                setTimeout(() => setCopied(false), 2000)
            } catch (err) {
                console.error("Failed to copy text: ", err)
            }
        }
    }

    return (
        <div className="relative group mb-6">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 bg-[#adbac7]/10 hover:bg-[#adbac7]/20 text-[#adbac7]/70 hover:text-[#adbac7] rounded-md transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-[#adbac7]/10 z-10"
                aria-label="Copy code"
                title="Copy code"
            >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre
                ref={preRef}
                className={className || "bg-[#1a1a2e] border border-border rounded-lg p-4 overflow-x-auto text-sm"}
            >
                {children}
            </pre>
        </div>
    )
}
