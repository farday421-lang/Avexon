import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface DotToTextIntroProps {
  onComplete: () => void;
}

export default function DotToTextIntro({ onComplete }: DotToTextIntroProps) {
  const [stage, setStage] = useState<"dot" | "expand" | "text" | "fadeout">("dot");

  useEffect(() => {
    // Stage 1: Central Glowing Dot breathing (~1.0s)
    const t1 = setTimeout(() => {
      setStage("expand");
    }, 1000);

    // Stage 2: Dot morphs/expands into a glowing horizontal core line (~0.8s)
    const t2 = setTimeout(() => {
      setStage("text");
    }, 1800);

    // Stage 3: Letters beautifully emerge from the line and crystallize (~1.4s)
    const t3 = setTimeout(() => {
      setStage("fadeout");
    }, 3200);

    // Stage 4: Entire screen transitions into active website
    const t4 = setTimeout(() => {
      onComplete();
    }, 3700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Letters array with spacing elements for "AVEXON STUDIO"
  const word1 = "AVEXON".split("");
  const word2 = "STUDIO".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "fadeout" ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-[#010003] z-[99999] flex flex-col items-center justify-center overflow-hidden select-none select-none pointer-events-auto"
      style={{ willChange: "opacity" }}
    >
      {/* Dynamic Background Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.12)_0%,rgba(0,0,0,0)_65%)] pointer-events-none" />

      <div className="relative flex flex-col items-center justify-center">
        
        {/* Dynamic Glowing Dot / Core Line element */}
        <motion.div
          layout
          initial={{ width: 14, height: 14, borderRadius: "50%" }}
          animate={{
            width: stage === "dot" ? 14 : stage === "expand" ? 180 : 0,
            height: stage === "dot" ? 14 : stage === "expand" ? 2 : 0,
            borderRadius: stage === "dot" ? "50%" : "2px",
            scale: stage === "dot" ? [1, 1.25, 1] : 1,
            opacity: stage === "text" ? 0 : 1,
          }}
          transition={{
            width: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            height: { duration: 0.5, ease: "easeInOut" },
            scale: { repeat: stage === "dot" ? Infinity : 0, duration: 1.2, ease: "easeInOut" },
            opacity: { duration: 0.4 }
          }}
          className="bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-500 absolute z-20 shadow-[0_0_20px_rgba(168,85,247,0.85)]"
        />

        {/* Ambient surrounding flare ring strictly inside dot stage */}
        {stage === "dot" && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.8, 1.6, 0.8], opacity: [0.15, 0.45, 0.15] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute w-24 h-24 rounded-full border border-purple-500/25 blur-sm"
          />
        )}

        {/* Text Area */}
        <div className="flex flex-col items-center justify-center mt-2 h-16 relative">
          
          {stage === "text" && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1
                  }
                }
              }}
              className="flex items-center gap-x-2 sm:gap-x-3"
            >
              {/* Word 1 - AVEXON */}
              <div className="flex items-center">
                {word1.map((char, index) => (
                  <motion.span
                    key={`word1-${index}`}
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        y: 12, 
                        filter: "blur(4px)",
                        scale: 0.8 
                      },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        filter: "blur(0px)",
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 140,
                          damping: 12
                        }
                      }
                    }}
                    className="font-sans text-[26px] sm:text-[34px] font-extrabold tracking-[0.08em] bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(168,85,247,0.15)] select-none"
                    style={{ willChange: "transform, opacity, filter" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Spacing Particle dot separating the brand words */}
              <motion.span
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: 0.5, type: "spring", stiffness: 200 }
                  }
                }}
                className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 mx-1 shadow-[0_0_8px_rgba(236,72,153,0.8)] self-center mb-0.5 sm:mb-1"
              />

              {/* Word 2 - STUDIO */}
              <div className="flex items-center">
                {word2.map((char, index) => (
                  <motion.span
                    key={`word2-${index}`}
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        y: 12, 
                        filter: "blur(4px)",
                        scale: 0.8
                      },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        filter: "blur(0px)",
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 140,
                          damping: 12
                        }
                      }
                    }}
                    className="font-sans text-[26px] sm:text-[34px] font-extrabold tracking-[0.08em] bg-gradient-to-r from-purple-200 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(236,72,153,0.15)] select-none"
                    style={{ willChange: "transform, opacity, filter" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

            </motion.div>
          )}

          {/* Subtext sliding down elegantly on finalize */}
          {stage === "text" && (
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
              className="text-[9px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-purple-400/90 text-center select-none absolute bottom-[-16px]"
            >
              Premium Web Agency
            </motion.span>
          )}

        </div>
      </div>
      
      {/* High-performance hardware acceleration support block */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono opacity-25 tracking-[0.1em] uppercase text-white/50">
        AVX v1.0.0.8 • SECURE ENGINE
      </div>
    </motion.div>
  );
}
