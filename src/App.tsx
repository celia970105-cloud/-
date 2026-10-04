/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab } from './types/pregnancy';
import { Navbar } from './components/Navbar';
import { SubwayGameView } from './components/subway/SubwayGameView';
import { VideoShowcaseView } from './components/video/VideoShowcaseView';
import { DailyChallengeGame } from './components/game/DailyChallengeGame';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('subway');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF4] text-[#4A3337]">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPrint={handlePrint}
      />

      <main className="flex-1 w-full">
        {activeTab === 'subway' && (
          <SubwayGameView
            onSwitchToVideo={() => setActiveTab('video')}
          />
        )}

        {activeTab === 'video' && (
          <VideoShowcaseView
            onBackToGame={() => setActiveTab('subway')}
          />
        )}

        {activeTab === 'game' && (
          <DailyChallengeGame
            onBackToSubway={() => setActiveTab('subway')}
          />
        )}
      </main>

      {/* Clean, respectful footer matching strawberry milk theme */}
      <footer className="no-print border-t border-[#FFBCBD]/40 bg-[#FFE0E6]/30 py-5 text-xs text-[#6B4B52]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#4A3337] font-serif-tc">🚇 站穩啦媽咪 · 捷運車廂妊娠體驗</span>
            <span>·</span>
            <span>生命教育與友善讓座倡議</span>
          </div>

          <div className="flex items-center gap-3 text-[#7A5860] font-bold">
            <button
              onClick={() => setActiveTab('subway')}
              className="hover:text-[#E85D75] transition-colors cursor-pointer"
            >
              捷運答題
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('video')}
              className="hover:text-[#E85D75] transition-colors cursor-pointer"
            >
              小組影片
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('game')}
              className="hover:text-[#E85D75] transition-colors cursor-pointer"
            >
              日常小遊戲
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
