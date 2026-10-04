import React, { useState } from 'react';
import { Film, Play, Upload, Link as LinkIcon, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { playKawaiiPop } from '../../utils/audio';

interface VideoShowcaseViewProps {
  onBackToGame: () => void;
  onGoToReport: () => void;
}

export const VideoShowcaseView: React.FC<VideoShowcaseViewProps> = ({ onBackToGame, onGoToReport }) => {
  const [videoSourceType, setVideoSourceType] = useState<'sample' | 'url' | 'file'>('sample');
  const [customUrl, setCustomUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playKawaiiPop();
      const url = URL.createObjectURL(file);
      setUploadedFileUrl(url);
      setVideoSourceType('file');
    }
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    playKawaiiPop();
    setActiveUrl(customUrl.trim());
    setVideoSourceType('url');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-100 via-pink-50 to-purple-50 rounded-3xl border-2 border-sky-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-sky-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs mb-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>成果發表專屬 · 實測影片展演區</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif-tc">
            我們的妊娠體驗實測短片
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            將組員實際穿戴負重裝備、在捷運車廂晃動通勤與日常穿鞋的真實影片，無縫放進專案成果中向全班展示！
          </p>
        </div>

        <button
          onClick={onBackToGame}
          className="px-4 py-2 bg-white text-stone-800 rounded-2xl text-xs font-bold border border-sky-300 hover:bg-sky-50 shadow-xs cursor-pointer shrink-0"
        >
          ← 返回捷運答題遊戲
        </button>
      </div>

      {/* Video Source Switcher Controls */}
      <div className="bg-white rounded-3xl border-2 border-sky-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-700">影片來源選擇：</span>
          <button
            onClick={() => {
              playKawaiiPop();
              setVideoSourceType('sample');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              videoSourceType === 'sample'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🎬 成果展示示範影片
          </button>

          <button
            onClick={() => {
              playKawaiiPop();
              setVideoSourceType('file');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              videoSourceType === 'file'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            📁 本地影片上傳播放 (MP4/MOV)
          </button>

          <button
            onClick={() => {
              playKawaiiPop();
              setVideoSourceType('url');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              videoSourceType === 'url'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🔗 線上影片連結 (YouTube/雲端)
          </button>
        </div>
      </div>

      {/* Input row when URL or File selected */}
      {videoSourceType === 'url' && (
        <div className="bg-sky-50 rounded-2xl border border-sky-200 p-4 flex gap-2 items-center text-xs animate-in fade-in">
          <LinkIcon className="w-4 h-4 text-sky-600 shrink-0" />
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="貼上 YouTube 影片網址、Google 雲端共用連結或 MP4 網址..."
            className="flex-1 p-2 bg-white rounded-xl border border-sky-300 text-xs"
          />
          <button
            onClick={handleApplyUrl}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold cursor-pointer"
          >
            載入播放
          </button>
        </div>
      )}

      {videoSourceType === 'file' && (
        <div className="bg-sky-50 rounded-2xl border border-sky-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-stone-700">選擇你們小組拍攝好的體驗影片檔案：</span>
          </div>
          <label className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5">
            <span>瀏覽選擇影片 (.mp4/.mov)</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Video Player Display Screen */}
      <div className="bg-stone-900 rounded-3xl border-3 border-stone-800 overflow-hidden shadow-xl aspect-16/9 relative flex items-center justify-center">
        {videoSourceType === 'file' && uploadedFileUrl ? (
          <video
            src={uploadedFileUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        ) : videoSourceType === 'url' && activeUrl ? (
          activeUrl.includes('youtube.com') || activeUrl.includes('youtu.be') ? (
            <iframe
              src={
                activeUrl.includes('watch?v=')
                  ? activeUrl.replace('watch?v=', 'embed/')
                  : activeUrl.replace('youtu.be/', 'www.youtube.com/embed/')
              }
              title="組員實測影片"
              className="w-full h-full border-0"
              allowFullScreen
            />
          ) : (
            <video
              src={activeUrl}
              controls
              className="w-full h-full object-contain"
            />
          )
        ) : (
          /* Sample Preview Showcase */
          <div className="relative w-full h-full bg-gradient-to-tr from-stone-950 via-slate-900 to-sky-950 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-20 h-20 rounded-full bg-pink-500/20 border-2 border-pink-400 flex items-center justify-center text-4xl mb-3 shadow-lg animate-pulse">
              🎬
            </div>
            <h3 className="text-xl font-black font-serif-tc text-pink-200 mb-1">
              第 3 組 · 捷運車廂負重體驗實測紀錄片
            </h3>
            <p className="text-xs text-stone-400 max-w-md mb-4">
              實地穿戴 6.5kg 水袋背包於捷運通勤時段錄製，完整收錄煞車重心傾斜、尋座眼神與讓座感動瞬間。
            </p>
            <div className="flex gap-2">
              <label className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold text-xs shadow-md cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>點此載入你們拍攝的影片檔案</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Video Presentation Notes */}
      <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 shadow-xs space-y-3">
        <h3 className="text-base font-black text-stone-900 font-serif-tc flex items-center gap-2">
          <span>📝 影片解說重點（上台向老師與同學介紹）</span>
        </h3>
        <ul className="text-xs text-stone-600 space-y-2 list-disc pl-5 leading-relaxed font-medium">
          <li><strong>00:15 - 出發穿戴：</strong> 背包注入 6.5kg 溫水，肚子綁上大靠枕，剛出門穿鞋時就經歷了第一次彎腰卡肚。</li>
          <li><strong>01:10 - 捷運晃動實拍：</strong> 列車過彎與煞車時，重心明顯往前傾斜，手部需施加雙倍力量抓緊吊環。</li>
          <li><strong>02:05 - 車廂讓座觀察：</strong> 佩戴好孕胸章與未佩戴時的周遭乘客視線對比，真實呈現「隱形需求」的溝通價值。</li>
        </ul>
      </div>
    </div>
  );
};
