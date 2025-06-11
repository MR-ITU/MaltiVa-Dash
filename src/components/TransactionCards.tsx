import React, { useState, useEffect } from 'react';

const TransactionCards: React.FC = () => {
  const [ethTx, setEthTx] = useState(700812);
  const [transactions, setTransactions] = useState(9698);
  const [instructions, setInstructions] = useState(68873);

  useEffect(() => {
    const interval = setInterval(() => {
      setEthTx(prev => prev + Math.floor(Math.random() * 10));
      setTransactions(prev => prev + Math.floor(Math.random() * 5));
      setInstructions(prev => prev + Math.floor(Math.random() * 20));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Metric Cards */}
     

      {/* Global Network Status Bar */}
      <div className="flex justify-between items-center  from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/20 rounded-xl px-4 py-2 mt-4">
        <span className="text-blue-400 font-medium">Global Network: <span className="text-blue-300">Operational</span></span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1 rounded-md transition">
          Live Metrics
        </button>
      </div>
    </div>
  );
};

export default TransactionCards;
