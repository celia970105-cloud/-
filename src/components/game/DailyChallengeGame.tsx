import React, { useState } from 'react';
import { GameState } from '../../types/pregnancy';
import { Stage1MorningNausea } from './stages/Stage1MorningNausea';
import { Stage5LamazeBreathing } from './stages/Stage5LamazeBreathing';
import { Sparkles, Trophy, ArrowRight, CheckCircle2, Heart, TrainFront, Zap } from 'lucide-react';
import { playSuccessChime, playKawaiiPop } from '../../utils/audio';

interface DailyChallengeGameProps {
  onBackToSubway: () => void;
}

const STAGES = [
  { id: 1, name: '晨吐快手接接樂', emoji: '🍪', tag: '高速避油煙', sub: '孕早期護胃' },
  { id: 2, name: '拉梅茲急速音遊', emoji: '🥁', tag: '飛速節奏打擊', sub: '孕晚期陣痛轉移' }
];

export const DailyChallengeGame: React.FC<DailyChallengeGameProps> = ({
  onBackToSubway
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
        empathyPoints: prev.empathyPoints + 35
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
    if (gameState.currentStage < 2) {
      setGameState((prev) => ({ ...prev, currentStage: prev.currentStage + 1 }));
    }
  };

  const allCompleted = gameState.completedStages.length === 2;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Kawaii Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-pink-200 bg-gradient-to-r from-pink-100 via-rose-50 to-amber-50 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-6">
          <div className="sm:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/90 border border-pink-300 text-pink-700 text-xs font-black px-3.5 py-1 rounded-full shadow-xs">
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>成果簡報精華版 · 兩大高難度急速挑戰</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 font-serif-tc tracking-tight">
              負重前行！日常挑戰急速篇 ✨
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              配合 8 分鐘精華口頭報告時間，精簡保留最具代表性的<strong>「孕早期晨吐」</strong>與<strong>「孕晚期拉梅茲呼吸」</strong>兩大關卡，速度與難度全面升級，精采緊湊！
            </p>

            {/* Quick status bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
              <span className="bg-white/90 px-3 py-1.5 rounded-full border border-pink-200 text-pink-800 flex items-center gap-1 shadow-xs">
                💖 同理心指數：+{gameState.empathyPoints} pt
              </span>
              <span className="bg-white/90 px-3 py-1.5 rounded-full border border-pink-200 text-stone-700 flex items-center gap-1 shadow-xs font-mono">
                🏆 已通關：{gameState.completedStages.length} / 2 關
              </span>
            </div>
          </div>

          <div className="sm:col-span-4 flex justify-center sm:justify-end">
            <div className="p-4 bg-white/95 rounded-3xl border-2 border-pink-300 shadow-md text-center space-y-2">
              <span className="text-[11px] font-black text-pink-800 bg-pink-100 px-3 py-0.5 rounded-full">
                8分鐘簡報快捷導航
              </span>
              <div className="text-2xl font-black text-pink-600 font-mono">
                {gameState.completedStages.length} / 2 關完成
              </div>
              <button
                onClick={onBackToSubway}
                className="w-full py-2 bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs font-black rounded-xl transition-all cursor-pointer"
              >
                ← 返回捷運答題大冒險
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Stages Navigation Pills */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {STAGES.map((stg) => {
          const isCurrent = gameState.currentStage === stg.id;
          const isDone = gameState.completedStages.includes(stg.id);

          return (
            <button
              key={stg.id}
              onClick={() => {
                playKawaiiPop();
                setGameState((prev) => ({ ...prev, currentStage: stg.id }));
              }}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isCurrent
                  ? 'border-pink-500 bg-pink-50/90 shadow-sm scale-101'
                  : isDone
                  ? 'border-emerald-300 bg-emerald-50/60'
                  : 'border-stone-200 bg-white hover:bg-pink-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">{stg.emoji}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-stone-900">{stg.name}</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-md">
                      {stg.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium block mt-0.5">
                    {stg.sub}
                  </span>
                </div>
              </div>

              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <span className="text-xs font-bold text-stone-400 font-mono">0{stg.id}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Stage Screen */}
      <div className="bg-white rounded-3xl border-2 border-pink-200 p-5 sm:p-6 shadow-sm">
        {gameState.currentStage === 1 && (
          <Stage1MorningNausea
            onComplete={handleStageComplete}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {gameState.currentStage === 2 && (
          <Stage5LamazeBreathing
            onComplete={handleStageComplete}
            onUpdateStats={handleUpdateStats}
          />
        )}
      </div>

      {/* Stage Complete Modal */}
      {showStageSuccessModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-xl border-2 border-pink-300">
            <div className="w-16 h-16 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-4xl mx-auto shadow-xs animate-bounce">
              🎉
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full">
                STAGE {gameState.currentStage} CLEARED
              </span>
              <h3 className="text-xl font-black text-stone-900 font-serif-tc">
                挑戰大成功！得分：{latestScore}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                在急速難度下成功應對！同理心分數 +35 分！
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {gameState.currentStage < 2 ? (
                <button
                  onClick={handleNextStage}
                  className="w-full py-3 bg-pink-600 hover:bg-pink-700 active:scale-98 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>進入下一關：拉梅茲急速音遊</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900">
                    🏆 兩大精華挑戰全部通關！完美符合 8 分鐘發表節奏！
                  </div>
                  <button
                    onClick={() => {
                      setShowStageSuccessModal(false);
                      onBackToSubway();
                    }}
                    className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <TrainFront className="w-4 h-4" />
                    <span>返回捷運答題大冒險</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
