import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Gamepad2, Heart } from 'lucide-react';

// 16x16 Pixel Art Patterns
// 0: Empty/Background
// 1: Primary Color
const ART_PATTERNS = {
  cat: [
    "0000000000000000",
    "0000000000000000",
    "0010000000010000",
    "0111000000111000",
    "0111100001111100",
    "1111111111111110",
    "1111111111111110",
    "1100111111110010", 
    "1100111111110010",
    "1111110011111110",
    "1111111111111110",
    "0111111111111100",
    "0011110011111000",
    "0001111111110000",
    "0000000000000000",
    "0000000000000000"
  ],
  creeper: [
    "0000000000000000",
    "0000000000000000",
    "0001111111111000",
    "0001111111111000",
    "0001100111001000",
    "0001100111001000",
    "0001111111111000",
    "0001110001111000",
    "0001110001111000",
    "0001111011111000",
    "0001111111111000",
    "0001111111111000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000"
  ],
  sword: [
    "0000000000000110",
    "0000000000001110",
    "0000000000011000",
    "0000000000110000",
    "0000000001100000",
    "0000000011000000",
    "0000000110000000",
    "0000001100000000",
    "0001011000000000",
    "0011110000000000",
    "0001010000000000",
    "0010001000000000",
    "0100000100000000",
    "1000000010000000",
    "0000000000000000",
    "0000000000000000"
  ],
  heart: [
    "0000000000000000",
    "0000000000000000",
    "0000000000000000",
    "0001100000011000",
    "0011110000111100",
    "0011111001111100",
    "0011111111111100",
    "0011111111111100",
    "0001111111111000",
    "0000111111110000",
    "0000011111100000",
    "0000001111000000",
    "0000000110000000",
    "0000000000000000",
    "0000000000000000",
    "0000000000000000"
  ],
  rocket: [
    "0000000000000000",
    "0000000010000000",
    "0000000111000000",
    "0000000111000000",
    "0000001111100000",
    "0000001111100000",
    "0000001111100000",
    "0000001101100000",
    "0000011101110000",
    "0000111101111000",
    "0000111101111000",
    "0000111111111000",
    "0000011111110000",
    "0000001111100000",
    "0000000101000000",
    "0000000101000000"
  ],
};

const COLORS = {
  cat: '#f97316', // Orange
  creeper: '#22c55e', // Minecraft Green
  sword: '#06b6d4', // Diamond Blue
  heart: '#ef4444', // Red
  rocket: '#3b82f6', // Blue
  noise: ['#94a3b8', '#cbd5e1', '#64748b', '#e2e8f0'] // Greys for noise
};

export default function GenerativeLab() {
  const [prompt, setPrompt] = useState<keyof typeof ART_PATTERNS | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0); // 0 to 20
  const [grid, setGrid] = useState<string[][]>([]);

  // Initialize noise grid
  useEffect(() => {
    generateNoise();
  }, []);

  const generateNoise = () => {
    const newGrid = [];
    for (let y = 0; y < 16; y++) {
      const row = [];
      for (let x = 0; x < 16; x++) {
        row.push(COLORS.noise[Math.floor(Math.random() * COLORS.noise.length)]);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  const startGeneration = (selectedPrompt: keyof typeof ART_PATTERNS) => {
    if (isGenerating) return;
    setPrompt(selectedPrompt);
    setIsGenerating(true);
    setStep(0);
    generateNoise(); // Reset to noise first
  };

  useEffect(() => {
    if (!isGenerating || !prompt) return;

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= 20) {
          setIsGenerating(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });

      setGrid((prevGrid) => {
        const newGrid = [...prevGrid.map(row => [...row])]; // Deep copy
        const targetPattern = ART_PATTERNS[prompt];
        const targetColor = COLORS[prompt];
        
        // Update a percentage of pixels based on the step
        for (let y = 0; y < 16; y++) {
          for (let x = 0; x < 16; x++) {
            // Probability of showing the true pixel increases with step
            if (Math.random() < (step + 1) / 20) {
              const char = targetPattern[y][x];
              if (char === '0') {
                 newGrid[y][x] = '#ffffff'; // White background
              } else if (char === '1') {
                 newGrid[y][x] = targetColor;
              }
            } else {
               // Keep noise or regenerate noise for "flux" effect
               if (Math.random() > 0.5) {
                 newGrid[y][x] = COLORS.noise[Math.floor(Math.random() * COLORS.noise.length)];
               }
            }
          }
        }
        return newGrid;
      });

    }, 200); // Speed of generation

    return () => clearInterval(interval);
  }, [isGenerating, prompt, step]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🎨 生成式 AI：梦想画师
          </h2>
          <div className="bg-indigo-700 px-3 py-1 rounded-lg text-sm font-mono flex items-center gap-2">
            <Sparkles size={14} />
            {isGenerating ? `生成中... ${Math.round((step / 20) * 100)}%` : '准备就绪'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          
          {/* Canvas Area */}
          <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 bg-slate-100 border-4 border-slate-200 shadow-inner rounded-xl overflow-hidden p-1">
               {/* Grid Renderer */}
               <div 
                 className="w-full h-full grid gap-[1px] bg-slate-200"
                 style={{ 
                   gridTemplateColumns: 'repeat(16, 1fr)', 
                   gridTemplateRows: 'repeat(16, 1fr)' 
                 }}
               >
                  {grid.map((row, y) => (
                    row.map((color, x) => (
                      <div 
                        key={`${x}-${y}`} 
                        className="w-full h-full transition-colors duration-200"
                        style={{ backgroundColor: color }}
                      />
                    ))
                  ))}
               </div>
               
               {/* Label Overlay */}
               {isGenerating && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full backdrop-blur-md text-sm font-bold animate-pulse">
                      去噪中...
                    </span>
                 </div>
               )}
            </div>
            <p className="text-slate-400 text-xs mt-3">
              像素分辨率: 16x16 | 扩散步数: 20
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Wand2 className="text-indigo-500" />
                输入提示词 (Prompt):
              </h3>
              
              <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2">
                
                {/* Cat */}
                <button 
                  onClick={() => startGeneration('cat')}
                  disabled={isGenerating}
                  className="p-3 text-left rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50"
                >
                  <span className="text-2xl">🐱</span>
                  <div>
                    <div className="font-bold text-slate-700">画一只橘猫</div>
                    <div className="text-xs text-slate-400">Orange cat face, pixel art</div>
                  </div>
                </button>

                {/* Creeper */}
                <button 
                  onClick={() => startGeneration('creeper')}
                  disabled={isGenerating}
                  className="p-3 text-left rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50"
                >
                  <span className="text-2xl text-green-600"><Gamepad2 /></span>
                  <div>
                    <div className="font-bold text-slate-700">画一个像素怪物</div>
                    <div className="text-xs text-slate-400">Green blocky monster face</div>
                  </div>
                </button>

                {/* Sword */}
                <button 
                  onClick={() => startGeneration('sword')}
                  disabled={isGenerating}
                  className="p-3 text-left rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50"
                >
                  <span className="text-2xl">⚔️</span>
                  <div>
                    <div className="font-bold text-slate-700">画一把勇者之剑</div>
                    <div className="text-xs text-slate-400">Diamond sword, blue</div>
                  </div>
                </button>

                {/* Heart */}
                <button 
                  onClick={() => startGeneration('heart')}
                  disabled={isGenerating}
                  className="p-3 text-left rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50"
                >
                  <span className="text-2xl text-red-500"><Heart /></span>
                  <div>
                    <div className="font-bold text-slate-700">画一个爱心</div>
                    <div className="text-xs text-slate-400">Red heart shape</div>
                  </div>
                </button>

                {/* Rocket */}
                <button 
                  onClick={() => startGeneration('rocket')}
                  disabled={isGenerating}
                  className="p-3 text-left rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center gap-3 disabled:opacity-50"
                >
                  <span className="text-2xl">🚀</span>
                  <div>
                    <div className="font-bold text-slate-700">画一艘火箭</div>
                    <div className="text-xs text-slate-400">Space rocket, taking off</div>
                  </div>
                </button>

              </div>
            </div>

            <div className="text-sm text-slate-500 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
               <strong>原理小知识：</strong> 生成式 AI (如 Midjourney) 并不是从头开始画画，而是从一堆像“电视雪花”一样的噪点中，慢慢把图像“变”清晰。这个过程叫做<b>“扩散模型”</b>。
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}