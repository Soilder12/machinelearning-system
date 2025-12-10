import React, { useState } from 'react';
import { Code, Brain, Check, X, Database, Play } from 'lucide-react';

const IntroSection: React.FC = () => {
  const [mode, setMode] = useState<'traditional' | 'ml'>('traditional');

  // Traditional Mode State
  const [rules, setRules] = useState({
    whiskers: false,
    ears: false,
    meow: false
  });
  const [progResult, setProgResult] = useState<'idle' | 'success' | 'fail'>('idle');

  // ML Mode State
  const [dataCount, setDataCount] = useState(0);
  const [mlResult, setMlResult] = useState<'idle' | 'predicting' | 'success'>('idle');
  const [particles, setParticles] = useState<{id: number, char: string, left: number, delay: number}[]>([]);

  // --- Logic for Traditional Programming ---
  const runProgram = () => {
    // Scenario: We are identifying a Cat.
    // The strict rule requires ALL features to be present.
    if (rules.whiskers && rules.ears && rules.meow) {
      setProgResult('success');
    } else {
      setProgResult('fail');
    }
  };

  // --- Logic for Machine Learning ---
  const trainModel = () => {
    if (dataCount >= 100) return;
    
    // 1. Increment Data (Manual clicking)
    setDataCount(prev => Math.min(prev + 10, 100));

    // 2. Generate Flying Particles (Visual Feedback)
    const emojis = ['🐱', '🐶', '📸', '🖼️', '💾', '🦁'];
    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      char: emojis[Math.floor(Math.random() * emojis.length)],
      left: 20 + Math.random() * 60, // Random position 20% to 80%
      delay: i * 0.1
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Cleanup particles after animation (1s)
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1000);
  };

  const predict = () => {
    setMlResult('predicting');
    setTimeout(() => {
      setMlResult('success');
    }, 1500);
  };

  const reset = () => {
    setRules({ whiskers: false, ears: false, meow: false });
    setProgResult('idle');
    setDataCount(0);
    setMlResult('idle');
    setParticles([]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header Switcher */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            🤖 挑战：如何教计算机认出一只猫？
          </h2>
          
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => { setMode('traditional'); reset(); }}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                mode === 'traditional'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Code size={20} /> 方法一：传统编程
            </button>
            <button
              onClick={() => { setMode('ml'); reset(); }}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                mode === 'ml'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Brain size={20} /> 方法二：机器学习
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 min-h-[500px] flex items-start justify-center">
          
          {/* --- TRADITIONAL MODE --- */}
          {mode === 'traditional' && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Left: The Rule Editor */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                  1. 编写规则代码
                </h3>
                <p className="text-sm text-blue-700 mb-6">
                  你必须告诉计算机<strong className="text-red-500">所有</strong>关于猫的特征。
                  如果少写一条，程序就会出错！
                </p>

                <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                  <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-slate-100">
                    <span className="font-mono text-slate-600">IF (有胡须 == true)</span>
                    <input 
                      type="checkbox" 
                      checked={rules.whiskers}
                      onChange={e => setRules({...rules, whiskers: e.target.checked})}
                      className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-slate-100">
                    <span className="font-mono text-slate-600">AND (有尖耳朵 == true)</span>
                    <input 
                      type="checkbox" 
                      checked={rules.ears}
                      onChange={e => setRules({...rules, ears: e.target.checked})}
                      className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-slate-100">
                    <span className="font-mono text-slate-600">AND (会喵喵叫 == true)</span>
                    <input 
                      type="checkbox" 
                      checked={rules.meow}
                      onChange={e => setRules({...rules, meow: e.target.checked})}
                      className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>

                <button 
                  onClick={runProgram}
                  className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition transform active:scale-95"
                >
                  <Play size={20} /> 运行程序 (Run Code)
                </button>
              </div>

              {/* Right: The Result */}
              <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-4">运行结果</h3>
                
                <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-slate-100 mb-6">
                  {progResult === 'idle' && <span className="text-6xl grayscale opacity-50">🐱</span>}
                  {progResult === 'success' && <span className="text-8xl animate-bounce">🐱</span>}
                  {progResult === 'fail' && <span className="text-6xl opacity-50">❓</span>}
                </div>

                <div className="h-20 w-full flex items-center justify-center">
                  {progResult === 'idle' && (
                    <p className="text-slate-400">等待运行代码...</p>
                  )}
                  {progResult === 'success' && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 animate-in zoom-in">
                      <Check size={20} /> 识别成功！这是一只猫。
                    </div>
                  )}
                  {progResult === 'fail' && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 animate-in shake">
                      <X size={20} /> 错误！特征不足，无法识别！
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-4 text-center max-w-xs">
                  <strong>缺点：</strong> 如果遇到一只断了一根胡须的猫（规则不满足），传统程序就会彻底失效！太死板了！
                </p>
              </div>
            </div>
          )}

          {/* --- ML MODE --- */}
          {mode === 'ml' && (
             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
               {/* Left: The Data Trainer */}
               <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 relative overflow-hidden">
                <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2 z-10 relative">
                  1. 投喂数据 (Training)
                </h3>
                <p className="text-sm text-purple-700 mb-6 z-10 relative">
                  不需要写规则！只要给 AI 看大量的照片。
                  <br/>
                  <span className="font-bold text-purple-800">任务：猛点按钮，把数据喂饱！</span>
                </p>

                {/* Data Visualization Container */}
                <div className="relative h-40 bg-white rounded-xl border border-purple-100 flex items-center justify-center overflow-hidden mb-6 z-10">
                  <div className="z-10 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-1">{dataCount}%</div>
                    <div className="text-xs text-purple-400">数据量 (Data Volume)</div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 h-2 bg-purple-500 transition-all duration-300" style={{width: `${dataCount}%`}}></div>

                  {/* Falling/Flying Particles Animation Layer */}
                  {particles.map((p) => (
                    <div 
                      key={p.id}
                      className="absolute text-2xl pointer-events-none animate-float-up opacity-0"
                      style={{
                        left: `${p.left}%`,
                        bottom: '10px',
                        animation: `flyUp 0.8s ease-out forwards`,
                        animationDelay: `${p.delay}s`
                      }}
                    >
                      {p.char}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={trainModel}
                  disabled={dataCount >= 100}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition transform active:scale-95 shadow-lg shadow-purple-200 z-10 relative"
                >
                  <Database size={24} /> 
                  {dataCount >= 100 ? '训练完成 (Full)' : `投喂一批照片 (+10%)`}
                </button>

                {/* CSS for specific animation in this component */}
                <style>{`
                  @keyframes flyUp {
                    0% { transform: translateY(0) scale(0.5); opacity: 1; }
                    100% { transform: translateY(-120px) scale(1.2); opacity: 0; }
                  }
                `}</style>
              </div>

              {/* Right: The Prediction */}
              <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-4">测试 AI</h3>
                
                <div className={`relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-slate-100 mb-6 transition-all duration-500 ${
                  dataCount >= 100 ? 'shadow-purple-200 border-purple-200' : ''
                }`}>
                   {/* Brain growing animation */}
                   <Brain 
                      size={dataCount < 50 ? 60 : dataCount < 100 ? 90 : 120} 
                      className={`text-purple-500 transition-all duration-500 ${mlResult === 'predicting' ? 'animate-pulse' : ''}`}
                    />
                   
                   {/* Thinking bubble */}
                   {mlResult === 'predicting' && (
                     <div className="absolute -top-4 -right-4 bg-white px-3 py-1 rounded-full shadow border text-sm animate-bounce">
                       🤔 看起来像...
                     </div>
                   )}
                </div>

                <div className="h-20 w-full flex flex-col items-center justify-center">
                  {mlResult === 'idle' && (
                     <button 
                      onClick={predict}
                      disabled={dataCount < 100}
                      className="px-6 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-700 transition"
                     >
                       给它看一张新照片
                     </button>
                  )}
                  
                  {mlResult === 'success' && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 animate-in zoom-in">
                      <Check size={20} /> 我知道了！这是一只猫！(99% 确信)
                    </div>
                  )}

                  {dataCount < 100 && mlResult === 'idle' && (
                    <p className="text-xs text-red-400 mt-2 animate-pulse">
                      ⬆️ 快去左边投喂数据！AI 还没吃饱！
                    </p>
                  )}
                </div>

                 <p className="text-xs text-slate-500 mt-4 text-center max-w-xs">
                  <strong>优点：</strong> 即使猫的样子千奇百怪，只要数据量够大（你喂得够多），AI 都能自己学会！
                </p>
              </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default IntroSection;