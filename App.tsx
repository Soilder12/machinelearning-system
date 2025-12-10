import React, { useState } from 'react';
import { ViewState } from './types';
import IntroSection from './components/IntroSection';
import SupervisedLab from './components/SupervisedLab';
import UnsupervisedLab from './components/UnsupervisedLab';
import ReinforcementLab from './components/ReinforcementLab';
import GenerativeLab from './components/GenerativeLab';
import { BookOpen, Target, LayoutGrid, Zap, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.INTRO);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Zap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">AI 学习实验室</h1>
              <p className="text-xs text-slate-500">初中人工智能入门课程</p>
            </div>
          </div>

          <nav className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
            <NavButton 
              active={view === ViewState.INTRO} 
              onClick={() => setView(ViewState.INTRO)}
              icon={<BookOpen size={18} />}
              label="1. 概念"
            />
            <NavButton 
              active={view === ViewState.SUPERVISED} 
              onClick={() => setView(ViewState.SUPERVISED)}
              icon={<Target size={18} />}
              label="2. 监督学习"
            />
            <NavButton 
              active={view === ViewState.UNSUPERVISED} 
              onClick={() => setView(ViewState.UNSUPERVISED)}
              icon={<LayoutGrid size={18} />}
              label="3. 无监督学习"
            />
            <NavButton 
              active={view === ViewState.REINFORCEMENT} 
              onClick={() => setView(ViewState.REINFORCEMENT)}
              icon={<Zap size={18} />}
              label="4. 强化学习"
            />
            <NavButton 
              active={view === ViewState.GENERATIVE} 
              onClick={() => setView(ViewState.GENERATIVE)}
              icon={<Sparkles size={18} />}
              label="5. 生成式 AI"
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {view === ViewState.INTRO && <IntroSection />}
          {view === ViewState.SUPERVISED && <SupervisedLab />}
          {view === ViewState.UNSUPERVISED && <UnsupervisedLab />}
          {view === ViewState.REINFORCEMENT && <ReinforcementLab />}
          {view === ViewState.GENERATIVE && <GenerativeLab />}
        </div>
      </main>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
      active 
        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' 
        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default App;