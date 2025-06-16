import React, { useState, useEffect } from 'react';

const TransactionCards: React.FC = () => {
  // Initialize with consistent values
  const [totalRequests, setTotalRequests] = useState(1002);
  const [rejectedRequests, setRejectedRequests] = useState(401); // 40% of 1002 ≈ 401
  const [issuedCertificates, setIssuedCertificates] = useState(601); // 60% of 1002 ≈ 601
  const [queuedRequests, setQueuedRequests] = useState(2);
  
  useEffect(() => {
    // Add new requests to queue every 1-2 minutes
    const addInterval = setInterval(() => {
      const newRequests = Math.floor(Math.random() * 3) + 2; // 2-4 new requests
      setTotalRequests(prev => prev + newRequests);
      setQueuedRequests(prev => prev + newRequests);
    }, 60000 + Math.random() * 60000); // 60-120 seconds

    // Process queue every 60-80 seconds
    const processInterval = setInterval(() => {
      setQueuedRequests(prev => {
        if (prev <= 0) return 0;
        
        // Process 2-4 requests from queue
        const processCount = Math.min(prev, Math.floor(Math.random() * 3) + 2);
        
        // Calculate issued vs rejected (60% issued, 40% rejected)
        const issuedCount = Math.floor(processCount * 0.6);
        const rejectedCount = processCount - issuedCount;
        
        // Update counts with slight delay for visual effect
        setTimeout(() => {
          setIssuedCertificates(i => i + issuedCount);
          setRejectedRequests(r => r + rejectedCount);
        }, 500);
        
        return prev - processCount;
      });
    }, 60000 + Math.random() * 20000); // 60-80 seconds

    return () => {
      clearInterval(addInterval);
      clearInterval(processInterval);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Total Requests Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-purple-200 text-sm">Total Request</h3>
            <div className="w-4 h-4 bg-purple-500/50 rounded-full flex items-center justify-center">
              <span className="text-purple-200 text-xs">?</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {totalRequests.toLocaleString()}
          </div>
          <div className="text-purple-300 text-sm"></div>
        </div>

        {/* Queued Requests Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-purple-200 text-sm">Requested in Queue</h3>
            <div className="w-4 h-4 bg-purple-500/50 rounded-full flex items-center justify-center">
              <span className="text-purple-200 text-xs">?</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {queuedRequests.toLocaleString()}
          </div>
          <div className="text-purple-300 text-sm"></div>
        </div>

        {/* Rejected Requests Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-purple-200 text-sm">Rejected Request</h3>
            <div className="w-4 h-4 bg-purple-500/50 rounded-full flex items-center justify-center">
              <span className="text-purple-200 text-xs">?</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {rejectedRequests.toLocaleString()}
          </div>
          <div className="text-purple-300 text-sm"></div>
        </div>

        {/* Issued Certificates Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-purple-200 text-sm">Certificate issued</h3>
            <div className="w-4 h-4 bg-purple-500/50 rounded-full flex items-center justify-center">
              <span className="text-purple-200 text-xs"></span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {issuedCertificates.toLocaleString()}
          </div>
          <div className="text-purple-300 text-sm"></div>
        </div>
      </div>

      {/* Global Network Status Bar */}
      <div className="flex justify-between items-center from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/20 rounded-xl px-4 py-2 mt-4">
        <span className="text-blue-400 font-medium">Global Network: <span className="text-blue-300">Operational</span></span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1 rounded-md transition">
          Live Metrics
        </button>
      </div>
    </div>
  );
};

export default TransactionCards;