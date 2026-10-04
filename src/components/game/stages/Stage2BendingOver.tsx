import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { playKawaiiCoin, playKawaiiOuch, playSuccessChime, playKawaiiPop } from '../../../utils/audio';
import { RotateCcw, CheckCircle2, Sparkles, Heart } from 'lucide-react';

interface StageProps {
  onComplete: (score: number) => void;
  onUpdateStats: (energyDelta: number, fatigueDelta: number, empathyDelta: number) => void;
}

const ITEMS_TO_PICK = [
  { id: 1, name: '家門鑰匙', emoji: '🔑', picked: false },
  { id: 2, name: '小熊搖鈴', emoji: '🧸', picked: false },
  { id: 3, name: '散開的布鞋', emoji: '👟', picked: false }
];

export const Stage2BendingOver: React.FC<StageProps> = ({ onComplete, onUpdateStats }) => {
  const [items, setItems] = useState(ITEMS_TO_PICK);
  const [cursorPos, setCursorPos] = useState(50); // 0 to 100
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isSquatting, setIsSquatting] = useState(false);
  const [characterReaction, setCharacterReaction] = useState<'idle' | 'happy' | 'wobble'>('idle');
  const [dialogue, setDialogue] = useState('肚子大大的，視線都被擋住啦！抓準指針進入【綠色安全區】的時機點擊下蹲！');
  const [isWon, setIsWon] = useState(false);

  // Meter oscillating motion
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setCursorPos((prev) => {
        let next = prev + direction * 3;
        if (next >= 95) {
          setDirection(-1);
          next = 95;
        } else if (next <= 5) {
          setDirection(1);
          next = 5;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [direction, isWon]);

  const handleSquatAction = () => {
    if (isWon || isSquatting) return;
    setIsSquatting(true);

    const currentItem = items.find((i) => !i.picked);
    if (!currentItem) return;

    // Sweet spot is between 40% and 60%
    const isSweetSpot = cursorPos >= 38 && cursorPos <= 62;

    if (isSweetSpot) {
      playKawaiiCoin();
      setCharacterReaction('happy');
      setDialogue(`✨ 完美深蹲！直背扶牆，輕鬆撿起【${currentItem.name}】！`);
      onUpdateStats(5, -5, 10);

      const nextItems = items.map((i) => (i.id === currentItem.id ? { ...i, picked: true } : i));
      setItems(nextItems);

      if (nextItems.every((i) => i.picked)) {
        setIsWon(true);
        playSuccessChime();
        onComplete(98);
      }
    } else {
      playKawaiiOuch();
      setCharacterReaction('wobble');
      setDialogue(`😵 哎呀！直接彎腰肚子頂到了大腿，腰好酸！試著在綠色區域再按一次！`);
      onUpdateStats(-2, 10, 3);
    }

    setTimeout(() => {
      setIsSquatting(false);
      setCharacterReaction('idle');
    }, 700);
  };

  const handleReset = () => {
    setItems(ITEMS_TO_PICK);
    setCursorPos(50);
    setCharacterReaction('idle');
    setDialogue('重新挑戰：抓準時機點擊下蹲！');
    setIsWon(false);
  };

  const remainingCount = items.filter((i) => !i.picked).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
            👟
          </div>
          <div>
            <div className="inline-block bg-amber-200 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full mb-0.5">
              STAGE 02 · 孕晚期物理考驗
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-tc">
              大肚肚平衡機！完美深蹲撿物
            </h3>
            <p className="text-xs text-stone-500">
              肚子向前凸出 25cm，彎腰會卡住！當指針掃過綠色區間時，迅速點擊「下蹲」！
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-amber-200">
          <span className="text-xs font-bold text-stone-500">待撿物品：</span>
          <div className="flex gap-1.5 text-lg">
            {items.map((i) => (
              <span key={i.id} className={i.picked ? 'opacity-30 line-through' : 'animate-bounce'}>
                {i.emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 flex flex-col items-center justify-between min-h-[400px] shadow-sm relative overflow-hidden">
        {/* Dialogue Bubble */}
        <div className="bg-amber-100/70 border border-amber-300 rounded-full px-5 py-2 text-xs font-bold text-amber-900 shadow-xs mb-4 text-center max-w-md">
          {dialogue}
        </div>

        {/* Character Visual Stage */}
        <div className="relative py-4 flex flex-col items-center">
          {/* Animated cute mom */}
          <motion.div
            animate={{
              y: isSquatting ? 35 : 0,
              rotate: characterReaction === 'wobble' ? [-5, 5, -5, 5, 0] : 0,
              scale: characterReaction === 'happy' ? 1.1 : 1
            }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            {/* Mom Body */}
            <div className="w-28 h-28 rounded-full bg-pink-100 border-4 border-pink-300 flex items-center justify-center text-5xl shadow-md relative">
              {characterReaction === 'wobble' ? '😖' : characterReaction === 'happy' ? '🥰' : '🤰'}

              {/* Cute giant belly badge */}
              <div className="absolute -bottom-2 -right-1 bg-amber-400 border-2 border-white text-[11px] font-black text-amber-950 px-2 py-0.5 rounded-full shadow-xs">
                7.0 kg
              </div>
            </div>
          </motion.div>

          {/* Floor Items */}
          <div className="mt-8 flex items-center justify-center gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center transition-all ${
                  item.picked
                    ? 'bg-stone-50 border-stone-200 opacity-30 scale-90'
                    : 'bg-amber-50 border-amber-300 scale-105 shadow-sm animate-pulse'
                }`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-[10px] font-bold text-stone-700 mt-1">{item.name}</span>
                <span className="text-[9px] text-stone-400">{item.picked ? '✓ 已撿起' : '待撿'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The Oscillating Balance Bar */}
        <div className="w-full max-w-md space-y-3 mt-4">
          <div className="text-center text-xs font-bold text-stone-600 flex justify-between px-2">
            <span className="text-red-500 font-bold">⚠️ 直接彎腰 (腰椎暴擊)</span>
            <span className="text-emerald-600 font-black">🎯 綠色安全重心</span>
            <span className="text-red-500 font-bold">⚠️ 直接彎腰</span>
          </div>

          {/* Gauge track */}
          <div className="relative h-8 bg-stone-100 rounded-full border-2 border-stone-300 overflow-hidden shadow-inner">
            {/* Red left */}
            <div className="absolute top-0 bottom-0 left-0 w-[38%] bg-rose-200" />
            {/* Green center sweet spot */}
            <div className="absolute top-0 bottom-0 left-[38%] right-[38%] bg-emerald-300 border-x-2 border-emerald-500 flex items-center justify-center">
              <span className="text-[10px] font-black text-emerald-900 tracking-wider">PERFECT!</span>
            </div>
            {/* Red right */}
            <div className="absolute top-0 bottom-0 right-0 w-[38%] bg-rose-200" />

            {/* Moving Indicator needle */}
            <div
              style={{ left: `${cursorPos}%` }}
              className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-stone-900 border-2 border-white rounded-full shadow-md z-10"
            />
          </div>

          {/* Big Squat Action Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={isWon || isSquatting}
            onClick={handleSquatAction}
            className={`w-full py-4 rounded-2xl font-black text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isWon
                ? 'bg-emerald-500 text-white cursor-default'
                : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950'
            }`}
          >
            {isWon ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>全部撿起啦！過關！</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>抓準時機 · 點擊深蹲撿起！ (剩餘 {remainingCount} 件)</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Reset button */}
        <div className="w-full flex justify-end mt-2">
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
