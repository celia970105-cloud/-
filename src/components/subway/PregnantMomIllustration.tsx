import React from 'react';
import { motion } from 'motion/react';

export type CharacterMood = 'idle' | 'correct' | 'wrong' | 'seated';

interface PregnantMomIllustrationProps {
  mood: CharacterMood;
  name: string;
  badgeStyle: 'pink_heart' | 'bear' | 'star';
  tiltAngle: number;
}

export const PregnantMomIllustration: React.FC<PregnantMomIllustrationProps> = ({
  mood,
  name,
  badgeStyle,
  tiltAngle
}) => {
  const isWrong = mood === 'wrong';
  const isCorrect = mood === 'correct';
  const isSeated = mood === 'seated';

  return (
    <motion.div
      animate={{
        rotate: tiltAngle,
        x: isWrong ? [-6, 6, -8, 8, -4, 4, 0] : 0,
        y: isWrong ? [0, 4, -4, 2, 0] : isCorrect ? [0, -6, 0] : 0
      }}
      transition={{
        rotate: { type: 'spring', stiffness: isWrong ? 400 : 180, damping: 12 },
        x: { duration: 0.45, ease: 'easeInOut' },
        y: { duration: 0.4, ease: 'easeInOut' }
      }}
      className="relative flex flex-col items-center select-none"
    >
      {/* Floating Emotions / Particles above head */}
      {isWrong && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1.1, y: 0 }}
          className="absolute -top-12 z-30 flex items-center gap-1 bg-rose-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce"
        >
          <span>😵 晃晃！站不穩啦！</span>
        </motion.div>
      )}

      {isCorrect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1.1, y: 0 }}
          className="absolute -top-12 z-30 flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce"
        >
          <span>✨ 呼~ 站穩微笑！</span>
        </motion.div>
      )}

      {/* Sweat droplets when wrong */}
      {isWrong && (
        <>
          <motion.div
            animate={{ y: [-5, 10], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="absolute -top-3 -right-2 text-xl z-20 pointer-events-none"
          >
            💦
          </motion.div>
          <motion.div
            animate={{ y: [-5, 12], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
            className="absolute -top-1 -left-3 text-lg z-20 pointer-events-none"
          >
            💧
          </motion.div>
        </>
      )}

      {/* Sparkles when correct */}
      {isCorrect && (
        <>
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 90, 180] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute -top-4 -right-4 text-xl z-20 pointer-events-none"
          >
            💖
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute -top-2 -left-4 text-lg z-20 pointer-events-none"
          >
            ✨
          </motion.div>
        </>
      )}

      {/* Hanging subway strap hand when standing */}
      {!isSeated && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-6 flex flex-col items-center pointer-events-none z-0">
          <div className="w-1.5 h-10 bg-stone-700 rounded-b-sm" />
          <div className="w-6 h-6 rounded-full border-3 border-amber-400 bg-amber-100/30" />
        </div>
      )}

      {/* SVG Character Vector Illustration */}
      <svg
        viewBox="0 0 160 210"
        className="w-32 h-44 sm:w-36 sm:h-48 drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C4A2D" />
            <stop offset="100%" stopColor="#532E18" />
          </linearGradient>

          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2E8" />
            <stop offset="100%" stopColor="#FFE0CE" />
          </linearGradient>

          <linearGradient id="dressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB3C6" />
            <stop offset="60%" stopColor="#FF8FAB" />
            <stop offset="100%" stopColor="#FB6F92" />
          </linearGradient>

          <linearGradient id="apronGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF0F5" />
          </linearGradient>
        </defs>

        {/* Back Hair Bun / Ponytail */}
        <ellipse cx="80" cy="40" rx="36" ry="34" fill="url(#hairGrad)" />
        <ellipse cx="112" cy="38" rx="14" ry="14" fill="url(#hairGrad)" />
        {/* Pink hair ribbon scrunchie */}
        <circle cx="106" cy="38" r="6" fill="#FB6F92" />

        {/* Neck */}
        <rect x="74" y="66" width="12" height="12" rx="4" fill="url(#skinGrad)" />

        {/* Main Head Base */}
        <ellipse cx="80" cy="50" rx="28" ry="26" fill="url(#skinGrad)" />

        {/* Cute Ears */}
        <circle cx="52" cy="52" r="5" fill="url(#skinGrad)" />
        <circle cx="108" cy="52" r="5" fill="url(#skinGrad)" />

        {/* Front Hair Bangs */}
        <path
          d="M 52 46 C 54 28, 106 28, 108 46 C 104 36, 92 38, 86 42 C 80 38, 70 36, 62 44 C 58 42, 54 44, 52 46 Z"
          fill="url(#hairGrad)"
        />

        {/* ---------------- DYNAMIC FACIAL EXPRESSIONS ---------------- */}
        {isWrong ? (
          /* WRONG / PANICKED / WOBBLE FACE */
          <g>
            {/* Furrowed distress eyebrows (八字眉) */}
            <path d="M 64 39 Q 70 44 74 42" stroke="#532E18" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 96 39 Q 90 44 86 42" stroke="#532E18" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Dizzy / tightly shut eyes (> <) */}
            <path d="M 62 48 L 72 52 L 62 56" stroke="#4A2511" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 98 48 L 88 52 L 98 56" stroke="#4A2511" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Blushing from distress/heat */}
            <ellipse cx="60" cy="58" rx="5" ry="3" fill="#FF8FAB" opacity="0.6" />
            <ellipse cx="100" cy="58" rx="5" ry="3" fill="#FF8FAB" opacity="0.6" />

            {/* Wavy distressed mouth (﹏) */}
            <path
              d="M 72 63 Q 76 60 80 63 Q 84 66 88 63"
              stroke="#532E18"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : isCorrect ? (
          /* CORRECT / HAPPY / RELAXED FACE */
          <g>
            {/* Relaxed cheerful gentle eyebrows */}
            <path d="M 64 40 Q 70 36 75 40" stroke="#532E18" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 85 40 Q 90 36 96 40" stroke="#532E18" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Happy curved eyes (＾ ＾) */}
            <path d="M 63 50 Q 69 44 75 50" stroke="#4A2511" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 85 50 Q 91 44 97 50" stroke="#4A2511" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Cute pink rosy cheeks with shine */}
            <ellipse cx="61" cy="56" rx="6" ry="3.5" fill="#FF8FAB" opacity="0.75" />
            <ellipse cx="99" cy="56" rx="6" ry="3.5" fill="#FF8FAB" opacity="0.75" />
            <circle cx="63" cy="55" r="1.5" fill="#FFFFFF" />
            <circle cx="101" cy="55" r="1.5" fill="#FFFFFF" />

            {/* Sweet open smiling mouth (▽) */}
            <path
              d="M 74 60 Q 80 68 86 60 Z"
              fill="#E63946"
            />
            <path
              d="M 76 60 Q 80 64 84 60"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        ) : isSeated ? (
          /* SEATED / BLISSFUL RELAXED FACE */
          <g>
            {/* Soft eyebrows */}
            <path d="M 64 41 Q 70 38 75 41" stroke="#532E18" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 85 41 Q 90 38 96 41" stroke="#532E18" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Blissful closed eyes ( ˘ ˘ ) */}
            <path d="M 64 51 Q 69 54 74 51" stroke="#4A2511" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 86 51 Q 91 54 96 51" stroke="#4A2511" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Rosy cheeks */}
            <ellipse cx="61" cy="56" rx="6" ry="3.5" fill="#FF8FAB" opacity="0.8" />
            <ellipse cx="99" cy="56" rx="6" ry="3.5" fill="#FF8FAB" opacity="0.8" />

            {/* Peaceful little curved smile */}
            <path d="M 75 61 Q 80 65 85 61" stroke="#532E18" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          /* IDLE / NORMAL OBSERVING FACE */
          <g>
            {/* Neutral eyebrows */}
            <path d="M 65 41 Q 70 38 75 41" stroke="#532E18" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 85 41 Q 90 38 95 41" stroke="#532E18" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Big cute manga chibi eyes */}
            <circle cx="69" cy="50" r="4.5" fill="#4A2511" />
            <circle cx="91" cy="50" r="4.5" fill="#4A2511" />
            <circle cx="70.5" cy="48.5" r="1.8" fill="#FFFFFF" />
            <circle cx="92.5" cy="48.5" r="1.8" fill="#FFFFFF" />
            <circle cx="68" cy="51.5" r="1" fill="#FFFFFF" />
            <circle cx="90" cy="51.5" r="1" fill="#FFFFFF" />

            {/* Light blush */}
            <ellipse cx="61" cy="56" rx="5" ry="3" fill="#FF8FAB" opacity="0.5" />
            <ellipse cx="99" cy="56" rx="5" ry="3" fill="#FF8FAB" opacity="0.5" />

            {/* Gentle smile */}
            <path d="M 76 61 Q 80 64 84 61" stroke="#532E18" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ---------------- BODY & MATERNITY DRESS ---------------- */}
        {/* Dress Shoulders & Top */}
        <path
          d="M 66 74 Q 80 78 94 74 L 102 96 Q 80 102 58 96 Z"
          fill="url(#dressGrad)"
        />
        {/* White Peter Pan Collar */}
        <path d="M 70 74 C 74 80, 80 80, 80 75 C 80 80, 86 80, 90 74 Z" fill="#FFFFFF" />

        {/* Cute Giant Bulging Round Belly (孕肚) */}
        <ellipse
          cx="80"
          cy="126"
          rx="38"
          ry="36"
          fill="url(#dressGrad)"
        />

        {/* Dress Overlay / Apron curve */}
        <path
          d="M 52 110 C 50 145, 110 145, 108 110 C 95 106, 65 106, 52 110 Z"
          fill="#FFFFFF"
          opacity="0.25"
        />

        {/* Cute Baby Badge pinned on tummy */}
        <g transform="translate(68, 114)">
          <circle cx="12" cy="12" r="12" fill="#FFFFFF" stroke="#FB6F92" strokeWidth="1.5" />
          {badgeStyle === 'pink_heart' ? (
            <path d="M 12 7 C 9 4, 5 7, 7 11 L 12 16 L 17 11 C 19 7, 15 4, 12 7 Z" fill="#FB6F92" />
          ) : badgeStyle === 'bear' ? (
            <g transform="translate(6, 6) scale(0.6)">
              <circle cx="6" cy="6" r="3" fill="#B45309" />
              <circle cx="14" cy="6" r="3" fill="#B45309" />
              <circle cx="10" cy="10" r="7" fill="#D97706" />
              <circle cx="8" cy="9" r="1" fill="#000" />
              <circle cx="12" cy="9" r="1" fill="#000" />
            </g>
          ) : (
            <polygon points="12,5 14,9 19,10 15,13 16,18 12,15 8,18 9,13 5,10 10,9" fill="#F59E0B" />
          )}
        </g>

        {/* ---------------- ARMS & HANDS ---------------- */}
        {isSeated ? (
          /* Seated: Both hands gently resting on tummy */
          <g>
            <path d="M 58 92 C 54 110, 64 125, 70 128" stroke="#FFE0CE" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 102 92 C 106 110, 96 125, 90 128" stroke="#FFE0CE" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
        ) : isWrong ? (
          /* Wrong / Wobble: One arm straining up to grip ring tightly, other arm flailing out for balance */
          <g>
            {/* Right arm gripping ceiling strap with shaking wave */}
            <path d="M 98 84 Q 106 45 92 10" stroke="#FFE0CE" strokeWidth="7" strokeLinecap="round" fill="none" />
            <circle cx="92" cy="10" r="5" fill="#FFE0CE" />

            {/* Left arm flailing out */}
            <path d="M 62 86 Q 40 100 32 114" stroke="#FFE0CE" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="32" cy="114" r="4.5" fill="#FFE0CE" />
          </g>
        ) : (
          /* Standing / Normal / Correct: Right arm gracefully holding the strap overhead, Left arm supporting belly */
          <g>
            {/* Right arm holding strap overhead */}
            <path d="M 96 82 Q 104 40 85 8" stroke="#FFE0CE" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            <circle cx="85" cy="8" r="4.5" fill="#FFE0CE" />

            {/* Left arm gently supporting lower belly */}
            <path d="M 62 86 C 54 104, 62 128, 72 134" stroke="#FFE0CE" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="72" cy="134" r="4" fill="#FFE0CE" />
          </g>
        )}

        {/* ---------------- LEGS & CUTE SHOES ---------------- */}
        {isSeated ? (
          /* Seated legs */
          <g>
            <path d="M 68 155 L 68 180" stroke="#FFE0CE" strokeWidth="8" strokeLinecap="round" />
            <path d="M 92 155 L 92 180" stroke="#FFE0CE" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="68" cy="184" rx="8" ry="5" fill="#FB6F92" />
            <ellipse cx="92" cy="184" rx="8" ry="5" fill="#FB6F92" />
          </g>
        ) : isWrong ? (
          /* Wobbling uneven legs */
          <g>
            <path d="M 66 156 L 56 190" stroke="#FFE0CE" strokeWidth="8" strokeLinecap="round" />
            <path d="M 94 156 L 102 186" stroke="#FFE0CE" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="54" cy="194" rx="9" ry="5" fill="#FB6F92" />
            <ellipse cx="104" cy="190" rx="9" ry="5" fill="#FB6F92" />
          </g>
        ) : (
          /* Stable wide stance (雙腳分開與肩同寬穩固站姿) */
          <g>
            <path d="M 68 156 L 62 192" stroke="#FFE0CE" strokeWidth="8" strokeLinecap="round" />
            <path d="M 92 156 L 98 192" stroke="#FFE0CE" strokeWidth="8" strokeLinecap="round" />
            {/* Cute pink sneakers */}
            <ellipse cx="60" cy="196" rx="9" ry="5" fill="#FB6F92" />
            <ellipse cx="100" cy="196" rx="9" ry="5" fill="#FB6F92" />
            <ellipse cx="60" cy="195" rx="5" ry="2" fill="#FFFFFF" />
            <ellipse cx="100" cy="195" rx="5" ry="2" fill="#FFFFFF" />
          </g>
        )}
      </svg>

      {/* Name tag pill beneath */}
      <div className="mt-1 text-[11px] font-black text-pink-900 bg-white/95 px-3 py-0.5 rounded-full shadow-xs border border-pink-200">
        {name} · {mood === 'wrong' ? '重心失衡中！' : mood === 'correct' ? '站穩啦！✨' : mood === 'seated' ? '幸福坐下 💤' : '抓緊吊環中'}
      </div>
    </motion.div>
  );
};
