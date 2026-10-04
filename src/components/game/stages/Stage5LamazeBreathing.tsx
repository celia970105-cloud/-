import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StageProps } from '../../../types/pregnancy';
import { playRhythmHit, playKawaiiOuch, playSuccessChime, playKawaiiPop } from '../../../utils/audio';
import { Sparkles, RotateCcw, Heart, CheckCircle2, Zap, Target } from 'lucide-react';

interface RhythmNote {
  id: number;
  type: 'inhale' | 'exhale' | 'heehoo';
  text: string;
  emoji: string;
  position: number; // 0 to 100% (travels from 0 to 100, target is at 80%)
}

export const Stage5LamazeBreathing: React.FC<StageProps> = ({ onComplete, onUpdateStats }) => {
  const [notes, setNotes] = useState<RhythmNote[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hitFeedback, setHitFeedback] = useState<string | null>(null);
  const [calmMeter, setCalmMeter] = useState(15);
  const [isWon, setIsWon] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [accuracyPct, setAccuracyPct] = useState(0);

  // Statistics tracker to prevent easy 100 full marks
  const statsRef = useRef({
    perfectHits: 0,
    greatHits: 0,
    missHits: 0,
    totalHits: 0
  });

  // Target hit zone is at 80%
  const TARGET_ZONE = 80;

  // Spawn rhythm notes periodically (every 850ms)
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      const types: ('inhale' | 'exhale' | 'heehoo')[] = ['inhale', 'exhale', 'heehoo'];
      const chosen = types[Math.floor(Math.random() * types.length)];
      const textMap = {
        inhale: { text: '深吸~', emoji: '🌬️' },
        exhale: { text: '慢呼~', emoji: '💨' },
        heehoo: { text: '淺快呼!', emoji: '🎈' }
      };

      setNotes((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          type: chosen,
          text: textMap[chosen].text,
          emoji: textMap[chosen].emoji,
          position: 0
        }
      ]);
    }, 850);

    return () => clearInterval(interval);
  }, [isWon]);

  // Notes motion animation loop
  useEffect(() => {
    if (isWon) return;
    const loop = setInterval(() => {
      setNotes((prev) => {
        const next: RhythmNote[] = [];
        for (const n of prev) {
          const nextPos = n.position + 3.2;
          if (nextPos > 105) {
            // Note missed automatically
            statsRef.current.missHits += 1;
            setCombo(0);
            setCalmMeter((c) => Math.max(5, c - 6));
            continue;
          }
          next.push({ ...n, position: nextPos });
        }
        return next;
      });
    }, 40);

    return () => clearInterval(loop);
  }, [isWon]);

  const handleDrumTap = () => {
    if (isWon) return;

    // Find closest note near TARGET_ZONE (Tighter window ±8 for calibrated difficulty)
    const hitIndex = notes.findIndex((n) => Math.abs(n.position - TARGET_ZONE) <= 8);

    if (hitIndex !== -1) {
      const note = notes[hitIndex];
      const dist = Math.abs(note.position - TARGET_ZONE);

      let rating = 'PERFECT!';
      let scoreAdd = 80;
      let calmAdd = 7;

      if (dist <= 3.8) {
        // Strict Perfect
        statsRef.current.perfectHits += 1;
        rating = 'PERFECT!';
        scoreAdd = 80;
        calmAdd = 7;
      } else {
        // Great
        statsRef.current.greatHits += 1;
        rating = 'GREAT!';
        scoreAdd = 45;
        calmAdd = 4;
      }

      statsRef.current.totalHits += 1;
      playRhythmHit(dist <= 3.8);

      setScore((s) => s + scoreAdd);
      setCombo((c) => {
        const nextC = c + 1;
        setMaxCombo((m) => Math.max(m, nextC));
        return nextC;
      });
      setHitFeedback(rating);

      const nextCalm = Math.min(100, calmMeter + calmAdd);
      setCalmMeter(nextCalm);
      onUpdateStats(4, -3, 6);

      // Remove hit note
      setNotes((prev) => prev.filter((_, idx) => idx !== hitIndex));

      // Reaching 100 calm triggers completion with strictly calculated accuracy score
      if (nextCalm >= 100) {
        evaluateWin();
      }
    } else {
      // Miss tap penalty
      playKawaiiOuch();
      statsRef.current.missHits += 1;
      setCombo(0);
      setScore((s) => Math.max(0, s - 25));
      setCalmMeter((c) => Math.max(5, c - 8));
      setHitFeedback('MISS!');
    }

    setTimeout(() => {
      setHitFeedback(null);
    }, 380);
  };

  // Rigorous scoring: avoids giving easy 100 marks
  const evaluateWin = () => {
    setIsWon(true);
    playSuccessChime();

    const { perfectHits, greatHits, missHits } = statsRef.current;
    const total = perfectHits + greatHits + missHits;
    const accuracy = total > 0 ? Math.round(((perfectHits * 1.0 + greatHits * 0.6) / total) * 100) : 70;
    setAccuracyPct(accuracy);

    // Realistic nursing score: 100 requires 0 misses and >90% perfects!
    let computedScore = Math.round(accuracy * 0.88 + (maxCombo >= 10 ? 8 : maxCombo >= 5 ? 4 : 0));
    if (missHits > 0 && computedScore >= 98) {
      computedScore = 93; // Cap if there were misses
    }
    const finalVal = Math.min(99, Math.max(68, computedScore));
    setFinalScore(finalVal);
    onComplete(finalVal);
  };

  const handleReset = () => {
    statsRef.current = { perfectHits: 0, greatHits: 0, missHits: 0, totalHits: 0 };
    setNotes([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCalmMeter(15);
    setIsWon(false);
    setHitFeedback(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-pink-50/80 border-2 border-pink-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-pink-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
            🥁
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block bg-pink-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                STAGE 02 · 拉梅茲急速音遊
              </span>
              <span className="inline-flex items-center gap-0.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                <Target className="w-3 h-3" /> 嚴格節奏評分 · 難拿滿分
              </span>
            </div>
            <h2 className="text-lg font-black text-stone-900 font-serif-tc mt-0.5">
              精準擊打判定線，錯拍扣平靜度，真實計算節奏分！
            </h2>
          </div>
        </div>

        {/* Calm Meter & Combo */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-pink-200 shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-stone-400 block">放鬆平靜度 (累積至 100%)</span>
            <div className="w-24 h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200 mt-0.5">
              <div
                className="h-full bg-pink-500 transition-all duration-150"
                style={{ width: `${calmMeter}%` }}
              />
            </div>
          </div>
          <div className="h-7 w-px bg-pink-200" />
          <div className="text-center min-w-[55px]">
            <span className="text-[10px] font-bold text-stone-400 block">COMBO</span>
            <span className="text-base font-black text-pink-700 font-mono">
              {combo} ✕
            </span>
          </div>
        </div>
      </div>

      {/* Rhythm Track Highway */}
      <div className="relative h-60 sm:h-68 bg-gradient-to-r from-stone-900 via-stone-850 to-pink-950 rounded-3xl border-3 border-pink-300 overflow-hidden shadow-inner p-4 flex flex-col justify-between select-none">
        {/* Track Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-16 bg-white/5 border-y border-pink-500/20 flex items-center">
          {/* Target Judgement Ring Zone at 80% */}
          <div
            style={{ left: `${TARGET_ZONE}%` }}
            className="absolute -translate-x-1/2 w-16 h-16 rounded-full border-4 border-pink-400/90 bg-pink-500/20 shadow-[0_0_20px_rgba(251,111,146,0.6)] flex items-center justify-center animate-pulse"
          >
            <div className="w-8 h-8 rounded-full border-2 border-white/60" />
            <span className="absolute -bottom-6 text-[10px] font-black text-pink-300">
              判定線
            </span>
          </div>

          {/* Flying Notes */}
          {notes.map((note) => (
            <div
              key={note.id}
              style={{ left: `${note.position}%` }}
              className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none transition-transform"
            >
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl shadow-lg ${
                  note.type === 'inhale'
                    ? 'bg-sky-500 border-sky-200 text-white'
                    : note.type === 'exhale'
                    ? 'bg-emerald-500 border-emerald-200 text-white'
                    : 'bg-rose-500 border-rose-200 text-white animate-spin'
                }`}
              >
                {note.emoji}
              </div>
              <span className="text-[10px] font-black text-white bg-black/60 px-1.5 rounded-full mt-0.5">
                {note.text}
              </span>
            </div>
          ))}
        </div>

        {/* Feedback text */}
        <div className="relative z-10 flex justify-between items-start text-xs font-bold text-white/80">
          <div>
            <span>得分：</span>
            <span className="font-mono text-pink-400 text-base font-black ml-1">{score}</span>
          </div>

          <AnimatePresence>
            {hitFeedback && (
              <motion.div
                initial={{ scale: 0.5, y: -5 }}
                animate={{ scale: 1.2, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-lg font-black tracking-wider ${
                  hitFeedback === 'PERFECT!'
                    ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]'
                    : hitFeedback === 'GREAT!'
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {hitFeedback}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-stone-400">
            平靜度：{calmMeter}%
          </div>
        </div>

        {/* Big Interactive Tap Button (Drum Pad) */}
        <div className="relative z-10 flex justify-center pb-2">
          <button
            onClick={handleDrumTap}
            className="w-full sm:w-80 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 active:scale-95 text-white rounded-2xl font-black text-base shadow-xl border-2 border-pink-300 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>🥁 點擊敲擊呼吸鼓！(SPACE / 點擊)</span>
          </button>
        </div>

        {/* Win Modal Overlay with Strict Real Evaluated Score */}
        {isWon && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-xl border-2 border-emerald-300">
              <div className="text-5xl">🎶✨</div>
              <h3 className="text-xl font-black text-stone-900 font-serif-tc">
                挑戰完成！平靜度達標！
              </h3>
              <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200 space-y-1">
                <div className="text-xs text-stone-500 font-bold">嚴格結算成績</div>
                <div className="text-2xl font-black text-pink-700 font-mono">
                  {finalScore} 分
                </div>
                <div className="text-[11px] text-stone-600">
                  節奏精準度：{accuracyPct}% · 最高連擊：{maxCombo} ✕
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {finalScore >= 95
                  ? '神級大師！幾乎沒有失誤，完美呼吸轉移陣痛！'
                  : finalScore >= 80
                  ? '表現優良！能隨宮縮節拍及時調整呼吸深度！'
                  : '順利通關！雖然稍有漏拍，依然成功平撫了焦慮！'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard hotkey listener for Space bar */}
      <KeyboardSpaceListener onSpace={handleDrumTap} />
    </div>
  );
};

const KeyboardSpaceListener: React.FC<{ onSpace: () => void }> = ({ onSpace }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onSpace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSpace]);

  return null;
};
