import React, { useState } from 'react';
import { GameState } from '../../types/pregnancy';
import { Stage1MorningNausea } from './stages/Stage1MorningNausea';
import { Stage2BendingOver } from './stages/Stage2BendingOver';
import { Stage3CommuteTransit } from './stages/Stage3CommuteTransit';
import { Stage4SleepSupport } from './stages/Stage4SleepSupport';
import { Stage5LamazeBreathing } from './stages/Stage5LamazeBreathing';
import { Sparkles, Trophy, ArrowRight, CheckCircle2, Heart, Award, Gamepad2 } from 'lucide-react';
import { playSuccessChime, playKawaiiPop } from '../../utils/audio';

interface DailyChallengeGameProps {
  onSwitchToReport: () => void;
  onSwitchToCertificate: () => void;
}

const STAGES = [
  { id: 1, name: '晨吐接接樂', emoji: '🍪', tag: '街機接物' },
  { id: 2, name: '深蹲撿物機', emoji: '👟', tag: '節奏平衡' },
  { id: 3, name: '捷運搖搖車', emoji: '🚇', tag: '抗震找座' },
  { id: 4, name: '好眠疊疊樂', emoji: '🌙', tag: '拼圖枕頭' },
  { id: 5, name: '拉梅茲音遊', emoji: '🥁', tag: '打擊節奏' }
];

export const DailyChallengeGame: React.FC<DailyChallengeGameProps> = ({
  onSwitchToReport,
  onSwitchToCertificate
}) => {
  const [gameState, setGameState] = useState<GameState>({
    currentStage: 1,
    totalScore: 0,
    stageScores: {},
    completedStages: [],
    energyLevel: 85,
    lumbarFatigue: 20,
    empathyPoints: 30
  });

  const [showStageSuccessModal, setShowStageSuccessModal] = useState(false);
  const [latestScore, setLatestScore] = useState(0);

  const handleStageComplete = (score: number) => {
    const stageId = gameState.currentStage;
    playSuccessChime();

    setGameState((prev) => {
      const alreadyDone = prev.completedStages.includes(stageId);
      const newCompleted = alreadyDone ? prev.completedStages : [...prev.completedStages, stageId];
      const newScores = { ...prev.stageScores, [stageId]: score };
      const total = Object.values(newScores).reduce((a, b) => a + b, 0);

      return {
        ...prev,
        stageScores: newScores,
        completedStages: newCompleted,
        totalScore: Math.round(total / newCompleted.length),
        empathyPoints: prev.empathyPoints + 25
      };
    });

    setLatestScore(score);
    setShowStageSuccessModal(true);
  };

  const handleUpdateStats = (energyDelta: number, fatigueDelta: number, empathyDelta: number) => {
    setGameState((prev) => ({
      ...prev,
      energyLevel: Math.min(100, Math.max(0, prev.energyLevel + energyDelta)),
      lumbarFatigue: Math.min(100, Math.max(0, prev.lumbarFatigue + fatigueDelta)),
      empathyPoints: prev.empathyPoints + empathyDelta
    }));
  };

  const handleNextStage = () => {
    playKawaiiPop();
    setShowStageSuccessModal(false);
    if (gameState.currentStage < 5) {
      setGameState((prev) => ({ ...prev, currentStage: prev.currentStage + 1 }));
    }
  };

  const allCompleted = gameState.completedStages.length === 5;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Cute Kawaii Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-pink-200 bg-gradient-to-r from-pink-100 via-rose-50 to-amber-50 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-6">
          <div className="sm:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/80 border border-pink-300 text-pink-700 text-xs font-black px-3 py-1 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>可愛風 · 準媽咪的 24 小時闖關小遊戲</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 font-serif-tc tracking-tight">
              負重前行！媽咪大挑戰 ✨
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              透過接物、深蹲、捷運平衡、枕頭拼圖與打擊音遊，化身準媽咪體驗一天！五大趣味關卡等你來破關！
            </p>

            {/* Quick status bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
              <span className="bg-white/90 px-3 py-1.5 rounded-full border border-pink-200 text-pink-800 flex items-center gap-1 shadow-xs">
                💖 同理心指數：+{gameState.empathyPoints} pt
              </span>
              <span className="bg-white/90 px-3 py-1.5 rounded-full border border-pink-200 text-stone-700 flex items-center gap-1 shadow-xs">
                🏆 已通關：{gameState.completedStages.length} / 5 關
              </span>
            </div>
          </div>

          <div className="sm:col-span-4 flex justify-center">
            <div className="relative">
              <img
                src="/src/assets/images/kawaii_pregnant_mom_1791093708955.jpg"
                alt="可愛孕媽咪"
                className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-3xl border-3 border-white shadow-lg rotate-1 hover:rotate-0 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 font-black text-[11px] px-2.5 py-1 rounded-full shadow-md border-2 border-white">
                🤰 加油媽咪！
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Selector Tabs (Cute Segmented Buttons) */}
      <div className="bg-white rounded-3xl border-2 border-pink-200 p-2 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STAGES.map((s) => {
            const isCompleted = gameState.completedStages.includes(s.id);
            const isActive = gameState.currentStage === s.id;

            return (
              <button
                key={s.id}
                onClick={() => {
                  playKawaiiPop();
                  setGameState((prev) => ({ ...prev, currentStage: s.id }));
                }}
                className={`p-3 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-md scale-102 font-black'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold hover:bg-emerald-100'
                    : 'bg-pink-50/50 hover:bg-pink-100/70 text-stone-700 border border-pink-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-xl">{s.emoji}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <div className="text-xs sm:text-sm font-bold truncate">
                  {s.name}
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-pink-700 text-pink-100' : 'bg-white/80 text-stone-500'
                }`}>
                  {s.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Screen */}
      <div>
        {gameState.currentStage === 1 && (
          <Stage1MorningNausea
            onComplete={handleStageComplete}
            onUpdateStats={handleUpdateStats}
          />
        )}
        {gameState.currentStage === 2 && (
          <Stage2BendingOver
            onComplete={handleStageComplete}
            onUpdateStats={handleUpdateStats}
          />
        )}
        {gameState.currentStage === 3 && (
          <Stage3CommuteTransit
            onComplete={handleStageComplete}
            onUpdateStats={handleUpdateStats}
          />
        )}
        {gameState.currentStage === 4 && (
          <Stage4SleepSupport
            onComplete={handleStageComplete}
            onUpdateStats={handleUpdateStats}
          />
        )}
        {gameState.currentStage === 5 && (
          <Stage5LamazeBreathing
            onComplete={handleStageComplete}
            onUpdateStats={handleUpdateStats}
          />
        )}
      </div>

      {/* When All Completed Celebration */}
      {allCompleted && (
        <div className="p-6 bg-gradient-to-r from-pink-200 via-rose-200 to-amber-200 rounded-3xl border-3 border-pink-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white text-pink-600 flex items-center justify-center text-3xl shadow-md shrink-0">
              🏆
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 font-serif-tc">
                太厲害啦！五大關卡全數通關破關！
              </h3>
              <p className="text-xs text-stone-700 mt-0.5">
                你已經親身體會了孕媽咪從早到晚的大冒險！快去領取專屬同理心結業證書吧！
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onSwitchToReport}
              className="px-4 py-2.5 bg-white text-stone-800 rounded-2xl text-xs font-bold hover:bg-stone-50 shadow-sm cursor-pointer"
            >
              檢視專題提綱
            </button>
            <button
              onClick={onSwitchToCertificate}
              className="px-4 py-2.5 bg-pink-600 text-white rounded-2xl text-xs font-black hover:bg-pink-700 shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>領取可愛證書</span>
            </button>
          </div>
        </div>
      )}

      {/* Stage Clear Modal */}
      {showStageSuccessModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-3 border-pink-300 max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
              ✨
            </div>

            <div>
              <h3 className="text-xl font-black text-stone-900 font-serif-tc">
                關卡過關啦！🎉
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                通關評分：<span className="font-black text-pink-600 text-base">{latestScore} 分</span>
              </p>
            </div>

            <div className="bg-pink-50 p-3.5 rounded-2xl border border-pink-200 text-xs text-pink-900 font-medium">
              {gameState.currentStage === 1 && '「原來連挑個早餐都像打怪一樣緊張！媽咪真不容易！」'}
              {gameState.currentStage === 2 && '「哇！挺著肚子蹲下撿鞋帶，大腿和腰超有感！」'}
              {gameState.currentStage === 3 && '「好孕胸章發射愛心！謝謝願意抬頭讓座的善良同學！」'}
              {gameState.currentStage === 4 && '「3 顆月亮枕完美包覆！終於可以舒舒服服睡個好覺啦！」'}
              {gameState.currentStage === 5 && '「寶寶平安誕生啦！拉梅茲呼吸法大成功！」'}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowStageSuccessModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-bold cursor-pointer"
              >
                留在本關再玩
              </button>
              <button
                onClick={handleNextStage}
                className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>下一關！</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
