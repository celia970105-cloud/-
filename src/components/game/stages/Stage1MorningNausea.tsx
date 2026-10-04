import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StageProps } from '../../../types/pregnancy';
import {
  playKawaiiCoin,
  playKawaiiOuch,
  playSuccessChime,
  playKawaiiPop,
  playMorningSicknessGurgle,
  startMorningAmbientHum,
  stopMorningAmbientHum
} from '../../../utils/audio';
import { Sparkles, RotateCcw, Award, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, Zap, Target } from 'lucide-react';

interface FallingItem {
  id: number;
  x: number; // percentage 10 to 90
  y: number; // percentage 0 to 100
  emoji: string;
  name: string;
  isGood: boolean;
  speed: number;
}

const GOOD_TEMPLATES = [
  { emoji: '🍪', name: '蘇打餅乾', isGood: true },
  { emoji: '🍞', name: '無油乾吐司', isGood: true },
  { emoji: '🍋', name: '酸甜檸檬水', isGood: true },
  { emoji: '💊', name: '維生素B6錠', isGood: true },
  { emoji: '🍎', name: '甜蘋果片', isGood: true },
  { emoji: '🥣', name: '暖胃燕麥粥', isGood: true },
  { emoji: '🍌', name: '補鉀熟香蕉', isGood: true },
  { emoji: '🫚', name: '止吐生薑片', isGood: true },
  { emoji: '🍵', name: '清香薄荷茶', isGood: true },
  { emoji: '🧀', name: '高蛋白乳酪', isGood: true }
];

const BAD_TEMPLATES = [
  { emoji: '🥓', name: '油炸培根', isGood: false },
  { emoji: '☕', name: '濃黑咖啡', isGood: false },
  { emoji: '💨', name: '刺鼻油煙', isGood: false },
  { emoji: '🧄', name: '爆炒生大蒜', isGood: false },
  { emoji: '🌶️', name: '重辣麻辣鍋', isGood: false },
  { emoji: '🍗', name: '酥脆炸雞排', isGood: false },
  { emoji: '🧋', name: '甜膩波霸奶', isGood: false },
  { emoji: '🦨', name: '濃郁臭豆腐', isGood: false }
];

export const Stage1MorningNausea: React.FC<StageProps> = ({ onComplete, onUpdateStats }) => {
  const [basketX, setBasketX] = useState(50); // 10 to 90%
  const [nausea, setNausea] = useState(25);
  const [score, setScore] = useState(0); // 0 to 10 points
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState<{ text: string; good: boolean } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef(0);
  const nauseaRef = useRef(25);

  // Gentle morning ambient hum during gameplay
  useEffect(() => {
    if (!isGameOver && !isWon) {
      startMorningAmbientHum();
    } else {
      stopMorningAmbientHum();
    }
    return () => {
      stopMorningAmbientHum();
    };
  }, [isGameOver, isWon]);

  // Spawn falling items at high speed (Every 600ms)
  useEffect(() => {
    if (isGameOver || isWon) return;

    const spawnInterval = setInterval(() => {
      const isGood = Math.random() > 0.42;
      const template = isGood
        ? GOOD_TEMPLATES[Math.floor(Math.random() * GOOD_TEMPLATES.length)]
        : BAD_TEMPLATES[Math.floor(Math.random() * BAD_TEMPLATES.length)];

      const newItem: FallingItem = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 80) + 10,
        y: 0,
        emoji: template.emoji,
        name: template.name,
        isGood: template.isGood,
        speed: Math.random() * 2.5 + 4.2
      };

      setFallingItems((prev) => [...prev, newItem]);
    }, 600);

    return () => clearInterval(spawnInterval);
  }, [isGameOver, isWon]);

  // Game animation frame loop
  useEffect(() => {
    if (isGameOver || isWon) return;

    const gameLoop = setInterval(() => {
      const caughtThisFrame: FallingItem[] = [];

      setFallingItems((prev) => {
        const nextItems: FallingItem[] = [];

        for (const item of prev) {
          const nextY = item.y + item.speed;

          // Check collision with basket
          if (nextY >= 80 && nextY <= 92 && Math.abs(item.x - basketX) < 14) {
            caughtThisFrame.push(item);
            continue; // consumed
          }

          if (nextY < 100) {
            nextItems.push({ ...item, y: nextY });
          }
        }
        return nextItems;
      });

      // Process collision results safely outside state updater
      for (const item of caughtThisFrame) {
        if (item.isGood) {
          playKawaiiCoin();
          scoreRef.current += 1; // +1 point for good food
          nauseaRef.current = Math.max(0, nauseaRef.current - 12);
          setScore(scoreRef.current);
          setNausea(nauseaRef.current);
          setFeedbackEffect({ text: `+1分 ✨ ${item.name} 胃好舒服！`, good: true });
          onUpdateStats(8, -2, 5);

          // WIN CONDITION: 10 points!
          if (scoreRef.current >= 10) {
            setIsWon(true);
            playSuccessChime();
            onComplete(95);
            break;
          }
        } else {
          playKawaiiOuch();
          playMorningSicknessGurgle();
          scoreRef.current = Math.max(0, scoreRef.current - 1); // -1 point penalty for bad food!
          nauseaRef.current = Math.min(100, nauseaRef.current + 26);
          setScore(scoreRef.current);
          setNausea(nauseaRef.current);
          setFeedbackEffect({ text: `-1分 ❌ 吃到 ${item.name}！反胃扣分！`, good: false });
          onUpdateStats(-5, 10, 2);

          if (nauseaRef.current >= 100) {
            setIsGameOver(true);
            break;
          }
        }
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [basketX, isGameOver, isWon, onComplete, onUpdateStats]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setBasketX((x) => Math.max(10, x - 12));
      } else if (e.key === 'ArrowRight') {
        setBasketX((x) => Math.min(90, x + 12));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReset = () => {
    scoreRef.current = 0;
    nauseaRef.current = 25;
    setBasketX(50);
    setNausea(25);
    setScore(0);
    setFallingItems([]);
    setIsGameOver(false);
    setIsWon(false);
    setFeedbackEffect(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-pink-50/80 border-2 border-pink-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-pink-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
            🍪
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block bg-pink-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                STAGE 01 · 晨吐快手接接樂
              </span>
              <span className="inline-flex items-center gap-0.5 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                🎯 滿 10 分過關 · 壞物扣 1 分
              </span>
            </div>
            <h2 className="text-lg font-black text-stone-900 font-serif-tc mt-0.5">
              吃到 10 個好食物得 10 分過關，吃到壞的扣 1 分！
            </h2>
          </div>
        </div>

        {/* Score & Nausea Bar */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-pink-200 shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-stone-400 block">反胃乾嘔度 (滿百失格)</span>
            <div className="w-24 h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200 mt-0.5">
              <div
                className={`h-full transition-all ${
                  nausea < 40 ? 'bg-emerald-400' : nausea < 75 ? 'bg-amber-400' : 'bg-red-500'
                }`}
                style={{ width: `${nausea}%` }}
              />
            </div>
          </div>
          <div className="h-7 w-px bg-pink-200" />
          <div className="text-center min-w-[70px]">
            <span className="text-[10px] font-bold text-stone-400 block">當前得分</span>
            <span className="text-base font-black text-pink-700 font-mono">
              {score} / 10 分
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Screen */}
      <div
        ref={containerRef}
        onMouseMove={(e) => {
          if (!containerRef.current || isGameOver || isWon) return;
          const rect = containerRef.current.getBoundingClientRect();
          const percent = ((e.clientX - rect.left) / rect.width) * 100;
          setBasketX(Math.max(10, Math.min(90, percent)));
        }}
        className="relative h-72 sm:h-80 bg-gradient-to-b from-sky-50 via-pink-50/50 to-amber-50/40 rounded-3xl border-3 border-pink-200 overflow-hidden shadow-inner cursor-ew-resize select-none"
      >
        {/* Falling items */}
        {fallingItems.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            className={`absolute flex flex-col items-center pointer-events-none transition-transform ${
              item.isGood ? 'scale-110 drop-shadow-xs' : 'scale-105 opacity-90'
            }`}
          >
            <span className="text-3xl sm:text-4xl animate-bounce">{item.emoji}</span>
            <span
              className={`text-[10px] font-black px-1.5 rounded-full ${
                item.isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {item.name}
            </span>
          </div>
        ))}

        {/* Floating feedback toast */}
        <AnimatePresence>
          {feedbackEffect && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: -25, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ left: `${basketX}%`, top: '70%' }}
              className={`absolute -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black shadow-md z-30 pointer-events-none ${
                feedbackEffect.good
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {feedbackEffect.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Plate / Basket */}
        <div
          style={{
            left: `${basketX}%`,
            top: '84%',
            transform: 'translate(-50%, -50%)'
          }}
          className="absolute flex flex-col items-center transition-all duration-75 z-20 pointer-events-none"
        >
          <div className="w-20 sm:w-24 h-7 bg-white rounded-full border-3 border-pink-400 shadow-md flex items-center justify-center gap-1">
            <span className="text-sm">🥣</span>
            <span className="text-[10px] font-black text-pink-700">護胃盤</span>
          </div>
          <div className="text-[10px] font-bold text-stone-500 mt-1 bg-white/80 px-2 rounded-full border border-pink-100">
            左右移動 / 方向鍵
          </div>
        </div>

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-xl border-2 border-rose-300">
              <div className="text-5xl">😵‍💫</div>
              <h3 className="text-xl font-black text-stone-900 font-serif-tc">
                反胃值破表！吐得全身無力...
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                吃到了油炸、辛辣或刺鼻氣味，得分倒扣且胃酸逆流！
              </p>
              <button
                onClick={handleReset}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重新挑戰 10 分！</span>
              </button>
            </div>
          </div>
        )}

        {/* Win Screen */}
        {isWon && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-xl border-2 border-emerald-300">
              <div className="text-5xl">✨🎉✨</div>
              <h3 className="text-xl font-black text-stone-900 font-serif-tc">
                恭喜滿 10 分！晨吐大獲全勝！
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                太精準了！成功避開油煙油炸，接滿 10 個良食達到 10 分完美通關！
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile touch helper buttons */}
      <div className="sm:hidden flex gap-2">
        <button
          onClick={() => setBasketX((x) => Math.max(10, x - 15))}
          className="flex-1 py-3 bg-pink-100 active:bg-pink-200 rounded-2xl font-black text-xs text-pink-900 flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> 向左移動
        </button>
        <button
          onClick={() => setBasketX((x) => Math.min(90, x + 15))}
          className="flex-1 py-3 bg-pink-100 active:bg-pink-200 rounded-2xl font-black text-xs text-pink-900 flex items-center justify-center gap-1"
        >
          向右移動 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
