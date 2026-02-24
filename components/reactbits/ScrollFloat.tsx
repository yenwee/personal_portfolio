"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface ScrollFloatProps {
  children: React.ReactNode;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  stagger?: number;
}

function ScrollFloat({
  children,
  containerClassName = "",
  textClassName = "",
  animationDuration = 0.6,
  stagger = 0.03,
}: ScrollFloatProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const text = typeof children === "string" ? children : String(children);
  const chars = text.split("");

  return (
    <h2 ref={ref} className={containerClassName}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className={textClassName}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
          initial={{ opacity: 0, y: "100%", scaleY: 2.3, scaleX: 0.7 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scaleY: 1, scaleX: 1 }
              : { opacity: 0, y: "100%", scaleY: 2.3, scaleX: 0.7 }
          }
          transition={{
            duration: animationDuration,
            delay: i * stagger,
            ease: [0.215, 0.61, 0.355, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </h2>
  );
}

export default ScrollFloat;
