import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { SUBWAY_QUESTIONS } from '../../data/subwayQuestions';
import { PlayerProfile, GamePhase } from '../../types/subwayGame';
import { PregnantMomIllustration, CharacterMood } from './PregnantMomIllustration';
import { playKawaiiCoin, playKawaiiOuch, playSuccessChime, playKawaiiPop } from '../../utils/audio';
import { Sparkles, RotateCcw, Award, CheckCircle2, XCircle, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';

interface SubwayGameViewProps {
  onSwitchToReport: () => void;
  onSwitchToCertificate: () => void;
  onSwitchToVideo: () => void;
}

const QUESTION_TIME_LIMIT = 8; // 8 seconds per question (short & thrilling!)

export const SubwayGameView: React.FC<SubwayGameViewProps> = ({
  onSwitchToReport,
  onSwitchToCertificate,
  onSwitchToVideo
}) => {
  // Opening player profile with default "雅麟媽咪"
  const [profile, setProfile] = useState<PlayerProfile>({
    name: '雅麟媽咪',
    badgeStyle: 'pink_heart',
    avatar: '🤰'
  });

  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0); // Max 2 strikes!
  const [balance, setBalance] = useState(100);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [passengerBubble, setPassengerBubble] = useState<string | null>(null);

  // Countdown timer per question
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Derive active dynamic mood
  let characterMood: CharacterMood = 'idle';
  if (phase === 'won') {
    characterMood = 'correct';
  } else if (isWobbling || phase === 'lost') {
    characterMood = 'wrong';
  } else if (isAnswerCorrect && showExplanation) {
    characterMood = 'correct';
  }

  // Train natural gentle swaying effect
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      const naturalSway = (Math.random() - 0.5) * 14;
      setTiltAngle((t) => (isWobbling ? t : naturalSway));
    }, 450);

    return () => clearInterval(interval);
  }, [phase, isWobbling]);

  // Question countdown timer effect
  useEffect(() => {
    if (phase !== 'playing' || showExplanation) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(QUESTION_TIME_LIMIT);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentQIndex, showExplanation]);

  const handleStartGame = () => {
    playKawaiiPop();
    setPhase('playing');
    setCurrentQIndex(0);
    setCorrectCount(0);
    setMistakeCount(0);
    setBalance(100);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsTimeout(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
  };

  // Triggered when user selects an answer option
  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedOption !== null || showExplanation || timeLeft <= 0) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(optionIdx);
    const question = SUBWAY_QUESTIONS[currentQIndex % SUBWAY_QUESTIONS.length];
    const isCorrect = optionIdx === question.correctIndex;
    setIsAnswerCorrect(isCorrect);
    setIsTimeout(false);
    setShowExplanation(true);

    if (isCorrect) {
      playKawaiiCoin();
      setBalance(100);
      setTiltAngle(0);
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);

      if (nextCorrect >= 5) {
        setTimeout(() => {
          handleTriggerWin();
        }, 1200);
      }
    } else {
      handleRecordMistake(false);
    }
  };

  // Triggered when time runs out on a question
  const handleTimeExpire = () => {
    setIsTimeout(true);
    setIsAnswerCorrect(false);
    setShowExplanation(true);
    handleRecordMistake(true);
  };

  // Helper to handle strike / fall accumulation
  const handleRecordMistake = (byTimeout: boolean) => {
    playKawaiiOuch();
    setIsWobbling(true);
    setTiltAngle(Math.random() > 0.5 ? -35 : 35);

    const nextMistakes = mistakeCount + 1;
    setMistakeCount(nextMistakes);
    setBalance(nextMistakes >= 2 ? 0 : 40);

    setTimeout(() => {
      setIsWobbling(false);
      setTiltAngle(0);
    }, 1000);

    // Lose condition: 2 mistakes = Fall!
    if (nextMistakes >= 2) {
      setTimeout(() => {
        setPhase('lost');
      }, 1300);
    }
  };

  const handleNextQuestion = () => {
    playKawaiiPop();
    setSelectedOption(null);
    setShowExplanation(false);
    setIsTimeout(false);
    setCurrentQIndex((prev) => prev + 1);
  };

  const handleTriggerWin = () => {
    setPhase('won');
    playSuccessChime();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handlePassengerClick = (type: 'game' | 'sleep' | 'phone') => {
    playKawaiiPop();
    if (type === 'game') {
      setPassengerBubble('🎮 打手遊同學：「排位生死局！手不能停！完全沒注意到有人站著...」 (不讓座)');
    } else if (type === 'sleep') {
      setPassengerBubble('😴 裝睡同學：「呼嚕嚕... (緊閉雙眼假裝睡著，完全不抬頭)」 (不讓座)');
    } else {
      setPassengerBubble('📱 追劇同學：「正戴著耳機看短影音，視線完全盯著螢幕...」 (不讓座)');
    }
    setTimeout(() => {
      setPassengerBubble(null);
    }, 3200);
  };

  const currentQ = SUBWAY_QUESTIONS[currentQIndex % SUBWAY_QUESTIONS.length];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome Screen */}
      {phase === 'welcome' && (
        <div className="bg-gradient-to-b from-sky-100 via-pink-50 to-amber-50 rounded-3xl border-3 border-pink-300 p-8 sm:p-12 shadow-lg text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <PregnantMomIllustration
              mood="idle"
              name={profile.name}
              badgeStyle={profile.badgeStyle}
              tiltAngle={0}
            />
          </div>

          <div className="space-y-2">
            <div className="inline-block bg-pink-600 text-white text-xs font-black px-4 py-1 rounded-full shadow-xs">
              🚇 妊娠體驗實測 · 捷運搖晃求衡大挑戰
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif-tc tracking-tight">
              站穩啦！{profile.name}的捷運無座大考驗
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-medium">
              雅麟媽咪正在進行 6.5kg 負重實測，<strong>捷運上沒有任何同學願意讓座！</strong> 車廂搖晃顛簸，每題只有短暫的 <strong>8 秒鐘</strong>，必須快速答對護理題目才能抓穩吊環；<strong>累積 2 題沒答對，媽咪就會跌倒！</strong>
            </p>
          </div>

          {/* Player Customization */}
          <div className="bg-white/85 rounded-2xl border-2 border-pink-200 p-5 space-y-4 text-left shadow-xs">
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5">
                體驗主角姓名：
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="例如：雅麟媽咪"
                className="w-full p-3 bg-pink-50/50 rounded-xl border border-pink-300 text-sm font-black text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5">
                隨身佩戴的好孕胸章：
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, badgeStyle: 'pink_heart' })}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    profile.badgeStyle === 'pink_heart'
                      ? 'border-pink-500 bg-pink-100 text-pink-900 shadow-sm scale-102 font-black'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-pink-50'
                  }`}
                >
                  <div className="text-xl mb-1">💖</div>
                  <div>愛心好孕章</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, badgeStyle: 'bear' })}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    profile.badgeStyle === 'bear'
                      ? 'border-amber-500 bg-amber-100 text-amber-900 shadow-sm scale-102 font-black'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-amber-50'
                  }`}
                >
                  <div className="text-xl mb-1">🐻</div>
                  <div>萌萌小熊章</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, badgeStyle: 'star' })}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    profile.badgeStyle === 'star'
                      ? 'border-sky-500 bg-sky-100 text-sky-900 shadow-sm scale-102 font-black'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-sky-50'
                  }`}
                >
                  <div className="text-xl mb-1">⭐</div>
                  <div>閃亮星星章</div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartGame}
              className="w-full py-4 bg-pink-600 hover:bg-pink-700 active:scale-98 text-white rounded-2xl font-black text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>進入車廂 · 接受無人讓座挑戰！</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Subway Game Arena */}
      {phase === 'playing' && (
        <div className="space-y-4">
          {/* Top HUD Status */}
          <div className="bg-white rounded-3xl border-2 border-sky-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-2xl shadow-xs">
                {profile.avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-stone-900">{profile.name}</span>
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                    ❌ 捷運上無人讓座中
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  全車顛簸中 · 需靠答題抓緊吊環站穩
                </div>
              </div>
            </div>

            {/* Target Score Progress & Strikes */}
            <div className="flex items-center gap-4 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200">
              <div className="text-center">
                <span className="text-[10px] text-stone-400 block font-bold">成功站穩題數</span>
                <span className="text-lg font-black text-emerald-600 font-mono">
                  {correctCount} / 5 題
                </span>
              </div>
              <div className="h-8 w-px bg-sky-200" />
              <div className="text-center">
                <span className="text-[10px] text-stone-400 block font-bold">失衡警告 (滿2次跌倒)</span>
                <span className={`text-lg font-black font-mono ${mistakeCount >= 1 ? 'text-red-600 animate-pulse' : 'text-stone-700'}`}>
                  {mistakeCount} / 2 次
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Subway Carriage Scene (Nobody gives seats) */}
          <div className="relative min-h-[300px] sm:min-h-[340px] bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 rounded-3xl border-3 border-sky-300 overflow-hidden shadow-inner flex flex-col justify-between p-4 select-none">
            {/* Subway Windows with moving speed lines */}
            <div className="w-full flex justify-around opacity-60">
              <div className="w-24 h-14 bg-sky-300/60 rounded-xl border-2 border-sky-400 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="w-24 h-14 bg-sky-300/60 rounded-xl border-2 border-sky-400 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="w-24 h-14 bg-sky-300/60 rounded-xl border-2 border-sky-400 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>

            {/* Passenger Speech Bubble */}
            {passengerBubble && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/95 text-stone-800 border-2 border-pink-400 rounded-2xl px-4 py-2 text-xs font-bold shadow-lg z-30 max-w-sm text-center"
              >
                {passengerBubble}
              </motion.div>
            )}

            {/* Floor Area: 3 Unyielding Passengers + Center Standing Pregnant Mom */}
            <div className="relative z-10 w-full flex items-end justify-between px-2 sm:px-8 pt-4">
              {/* Passenger 1: Gamer (Ignoring) */}
              <div
                onClick={() => handlePassengerClick('game')}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="text-[10px] font-bold text-stone-500 bg-white/90 px-2 py-0.5 rounded-full mb-1 border border-stone-200 group-hover:bg-amber-100">
                  🎮 低頭打手遊
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform">
                  🎧
                </div>
                <div className="h-3 w-16 bg-blue-600 rounded-t-md mt-1" />
              </div>

              {/* Center: Dynamic Animated Illustrated Pregnant Mom Character */}
              <div className="relative z-20 flex justify-center pb-1">
                <PregnantMomIllustration
                  mood={characterMood}
                  name={profile.name}
                  badgeStyle={profile.badgeStyle}
                  tiltAngle={tiltAngle}
                />
              </div>

              {/* Passenger 2: Fake Sleeping (Ignoring) */}
              <div
                onClick={() => handlePassengerClick('sleep')}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="text-[10px] font-bold text-stone-500 bg-white/90 px-2 py-0.5 rounded-full mb-1 border border-stone-200 group-hover:bg-amber-100">
                  😴 閉眼裝睡中
                </div>
                <div className="w-14 h-14 rounded-2xl bg-stone-100 border-2 border-stone-300 flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform">
                  😴
                </div>
                <div className="h-3 w-16 bg-blue-600 rounded-t-md mt-1" />
              </div>

              {/* Passenger 3: Phone Social Media Watcher (Ignoring) */}
              <div
                onClick={() => handlePassengerClick('phone')}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="text-[10px] font-bold text-stone-500 bg-white/90 px-2 py-0.5 rounded-full mb-1 border border-stone-200 group-hover:bg-amber-100">
                  📱 低頭看短影音
                </div>
                <div className="w-14 h-14 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform">
                  📱
                </div>
                <div className="h-3 w-16 bg-blue-600 rounded-t-md mt-1" />
              </div>
            </div>
          </div>

          {/* Rapid Quiz Question Card with Countdown Timer Bar */}
          <div className="bg-white rounded-3xl border-2 border-pink-200 p-6 shadow-sm space-y-4">
            {/* Timer & Question Header */}
            <div className="space-y-2 pb-3 border-b border-pink-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-pink-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                    QUESTION 0{currentQIndex + 1}
                  </span>
                  <span className="text-xs font-bold text-stone-600">
                    上課護理考題 · 快選正確對策站穩！
                  </span>
                </div>

                {/* Countdown Time Display */}
                <div className="flex items-center gap-1.5 font-mono font-black text-sm">
                  <Clock className={`w-4 h-4 ${timeLeft <= 3 ? 'text-red-600 animate-spin' : 'text-pink-600'}`} />
                  <span className={timeLeft <= 3 ? 'text-red-600 animate-pulse text-base' : 'text-stone-800'}>
                    0{timeLeft} 秒
                  </span>
                </div>
              </div>

              {/* Animated Countdown Progress Bar */}
              <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft > 4 ? 'bg-emerald-500' : timeLeft > 2 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(timeLeft / QUESTION_TIME_LIMIT) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-stone-50 border-stone-200 hover:bg-pink-50 hover:border-pink-300 text-stone-800';

                if (showExplanation) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black shadow-sm';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                  } else {
                    btnStyle = 'bg-stone-50 border-stone-200 opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showExplanation || timeLeft <= 0}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showExplanation && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {showExplanation && selectedOption === idx && idx !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button */}
            {showExplanation && (
              <div className="p-4 bg-pink-50/80 rounded-2xl border border-pink-200 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-xs font-black">
                  {isAnswerCorrect ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> 答對啦！雅麟媽咪抓穩吊環，平穩站立！
                    </span>
                  ) : isTimeout ? (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> ⏰ 時間到！來不及應變，重心歪斜差點跌倒！
                    </span>
                  ) : (
                    <span className="text-rose-700 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> 答錯啦！眉頭深鎖、車廂晃動差點跌倒！
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-700 font-medium leading-relaxed">
                  {currentQ.explanation}
                </p>

                {correctCount < 5 && mistakeCount < 2 && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-transform active:scale-95"
                    >
                      下一題繼續站穩！▶
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Win Screen (5 Correct while standing!) */}
      {phase === 'won' && (
        <div className="bg-gradient-to-b from-emerald-50 via-pink-50 to-amber-50 rounded-3xl border-3 border-emerald-300 p-8 sm:p-12 shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <PregnantMomIllustration
              mood="correct"
              name={profile.name}
              badgeStyle={profile.badgeStyle}
              tiltAngle={0}
            />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-emerald-600 text-white text-xs font-black px-4 py-1 rounded-full shadow-xs">
              COMMUTE MASTER · 負重實測大成功！
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif-tc">
              🎉 抵達目的地！{profile.name}成功站穩全程！
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-medium">
              即使捷運上沒有任何同學讓座，雅麟媽咪依然憑藉著精準的護理學知識與防跌站姿，在限時內答對 5 題，成功挺過全線顛簸，順利完成 6.5kg 妊娠實測！
            </p>
          </div>

          <div className="p-4 bg-white/90 rounded-2xl border-2 border-emerald-200 text-xs text-emerald-950 font-bold max-w-md mx-auto shadow-xs">
            「在沒有人讓座的車廂裡，更能深刻感受到孕婦的體能煎熬與社會友善的迫切必要。」這正是專題最寶貴的心得！
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartGame}
              className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs font-black transition-colors cursor-pointer"
            >
              再挑戰一次捷運站立
            </button>
            <button
              onClick={onSwitchToVideo}
              className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>🎬 觀看我們拍攝的實測影片</span>
            </button>
            <button
              onClick={onSwitchToCertificate}
              className="px-5 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>領取同理心證書</span>
            </button>
          </div>
        </div>
      )}

      {/* Lost Screen (2 Mistakes = Fall!) */}
      {phase === 'lost' && (
        <div className="bg-gradient-to-b from-rose-50 via-white to-stone-50 rounded-3xl border-3 border-rose-300 p-8 sm:p-12 shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <PregnantMomIllustration
              mood="wrong"
              name={profile.name}
              badgeStyle={profile.badgeStyle}
              tiltAngle={-30}
            />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-rose-600 text-white text-xs font-black px-4 py-1 rounded-full shadow-xs">
              ⚠️ 累積兩題未在時間內答對 · 媽咪跌倒了！
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif-tc">
              哎呀！列車劇烈晃動，雅麟媽咪跌倒了！
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-medium">
              車廂上完全沒有人讓座，連續兩題失衡超時，6.5kg 的負重大肚肚失去重心！這正是孕婦在尖峰通勤中面臨的真實危險。
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartGame}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-2xl font-black text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>扶起媽咪 · 重新挑戰捷運站立！</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
