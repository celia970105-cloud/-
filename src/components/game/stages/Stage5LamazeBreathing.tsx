import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { playRhythmHit, playSuccessChime, playHeartbeat, playKawaiiOuch } from '../../../utils/audio';
import { RotateCcw, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface StageProps {
  onComplete: (score: number) => void;
  onUpdateStats: (energyDelta: number, fatigueDelta: number, empathyDelta: number) => void;
}

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
  const [hitFeedback, setHitFeedback] = useState<string | null>(null);
  const [calmMeter, setCalmMeter] = useState(30);
  const [isWon, setIsWon] = useState(false);

  // Target hit zone is at 80%
  const TARGET_ZONE = 80;

  // Spawn rhythm notes periodically
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
    }, 1400);

    return () => clearInterval(interval);
  }, [isWon]);

  // Notes motion animation loop
  useEffect(() => {
    if (isWon) return;
    const loop = setInterval(() => {
      setNotes((prev) => {
        const next: RhythmNote[] = [];
        for (const n of prev) {
          const nextPos = n.position + 2.5;
          if (nextPos > 105) {
            // Note missed
            setCombo(0);
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

    // Find closest note near TARGET_ZONE (e.g. 70% to 90%)
    const hitIndex = notes.findIndex((n) => Math.abs(n.position - TARGET_ZONE) <= 12);

    if (hitIndex !== -1) {
      const note = notes[hitIndex];
      const dist = Math.abs(note.position - TARGET_ZONE);

      let rating = 'PERFECT!';
      let scoreAdd = 100;
      if (dist > 6) {
        rating = 'GREAT!';
        scoreAdd = 60;
      }

      playRhythmHit(dist <= 6);
      setScore((s) => s + scoreAdd);
      setCombo((c) => c + 1);
      setHitFeedback(rating);

      const nextCalm = Math.min(100, calmMeter + 10);
      setCalmMeter(nextCalm);
      onUpdateStats(5, -4, 8);

      // Remove hit note
      setNotes((prev) => prev.filter((_, idx) => idx !== hitIndex));

      if (nextCalm >= 100) {
        triggerWin();
      }
    } else {
      // Miss tap
      playKawaiiOuch();
      setCombo(0);
      setHitFeedback('MISS!');
    }

    setTimeout(() => {
      setHitFeedback(null);
    }, 500);
  };

  const triggerWin = () => {
    setIsWon(true);
    playSuccessChime();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    onComplete(99);
  };

  const handleReset = () => {
    setNotes([]);
    setScore(0);
    setCombo(0);
    setCalmMeter(30);
    setHitFeedback(null);
    setIsWon(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-rose-50/80 border-2 border-rose-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-rose-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
            🥁
          </div>
          <div>
            <div className="inline-block bg-rose-200 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full mb-0.5">
              STAGE 05 · 產前陣痛音樂節奏
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-tc">
              陣痛來啦！拉梅茲節奏打擊音遊
            </h3>
            <p className="text-xs text-stone-500">
              宮縮波浪來襲！當呼吸音符滑入右側【紅色同心圓】時，迅速點擊下方大愛心節奏鼓！
            </p>
          </div>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-rose-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-400 block font-bold">連擊 COMBO</span>
            <span className="text-lg font-black text-rose-600 font-mono">
              {combo} 連打
            </span>
          </div>
          <div className="h-8 w-px bg-rose-100" />
          <div className="text-center">
            <span className="text-[10px] text-stone-400 block font-bold">平靜催產素</span>
            <span className="text-lg font-black text-emerald-600 font-mono">
              {calmMeter}%
            </span>
          </div>
        </div>
      </div>

      {/* Rhythm Track Canvas */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-rose-950 text-white rounded-3xl border-3 border-rose-300 p-6 flex flex-col items-center justify-between min-h-[420px] shadow-sm relative overflow-hidden select-none">
        {/* Rating Floating Text */}
        {hitFeedback && (
          <motion.div
            initial={{ scale: 0.5, y: 0 }}
            animate={{ scale: 1.3, y: -20 }}
            className={`absolute top-10 font-black text-2xl z-30 drop-shadow-md ${
              hitFeedback === 'PERFECT!'
                ? 'text-amber-300'
                : hitFeedback === 'GREAT!'
                ? 'text-emerald-300'
                : 'text-rose-400'
            }`}
          >
            {hitFeedback}
          </motion.div>
        )}

        {/* Baby ready announcement */}
        <div className="w-full flex items-center justify-between text-xs text-pink-200 font-mono pb-2 border-b border-rose-700/60 mb-2">
          <span>👶 胎心率 140 bpm · 宮縮波浪推進中</span>
          <span className="text-amber-300 font-bold">SCORE: {score}</span>
        </div>

        {/* Rhythm Track Lane */}
        <div className="w-full h-28 bg-stone-900/70 rounded-2xl border-2 border-rose-400/50 relative overflow-hidden flex items-center my-4 shadow-inner">
          {/* Track line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-rose-500/30 -translate-y-1/2" />

          {/* TARGET HIT ZONE at 80% */}
          <div
            style={{ left: `${TARGET_ZONE}%` }}
            className="absolute top-0 bottom-0 w-16 -ml-8 border-4 border-rose-400 bg-rose-500/30 rounded-2xl flex flex-col items-center justify-center animate-pulse z-10"
          >
            <span className="text-[10px] font-black text-rose-200">HIT!</span>
          </div>

          {/* Moving Notes */}
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                left: `${note.position}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute top-1/2 flex flex-col items-center pointer-events-none transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-white text-stone-900 border-2 border-pink-400 shadow-md flex items-center justify-center text-2xl">
                {note.emoji}
              </div>
              <span className="text-[10px] font-bold text-white bg-rose-700/80 px-1.5 rounded-full mt-1">
                {note.text}
              </span>
            </div>
          ))}
        </div>

        {/* Big Kawaii Rhythm Drum Button */}
        <div className="flex flex-col items-center my-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDrumTap}
            disabled={isWon}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 shadow-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:ring-8 ${
              isWon
                ? 'bg-emerald-500 border-emerald-300 text-white'
                : 'bg-gradient-to-tr from-rose-500 to-pink-400 border-white text-white hover:brightness-110 active:ring-rose-300'
            }`}
          >
            <Heart className="w-10 h-10 fill-current animate-pulse" />
            <span className="text-sm font-black tracking-wider">
              {isWon ? '誕生啦！' : '打擊節奏！'}
            </span>
          </motion.button>
          <span className="text-[11px] text-pink-200 mt-2">
            音符進入方框時，用力點擊大愛心！
          </span>
        </div>

        {/* Win Banner */}
        {isWon && (
          <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-40 animate-in fade-in">
            <div className="text-6xl mb-2 animate-bounce">👶🎉</div>
            <h4 className="text-3xl font-black text-amber-300 font-serif-tc mb-1">
              哇！寶寶平安出生啦！
            </h4>
            <p className="text-sm text-pink-100 max-w-md mb-4">
              你用完美的拉梅茲呼吸節奏，成功抵禦了陣痛波峰！全體通關！
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-xs shadow-lg cursor-pointer"
            >
              再打擊一次音遊
            </button>
          </div>
        )}

        {/* Reset button */}
        <div className="w-full flex justify-end">
          <button
            onClick={handleReset}
            className="text-xs text-pink-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重新打擊</span>
          </button>
        </div>
      </div>
    </div>
  );
};
