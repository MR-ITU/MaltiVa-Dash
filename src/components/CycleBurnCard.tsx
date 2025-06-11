
import React, { useState, useEffect } from 'react';

const CycleBurnCard: React.FC = () => {
  const [burnRate, setBurnRate] = useState(18789);
  const [tcycles, setTcycles] = useState(0.1604);

  useEffect(() => {
    const interval = setInterval(() => {
      setBurnRate(prev => prev + Math.floor(Math.random() * 100 - 50));
      setTcycles(prev => prev + (Math.random() - 0.5) * 0.001);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-purple-200 text-lg">Cycle Burn Rate</h3>
        <div className="w-4 h-4 bg-purple-500/50 rounded-full flex items-center justify-center">
          <span className="text-purple-200 text-xs">?</span>
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-4xl font-bold text-white">${burnRate.toLocaleString()}</span>
        <span className="text-purple-300 ml-2">per day</span>
      </div>
      
      <div className="text-purple-300">
        {tcycles.toFixed(4)} <span className="text-sm">TCYCLES/s</span>
      </div>
    </div>
  );
};

export default CycleBurnCard;
