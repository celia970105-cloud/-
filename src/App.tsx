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
import { ProjectReportView } from './components/report/ProjectReportView';
import { EmpathyCertificate } from './components/certificate/EmpathyCertificate';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('subway');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF7] text-stone-800">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPrint={handlePrint}
      />

      <main className="flex-1">
        {activeTab === 'subway' && (
          <SubwayGameView
            onSwitchToReport={() => setActiveTab('report')}
            onSwitchToCertificate={() => setActiveTab('certificate')}
            onSwitchToVideo={() => setActiveTab('video')}
          />
        )}

        {activeTab === 'video' && (
          <VideoShowcaseView
            onBackToGame={() => setActiveTab('subway')}
            onGoToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'game' && (
          <DailyChallengeGame
            onSwitchToReport={() => setActiveTab('report')}
            onSwitchToCertificate={() => setActiveTab('certificate')}
          />
        )}

        {activeTab === 'report' && (
          <ProjectReportView
            onPrint={handlePrint}
            onGoToGame={() => setActiveTab('subway')}
          />
        )}

        {activeTab === 'certificate' && (
          <EmpathyCertificate
            onPrint={handlePrint}
            onGoToGame={() => setActiveTab('subway')}
          />
        )}
      </main>

      {/* Clean, respectful footer */}
      <footer className="no-print border-t border-pink-200 bg-white py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-stone-800 font-serif-tc">🚇 站穩啦媽咪 · 捷運車廂妊娠體驗</span>
            <span>·</span>
            <span>生命教育與友善讓座倡議</span>
          </div>

          <div className="flex items-center gap-3 text-stone-400 font-bold">
            <button
              onClick={() => setActiveTab('subway')}
              className="hover:text-pink-600 transition-colors cursor-pointer"
            >
              捷運答題
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('video')}
              className="hover:text-pink-600 transition-colors cursor-pointer"
            >
              小組影片
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('game')}
              className="hover:text-pink-600 transition-colors cursor-pointer"
            >
              日常小遊戲
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('report')}
              className="hover:text-pink-600 transition-colors cursor-pointer"
            >
              演講提綱
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('certificate')}
              className="hover:text-pink-600 transition-colors cursor-pointer"
            >
              結業證書
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
