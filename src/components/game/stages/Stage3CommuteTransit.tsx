import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { playKawaiiCoin, playKawaiiOuch, playSuccessChime, playKawaiiPop } from '../../../utils/audio';
import { RotateCcw, Heart, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

interface StageProps {
  onComplete: (score: number) => void;
  onUpdateStats: (energyDelta: number, fatigueDelta: number, empathyDelta: number) => void;
}

export const Stage3CommuteTransit: React.FC<StageProps> = ({ onComplete, onUpdateStats }) => {
  const [balance, setBalance] = useState(50); // 0 to 100
  const [badgeActive, setBadgeActive] = useState(false);
  const [seated, setSeated] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [dialogue, setDialogue] = useState('捷運車廂正在搖晃晃！快拉住把手維持平衡，並點擊【好孕胸章】尋找座位！');

  // Subway rocking sway
  useEffect(() => {
    if (seated) return;
    const interval = setInterval(() => {
      // Random sway force
      const sway = (Math.random() - 0.5) * 16;
      setBalance((b) => {
        const next = Math.max(5, Math.min(95, b + sway));
        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [seated]);

  const handleAdjustBalance = (delta: number) => {
    playKawaiiPop();
    setBalance((b) => Math.max(10, Math.min(90, b + delta)));
  };

  const handleShowBadge = () => {
    playKawaiiCoin();
    setBadgeActive(true);
    setDialogue('✨ 好孕胸章發出溫暖愛心光波！坐在博愛座的同學看見了！');
    onUpdateStats(10, -5, 10);

    // Spawn cute heart particles
    const newHearts = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 40
    }));
    setHearts(newHearts);
  };

  const handleSitDown = () => {
    playKawaiiCoin();
    playSuccessChime();
    setSeated(true);
    setBalance(50);
    setDialogue('🎉 順利坐下啦！腰痛和頭暈都瞬間消失了，謝謝溫暖讓座的同學！');
    onUpdateStats(25, -20, 20);
    onComplete(96);
  };

  const handleReset = () => {
    setBalance(50);
    setBadgeActive(false);
    setSeated(false);
    setHearts([]);
    setDialogue('挑戰重置：捷運又開動囉！');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-sky-50/80 border-2 border-sky-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-sky-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
            🚇
          </div>
          <div>
            <div className="inline-block bg-sky-200 text-sky-800 text-[11px] font-bold px-2 py-0.5 rounded-full mb-0.5">
              STAGE 03 · 捷運通勤大冒險
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-tc">
              捷運晃晃車廂！平衡抗震 & 閃亮好孕章
            </h3>
            <p className="text-xs text-stone-500">
              列車會左右搖晃！點擊把手保持綠色平衡，發射好孕光波尋求友善讓座！
            </p>
          </div>
        </div>

        {/* Balance status */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-sky-200">
          <span className="text-xs font-bold text-stone-500">車廂平衡：</span>
          <span className={`text-base font-black font-mono ${
            balance < 25 || balance > 75 ? 'text-red-500 animate-pulse' : 'text-emerald-600'
          }`}>
            {balance < 25 || balance > 75 ? '⚠️ 快跌倒啦！' : '🌿 平穩站立中'}
          </span>
        </div>
      </div>

      {/* Main Carriage Interactive Screen */}
      <div className="bg-gradient-to-b from-sky-100 to-white rounded-3xl border-3 border-sky-200 p-6 flex flex-col items-center justify-between min-h-[420px] shadow-sm relative overflow-hidden">
        {/* Dialogue Bubble */}
        <div className="bg-white/90 border border-sky-300 rounded-full px-5 py-2 text-xs font-bold text-sky-900 shadow-xs mb-3 text-center max-w-md">
          {dialogue}
        </div>

        {/* Floating Heart Particles */}
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ scale: 0.5, y: 0, opacity: 1 }}
            animate={{ scale: 1.5, y: -80, opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className="absolute text-2xl pointer-events-none z-20"
          >
            💖
          </motion.div>
        ))}

        {/* Subway Visual Scene */}
        <div className="w-full max-w-lg bg-sky-50 rounded-2xl border-2 border-sky-200 p-6 relative flex flex-col items-center justify-between my-2 overflow-hidden shadow-inner min-h-[220px]">
          {/* Train windows */}
          <div className="w-full flex justify-around mb-4 opacity-50">
            <div className="w-20 h-10 bg-sky-200 rounded-lg border border-sky-300" />
            <div className="w-20 h-10 bg-sky-200 rounded-lg border border-sky-300" />
            <div className="w-20 h-10 bg-sky-200 rounded-lg border border-sky-300" />
          </div>

          {/* Seat Passenger & Pregnant Mom */}
          <div className="w-full flex items-end justify-around relative z-10">
            {/* Priority Seat Passenger */}
            <div className="flex flex-col items-center">
              {badgeActive && !seated && (
                <div className="bg-pink-100 border border-pink-300 text-pink-900 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 animate-bounce">
                  「阿！妳懷孕了！快請坐！」
                </div>
              )}
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-xs">
                {seated ? '🚶' : badgeActive ? '🙋‍♂️' : '🎧'}
              </div>
              <span className="text-[10px] font-bold text-stone-500 mt-1">
                {seated ? '讓座站立' : '博愛座同學'}
              </span>
            </div>

            {/* Pregnant Mom */}
            <motion.div
              animate={{
                rotate: seated ? 0 : (balance - 50) * 0.4,
                x: seated ? -40 : (balance - 50) * 1.5
              }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-pink-100 border-3 border-pink-300 flex items-center justify-center text-4xl shadow-md">
                  {seated ? '🥰' : balance < 25 || balance > 75 ? '😵' : '🤰'}
                </div>
                {badgeActive && (
                  <div className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full p-1 text-[11px] shadow-sm animate-pulse">
                    ❤️
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-pink-700 mt-1">
                {seated ? '舒適入座中 💤' : '站立抓吊環'}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Live Balance Gauge Bar */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-stone-500">
            <span>◀ 向左傾斜</span>
            <span className="text-sky-700">吊環重心平衡點</span>
            <span>向右傾斜 ▶</span>
          </div>

          <div className="relative h-6 bg-stone-100 rounded-full border-2 border-stone-300 overflow-hidden">
            <div className="absolute top-0 bottom-0 left-[35%] right-[35%] bg-emerald-200" />
            <div
              style={{ left: `${balance}%` }}
              className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-sky-600 rounded-full shadow-md z-10 transition-all duration-75"
            />
          </div>

          {/* Balance controls & Badge action */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <button
              disabled={seated}
              onClick={() => handleAdjustBalance(-18)}
              className="py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 rounded-xl font-bold text-xs cursor-pointer shadow-xs disabled:opacity-40"
            >
              ◀ 往左抓穩
            </button>

            <button
              disabled={badgeActive || seated}
              onClick={handleShowBadge}
              className={`col-span-2 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                badgeActive
                  ? 'bg-pink-100 text-pink-700 border border-pink-300 cursor-default'
                  : 'bg-pink-500 hover:bg-pink-600 text-white'
              }`}
            >
              <Heart className="w-4 h-4 fill-current text-white" />
              <span>{badgeActive ? '✨ 已出示好孕胸章' : '💖 發射好孕光波 (秀出胸章)'}</span>
            </button>

            <button
              disabled={seated}
              onClick={() => handleAdjustBalance(18)}
              className="py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 rounded-xl font-bold text-xs cursor-pointer shadow-xs disabled:opacity-40"
            >
              往右抓穩 ▶
            </button>
          </div>

          {/* Seat Action Button when badge is active */}
          {badgeActive && !seated && (
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSitDown}
              className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer animate-bounce"
            >
              <Sparkles className="w-5 h-5" />
              <span>點擊入座！感謝同學禮貌讓座！</span>
            </motion.button>
          )}

          {seated && (
            <div className="w-full text-center py-2 text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>過關！安全入座，安心抵達目的地！</span>
            </div>
          )}
        </div>

        {/* Reset button */}
        <div className="w-full flex justify-end mt-1">
          <button
            onClick={handleReset}
            className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重新玩</span>
          </button>
        </div>
      </div>
    </div>
  );
};
