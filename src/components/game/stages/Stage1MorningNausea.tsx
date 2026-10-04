import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { playKawaiiCoin, playKawaiiOuch, playSuccessChime, playKawaiiPop } from '../../../utils/audio';
import { Sparkles, RotateCcw, ArrowLeft, ArrowRight, Heart } from 'lucide-react';

interface StageProps {
  onComplete: (score: number) => void;
  onUpdateStats: (energyDelta: number, fatigueDelta: number, empathyDelta: number) => void;
}

interface FallingItem {
  id: number;
  x: number; // 5 to 90%
  y: number; // 0 to 100%
  emoji: string;
  name: string;
  isGood: boolean;
  speed: number;
}

const GOOD_TEMPLATES = [
  { emoji: '🍪', name: '蘇打餅乾', isGood: true },
  { emoji: '🍋', name: '檸檬水', isGood: true },
  { emoji: '🍞', name: '乾吐司', isGood: true },
  { emoji: '💊', name: '葉酸錠', isGood: true },
  { emoji: '🍎', name: '甜蘋果片', isGood: true }
];

const BAD_TEMPLATES = [
  { emoji: '🥓', name: '油炸培根', isGood: false },
  { emoji: '☕', name: '濃黑咖啡', isGood: false },
  { emoji: '💨', name: '油煙嗆味', isGood: false },
  { emoji: '🧄', name: '大蒜臭氣', isGood: false }
];

export const Stage1MorningNausea: React.FC<StageProps> = ({ onComplete, onUpdateStats }) => {
  const [basketX, setBasketX] = useState(50); // 10 to 90%
  const [nausea, setNausea] = useState(30);
  const [caughtCount, setCaughtCount] = useState(0);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState<{ text: string; good: boolean } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Spawn falling items
  useEffect(() => {
    if (isGameOver || isWon) return;

    const spawnInterval = setInterval(() => {
      const isGood = Math.random() > 0.4;
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
        speed: Math.random() * 2 + 2.5
      };

      setFallingItems((prev) => [...prev, newItem]);
    }, 1100);

    return () => clearInterval(spawnInterval);
  }, [isGameOver, isWon]);

  // Game animation frame loop
  useEffect(() => {
    if (isGameOver || isWon) return;

    const gameLoop = setInterval(() => {
      setFallingItems((prev) => {
        const nextItems: FallingItem[] = [];

        for (const item of prev) {
          const nextY = item.y + item.speed;

          // Check collision with basket (basket is around y: 82 to 92%)
          if (nextY >= 80 && nextY <= 92 && Math.abs(item.x - basketX) < 14) {
            // Collision caught!
            if (item.isGood) {
              playKawaiiCoin();
              setCaughtCount((c) => {
                const nextC = c + 1;
                if (nextC >= 8) {
                  triggerWin();
                }
                return nextC;
              });
              setNausea((n) => Math.max(0, n - 10));
              setFeedbackEffect({ text: `+1 ${item.name} 胃好舒服~`, good: true });
              onUpdateStats(8, -2, 5);
            } else {
              playKawaiiOuch();
              setNausea((n) => {
                const nextN = n + 22;
                if (nextN >= 100) {
                  setIsGameOver(true);
                }
                return nextN;
              });
              setFeedbackEffect({ text: `吃到 ${item.name} 嘔嘔嘔！`, good: false });
              onUpdateStats(-5, 10, 2);
            }
            continue; // item consumed
          }

          if (nextY < 100) {
            nextItems.push({ ...item, y: nextY });
          }
        }
        return nextItems;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [basketX, isGameOver, isWon]);

  const triggerWin = () => {
    setIsWon(true);
    playSuccessChime();
    onComplete(96);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setBasketX((x) => Math.max(12, x - 8));
      } else if (e.key === 'ArrowRight') {
        setBasketX((x) => Math.min(88, x + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReset = () => {
    setBasketX(50);
    setNausea(30);
    setCaughtCount(0);
    setFallingItems([]);
    setIsGameOver(false);
    setIsWon(false);
    setFeedbackEffect(null);
  };

  return (
    <div className="space-y-4">
      {/* Kawaii Cute Header */}
      <div className="bg-pink-50/80 border-2 border-pink-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-pink-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
            🍪
          </div>
          <div>
            <div className="inline-block bg-pink-200 text-pink-800 text-[11px] font-bold px-2 py-0.5 rounded-full mb-0.5">
              STAGE 01 · 孕早期晨吐大作戰
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-tc">
              清晨補給接接樂！避開油煙怪
            </h3>
            <p className="text-xs text-stone-500">
              用方向鍵或按鈕移動媽咪，接住 8 樣清淡美食！千萬不要吃到油膩物喔！
            </p>
          </div>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-4 shrink-0 bg-white px-4 py-2 rounded-2xl border border-pink-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-400 block font-bold">已收集補給</span>
            <span className="text-lg font-black text-pink-600 font-mono">
              {caughtCount} / 8
            </span>
          </div>
          <div className="h-8 w-px bg-pink-100" />
          <div className="text-center">
            <span className="text-[10px] text-stone-400 block font-bold">反胃乾嘔條</span>
            <span className={`text-lg font-black font-mono ${nausea > 70 ? 'text-red-500 animate-pulse' : 'text-stone-700'}`}>
              {nausea}%
            </span>
          </div>
        </div>
      </div>

      {/* Arcade Playfield Canvas */}
      <div
        ref={containerRef}
        className="relative h-96 sm:h-[420px] bg-gradient-to-b from-sky-50 via-pink-50/40 to-amber-50/50 rounded-3xl border-3 border-pink-200 overflow-hidden shadow-inner select-none"
      >
        {/* Cute Clouds in background */}
        <div className="absolute top-4 left-8 text-3xl opacity-40 animate-pulse">☁️</div>
        <div className="absolute top-12 right-12 text-2xl opacity-40">✨</div>
        <div className="absolute top-24 left-1/3 text-xl opacity-30">🌸</div>

        {/* Floating pop text */}
        {feedbackEffect && (
          <div
            className={`absolute top-16 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold shadow-md z-20 transition-all ${
              feedbackEffect.good ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white animate-bounce'
            }`}
          >
            {feedbackEffect.text}
          </div>
        )}

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
              item.isGood ? 'scale-110 drop-shadow-md' : 'scale-105'
            }`}
          >
            <span className="text-3xl sm:text-4xl animate-bounce">{item.emoji}</span>
            <span className={`text-[10px] font-bold px-1.5 rounded-full mt-0.5 ${
              item.isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {item.name}
            </span>
          </div>
        ))}

        {/* Player: Cute Mom Character with cute tummy & basket */}
        <div
          style={{
            left: `${basketX}%`,
            bottom: '16px',
            transform: 'translateX(-50%)'
          }}
          className="absolute z-10 flex flex-col items-center transition-all duration-75"
        >
          {/* Cute prompt bubble */}
          <div className="bg-white/90 border border-pink-300 text-[10px] text-pink-700 font-bold px-2 py-0.5 rounded-full shadow-xs mb-1">
            🤰 媽咪肚子好餓~
          </div>

          <div className="relative">
            {/* Cute mom emoji / avatar */}
            <div className="w-16 h-16 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-3xl shadow-md">
              {nausea > 70 ? '🤢' : isWon ? '🥰' : '🤰'}
            </div>
            {/* Basket Tray */}
            <div className="absolute -bottom-1 -left-3 -right-3 h-5 bg-amber-400 border border-amber-500 rounded-full flex items-center justify-center text-[10px] text-amber-950 font-bold shadow-xs">
              🧺 餐盤
            </div>
          </div>
        </div>

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30">
            <div className="text-5xl mb-2">😵‍💫</div>
            <h4 className="text-xl font-bold text-white mb-1">晨吐指數破表啦！</h4>
            <p className="text-xs text-pink-200 mb-4">吃到了太多油膩地雷，肚子開始劇烈翻滾！再試一次吧！</p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新挑戰</span>
            </button>
          </div>
        )}

        {/* Win Screen */}
        {isWon && (
          <div className="absolute inset-0 bg-pink-500/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30 animate-in fade-in">
            <div className="text-6xl mb-2 animate-bounce">🎉</div>
            <h4 className="text-2xl font-bold text-white mb-1">太棒啦！止吐成功！</h4>
            <p className="text-xs text-white/90 mb-4">
              成功吃到 8 份健康補給，晨間元氣滿滿，寶寶在肚子裡開心地翻跟斗！
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white/20 text-white rounded-full text-xs font-bold hover:bg-white/30 cursor-pointer"
              >
                再玩一次
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch / Click Controls for easy playing on screen */}
      <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-2xl border border-pink-200">
        <button
          onClick={() => {
            playKawaiiPop();
            setBasketX((x) => Math.max(12, x - 12));
          }}
          className="flex-1 py-3 bg-pink-100 hover:bg-pink-200 active:scale-95 text-pink-800 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>向左移動</span>
        </button>

        <button
          onClick={() => {
            playKawaiiPop();
            setBasketX((x) => Math.min(88, x + 12));
          }}
          className="flex-1 py-3 bg-pink-100 hover:bg-pink-200 active:scale-95 text-pink-800 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <span>向右移動</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
