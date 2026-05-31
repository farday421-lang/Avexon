import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface DotToTextIntroProps {
  onComplete: () => void;
}

// Deterministic glossy scatter offsets for each letter forming "AVEXON • STUDIO"
// This matches the video's scattered radial burst effect precisely
const LETTERS_CONFIG = [
  { char: "A", scatter: { x: -240, y: -130, rotate: -230, scale: 1.4 } },
  { char: "V", scatter: { x: -180, y: 150, rotate: 190, scale: 0.95 } },
  { char: "E", scatter: { x: -120, y: -190, rotate: -260, scale: 1.35 } },
  { char: "X", scatter: { x: -50, y: 110, rotate: 220, scale: 1.1 } },
  { char: "O", scatter: { x: -130, y: -50, rotate: -160, scale: 1.0 } },
  { char: "N", scatter: { x: -80, y: 170, rotate: 340, scale: 1.5 } },
  
  // High-luminance brand dot spacer
  { char: "•", scatter: { x: 0, y: -230, rotate: 180, scale: 2.2 }, isSpacer: true },

  { char: "S", scatter: { x: 80, y: 160, rotate: -190, scale: 1.25 } },
  { char: "T", scatter: { x: 130, y: -100, rotate: 280, scale: 1.0 } },
  { char: "U", scatter: { x: 190, y: 120, rotate: -160, scale: 1.3 } },
  { char: "D", scatter: { x: 250, y: -150, rotate: 390, scale: 1.1 } },
  { char: "I", scatter: { x: 160, y: 70, rotate: -100, scale: 0.9 } },
  { char: "O", scatter: { x: 220, y: -70, rotate: 250, scale: 1.4 } },
];

type IntroStage = "fall" | "scatter" | "settle" | "underline" | "fadeout";

export default function DotToTextIntro({ onComplete }: DotToTextIntroProps) {
  const [stage, setStage] = useState<IntroStage>("fall");

  useEffect(() => {
    // 1. Fall and Bouncing Ball sequence: 0ms to 1200ms
    const tScatter = setTimeout(() => {
      setStage("scatter");
    }, 1200);

    // 2. Letters scatter out and rotate dynamically: 1200ms to 2300ms
    const tSettle = setTimeout(() => {
      setStage("settle");
    }, 2350);

    // 3. Letters settle & snap perfectly into line: 2300ms to 3500ms
    const tUnderline = setTimeout(() => {
      setStage("underline");
    }, 3550);

    // 4. Glossy underline draws expansion & agency label fades in: 3500ms to 4500ms
    const tFadeout = setTimeout(() => {
      setStage("fadeout");
    }, 4550);

    // 5. Complete transition and reveal primary agency portals: 4500ms+
    const tComplete = setTimeout(() => {
      onComplete();
    }, 5050);

    return () => {
      clearTimeout(tScatter);
      clearTimeout(tSettle);
      clearTimeout(tUnderline);
      clearTimeout(tFadeout);
      clearTimeout(tComplete);
    };
  }, [onComplete]);

  // Handle immediate skip/bypass
  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "fadeout" ? 0 : 1 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
      style={{ willChange: "opacity" }}
    >
      {/* Background radial soft ambient violet glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      {/* Skip Button - Elite architectural touch for smooth user bypass */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-6 right-6 px-4 py-1.5 rounded-full border border-purple-500/15 text-[9px] text-purple-400 font-mono tracking-[0.2em] bg-purple-950/10 hover:bg-purple-950/25 hover:border-purple-500/40 hover:text-white transition duration-200 cursor-pointer z-50 select-none uppercase shadow-[0_0_15px_rgba(147,51,234,0.05)]"
      >
        Skip Intro
      </button>

      <div className="relative flex flex-col items-center justify-center w-full max-w-lg min-h-[300px]">
        {/* Dynamic Explosion Aura shockwave at moment of collision */}
        <AnimatePresence>
          {stage === "scatter" && (
            <motion.div
              initial={{ scale: 0.1, opacity: 0.95 }}
              animate={{ scale: 3.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="absolute w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.5)_0%,rgba(236,72,153,0.1)_50%,rgba(0,0,0,0)_70%)] blur-md pointer-events-none z-10"
            />
          )}
        </AnimatePresence>

        {/* 1. Bouncing Dot - Jelly Soft Squash and Stretch physics */}
        {stage === "fall" && (
          <motion.div
            initial={{ y: -380, opacity: 1, scale: 1 }}
            animate={{
              y: [-380, 0, -120, 0, -40, 0],
              scaleY: [1.35, 0.45, 1.25, 0.6, 1.05, 0.85],
              scaleX: [0.65, 1.55, 0.75, 1.4, 0.95, 1.15],
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.45, 0.65, 0.85, 0.94, 1.0],
              ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut"]
            }}
            style={{ transformOrigin: "bottom" }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-700 via-fuchsia-500 to-indigo-400 shadow-[0_0_35px_rgba(168,85,247,0.9),_0_0_15px_rgba(236,72,153,0.7)] relative flex items-center justify-center animate-pulse duration-1000"
          >
            {/* Specular spotlight glossy shine overlay */}
            <div className="w-3 h-3 bg-white/75 rounded-full absolute top-2 left-3 blur-[0.4px]" />
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full absolute top-5 left-5 blur-[0.6px]" />
          </motion.div>
        )}

        {/* 2. Text layout core - coordinates determined relative to natural horizontal flow */}
        {stage !== "fall" && (
          <div className="flex flex-col items-center justify-center relative mt-4">
            
            {/* Letters horizontal line */}
            <div className="flex items-center gap-x-1.5 sm:gap-x-2.5 px-6 relative py-4 mr-0.5 select-none">
              
              {LETTERS_CONFIG.map((item, idx) => {
                const isSpacer = item.isSpacer;
                
                // Determine target parameters for relative coordinates & rot values
                let animateProps = {};
                let transitionProps = {};

                if (stage === "scatter") {
                  animateProps = {
                    opacity: 1,
                    x: item.scatter.x,
                    y: item.scatter.y,
                    rotate: item.scatter.rotate,
                    scale: item.scatter.scale,
                  };
                  transitionProps = {
                    type: "spring",
                    stiffness: 110,
                    damping: 12,
                    mass: 0.8,
                  };
                } else if (stage === "settle" || stage === "underline" || stage === "fadeout") {
                  animateProps = {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                  };
                  transitionProps = {
                    type: "spring",
                    stiffness: 75,
                    damping: 11,
                    mass: 0.95,
                    delay: idx * 0.045, // Exquisite organic staggered locking delay!
                  };
                }

                return (
                  <motion.span
                    key={idx}
                    animate={animateProps}
                    transition={transitionProps}
                    className={`
                      select-none inline-block font-sans font-black tracking-[0.06em] leading-none select-none
                      ${isSpacer 
                        ? "text-[24px] sm:text-[34px] text-fuchsia-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.9)] mx-1" 
                        : "text-[26px] sm:text-[40px] bg-gradient-to-br from-white via-purple-300 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.75)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                      }
                    `}
                    style={{ willChange: "transform, opacity" }}
                  >
                    {item.char}
                  </motion.span>
                );
              })}

              {/* 3. Glossy Purple Underline - drawing dynamically sideways */}
              {["underline", "fadeout"].includes(stage) && (
                <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[82%] sm:w-[86%] h-[3px] overflow-hidden flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-transparent via-purple-500 through-fuchsia-400 to-transparent shadow-[0_0_15px_rgba(168,85,247,1.0)] rounded-full"
                  />
                </div>
              )}

            </div>

            {/* 4. Secondary micro agency signature slogan sliding elegantly below line */}
            <div className="h-6 relative flex items-center justify-center select-none mt-1">
              {["underline", "fadeout"].includes(stage) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 0.65, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
                  className="text-[9px] sm:text-[11px] font-mono tracking-[0.32em] uppercase bg-gradient-to-r from-purple-200 to-fuchsia-300 bg-clip-text text-transparent text-center select-none drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]"
                >
                  PREMIUM WEB STUDIO
                </motion.div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Decorative technical specs subtle overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono opacity-20 tracking-[0.16em] uppercase text-white/50 select-none">
        AVEXON • INTUITIVE SECURE FRAMEWORK
      </div>
    </motion.div>
  );
}
