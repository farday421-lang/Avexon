import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

interface ScrollBlurRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
}

export default function ScrollBlurReveal({
  text,
  className = "",
  as: Component = "span",
  delay = 0,
  duration = 0.6,
  stagger = 0.03,
  once = true,
}: ScrollBlurRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once, margin: "-10% 0px" });

  // Split description by space to form words
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: duration,
        ease: [0.16, 1, 0.3, 1], // Custom cinematic modern ease out
      },
    },
  };

  return (
    <Component ref={containerRef} className={`${className} inline-block`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="inline-flex flex-wrap gap-1 md:gap-[1.5]"
      >
        {words.map((word, wordIdx) => (
          <motion.span
            key={wordIdx}
            variants={childVariants}
            className="inline-block whitespace-nowrap"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}
