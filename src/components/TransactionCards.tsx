import React, { useState, useEffect } from 'react';

const TransactionCards: React.FC = () => {
  const [totalRequests, setTotalRequests] = useState(1002);
  const [rejectedRequests, setRejectedRequests] = useState(401);
  const [issuedCertificates, setIssuedCertificates] = useState(601);
  const [queuedRequests, setQueuedRequests] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4440/get-dashboard', {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        if (data.totalCustomers && data.totalCertIssues) {
          const total = data.totalCustomers;
          const issued = data.totalCertIssues;

          const estimatedRejected = Math.floor(total * 0.4);
          const estimatedQueued = total - issued - estimatedRejected;

          setTotalRequests(total);
          setIssuedCertificates(issued);
          setRejectedRequests(estimatedRejected);
          setQueuedRequests(estimatedQueued >= 0 ? estimatedQueued : 0);
        } else {
          console.warn('Incomplete data received. Using default values.');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to demo values (already set in useState)
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Request" value={totalRequests} />
        <MetricCard title="Requested in Queue" value={queuedRequests} />
        <MetricCard title="Rejected Request" value={rejectedRequests} />
        <MetricCard title="Certificate issued" value={issuedCertificates} />
      </div>

      <div className="flex justify-between items-center from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/20 rounded-xl px-4 py-2 mt-4">
        <span className="text-blue-400 font-medium">
          Global Network: <span className="text-blue-300">Operational</span>
        </span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1 rounded-md transition">
          Live Metrics
        </button>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-purple-200 text-sm">{title}</h3>
      <div className="w-4 h-4 bg-purple-500/50 rounded-full flex items-center justify-center">
        <span className="text-purple-200 text-xs">?</span>
      </div>
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</div>
    <div className="text-purple-300 text-sm"></div>
  </div>
);

export default TransactionCards;
