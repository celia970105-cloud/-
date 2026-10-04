import React, { useState } from 'react';
import { Film, Upload, RotateCcw, Video, FileVideo, Sparkles } from 'lucide-react';
import { playKawaiiPop } from '../../utils/audio';

interface VideoShowcaseViewProps {
  onBackToGame: () => void;
}

export const VideoShowcaseView: React.FC<VideoShowcaseViewProps> = ({ onBackToGame }) => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playKawaiiPop();
      const url = URL.createObjectURL(file);
      setUploadedFileUrl(url);
      setFileName(file.name);
    }
  };

  const handleClearVideo = () => {
    playKawaiiPop();
    setUploadedFileUrl(null);
    setFileName('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-100 via-pink-50 to-purple-50 rounded-3xl border-2 border-sky-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-sky-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs mb-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>成果發表專屬 · 本地實測影片展演</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif-tc">
            小組妊娠體驗實測短片
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            選取你們小組拍攝的真實影片檔，直接在本地播放展示給全班與老師觀看！
          </p>
        </div>

        <button
          onClick={onBackToGame}
          className="px-4 py-2 bg-white text-stone-800 rounded-2xl text-xs font-bold border border-sky-300 hover:bg-sky-50 shadow-xs cursor-pointer shrink-0"
        >
          ← 返回捷運答題遊戲
        </button>
      </div>

      {/* Upload Action Bar */}
      <div className="bg-white rounded-3xl border-2 border-sky-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <FileVideo className="w-4 h-4 text-sky-600" />
          {fileName ? (
            <span className="font-bold text-stone-800">
              目前播放檔案：<span className="text-sky-700 font-mono">{fileName}</span>
            </span>
          ) : (
            <span className="font-bold text-stone-600">
              請載入你們小組錄製的本地影片（MP4 / MOV / WebM）
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploadedFileUrl ? '更換本地影片檔' : '選取本地影片上傳'}</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {uploadedFileUrl && (
            <button
              onClick={handleClearVideo}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新載入</span>
            </button>
          )}
        </div>
      </div>

      {/* Video Player Display Screen */}
      <div className="bg-stone-900 rounded-3xl border-3 border-stone-800 overflow-hidden shadow-xl aspect-16/9 relative flex items-center justify-center">
        {uploadedFileUrl ? (
          <video
            src={uploadedFileUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        ) : (
          /* Empty Dropzone / Selector */
          <label className="w-full h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-stone-900/80 transition-colors group">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-20 h-20 rounded-3xl bg-sky-500/20 border-2 border-sky-400 group-hover:scale-105 transition-transform flex items-center justify-center text-4xl mb-4 shadow-lg">
              <Upload className="w-8 h-8 text-sky-400" />
            </div>
            <h3 className="text-xl font-black font-serif-tc text-sky-200 mb-1">
              點擊此處選取小組實測影片檔案
            </h3>
            <p className="text-xs text-stone-400 max-w-md mb-4">
              支援手機攝影錄影檔、.mp4、.mov 檔案，純本地直撥，畫質清晰無壓縮！
            </p>
            <span className="px-5 py-2.5 bg-sky-600 group-hover:bg-sky-500 text-white rounded-full font-bold text-xs shadow-md">
              📂 開啟檔案瀏覽器選擇影片
            </span>
          </label>
        )}
      </div>

      {/* Video Presentation Notes */}
      <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 shadow-xs space-y-3">
        <h3 className="text-base font-black text-stone-900 font-serif-tc flex items-center gap-2">
          <span>📝 小組實測解說提綱（簡報播放時可對照）</span>
        </h3>
        <ul className="text-xs text-stone-600 space-y-2 list-disc pl-5 leading-relaxed font-medium">
          <li><strong>負重出發段落：</strong> 背包注入 6.5kg 水袋，模擬懷孕後期胎兒與羊水重量，實測穿鞋彎腰卡肚。</li>
          <li><strong>捷運車廂段落：</strong> 台北捷運過彎與煞車減速時，因腹部向前突出，重心前移需耗費手部力氣緊抓吊環。</li>
          <li><strong>讓座觀察段落：</strong> 記錄博愛座乘客視線與互動，探討主動讓座與友善好孕胸章的深層社會意涵。</li>
        </ul>
      </div>
    </div>
  );
};
