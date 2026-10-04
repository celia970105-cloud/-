import React from 'react';
import { NavigationTab } from '../types/pregnancy';
import { Gamepad2, FileText, Award, Film, TrainFront } from 'lucide-react';
import { playKawaiiPop } from '../utils/audio';

interface NavbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onPrint?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const handleNavClick = (tab: NavigationTab) => {
    playKawaiiPop();
    onTabChange(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFE0E6]/95 backdrop-blur-md border-b-2 border-[#FFBCBD]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('subway')}
          className="text-lg font-black tracking-tight text-[#4A3337] font-serif-tc text-left hover:text-[#E85D75] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>🚇 站穩啦媽咪 · 捷運大冒險</span>
        </button>

        {/* Zone 2: clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleNavClick('subway')}
            className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'subway'
                ? 'bg-[#E85D75] text-white shadow-xs'
                : 'text-[#5C3E43] hover:text-[#4A3337] hover:bg-[#FFBCBD]/40'
            }`}
          >
            <TrainFront className="w-3.5 h-3.5" />
            <span>捷運答題闖關</span>
          </button>

          <button
            onClick={() => handleNavClick('video')}
            className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#E85D75] text-white shadow-xs'
                : 'text-[#5C3E43] hover:text-[#4A3337] hover:bg-[#FFBCBD]/40'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>小組影片展演</span>
          </button>

          <button
            onClick={() => handleNavClick('game')}
            className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'game'
                ? 'bg-[#E85D75] text-white shadow-xs'
                : 'text-[#5C3E43] hover:text-[#4A3337] hover:bg-[#FFBCBD]/40'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>日常挑戰館</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick(activeTab === 'subway' ? 'video' : 'subway')}
            className="px-4 py-2 text-xs font-black text-white bg-[#E85D75] hover:bg-[#D44763] rounded-xl shadow-xs transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
          >
            {activeTab === 'subway' ? '🎬 觀看小組影片' : '🎮 玩捷運答題遊戲'}
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex border-t border-[#FFBCBD]/40 bg-[#FFE0E6] px-2 py-1.5 justify-around text-xs">
        <button
          onClick={() => handleNavClick('subway')}
          className={`py-1 px-2 font-black flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'subway' ? 'text-[#E85D75]' : 'text-[#7A5860]'
          }`}
        >
          <TrainFront className="w-4 h-4" />
          <span>捷運答題</span>
        </button>
        <button
          onClick={() => handleNavClick('video')}
          className={`py-1 px-2 font-black flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'video' ? 'text-[#E85D75]' : 'text-[#7A5860]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>小組影片</span>
        </button>
        <button
          onClick={() => handleNavClick('game')}
          className={`py-1 px-2 font-black flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'game' ? 'text-[#E85D75]' : 'text-[#7A5860]'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>日常挑戰</span>
        </button>
      </div>
    </header>
  );
};
