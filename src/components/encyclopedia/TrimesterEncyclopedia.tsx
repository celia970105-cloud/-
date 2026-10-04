import React, { useState } from 'react';
import { TRIMESTER_DATA } from '../../data/reportData';
import { Sparkles, Heart, Activity, Info, Baby, Stethoscope } from 'lucide-react';
import { playGentleClick } from '../../utils/audio';

const MILESTONES = [
  { week: 4, name: '芝麻種子', size: '0.2cm', desc: '受精卵著床，神經管與原始心血管開始分裂發育。' },
  { week: 8, name: '覆盆子', size: '1.6cm', desc: '手腳微小指節雛形顯現，微小心跳可透過超音波偵測。' },
  { week: 12, name: '青檸檬', size: '5.4cm', desc: '主要器官成形，反射神經開始運作，骨骼逐漸硬化。' },
  { week: 16, name: '酪梨', size: '11.6cm', desc: '手指腳趾具備微小指紋，開始能在羊水中翻跟斗。' },
  { week: 20, name: '香蕉', size: '25.6cm', desc: '母親首度感受到真實胎動！聽覺神經發育，能聽見母親心跳與外界聲音。' },
  { week: 24, name: '玉米', size: '30.0cm', desc: '大腦神經元迅速連結，肺泡開始分泌表面活性物質。' },
  { week: 28, name: '茄子', size: '37.6cm', desc: '雙眼能夠睜開與眨動，具備規律的睡眠與清醒週期。' },
  { week: 32, name: '大白菜', size: '42.4cm', desc: '皮下脂肪沉積，骨骼變堅硬（頭骨仍保持柔軟以便分娩）。' },
  { week: 36, name: '蜜瓜', size: '47.4cm', desc: '胎頭逐漸下降進入骨盆，母親上腹壓迫減輕但膀胱壓迫達顛峰。' },
  { week: 40, name: '大西瓜', size: '51.2cm', desc: '足月準備誕生！肺部成熟，已具備獨立呼吸與吮吸能力。' }
];

export const TrimesterEncyclopedia: React.FC = () => {
  const [selectedTrimester, setSelectedTrimester] = useState<number>(1);
  const [selectedMilestone, setSelectedMilestone] = useState<number>(20);

  const trimester = TRIMESTER_DATA.find((t) => t.id === selectedTrimester) || TRIMESTER_DATA[0];
  const activeMilestone = MILESTONES.find((m) => m.week === selectedMilestone) || MILESTONES[4];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider">
            <span>生命科學與母體醫學</span>
            <span>·</span>
            <span>懷孕四十週生理科普百科</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif-tc text-balance">
            孕育四十週：人體如何創造一個奇蹟
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            一個微小細胞在短短 280 天內，成長為一個健全的新生命；與此同時，母體的心臟、骨骼、血管與荷爾蒙也經歷著人體生物學上最劇烈的適應性轉變。
          </p>
        </div>
      </div>

      {/* Week-by-Week Interactive Fruit & Baby Size Tracker */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-serif-tc flex items-center gap-2">
              <Baby className="w-5 h-5 text-rose-600" />
              <span>胎兒生長週數里程碑（水果食物形象比喻）</span>
            </h3>
            <p className="text-xs text-stone-500">點選不同週數，觀察寶寶體積與關鍵生理轉變：</p>
          </div>
          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
            第 {activeMilestone.week} 週 · 約 {activeMilestone.size}
          </span>
        </div>

        {/* Milestone Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {MILESTONES.map((m) => {
            const isSelected = m.week === selectedMilestone;
            return (
              <button
                key={m.week}
                onClick={() => {
                  setSelectedMilestone(m.week);
                  playGentleClick();
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-700 border-rose-700 text-white shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className={`text-[11px] font-mono font-bold ${isSelected ? 'text-rose-100' : 'text-stone-400'}`}>
                  {m.week}W
                </div>
                <div className="text-xs font-bold truncate mt-0.5">{m.name}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-rose-200' : 'text-stone-400'}`}>
                  {m.size}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Detail Card */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="font-bold text-stone-900 text-sm">
              懷孕第 {activeMilestone.week} 週：相當於一顆【{activeMilestone.name}】大小
            </span>
            <p className="text-stone-600 leading-relaxed">{activeMilestone.desc}</p>
          </div>
          <div className="shrink-0 bg-white px-3 py-2 rounded-lg border border-stone-200 text-center font-mono">
            <div className="text-[10px] text-stone-400">平均身長</div>
            <div className="text-sm font-bold text-stone-900">{activeMilestone.size}</div>
          </div>
        </div>
      </div>

      {/* Trimester Tabs */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-xl max-w-md">
          {TRIMESTER_DATA.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTrimester(t.id);
                playGentleClick();
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedTrimester === t.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Trimester Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Biological & Clinical Data */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="text-xs text-rose-700 font-semibold mb-1">
                {trimester.weeks} · 寶寶發展進程
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-serif-tc">
                {trimester.name}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                胎兒體型概況：{trimester.babySize} (約 {trimester.babyLength}，重約 {trimester.babyWeight})
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span>母體關鍵生理與荷爾蒙變化：</span>
                </span>
                <ul className="space-y-1.5 text-stone-600 pl-4 list-disc leading-relaxed">
                  {trimester.physicalChanges.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>孕期心理調適與隱形焦慮：</span>
                </span>
                <ul className="space-y-1.5 text-stone-600 pl-4 list-disc leading-relaxed">
                  {trimester.psychologicalChanges.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Care Guidance and Partner Support */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-2">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>臨床護理與生活減壓對策：</span>
              </span>
              <ul className="space-y-1.5 text-stone-700 pl-4 list-disc leading-relaxed">
                {trimester.careTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 text-xs space-y-2">
              <span className="font-bold text-rose-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>伴侶、家人與同儕的實質支持指引：</span>
              </span>
              <ul className="space-y-1.5 text-stone-700 pl-4 list-disc leading-relaxed">
                {trimester.partnerSupportAdvice.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <p>
                <strong>科普小提醒：</strong> 每位孕婦的體質與荷爾蒙反應皆有個體差異，若有劇烈腹痛、異常出血或持續頭暈，應立即就醫諮詢婦產科專科醫師。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
