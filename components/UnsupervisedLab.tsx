import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Play } from 'lucide-react';

interface Item {
  id: number;
  emoji: string;
  category: 'food' | 'clothing' | 'vehicle';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

const EMOJIS = {
  food: ['🍕', '🍔', '🍟', '🌭', '🥪'],
  clothing: ['👕', '👖', '👗', '🧥', '👚'],
  vehicle: ['🚗', '🚕', '🚙', '🚌', '🏎️']
};

const UnsupervisedLab: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<'scrambled' | 'clustering' | 'clustered'>('scrambled');
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize random items
  useEffect(() => {
    generateItems();
  }, []);

  const generateItems = () => {
    const newItems: Item[] = [];
    let idCounter = 0;
    
    // Create 15 items (5 of each)
    (['food', 'clothing', 'vehicle'] as const).forEach(cat => {
      for (let i = 0; i < 5; i++) {
        newItems.push({
          id: idCounter++,
          emoji: EMOJIS[cat][i],
          category: cat,
          x: Math.random() * 80 + 10, // 10-90%
          y: Math.random() * 80 + 10,
          targetX: 0, 
          targetY: 0
        });
      }
    });
    setItems(newItems);
    setStatus('scrambled');
  };

  const startClustering = () => {
    setStatus('clustering');
    
    // Calculate target positions based on categories (Clusters)
    // Cluster 1 (Food): Top Left
    // Cluster 2 (Clothing): Top Right
    // Cluster 3 (Vehicle): Bottom Center
    const updatedItems = items.map(item => {
      let tx = 0, ty = 0;
      // Add some randomness so they don't stack perfectly
      const randomOffset = () => (Math.random() - 0.5) * 15;

      if (item.category === 'food') {
        tx = 25 + randomOffset();
        ty = 30 + randomOffset();
      } else if (item.category === 'clothing') {
        tx = 75 + randomOffset();
        ty = 30 + randomOffset();
      } else {
        tx = 50 + randomOffset();
        ty = 75 + randomOffset();
      }

      return { ...item, targetX: tx, targetY: ty };
    });

    setItems(updatedItems);

    setTimeout(() => {
      setStatus('clustered');
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
        <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🔍 无监督学习：自动整理大师
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={generateItems}
              disabled={status === 'clustering'}
              className="p-2 bg-purple-700 rounded-lg hover:bg-purple-800 disabled:opacity-50"
              title="打乱"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={startClustering}
              disabled={status !== 'scrambled'}
              className="px-4 py-2 bg-yellow-400 text-purple-900 font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Play size={18} /> 开始聚类
            </button>
          </div>
        </div>

        <div className="relative h-[500px] bg-slate-50 overflow-hidden" ref={containerRef}>
          {/* Cluster Labels (Only visible after clustering) */}
          <div className={`absolute top-[20%] left-[25%] -translate-x-1/2 transition-opacity duration-1000 ${status === 'clustered' ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-48 h-48 border-2 border-dashed border-red-300 rounded-full flex items-center justify-center bg-red-50/50">
              <span className="text-red-300 font-bold text-xl uppercase mt-20">群组 A</span>
            </div>
          </div>
          <div className={`absolute top-[20%] right-[25%] translate-x-1/2 transition-opacity duration-1000 ${status === 'clustered' ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-48 h-48 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center bg-blue-50/50">
              <span className="text-blue-300 font-bold text-xl uppercase mt-20">群组 B</span>
            </div>
          </div>
          <div className={`absolute bottom-[15%] left-[50%] -translate-x-1/2 transition-opacity duration-1000 ${status === 'clustered' ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-48 h-48 border-2 border-dashed border-green-300 rounded-full flex items-center justify-center bg-green-50/50">
              <span className="text-green-300 font-bold text-xl uppercase mt-20">群组 C</span>
            </div>
          </div>

          {/* Items */}
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute text-3xl transition-all duration-[2000ms] ease-in-out cursor-pointer hover:scale-125"
              style={{
                left: `${status === 'scrambled' ? item.x : item.targetX}%`,
                top: `${status === 'scrambled' ? item.y : item.targetY}%`,
                transform: 'translate(-50%, -50%)' // Center the emoji
              }}
            >
              {item.emoji}
            </div>
          ))}

          {status === 'scrambled' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-slate-400 bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm">
                所有物品都乱了！点击“开始聚类”让 AI 自动找规律。
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm text-slate-600 text-sm">
        <strong>原理：</strong> 这里没有人告诉 AI 什么是“衣服”或“食物”。AI 只是通过计算物品之间的<b>相似度</b>（比如形状、用途），自动把相似的东西放在一起。这就是“聚类”。
      </div>
    </div>
  );
};

export default UnsupervisedLab;