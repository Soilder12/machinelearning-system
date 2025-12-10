import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Zap, Trophy, Flame } from 'lucide-react';

const GRID_SIZE = 5;

// 0: Empty, 1: Wall, 2: Start, 3: Goal, 4: Hazard
const INITIAL_GRID = [
  [2, 0, 0, 4, 0],
  [0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 4, 1, 4],
  [0, 0, 0, 0, 3],
];

const ReinforcementLab: React.FC = () => {
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [episode, setEpisode] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("准备开始训练...");
  
  // Simulated Q-Table quality (0 to 1)
  const [intelligence, setIntelligence] = useState(0);

  const resetRobot = () => setRobotPos({ x: 0, y: 0 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runEpisode = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setEpisode(e => e + 1);
    setMessage("探索中...");
    
    let currentX = 0;
    let currentY = 0;
    resetRobot();
    
    // Allow up to 20 steps
    for (let i = 0; i < 20; i++) {
      await sleep(200);

      // Simple AI Logic:
      // If intelligence is low, move random.
      // If intelligence is high, move towards goal (4,4).
      
      const moves = [
        { dx: 0, dy: -1 }, // Up
        { dx: 0, dy: 1 },  // Down
        { dx: -1, dy: 0 }, // Left
        { dx: 1, dy: 0 }   // Right
      ];

      // Decide next move
      let move;
      if (Math.random() < intelligence) {
        // Smart move: try to reduce distance to (4,4)
        // This simulates a trained policy
        const validMoves = moves.filter(m => {
            const nx = currentX + m.dx;
            const ny = currentY + m.dy;
            return nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && INITIAL_GRID[ny][nx] !== 1;
        });
        
        // Pick move that gets closer to 4,4
        validMoves.sort((a, b) => {
            const distA = Math.abs((currentX + a.dx) - 4) + Math.abs((currentY + a.dy) - 4);
            const distB = Math.abs((currentX + b.dx) - 4) + Math.abs((currentY + b.dy) - 4);
            return distA - distB;
        });
        move = validMoves[0] || moves[Math.floor(Math.random() * moves.length)];

      } else {
        // Random move (Exploration)
        move = moves[Math.floor(Math.random() * moves.length)];
      }

      const nextX = currentX + move.dx;
      const nextY = currentY + move.dy;

      // Check Bounds & Walls
      if (nextX >= 0 && nextX < GRID_SIZE && nextY >= 0 && nextY < GRID_SIZE && INITIAL_GRID[nextY][nextX] !== 1) {
        currentX = nextX;
        currentY = nextY;
        setRobotPos({ x: currentX, y: currentY });

        // Check Outcomes
        const cellType = INITIAL_GRID[nextY][nextX];
        
        if (cellType === 3) { // Goal
          setMessage("🎉 成功！获得奖励！");
          setIntelligence(prev => Math.min(prev + 0.3, 0.95)); // Learn a lot
          await sleep(500);
          break;
        } else if (cellType === 4) { // Hazard
          setMessage("🔥 糟糕！受到惩罚！");
           // Learn a little even from failure
          break;
        }
      }
    }
    
    setIsRunning(false);
    // Slowly increase smarts anyway simply by "trying"
    setIntelligence(prev => Math.min(prev + 0.05, 0.95));
  }, [intelligence, isRunning]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
        <div className="bg-red-500 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🍖 强化学习：机器狗特训
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm bg-red-600 px-3 py-1 rounded">
              训练次数: {episode}
            </div>
            <div className="text-sm bg-red-600 px-3 py-1 rounded flex items-center gap-1">
              <BrainIcon className="w-4 h-4" /> 
              智商: {Math.round(intelligence * 100)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          
          {/* The Grid */}
          <div className="aspect-square bg-slate-100 rounded-xl p-2 grid grid-cols-5 grid-rows-5 gap-1 shadow-inner relative">
            {INITIAL_GRID.map((row, y) => (
              row.map((cell, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`rounded-lg flex items-center justify-center text-2xl relative
                    ${cell === 1 ? 'bg-slate-800' : 'bg-white'}
                    ${cell === 3 ? 'bg-yellow-100' : ''}
                    ${cell === 4 ? 'bg-orange-100' : ''}
                  `}
                >
                  {cell === 1 && '🧱'}
                  {cell === 3 && '🍖'}
                  {cell === 4 && '🔥'}
                  
                  {/* Robot */}
                  {robotPos.x === x && robotPos.y === y && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 animate-bounce">
                      🤖
                    </div>
                  )}
                </div>
              ))
            ))}
          </div>

          {/* Controls & Logs */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              <div className="text-4xl mb-4">
                {message.includes("成功") ? "😋" : message.includes("糟糕") ? "😵" : "🤖"}
              </div>
              <p className="text-lg font-bold text-slate-700">{message}</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={runEpisode}
                disabled={isRunning}
                className="w-full py-4 bg-red-500 text-white rounded-xl font-bold text-lg hover:bg-red-600 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRunning ? '训练中...' : '▶️ 开始一次训练 (Episode)'}
              </button>
              
              <button 
                onClick={() => {
                  setIntelligence(0);
                  setEpisode(0);
                  resetRobot();
                  setMessage("记忆已清除");
                }}
                disabled={isRunning}
                className="w-full py-2 text-slate-500 hover:bg-slate-100 rounded-lg transition text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> 重置大脑
              </button>
            </div>

            <div className="text-sm text-slate-500 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
               <strong>观察：</strong> 刚开始机器人会乱撞墙（试错）。随着训练次数增加，它会记住哪里有火（惩罚），哪里有肉骨头（奖励），走得越来越快！
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const BrainIcon = ({className}: {className?: string}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
)

export default ReinforcementLab;