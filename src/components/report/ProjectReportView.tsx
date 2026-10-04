import React, { useState } from 'react';
import { EXPERIENCE_LOGS, SCIENTIFIC_STATS } from '../../data/reportData';
import { StudentReportData } from '../../types/pregnancy';
import { Printer, Presentation, FileText, Sparkles, Heart, Edit3, CheckCircle2 } from 'lucide-react';
import { playKawaiiPop } from '../../utils/audio';

interface ProjectReportViewProps {
  onPrint?: () => void;
  onGoToGame: () => void;
}

export const ProjectReportView: React.FC<ProjectReportViewProps> = ({ onPrint, onGoToGame }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'slides'>('cards');
  const [currentSlide, setCurrentSlide] = useState(0);

  const [studentData, setStudentData] = useState<StudentReportData>({
    projectName: '「負重前行 · 媽咪大挑戰」妊娠體驗學習專題',
    courseName: '生命教育與家庭生活',
    instructorName: '張老師',
    studentNames: '第 3 組（怡萱、宏宇、佩珊）',
    submissionDate: '2026年10月04日',
    weightUsedKg: 6.5,
    bellyCircumferenceCm: 102,
    hoursWorn: 24,
    summaryReflection: '親身體驗 6.5 公斤負重 24 小時後，我們才發現日常穿鞋、搭捷運、睡覺這些微不足道的小事，對孕婦都是全身考驗。懂得她的負重，才能給出最恰當的溫柔與支持！',
    partnerAppreciation: '主動蹲下幫忙綁鞋帶、提重物、捷運上主動開口協調讓座，是消除孕婦無助感最直接的力量。',
    campusSuggestion: '建議校園樓梯加強防滑黃條、圖書館增設托腰靠墊，以及推廣「好孕胸章」友善讓座文化！'
  });

  const [isEditing, setIsEditing] = useState(false);

  // Cue slides for the presentation
  const presentationSlides = [
    {
      title: '01. 專題動機 & 裝備設定',
      subtitle: '（演講提綱：介紹為什麼要做這個體驗、穿戴了什麼規格）',
      points: [
        `🎒 模擬負重：${studentData.weightUsedKg} kg 水袋背包（相當於懷孕 32~34 週）`,
        `📏 腹圍擴張：${studentData.bellyCircumferenceCm} cm（身體重心前移，視線受阻）`,
        `⏱️ 體驗時數：全天候 ${studentData.hoursWorn} 小時（包含課堂、通勤與睡眠）`,
        '💡 核心理念：打破旁觀者偏見，透過親身體會建立真正的同理心'
      ]
    },
    {
      title: '02. 日常挑戰四大障礙',
      subtitle: '（演講提綱：搭配小遊戲心得，分享最辛苦的四個時刻）',
      points: [
        '🍪 晨起乾嘔：空腹時胃酸翻騰，聞到油煙立刻反胃，需吃蘇打餅乾與深呼吸調息',
        '👟 彎腰卡肚：直接彎腰會壓迫腹部且腰椎劇痛，必須採取「扶物直背深蹲法」',
        '🚇 捷運通勤：列車晃動拉扯腰椎，外表看不出孕肚時很難啟齒，好孕胸章超重要',
        '🌙 深夜好眠：不能平躺（會壓迫大血管胸悶！），需左側臥並搭配 3 顆月亮枕'
      ]
    },
    {
      title: '03. 數據與生理代價',
      subtitle: '（演講提綱：分享孕婦身體承受的科學數據）',
      points: [
        '❤️ 心臟血容量：增加 40% ~ 50%（等於一顆心臟要供氧給兩個人！）',
        '🦴 鬆弛素分泌：骨盆韌帶鬆弛，恥骨聯合分離，翻身與跨步都會刺痛',
        '💤 破碎化睡眠：平均每晚因頻尿、抽筋與肋骨踢擊中斷 3.8 次',
        '⚖️ 孕期體重增加：平均 11 ~ 15 kg（胎兒、羊水、胎盤全重）'
      ]
    },
    {
      title: '04. 同理心收穫 & 友善建言',
      subtitle: '（演講提綱：結尾總結與給學校/社會的建議）',
      points: [
        `💖 組員反思：${studentData.summaryReflection}`,
        `🤝 伴侶/同儕分擔：${studentData.partnerAppreciation}`,
        `🏫 校園環境倡議：${studentData.campusSuggestion}`
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Controls Toolbar */}
      <div className="no-print bg-white rounded-3xl border-2 border-pink-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playKawaiiPop();
              setViewMode('cards');
            }}
            className={`px-4 py-2 text-xs font-black rounded-2xl transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-pink-50 text-stone-700 hover:bg-pink-100'
            }`}
          >
            📋 重點小卡模式
          </button>

          <button
            onClick={() => {
              playKawaiiPop();
              setViewMode('slides');
            }}
            className={`px-4 py-2 text-xs font-black rounded-2xl transition-all cursor-pointer ${
              viewMode === 'slides'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'bg-pink-50 text-stone-700 hover:bg-pink-100'
            }`}
          >
            📽️ 上台簡報提綱模式
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playKawaiiPop();
              setIsEditing(!isEditing);
            }}
            className="px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-2xl transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? '收起自訂' : '修改組員資料'}</span>
          </button>

          <button
            onClick={onPrint || (() => window.print())}
            className="px-4 py-2 text-xs font-black text-white bg-stone-900 hover:bg-stone-800 rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>列印簡報/報告 (PDF)</span>
          </button>
        </div>
      </div>

      {/* Editing Dialog */}
      {isEditing && (
        <div className="no-print bg-pink-50 rounded-3xl border-2 border-pink-200 p-5 space-y-3 text-xs animate-in fade-in duration-150">
          <span className="font-black text-pink-900 block">修改專案基本資料（即時套用全站）：</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-stone-500 block mb-0.5">專案題目</label>
              <input
                type="text"
                value={studentData.projectName}
                onChange={(e) => setStudentData({ ...studentData, projectName: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-pink-200"
              />
            </div>
            <div>
              <label className="text-stone-500 block mb-0.5">組員姓名</label>
              <input
                type="text"
                value={studentData.studentNames}
                onChange={(e) => setStudentData({ ...studentData, studentNames: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-pink-200"
              />
            </div>
            <div>
              <label className="text-stone-500 block mb-0.5">指導老師</label>
              <input
                type="text"
                value={studentData.instructorName}
                onChange={(e) => setStudentData({ ...studentData, instructorName: e.target.value })}
                className="w-full p-2 bg-white rounded-xl border border-pink-200"
              />
            </div>
          </div>
          <div>
            <label className="text-stone-500 block mb-0.5">心得重點一句話</label>
            <textarea
              rows={2}
              value={studentData.summaryReflection}
              onChange={(e) => setStudentData({ ...studentData, summaryReflection: e.target.value })}
              className="w-full p-2 bg-white rounded-xl border border-pink-200"
            />
          </div>
        </div>
      )}

      {/* Slide Presentation View */}
      {viewMode === 'slides' ? (
        <div className="bg-white rounded-3xl border-3 border-pink-200 p-8 sm:p-12 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-pink-100">
            <div>
              <span className="text-xs text-pink-600 font-bold tracking-wider">
                上台簡報卡片 · 第 {currentSlide + 1} / {presentationSlides.length} 頁
              </span>
              <h2 className="text-2xl font-black text-stone-900 font-serif-tc mt-1">
                {presentationSlides[currentSlide].title}
              </h2>
              <p className="text-xs text-pink-700 font-medium mt-0.5">
                {presentationSlides[currentSlide].subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-200 disabled:opacity-30 cursor-pointer"
              >
                ◀ 上一頁
              </button>
              <button
                disabled={currentSlide === presentationSlides.length - 1}
                onClick={() => setCurrentSlide((s) => Math.min(presentationSlides.length - 1, s + 1))}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-pink-600 text-white disabled:opacity-30 cursor-pointer"
              >
                下一頁 ▶
              </button>
            </div>
          </div>

          {/* Big Bullet Points for easy speaking */}
          <div className="py-6 space-y-4 min-h-[260px] flex flex-col justify-center">
            {presentationSlides[currentSlide].points.map((pt, i) => (
              <div
                key={i}
                className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 text-stone-800 text-sm sm:text-base font-semibold leading-relaxed flex items-start gap-3 shadow-xs"
              >
                <span className="text-pink-600 text-lg mt-0.5">✨</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-pink-100 flex justify-between text-xs text-stone-400">
            <span>報告組別：{studentData.studentNames}</span>
            <span>課程：{studentData.courseName} · 指導：{studentData.instructorName}</span>
          </div>
        </div>
      ) : (
        /* Cards Mode */
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border-2 border-pink-200 p-6 sm:p-8 text-center space-y-2 shadow-xs">
            <span className="inline-block bg-pink-100 text-pink-800 text-[11px] font-black px-3 py-1 rounded-full">
              專案成果提綱 · 自備補充演講
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif-tc">
              {studentData.projectName}
            </h1>
            <p className="text-xs text-stone-500">
              {studentData.courseName} · 指導老師：{studentData.instructorName} · 報告組別：{studentData.studentNames}
            </p>

            <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg mx-auto">
              <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200">
                <span className="text-[10px] text-stone-400 block font-bold">模擬負重</span>
                <span className="text-base font-black text-pink-700 font-mono">{studentData.weightUsedKg} kg</span>
              </div>
              <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200">
                <span className="text-[10px] text-stone-400 block font-bold">模擬腹圍</span>
                <span className="text-base font-black text-pink-700 font-mono">{studentData.bellyCircumferenceCm} cm</span>
              </div>
              <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200">
                <span className="text-[10px] text-stone-400 block font-bold">穿戴時長</span>
                <span className="text-base font-black text-pink-700 font-mono">{studentData.hoursWorn} 小時</span>
              </div>
            </div>
          </div>

          {/* 4 Quick Concept Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-3xl border-2 border-pink-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-black text-stone-900 text-sm">
                <span>🍪</span>
                <span>晨吐與飲食照護</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                • 孕早期體內 hCG 急遽攀升，早晨空腹低血糖容易引發反胃乾嘔。<br />
                • 床頭備有蘇打餅乾與無油烤吐司，能迅速中和胃酸，搭配深呼吸調息。
              </p>
            </div>

            <div className="p-5 bg-white rounded-3xl border-2 border-pink-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-black text-stone-900 text-sm">
                <span>👟</span>
                <span>重力彎腰與穿鞋處置</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                • 懷孕後期腹部外凸 25cm，重心大幅前移，直接彎腰會造成腰椎劇痛。<br />
                • 正確方式：分開雙腳寬站姿，一手扶穩椅背，背部挺直屈膝深蹲。
              </p>
            </div>

            <div className="p-5 bg-white rounded-3xl border-2 border-pink-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-black text-stone-900 text-sm">
                <span>🚇</span>
                <span>捷運通勤與隱形需求</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                • 早期孕婦外表看不出來，但在列車煞車晃動時最容易因貧血眩暈。<br />
                • 推廣「好孕胸章」與鼓勵大眾主動抬頭觀察周遭，消除讓座障礙。
              </p>
            </div>

            <div className="p-5 bg-white rounded-3xl border-2 border-pink-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-black text-stone-900 text-sm">
                <span>🌙</span>
                <span>左側臥與月亮枕人體工學</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                • 平躺會壓迫下腔靜脈（IVC），造成低血壓與胸悶。<br />
                • 三點人體工學：肚皮下方托墊 + 雙膝間夾墊 + 背後靠墊，維持骨盆放鬆。
              </p>
            </div>
          </div>

          {/* Reflection Box */}
          <div className="p-6 bg-pink-100/60 rounded-3xl border-2 border-pink-300 space-y-2">
            <div className="flex items-center gap-2 text-pink-900 font-black text-sm">
              <Heart className="w-4 h-4 fill-current text-pink-600" />
              <span>組員同理心心得總結（上台重點）：</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {studentData.summaryReflection}
            </p>
          </div>

          <div className="no-print flex justify-between items-center pt-2">
            <button
              onClick={onGoToGame}
              className="text-xs font-bold text-pink-700 hover:text-pink-800 cursor-pointer"
            >
              ← 返回挑戰小遊戲
            </button>
            <button
              onClick={onPrint || (() => window.print())}
              className="px-4 py-2 bg-stone-900 text-white rounded-2xl text-xs font-bold shadow-xs cursor-pointer"
            >
              列印成果頁面 (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
