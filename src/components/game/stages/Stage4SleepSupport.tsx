import React, { useState } from 'react';
import { motion } from 'motion/react';
import { playKawaiiCoin, playKawaiiOuch, playSuccessChime, playKawaiiPop } from '../../../utils/audio';
import { RotateCcw, Moon, Sparkles, CheckCircle2, BedDouble } from 'lucide-react';

interface StageProps {
  onComplete: (score: number) => void;
  onUpdateStats: (energyDelta: number, fatigueDelta: number, empathyDelta: number) => void;
}

export const Stage4SleepSupport: React.FC<StageProps> = ({ onComplete, onUpdateStats }) => {
  const [pose, setPose] = useState<'supine' | 'left'>('supine');
  const [pillowBelly, setPillowBelly] = useState(false);
  const [pillowKnees, setPillowKnees] = useState(false);
  const [pillowBack, setPillowBack] = useState(false);
  const [dialogue, setDialogue] = useState('大肚肚好重！平躺會胸口悶悶的，快幫媽咪翻到【左側臥】，並放上 3 個蓬蓬枕頭！');
  const [isWon, setIsWon] = useState(false);

  const checkWinCondition = (currentPose: string, b: boolean, k: boolean, bk: boolean) => {
    if (currentPose === 'left' && b && k && bk) {
      setIsWon(true);
      playSuccessChime();
      setDialogue('💤 舒適度 100%！月亮枕三點完美支撐，媽咪沉沉進入香甜美夢！');
      onUpdateStats(30, -20, 20);
      onComplete(98);
    }
  };

  const handleTogglePose = () => {
    playKawaiiPop();
    const nextPose = pose === 'supine' ? 'left' : 'supine';
    setPose(nextPose);
    if (nextPose === 'supine') {
      playKawaiiOuch();
      setDialogue('😵 平躺平躺！大肚肚壓迫到下腔靜脈，好難呼吸！快轉回左側臥！');
    } else {
      setDialogue('🌿 轉到左側臥囉！血液循環通暢多啦，快把枕頭填進空隙！');
      checkWinCondition(nextPose, pillowBelly, pillowKnees, pillowBack);
    }
  };

  const handleTogglePillow = (type: 'belly' | 'knees' | 'back') => {
    playKawaiiPop();
    let nextB = pillowBelly;
    let nextK = pillowKnees;
    let nextBk = pillowBack;

    if (type === 'belly') {
      nextB = !pillowBelly;
      setPillowBelly(nextB);
      if (nextB) setDialogue('🌙 托腹枕已墊好！沉重的肚肚不會懸空下垂了！');
    } else if (type === 'knees') {
      nextK = !pillowKnees;
      setPillowKnees(nextK);
      if (nextK) setDialogue('☁️ 雙腿夾枕置入！骨盆和膝蓋平行對齊，腰部超放鬆！');
    } else if (type === 'back') {
      nextBk = !pillowBack;
      setPillowBack(nextBk);
      if (nextBk) setDialogue('🧸 背部靠枕卡位！睡著也不會無意識翻回平躺！');
    }

    checkWinCondition(pose, nextB, nextK, nextBk);
  };

  const handleReset = () => {
    setPose('supine');
    setPillowBelly(false);
    setPillowKnees(false);
    setPillowBack(false);
    setIsWon(false);
    setDialogue('重新挑戰：請幫媽咪調整姿勢與枕頭！');
  };

  const placedCount = (pillowBelly ? 1 : 0) + (pillowKnees ? 1 : 0) + (pillowBack ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-purple-50/80 border-2 border-purple-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-purple-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
            🌙
          </div>
          <div>
            <div className="inline-block bg-purple-200 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full mb-0.5">
              STAGE 04 · 孕晚期好眠守護
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-tc">
              翻滾吧媽咪！三層月亮枕疊疊樂
            </h3>
            <p className="text-xs text-stone-500">
              點擊翻身切換為左側臥，並點選置入「肚肚枕」、「雙腿枕」和「背部枕」！
            </p>
          </div>
        </div>

        {/* Pillow Progress */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-purple-200">
          <span className="text-xs font-bold text-stone-500">枕頭就位：</span>
          <span className="text-base font-black text-purple-700 font-mono">
            {placedCount} / 3 顆
          </span>
        </div>
      </div>

      {/* Main Bedroom Interactive Screen */}
      <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 text-white rounded-3xl border-3 border-purple-300 p-6 flex flex-col items-center justify-between min-h-[440px] shadow-sm relative overflow-hidden">
        {/* Cute Stars in the night sky */}
        <div className="absolute top-4 left-6 text-xl opacity-60 animate-pulse">⭐</div>
        <div className="absolute top-10 right-10 text-2xl opacity-70">✨</div>
        <div className="absolute top-20 right-1/4 text-sm opacity-50">🌟</div>

        {/* Dialogue Bubble */}
        <div className="bg-white/95 text-stone-800 border-2 border-purple-300 rounded-full px-5 py-2 text-xs font-bold shadow-md mb-4 text-center max-w-md z-10">
          {dialogue}
        </div>

        {/* Dream Bubbles when won */}
        {isWon && (
          <div className="absolute top-16 right-16 flex flex-col items-center animate-bounce z-20">
            <span className="text-3xl">💭</span>
            <div className="bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              👶 寶寶在夢裡笑~
            </div>
          </div>
        )}

        {/* Cute Bed Visual with Mom and Pillows */}
        <div className="w-full max-w-md bg-purple-800/60 rounded-3xl border-2 border-purple-400/50 p-6 relative flex flex-col items-center my-2 shadow-2xl">
          {/* Bed Sheet & Headboard */}
          <div className="w-full flex items-center justify-between text-xs text-purple-200 font-mono pb-2 border-b border-purple-700/60 mb-4">
            <span className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" /> 雙人好眠床
            </span>
            <span>
              體位：{pose === 'left' ? '🌿 左側臥 (讚)' : '❌ 平躺 (悶)'}
            </span>
          </div>

          {/* Mom in Bed */}
          <div className="relative py-4 flex items-center justify-center">
            {/* Mom Character */}
            <motion.div
              animate={{
                rotate: pose === 'left' ? -20 : 0,
                scale: isWon ? 1.05 : 1
              }}
              className="relative z-10"
            >
              <div className="w-24 h-24 rounded-full bg-pink-100 border-4 border-pink-300 flex items-center justify-center text-5xl shadow-lg relative">
                {isWon ? '😴' : pose === 'supine' ? '😵' : '🥰'}

                {/* Snooze bubble */}
                {isWon && (
                  <span className="absolute -top-3 -right-2 text-sm font-black text-amber-300 animate-pulse">
                    Zzz...
                  </span>
                )}
              </div>
            </motion.div>

            {/* Pillow 1: Under Belly (left-bottom) */}
            {pillowBelly && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -left-6 z-20 bg-amber-200 border-2 border-amber-400 text-amber-900 rounded-full px-3 py-1 text-xs font-black shadow-md flex items-center gap-1"
              >
                <span>🌙 托腹枕</span>
              </motion.div>
            )}

            {/* Pillow 2: Between Knees (bottom-right) */}
            {pillowKnees && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -right-6 z-20 bg-sky-200 border-2 border-sky-400 text-sky-900 rounded-full px-3 py-1 text-xs font-black shadow-md flex items-center gap-1"
              >
                <span>☁️ 雙腿枕</span>
              </motion.div>
            )}

            {/* Pillow 3: Behind Back (top-right) */}
            {pillowBack && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-6 z-20 bg-emerald-200 border-2 border-emerald-400 text-emerald-900 rounded-full px-3 py-1 text-xs font-black shadow-md flex items-center gap-1"
              >
                <span>🧸 靠背枕</span>
              </motion.div>
            )}
          </div>

          {/* Quick Flip Pose Button */}
          <button
            onClick={handleTogglePose}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <span>🔄 點擊翻身 (目前：{pose === 'left' ? '左側臥' : '平躺'})</span>
          </button>
        </div>

        {/* 3 Pillows Toggle Deck */}
        <div className="w-full max-w-md grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={() => handleTogglePillow('belly')}
            className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              pillowBelly
                ? 'bg-amber-300 border-amber-400 text-amber-950 shadow-md scale-102'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-purple-200'
            }`}
          >
            <span className="text-xl">🌙</span>
            <span>① 肚肚托枕</span>
            <span className="text-[9px] opacity-80">{pillowBelly ? '已置入' : '+ 放入'}</span>
          </button>

          <button
            onClick={() => handleTogglePillow('knees')}
            className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              pillowKnees
                ? 'bg-sky-300 border-sky-400 text-sky-950 shadow-md scale-102'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-purple-200'
            }`}
          >
            <span className="text-xl">☁️</span>
            <span>② 雙腿夾枕</span>
            <span className="text-[9px] opacity-80">{pillowKnees ? '已置入' : '+ 放入'}</span>
          </button>

          <button
            onClick={() => handleTogglePillow('back')}
            className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              pillowBack
                ? 'bg-emerald-300 border-emerald-400 text-emerald-950 shadow-md scale-102'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-purple-200'
            }`}
          >
            <span className="text-xl">🧸</span>
            <span>③ 背部靠枕</span>
            <span className="text-[9px] opacity-80">{pillowBack ? '已置入' : '+ 放入'}</span>
          </button>
        </div>

        {/* Reset button */}
        <div className="w-full flex justify-end mt-2">
          <button
            onClick={handleReset}
            className="text-xs text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重新擺放</span>
          </button>
        </div>
      </div>
    </div>
  );
};
