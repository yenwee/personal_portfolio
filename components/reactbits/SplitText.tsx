"use client";

import { useRef, useEffect, useState, type ElementType, type CSSProperties } from "react";
import { motion } from "motion/react";

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  duration?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: CSSProperties["textAlign"];
}

function SplitText({
  text,
  className = "",
  charClassName = "",
  delay = 30,
  duration = 0.5,
  tag = "p",
  textAlign = "left",
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = tag as ElementType;
  const words = text.split(" ");
  const delayInSeconds = delay / 1000;

  let charCounter = 0;

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{
        textAlign,
        display: "flex",
        flexWrap: "wrap" as const,
        overflow: "clip",
        paddingBottom: "0.15em",
      }}
    >
      {words.map((word, wordIndex) => {
        const chars = word.split("");

        return (
          <span
            key={wordIndex}
            style={{ display: "inline-flex", whiteSpace: "pre" }}
          >
            {chars.map((char) => {
              const index = charCounter++;

              return (
                <motion.span
                  key={index}
                  className={charClassName}
                  initial={{ opacity: 0, y: 40 }}
                  animate={
                    isVisible
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 40 }
                  }
                  transition={{
                    duration,
                    delay: index * delayInSeconds,
                    ease: "easeOut",
                  }}
                  style={{ display: "inline-block", willChange: "transform, opacity" }}
                >
                  {char}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span style={{ display: "inline-block" }}>{"\u00A0"}</span>
            )}
          </span>
        );
      })}
    </Tag>
  );
}

export default SplitText;
