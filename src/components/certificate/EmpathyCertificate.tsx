import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, HeartHandshake, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { playSuccessChime } from '../../utils/audio';

interface EmpathyCertificateProps {
  onPrint?: () => void;
  onGoToGame: () => void;
}

export const EmpathyCertificate: React.FC<EmpathyCertificateProps> = ({ onPrint, onGoToGame }) => {
  const [recipientName, setRecipientName] = useState('雅麟媽咪與專題體驗組');
  const [courseName, setCourseName] = useState('生命教育與健康護理專題');
  const [instructor, setInstructor] = useState('張雅筑 老師');
  const [issueDate, setIssueDate] = useState('2026 年 10 月 04 日');

  const handleCelebrate = () => {
    playSuccessChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Controls Toolbar */}
      <div className="no-print bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900">
            同理心結業證書預覽與匯出
          </h2>
          <p className="text-xs text-stone-500">
            可用於學期作業成果附錄、課堂個人檔案或給老師打分
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCelebrate}
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>彩帶祝賀</span>
          </button>

          <button
            onClick={onPrint || (() => window.print())}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>列印證書 (PDF)</span>
          </button>
        </div>
      </div>

      {/* Customizable inputs form (No Print) */}
      <div className="no-print bg-stone-50 rounded-xl border border-stone-200 p-4 text-xs space-y-2">
        <span className="font-semibold text-stone-700">證書頒發資料自訂：</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div>
            <label className="text-[11px] text-stone-500 block mb-0.5">學員/組別姓名</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-stone-300 text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-500 block mb-0.5">專題課程名稱</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-stone-300 text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-500 block mb-0.5">授課/指導教師</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-stone-300 text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-500 block mb-0.5">頒發日期</label>
            <input
              type="text"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-stone-300 text-xs"
            />
          </div>
        </div>
      </div>

      {/* The Printable Certificate Design */}
      <div className="bg-white rounded-2xl border-4 border-double border-rose-300/80 p-8 sm:p-12 shadow-md relative overflow-hidden print:border-rose-400 print:shadow-none print:m-0">
        {/* Subtle decorative background watermarks/filigree */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-50/50 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-50/50 pointer-events-none" />

        <div className="relative z-10 text-center space-y-6">
          {/* Header Seal */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-300 text-rose-700 flex items-center justify-center shadow-xs">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-rose-700 tracking-widest uppercase">
              CERTIFICATE OF EMPATHY & RESILIENCE
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-tc tracking-tight">
              妊娠體驗與生命同理結業證書
            </h1>
            <p className="text-xs text-stone-500 font-mono">
              證書編號: EMP-2026-PREG-{Math.floor(1000 + Math.random() * 9000)}
            </p>
          </div>

          <div className="py-4 space-y-4 max-w-2xl mx-auto text-stone-700 text-sm leading-relaxed">
            <p>
              茲證明學員 <span className="font-bold text-stone-900 text-base border-b-2 border-rose-400 px-3 py-0.5 inline-block">{recipientName}</span>
            </p>
            <p className="text-stone-600 text-xs sm:text-sm">
              已順利完成 <strong className="text-stone-900">{courseName}</strong> 之「全天候妊娠負重模擬與日常障礙體驗」，親自實測並完成晨吐調息、重力下蹲、公共交通通勤、深夜體位承托及拉梅茲呼吸共五大日常挑戰。
            </p>
            <p className="text-xs text-stone-500 italic">
              「在負重中看見生命之重，在日常細節中實踐溫暖關懷。」
            </p>
          </div>

          {/* 5 Milestone Badges */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-5 gap-2 text-left">
            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-stone-800">晨吐調理</div>
              <div className="text-[10px] text-stone-500">生理調息認證</div>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-stone-800">安全下蹲</div>
              <div className="text-[10px] text-stone-500">人體工學認證</div>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-stone-800">大眾捷運</div>
              <div className="text-[10px] text-stone-500">隱形需求同理</div>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-stone-800">月亮枕好眠</div>
              <div className="text-[10px] text-stone-500">左側臥工學</div>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-stone-800">拉梅茲調息</div>
              <div className="text-[10px] text-stone-500">產痛共鳴突破</div>
            </div>
          </div>

          {/* Footer Signature Lines */}
          <div className="pt-8 border-t border-stone-200 grid grid-cols-2 gap-8 text-xs text-stone-600">
            <div className="text-left space-y-1">
              <span className="block text-stone-400 text-[11px]">指導教師簽署 (Instructor)</span>
              <span className="font-bold text-stone-800 text-sm">{instructor}</span>
              <div className="w-32 border-b border-stone-300 mt-2" />
            </div>

            <div className="text-right space-y-1">
              <span className="block text-stone-400 text-[11px]">證書簽發日期 (Issue Date)</span>
              <span className="font-bold text-stone-800 text-sm">{issueDate}</span>
              <div className="w-32 border-b border-stone-300 mt-2 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Return Button (No-Print) */}
      <div className="no-print text-center pt-2">
        <button
          onClick={onGoToGame}
          className="text-xs font-semibold text-rose-700 hover:text-rose-800 transition-colors cursor-pointer"
        >
          ← 返回日常挑戰模擬遊戲
        </button>
      </div>
    </div>
  );
};
