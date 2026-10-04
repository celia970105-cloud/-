import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { SUBWAY_QUESTIONS } from '../../data/subwayQuestions';
import { PlayerProfile, GamePhase } from '../../types/subwayGame';
import { PregnantMomIllustration, CharacterMood, MomStance } from './PregnantMomIllustration';
import {
  playKawaiiCoin,
  playKawaiiOuch,
  playSuccessChime,
  playKawaiiPop,
  playSubwayStationChime,
  playMetroDoorBeep,
  playQuizCorrectChime,
  playQuizWrongChime,
  playGuanduStationBroadcast,
  playGuanduArrivalBroadcast
} from '../../utils/audio';
import { Sparkles, RotateCcw, Award, CheckCircle2, XCircle, AlertTriangle, Clock, ShieldAlert, Volume2, Film } from 'lucide-react';

interface SubwayGameViewProps {
  onSwitchToVideo: () => void;
}

const QUESTION_TIME_LIMIT = 8; // 8 seconds per question (short & thrilling!)

export const SubwayGameView: React.FC<SubwayGameViewProps> = ({
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
  const [broadcastText, setBroadcastText] = useState<string>('下車時請注意間隙 · Mind the gap');

  // Pure background audio/video player (NO PICTURE / ZERO UI FOOTPRINT)
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgVideoMediaRef = useRef<HTMLVideoElement | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Countdown timer per question
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play audio in the background cleanly with zero picture
  const playBackgroundAudio = () => {
    setBroadcastText('正在背景播放關渡站到站廣播 (純音訊，無畫面)...');
    if (customAudioUrl && bgVideoMediaRef.current) {
      bgVideoMediaRef.current.currentTime = 0;
      bgVideoMediaRef.current.play().catch(() => {});
    } else if (bgAudioRef.current) {
      bgAudioRef.current.currentTime = 0;
      bgAudioRef.current.play().catch(() => {});
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setBroadcastText(`已載入你選取的影片：${file.name}（純背景播放聲音）`);
      if (bgVideoMediaRef.current) {
        bgVideoMediaRef.current.src = url;
        bgVideoMediaRef.current.currentTime = 0;
        bgVideoMediaRef.current.play().catch(() => {});
      }
    }
  };

  // Derive Stance Progression:
  // 1. If mistakeCount >= 2 or phase === 'lost' -> 'flying' (媽咪飛出去了！)
  // 2. Else if correctCount >= 4 or phase === 'won' -> 'seated' (有人讓座了！媽咪安穩入座)
  // 3. Else if correctCount >= 2 -> 'holding' (媽咪抓好扶手了！)
  // 4. Else -> 'unheld' (尚未抓好扶手，身體吃力晃動)
  let currentStance: MomStance = 'unheld';
  if (phase === 'lost' || mistakeCount >= 2) {
    currentStance = 'flying';
  } else if (phase === 'won' || correctCount >= 4) {
    currentStance = 'seated';
  } else if (correctCount >= 2) {
    currentStance = 'holding';
  } else {
    currentStance = 'unheld';
  }

  // Derive active dynamic mood
  let characterMood: CharacterMood = 'idle';
  if (phase === 'won' || currentStance === 'seated') {
    characterMood = 'seated';
  } else if (isWobbling || phase === 'lost' || currentStance === 'flying') {
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
    playBackgroundAudio();
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
      playQuizCorrectChime();
      setBalance(100);
      setTiltAngle(0);
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);

      if (nextCorrect >= 4) {
        setPassengerBubble('🧍 讓座同學：「媽咪您辛苦了！請坐這裡！」熱心同學主動起身讓座！');
        setBroadcastText('💖 乘客感動讓座！媽咪安心就座，平安抵達關渡站！');
      } else if (nextCorrect >= 2) {
        setPassengerBubble('💪 媽咪雙手穩穩抓好吊環扶手！身體平衡超穩定！');
        setBroadcastText('💪 太棒了！媽咪抓好扶手了！再多答對2題即有人感動讓座！');
      }

      if (nextCorrect >= 5) {
        setTimeout(() => {
          handleTriggerWin();
        }, 1200);
      }
    } else {
      playQuizWrongChime();
      handleRecordMistake(false);
    }
  };

  // Triggered when time runs out on a question
  const handleTimeExpire = () => {
    setIsTimeout(true);
    setIsAnswerCorrect(false);
    setShowExplanation(true);
    playQuizWrongChime();
    handleRecordMistake(true);
  };

  // Helper to handle strike / fall accumulation
  const handleRecordMistake = (byTimeout: boolean) => {
    setIsWobbling(true);
    setTiltAngle(Math.random() > 0.5 ? -35 : 35);

    const nextMistakes = mistakeCount + 1;
    setMistakeCount(nextMistakes);
    setBalance(nextMistakes >= 2 ? 0 : 40);

    setTimeout(() => {
      setIsWobbling(false);
      setTiltAngle(0);
    }, 1000);

    // Lose condition: 2 mistakes = 媽咪飛出去了！
    if (nextMistakes >= 2) {
      setPassengerBubble('😱 全車乘客：「天哪！列車一個急煞～媽咪飛出去了！」');
      setBroadcastText('🚨 警報！累積答錯兩題急煞！媽咪直接重心不穩飛出車廂！');
      setTimeout(() => {
        setPhase('lost');
      }, 1400);
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
    setBroadcastText('關渡到了，右側開門。下車時請注意間隙。');
    setTimeout(() => {
      playSuccessChime();
    }, 400);
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
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      {/* Welcome Screen */}
      {phase === 'welcome' && (
        <div className="bg-gradient-to-b from-[#D3E8F4]/80 via-[#FFE0E6]/90 to-[#FFFCF4] rounded-3xl border-3 border-[#FFBCBD] p-6 sm:p-10 shadow-lg text-center space-y-6 max-w-3xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <PregnantMomIllustration
              mood="idle"
              name={profile.name}
              badgeStyle={profile.badgeStyle}
              tiltAngle={0}
            />
          </div>

          <div className="space-y-2">
            <div className="inline-block bg-[#E85D75] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-xs">
              🍓 草莓厚牛乳特調 · 捷運車廂妊娠體驗
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#4A3337] font-serif-tc tracking-tight">
              站穩啦！{profile.name}的捷運無座大考驗
            </h1>
            <p className="text-xs sm:text-sm text-[#6B4B52] max-w-lg mx-auto leading-relaxed font-medium">
              雅麟媽咪正在進行 6.5kg 負重實測，<strong>捷運上沒有任何同學願意讓座！</strong> 車廂搖晃顛簸，每題限時 <strong>8 秒</strong>，答對 2 題媽咪會抓好扶手；累積答對 4 題會有同學感動讓座；<strong>但累積答錯 2 題，列車急煞媽咪就會飛出去！</strong>
            </p>
          </div>

          {/* Player Customization */}
          <div className="bg-[#FFFCF4]/90 rounded-2xl border-2 border-[#FFBCBD] p-5 space-y-4 text-left shadow-xs">
            <div>
              <label className="block text-xs font-black text-[#4A3337] mb-1.5">
                體驗主角姓名：
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="例如：雅麟媽咪"
                className="w-full p-3 bg-[#FFE0E6]/40 rounded-xl border border-[#FFBCBD] text-sm font-black text-[#4A3337] focus:outline-none focus:ring-2 focus:ring-[#E85D75]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#4A3337] mb-1.5">
                隨身佩戴的好孕胸章：
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, badgeStyle: 'pink_heart' })}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    profile.badgeStyle === 'pink_heart'
                      ? 'border-[#E85D75] bg-[#FFE0E6] text-[#4A3337] shadow-sm scale-102 font-black'
                      : 'border-[#FFBCBD]/50 bg-[#FFFCF4] text-[#6B4B52] hover:bg-[#FFE0E6]/50'
                  }`}
                >
                  <div className="text-xl mb-1">💖</div>
                  <div>溫暖愛心章</div>
                  <div className="text-[10px] text-[#E85D75] font-medium">經典好孕</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, badgeStyle: 'dino_egg' })}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    profile.badgeStyle === 'dino_egg'
                      ? 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-sm scale-102 font-black'
                      : 'border-[#FFBCBD]/50 bg-[#FFFCF4] text-[#6B4B52] hover:bg-emerald-50'
                  }`}
                >
                  <div className="text-xl mb-1">🦖</div>
                  <div>恐龍蛋孵化中</div>
                  <div className="text-[10px] text-emerald-700 font-medium">暴龍會踢肚！</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, badgeStyle: 'watermelon' })}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    profile.badgeStyle === 'watermelon'
                      ? 'border-rose-600 bg-rose-100 text-rose-950 shadow-sm scale-102 font-black'
                      : 'border-[#FFBCBD]/50 bg-[#FFFCF4] text-[#6B4B52] hover:bg-rose-50'
                  }`}
                >
                  <div className="text-xl mb-1">🍉</div>
                  <div>偷藏大西瓜</div>
                  <div className="text-[10px] text-rose-700 font-medium">剛吞了西瓜！</div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartGame}
              className="w-full py-4 bg-[#E85D75] hover:bg-[#D44763] active:scale-98 text-white rounded-2xl font-black text-base shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
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
          {/* Top HUD Status - Creamy Strawberry Milk Style */}
          <div className="bg-[#FFE0E6]/90 rounded-3xl border-2 border-[#FFBCBD] p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D3E8F4] border-2 border-[#FFBCBD] flex items-center justify-center text-2xl shadow-xs">
                {profile.avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#4A3337]">{profile.name}</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    correctCount >= 4
                      ? 'bg-emerald-100 text-emerald-800'
                      : correctCount >= 2
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {correctCount >= 4
                      ? '💖 獲同學主動讓座中！'
                      : correctCount >= 2
                      ? '💪 穩穩抓好扶手站立中！'
                      : '⚠️ 晃動站立中（尚未抓扶手）'}
                  </span>
                </div>
                <div className="text-xs text-[#6B4B52]">
                  {correctCount >= 4 ? '太溫馨了！已安心坐於博愛座' : correctCount >= 2 ? '雙手抓緊吊環！再對2題即可贏得讓座' : '全車顛簸中 · 答對2題助媽咪抓緊扶手！'}
                </div>
              </div>
            </div>

            {/* Target Score Progress & Strikes & Station Broadcast Chime */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={playBackgroundAudio}
                className="px-3.5 py-2 bg-[#E85D75] hover:bg-[#D44763] active:scale-95 text-white rounded-2xl border-2 border-[#FFBCBD] text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                title="在背景播放關渡站到站廣播聲音（純背景音，無畫面）"
              >
                <Volume2 className="w-4 h-4 text-white" />
                <span>背景播廣播原音</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-[#FFFCF4] hover:bg-[#FFE0E6] text-[#4A3337] rounded-2xl border border-[#FFBCBD] text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="若有你手機上的那支影片檔，可直接載入在背景播放其聲音（無畫面）"
              >
                <span>📂 載入你那支影片 (只播音)</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="video/*,audio/*"
                className="hidden"
              />

              <div className="flex items-center gap-3 bg-[#FFFCF4] px-3.5 py-2 rounded-2xl border border-[#FFBCBD]">
                <div className="text-center">
                  <span className="text-[10px] text-[#7A5860] block font-bold">答對題數</span>
                  <span className="text-base font-black text-[#E85D75] font-mono">
                    {correctCount} / 5 題
                  </span>
                </div>
                <div className="h-8 w-px bg-[#FFBCBD]/60" />
                <div className="text-center">
                  <span className="text-[10px] text-[#7A5860] block font-bold">進程目標</span>
                  <span className="text-[11px] font-black text-[#4A3337] font-mono">
                    {correctCount < 2 ? `差 ${2 - correctCount} 題抓扶手` : correctCount < 4 ? `差 ${4 - correctCount} 題有人讓座` : '已讓座坐好！'}
                  </span>
                </div>
                <div className="h-8 w-px bg-[#FFBCBD]/60" />
                <div className="text-center">
                  <span className="text-[10px] text-[#7A5860] block font-bold">失衡警告 (滿2題飛出)</span>
                  <span className={`text-base font-black font-mono ${mistakeCount >= 1 ? 'text-red-600 animate-pulse' : 'text-[#4A3337]'}`}>
                    {mistakeCount} / 2 題
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Invisible background audio elements */}
          <audio
            ref={bgAudioRef}
            src="/audio/guandu_29s.mp3"
            preload="auto"
            className="hidden"
          />
          <video
            ref={bgVideoMediaRef}
            playsInline
            style={{ display: 'none' }}
          />

          {/* Desktop 2-Column Split / Mobile Sticky Carriage Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (lg:col-span-7): The Interactive Subway Carriage Scene */}
            {/* On mobile, this container is sticky right under the navbar with a compact height so users NEVER lose sight of the carriage! */}
            <div className="lg:col-span-7 sticky top-[64px] lg:static z-20 transition-all">
              <div className="relative h-[215px] sm:h-[250px] lg:h-[390px] bg-gradient-to-b from-[#D3E8F4] via-[#FFE0E6]/50 to-[#FFFCF4] rounded-3xl border-3 border-[#FFBCBD] overflow-hidden shadow-inner flex flex-col justify-between p-3 sm:p-4 select-none">
                {/* Real Guandu Station Door LED Display */}
                <div className="w-full bg-stone-950 border-2 border-stone-700 rounded-2xl p-2 sm:p-2.5 shadow-md mb-1.5 sm:mb-2 text-white font-mono">
                  {/* Route strip */}
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-stone-400 pb-1 border-b border-stone-800">
                    <span className="text-red-500 font-bold">● 淡水信義線</span>
                    <span className="truncate mx-1">淡水 ◀ 竹圍 ◀ <strong className="text-white bg-red-600 px-1 rounded">關渡 R25</strong> ◀ 忠義</span>
                    <span className="text-stone-500 hidden sm:inline">往淡水</span>
                  </div>

                  {/* Main LED Matrix Screen */}
                  <div className="grid grid-cols-12 items-center gap-1 sm:gap-2 pt-1 pb-0.5">
                    <div className="col-span-3 text-left">
                      <span className="inline-block bg-amber-500/20 border border-amber-500 text-amber-400 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black">
                        往淡水
                      </span>
                    </div>

                    <div className="col-span-6 text-center">
                      <span className="text-emerald-400 text-sm sm:text-base lg:text-lg font-black tracking-widest drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]">
                        關渡 Guandu · R25
                      </span>
                    </div>

                    <div className="col-span-3 text-right">
                      <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500 text-amber-300 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                        本側開門
                      </span>
                    </div>
                  </div>

                  {/* Marquee Notice Bar */}
                  <div className="pt-0.5 border-t border-stone-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-amber-300 font-sans">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="bg-amber-400 text-stone-950 px-1 rounded text-[8px] sm:text-[9px] font-black shrink-0">
                        廣播
                      </span>
                      <span className="text-amber-200 font-bold truncate animate-pulse">
                        {broadcastText || '下車時請注意間隙 · Mind the gap'}
                      </span>
                    </div>
                    <span className="text-[9px] text-stone-400 font-sans font-medium hidden sm:inline shrink-0 font-mono">
                      淡水信義線 R25
                    </span>
                  </div>
                </div>

                {/* Subway Windows with moving speed lines (hidden on very small mobile to maximize Mom & Passengers visibility) */}
                <div className="w-full hidden sm:flex justify-around opacity-60">
                  <div className="w-20 lg:w-24 h-10 lg:h-12 bg-[#D3E8F4] rounded-xl border-2 border-sky-300 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  </div>
                  <div className="w-20 lg:w-24 h-10 lg:h-12 bg-[#D3E8F4] rounded-xl border-2 border-sky-300 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  </div>
                  <div className="w-20 lg:w-24 h-10 lg:h-12 bg-[#D3E8F4] rounded-xl border-2 border-sky-300 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  </div>
                </div>

                {/* Passenger Speech Bubble */}
                {passengerBubble && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 bg-[#FFFCF4]/95 text-[#4A3337] border-2 border-[#FFBCBD] rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold shadow-lg z-30 max-w-sm text-center"
                  >
                    {passengerBubble}
                  </motion.div>
                )}

                {/* Floor Area: 3 Passengers + Center Pregnant Mom */}
                <div className="relative z-10 w-full flex items-end justify-between px-1 sm:px-6 lg:px-8 pt-1 sm:pt-2">
                  {/* Passenger 1: Gamer OR Standing Yielding Student when correctCount >= 4 */}
                  {correctCount >= 4 ? (
                    <div
                      onClick={() => setPassengerBubble('🧍 讓座同學：「媽咪您辛苦了，請坐這裡！剛才太專注玩手遊沒看到，不好意思！」')}
                      className="flex flex-col items-center cursor-pointer animate-in fade-in group shrink-0"
                    >
                      <div className="text-[9px] sm:text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mb-1 border border-emerald-300 animate-bounce whitespace-nowrap shadow-xs">
                        💖 主動讓座！
                      </div>
                      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-2xl sm:text-3xl shadow-md group-hover:scale-105 transition-transform">
                        🧍
                      </div>
                      <div className="text-[8px] sm:text-[9px] font-bold text-emerald-700 mt-0.5">「請坐！」</div>
                    </div>
                  ) : (
                    <div
                      onClick={() => handlePassengerClick('game')}
                      className="flex flex-col items-center cursor-pointer group shrink-0"
                    >
                      <div className="text-[9px] sm:text-[10px] font-bold text-[#6B4B52] bg-[#FFFCF4]/90 px-1.5 py-0.5 rounded-full mb-1 border border-[#FFBCBD] group-hover:bg-[#FFE0E6]">
                        {correctCount >= 2 ? '👀 抬頭' : '🎮 手遊'}
                      </div>
                      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#FFE0E6] border-2 border-[#FFBCBD] flex items-center justify-center text-2xl sm:text-3xl shadow-xs group-hover:scale-105 transition-transform">
                        {mistakeCount >= 2 ? '😱' : correctCount >= 2 ? '👀' : '🎧'}
                      </div>
                      <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-blue-600 rounded-t-md mt-0.5" />
                    </div>
                  )}

                  {/* Center: Dynamic Animated Illustrated Pregnant Mom Character */}
                  <div className="relative z-20 flex justify-center pb-0.5 sm:pb-1">
                    <PregnantMomIllustration
                      mood={characterMood}
                      name={profile.name}
                      badgeStyle={profile.badgeStyle}
                      tiltAngle={tiltAngle}
                      stance={currentStance}
                    />
                  </div>

                  {/* Passenger 2: Fake Sleeping */}
                  <div
                    onClick={() => handlePassengerClick('sleep')}
                    className="flex flex-col items-center cursor-pointer group shrink-0"
                  >
                    <div className="text-[9px] sm:text-[10px] font-bold text-[#6B4B52] bg-[#FFFCF4]/90 px-1.5 py-0.5 rounded-full mb-1 border border-[#FFBCBD] group-hover:bg-[#FFE0E6]">
                      {mistakeCount >= 2 ? '😱 嚇醒！' : '😴 裝睡'}
                    </div>
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#FFFCF4] border-2 border-[#FFBCBD] flex items-center justify-center text-2xl sm:text-3xl shadow-xs group-hover:scale-105 transition-transform">
                      {mistakeCount >= 2 ? '😱' : '😴'}
                    </div>
                    <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-blue-600 rounded-t-md mt-0.5" />
                  </div>

                  {/* Passenger 3: Phone Social Media Watcher */}
                  <div
                    onClick={() => handlePassengerClick('phone')}
                    className="flex flex-col items-center cursor-pointer group shrink-0"
                  >
                    <div className="text-[9px] sm:text-[10px] font-bold text-[#6B4B52] bg-[#FFFCF4]/90 px-1.5 py-0.5 rounded-full mb-1 border border-[#FFBCBD] group-hover:bg-[#FFE0E6]">
                      {mistakeCount >= 2 ? '😱 掉了！' : '📱 追劇'}
                    </div>
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#D3E8F4] border-2 border-[#FFBCBD] flex items-center justify-center text-2xl sm:text-3xl shadow-xs group-hover:scale-105 transition-transform">
                      {mistakeCount >= 2 ? '😱' : '📱'}
                    </div>
                    <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-blue-600 rounded-t-md mt-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (lg:col-span-5): Rapid Quiz Question Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FFFCF4] rounded-3xl border-2 border-[#FFBCBD] p-5 sm:p-6 shadow-sm space-y-4">
                {/* Timer & Question Header */}
                <div className="space-y-2 pb-3 border-b border-[#FFBCBD]/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#E85D75] text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        QUESTION 0{currentQIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-[#6B4B52]">
                        快選正確對策站穩！
                      </span>
                    </div>

                    {/* Countdown Time Display */}
                    <div className="flex items-center gap-1.5 font-mono font-black text-sm">
                      <Clock className={`w-4 h-4 ${timeLeft <= 3 ? 'text-red-600 animate-spin' : 'text-[#E85D75]'}`} />
                      <span className={timeLeft <= 3 ? 'text-red-600 animate-pulse text-base' : 'text-[#4A3337]'}>
                        0{timeLeft} 秒
                      </span>
                    </div>
                  </div>

                  {/* Animated Countdown Progress Bar */}
                  <div className="h-2.5 w-full bg-[#FFE0E6] rounded-full overflow-hidden border border-[#FFBCBD]">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        timeLeft > 4 ? 'bg-emerald-500' : timeLeft > 2 ? 'bg-amber-500' : 'bg-[#E85D75]'
                      }`}
                      style={{ width: `${(timeLeft / QUESTION_TIME_LIMIT) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-black text-[#4A3337] leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    let btnStyle = 'bg-[#FFE0E6]/30 border-[#FFBCBD] hover:bg-[#FFE0E6] text-[#4A3337]';

                    if (showExplanation) {
                      if (idx === currentQ.correctIndex) {
                        btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black shadow-sm';
                      } else if (idx === selectedOption) {
                        btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                      } else {
                        btnStyle = 'bg-[#FFFCF4] border-[#FFBCBD]/40 opacity-40';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showExplanation || timeLeft <= 0}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
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
                  <div className="p-4 bg-[#FFE0E6]/50 rounded-2xl border border-[#FFBCBD] space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 text-xs font-black">
                      {isAnswerCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {correctCount >= 4 ? '太棒了！乘客感動讓座，安心就座！' : correctCount >= 2 ? '答對啦！媽咪雙手穩穩抓好扶手！' : '答對啦！雅麟媽咪抓穩平衡！'}
                        </span>
                      ) : isTimeout ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> ⏰ 時間到！來不及應變，重心歪斜！
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> 答錯啦！車廂晃動失去重心！
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5C3E43] font-medium leading-relaxed">
                      {currentQ.explanation}
                    </p>

                    {correctCount < 5 && mistakeCount < 2 && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={handleNextQuestion}
                          className="px-5 py-2.5 bg-[#E85D75] hover:bg-[#D44763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-transform active:scale-95"
                        >
                          下一題繼續站穩！▶
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {phase === 'won' && (
        <div className="bg-gradient-to-b from-[#D3E8F4]/80 via-[#FFE0E6] to-[#FFFCF4] rounded-3xl border-3 border-[#FFBCBD] p-8 sm:p-12 shadow-xl text-center space-y-6 max-w-3xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <PregnantMomIllustration
              mood="seated"
              name={profile.name}
              badgeStyle={profile.badgeStyle}
              tiltAngle={0}
              stance="seated"
            />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-[#E85D75] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-xs">
              COMMUTE MASTER · 溫馨讓座大成功！
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4A3337] font-serif-tc">
              🎉 抵達目的地！乘客感動讓座，{profile.name}安心入座！
            </h2>
            <p className="text-xs sm:text-sm text-[#6B4B52] max-w-lg mx-auto leading-relaxed font-medium">
              一開始全車無人讓座，雅麟媽咪在答對 2 題後雙手抓穩吊環，再多答對幾題後，同學深受感動主動起身讓座！母子安穩抵達關渡站！
            </p>
          </div>

          <div className="p-4 bg-[#FFFCF4]/90 rounded-2xl border-2 border-[#FFBCBD] text-xs text-[#4A3337] font-bold max-w-lg mx-auto shadow-xs">
            「先學會保護自己抓牢扶手，再透過體貼互動喚醒車廂溫暖。」生命教育與友善讓座倡議大成功！
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartGame}
              className="px-5 py-3 bg-[#FFE0E6] hover:bg-[#FFBCBD] text-[#4A3337] rounded-2xl text-xs font-black transition-colors cursor-pointer border border-[#FFBCBD]"
            >
              🔄 再挑戰一次捷運車廂
            </button>
            <button
              onClick={onSwitchToVideo}
              className="px-5 py-3 bg-[#E85D75] hover:bg-[#D44763] text-white rounded-2xl text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Film className="w-4 h-4" />
              <span>🎬 觀看小組實測影片</span>
            </button>
          </div>
        </div>
      )}

      {/* Lost Screen (2 Mistakes = 媽咪飛出去了！) */}
      {phase === 'lost' && (
        <div className="bg-gradient-to-b from-[#FFE0E6] via-[#FFFCF4] to-[#FFE0E6] rounded-3xl border-3 border-[#FFBCBD] p-8 sm:p-12 shadow-2xl text-center space-y-6 max-w-3xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="text-6xl animate-bounce">
            🚀💨😵
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-[#E85D75] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md animate-pulse">
              🚨 列車急煞警告！累積答錯 2 題！
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#E85D75] font-serif-tc">
              天哪！答錯兩題急煞，雅麟媽咪飛出車廂啦！
            </h2>
            <p className="text-xs sm:text-sm text-[#6B4B52] max-w-lg mx-auto leading-relaxed font-medium">
              全車乘客全嚇傻了！因為前兩題未抓穩扶手，列車一個大急煞，6.5kg 的負重直接失去平衡，媽咪『咻——』地一聲飛出車廂！
            </p>
          </div>

          <div className="p-4 bg-[#FFFCF4] rounded-2xl border-2 border-[#FFBCBD] text-xs text-[#4A3337] font-bold max-w-lg mx-auto">
            💡 闖關攻略：答對 2 題媽咪就會抓好扶手站穩；再多答對 2 題（累積 4 題）就會有人感動讓座！
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartGame}
              className="px-7 py-3.5 bg-[#E85D75] hover:bg-[#D44763] active:scale-95 text-white rounded-2xl font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              <span>重新進入車廂 · 幫媽咪抓好扶手！</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
