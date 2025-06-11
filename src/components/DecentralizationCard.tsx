 import React from 'react';

const DecentralizationCard: React.FC = () => {
  const counterNames = ['USA', 'Germany', 'Japan', 'Brazil', 'India'];

  return (
    <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md border border-purple-500/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">Decentralization</h2>
        {/* <div className="flex space-x-1">
          <button className="w-6 h-6 bg-purple-600/50 rounded border border-purple-400/30 flex items-center justify-center text-purple-200 text-xs">.</button>
          <button className="w-6 h-6 bg-purple-600/50 rounded border border-purple-400/30 flex items-center justify-center text-purple-200 text-xs">.</button>
          <button className="w-6 h-6 bg-purple-600/50 rounded border border-purple-400/30 flex items-center justify-center text-purple-200 text-xs">.</button>
          <button className="w-6 h-6 bg-purple-600/50 rounded border border-purple-400/30 flex items-center justify-center text-purple-200 text-xs">.</button>
        </div> */}
      </div>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-purple-300 text-sm">MultiVA in 5 Countries</span>
          <span className="text-purple-400">→</span>
        </div>
        <div className="text-6xl font-bold text-white mb-2">5</div>
      </div>

    {/* Pulse indicators with country names */}
<div className="grid grid-cols-5 gap-1 mb-4">
  {counterNames.map((name, i) => (
    <div key={i} className="flex flex-col items-center space-y-1">
      <div
        className="w-4 h-4 bg-cyan-400 rounded-sm animate-pulse"
        style={{ animationDelay: `${i * 0.1}s` }}
      ></div>
      <span className="text-xs text-purple-200">{name}</span>
    </div>
  ))}
</div>

    </div>
  );
};

export default DecentralizationCard;
