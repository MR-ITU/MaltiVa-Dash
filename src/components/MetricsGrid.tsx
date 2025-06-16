import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';

const MetricsGrid: React.FC = () => {
  const [globalRequests, setGlobalRequests] = useState(60760);
  const [latency, setLatency] = useState(2.4);
  const [successRate, setSuccessRate] = useState(99.8);
  const [threatsBlocked, setThreatsBlocked] = useState(128);

  useEffect(() => {
    const interval = setInterval(() => {
      // Adjusted global requests to always increase
      setGlobalRequests(prev => prev + Math.floor(Math.random() * 5) + 1);
      
      // Other metrics remain with natural fluctuations
      setLatency(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
      setSuccessRate(prev => +(Math.min(100, Math.max(98.5, prev + (Math.random() * 0.1 - 0.05))).toFixed(2)));
      setThreatsBlocked(prev => Math.max(0, prev + Math.floor(Math.random() * 5 - 2)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* <StatCard
        title="Global Requests"
        value={globalRequests.toLocaleString()}
        className="col-span-1"
      /> */}

      <StatCard
        title="Avg. Latency"
        value={`${latency.toFixed(2)}s`}
        className="col-span-1"
      />

      <StatCard
        title="Success Rate"
        value={`${successRate.toFixed(2)}%`}
        className="col-span-1"
      />

      <StatCard
        title="Threats Blocked"
        value={threatsBlocked.toLocaleString()}
        className="col-span-1"
      />
    </div>
  );
};

export default MetricsGrid;