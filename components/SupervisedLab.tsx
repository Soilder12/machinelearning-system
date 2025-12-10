import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, RefreshCw, BrainCircuit, Bot } from 'lucide-react';

const TRAINING_DATA = [
  { id: 1, emoji: '🍎', type: 'fruit' as const },
  { id: 2, emoji: '🐶', type: 'animal' as const },
  { id: 3, emoji: '🍌', type: 'fruit' as const },
  { id: 4, emoji: '🐱', type: 'animal' as const },
  { id: 5, emoji: '🍇', type: 'fruit' as const },
  { id: 6, emoji: '🐯', type: 'animal' as const },
  { id: 7, emoji: '🍊', type: 'fruit' as const },
  { id: 8, emoji: '🦊', type: 'animal' as const },
];

const TEST_DATA = [
  { id: 9, emoji: '🍓', type: 'fruit' as const },
  { id: 10, emoji: '🦁', type: 'animal' as const },
  { id: 11, emoji: '🍐', type: 'fruit' as const },
  { id: 12, emoji: '🦓', type: 'animal' as const },
];

const SupervisedLab: React.FC = () => {
  const [step, setStep] = useState<'training' | 'testing' | 'complete'>('training');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [lastChoice, setLastChoice] = useState<'fruit' | 'animal' | null>(null);
  const [aiConfidence, setAiConfidence] = useState(0);

  // Helper to handle the logic when a choice is made (by human or AI)
  const handleChoice = useCallback((choice: 'fruit' | 'animal') => {
    const currentItem = step === 'training' ? TRAINING_DATA[currentIndex] : TEST_DATA[currentIndex];
    
    // Guard clause if index is out of bounds
    if (!currentItem) return;

    const isCorrect = choice === currentItem.type;

    setLastChoice(choice);

    if (isCorrect) {
      setFeedback('correct');
      if (step === 'training') {
        setAiConfidence((prev) => Math.min(prev + 12.5, 100)); // 8 items to reach 100%
      }
      setScore((prev) => prev + 10);
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setLastChoice(null);

      if (step === 'training') {
        if (currentIndex < TRAINING_DATA.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setStep('testing');
          setCurrentIndex(0);
        }
      } else if (step === 'testing') {
         if (currentIndex < TEST_DATA.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setStep('complete');
        }
      }
    }, 1200);
  }, [currentIndex, step]);

  // AI Auto-play Logic during Testing Phase
  // Defined AFTER handleChoice so it can depend on it
  useEffect(() => {
    if (step === 'testing' && !feedback && currentIndex < TEST_DATA.length) {
      const currentItem = TEST_DATA[currentIndex];
      if (!currentItem) return;

      // Simulate AI "Thinking" delay
      const thinkTime = setTimeout(() => {
        // AI makes a choice (Correctly for this demo)
        handleChoice(currentItem.type);
      }, 1500);
      return () => clearTimeout(thinkTime);
    }
  }, [step, feedback, currentIndex, handleChoice]);

  const reset = () => {
    setStep('training');
    setCurrentIndex(0);
    setScore(0);
    setAiConfidence(0);
    setFeedback(null);
    setLastChoice(null);
  };

  const currentItem = step === 'training' 
    ? TRAINING_DATA[currentIndex] 
    : step === 'testing' 
      ? TEST_DATA[currentIndex] 
      : null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
        <div className="bg-green-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🏷️ 监督学习：AI 训练师
          </h2>
          <div className="bg-green-700 px-3 py-1 rounded-lg text-sm font-mono">
            得分: {score}
          </div>
        </div>

        <div className="p-8 text-center min-h-[450px] flex flex-col items-center justify-center relative">
          
          {step === 'complete' ? (
            <div className="animate-float">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">训练完成！</h3>
              <p className="text-slate-600 mb-6">
                太棒了！AI 已经学会了区分动物和水果。<br/>
                刚才的考试中，AI 全部回答正确！
              </p>
              <button 
                onClick={reset}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              >
                <RefreshCw size={20} /> 再玩一次
              </button>
            </div>
          ) : (
            <>
              {/* Top Status Bar */}
              <div className="w-full flex justify-between items-center mb-6">
                 <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  {step === 'training' ? `正在教学 (${currentIndex + 1}/${TRAINING_DATA.length})` : `AI 考试中 (${currentIndex + 1}/${TEST_DATA.length})`}
                </div>
                
                {/* AI Status Indicator */}
                {step === 'testing' && !feedback && (
                  <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-3 py-1 rounded-full animate-pulse">
                    <BrainCircuit size={16} />
                    <span className="text-xs font-bold">AI 正在思考...</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs bg-slate-200 rounded-full h-2.5 mb-8">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${step === 'testing' ? 'bg-purple-500' : 'bg-green-500'}`}
                  style={{ width: `${aiConfidence}%` }}
                ></div>
                <p className="text-xs text-slate-400 mt-1 text-right">AI 智力值</p>
              </div>

              {/* The Card */}
              <div className="relative mb-10 group">
                <div className={`w-48 h-48 bg-slate-50 rounded-3xl flex items-center justify-center text-8xl shadow-inner border-4 transition-all duration-300 ${
                  feedback === 'correct' ? 'border-green-400 bg-green-50 scale-105' : 
                  feedback === 'wrong' ? 'border-red-400 bg-red-50 shake' : 
                  step === 'testing' ? 'border-purple-200 shadow-purple-100' : 'border-slate-200'
                }`}>
                  <span className="drop-shadow-lg">{currentItem?.emoji}</span>
                </div>
                
                {/* Feedback Overlay */}
                {feedback && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-in fade-in zoom-in duration-300">
                    {feedback === 'correct' ? (
                      <CheckCircle className="text-green-500 w-24 h-24 bg-white rounded-full shadow-lg" />
                    ) : (
                      <XCircle className="text-red-500 w-24 h-24 bg-white rounded-full shadow-lg" />
                    )}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-6 w-full max-w-sm relative">
                {step === 'testing' && !feedback && (
                  <div className="absolute -top-12 left-0 right-0 text-center">
                    <span className="bg-slate-800 text-white text-xs px-3 py-1 rounded-full opacity-70">
                      请观看 AI 操作
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleChoice('fruit')}
                  disabled={!!feedback || step === 'testing'}
                  className={`py-4 rounded-xl flex flex-col items-center justify-center gap-2 border-b-4 transition-all duration-200 ${
                    lastChoice === 'fruit' 
                      ? 'bg-orange-200 border-orange-400 text-orange-800 translate-y-1' 
                      : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 active:scale-95'
                  } ${step === 'testing' ? 'cursor-default opacity-90' : ''}`}
                >
                  <span className="text-2xl">🍎</span>
                  <span className="font-bold">是水果</span>
                </button>

                <button
                  onClick={() => handleChoice('animal')}
                  disabled={!!feedback || step === 'testing'}
                  className={`py-4 rounded-xl flex flex-col items-center justify-center gap-2 border-b-4 transition-all duration-200 ${
                    lastChoice === 'animal'
                      ? 'bg-blue-200 border-blue-400 text-blue-800 translate-y-1'
                      : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 active:scale-95'
                  } ${step === 'testing' ? 'cursor-default opacity-90' : ''}`}
                >
                  <span className="text-2xl">🐶</span>
                  <span className="font-bold">是动物</span>
                </button>
              </div>

              <p className="mt-8 text-slate-500 text-sm bg-slate-50 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                {step === 'training' ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    请点击按钮，告诉 AI 这个图片是什么。
                  </>
                ) : (
                  <>
                    <Bot size={16} className="text-purple-500" />
                    AI 正在根据之前的训练进行自动分类...
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisedLab;