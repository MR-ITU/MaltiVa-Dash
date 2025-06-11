
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend = 'neutral',
  className = '' 
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-purple-300';
    }
  };

  return (
    <div className={`
      bg-gradient-to-br from-purple-900/40 to-indigo-900/40 
      backdrop-blur-md border border-purple-500/20 rounded-xl p-6
      hover:border-purple-400/40 transition-all duration-300
      ${className}
    `}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-purple-200 text-sm font-medium">{title}</h3>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-1">
        <div className={`text-2xl font-bold text-white ${getTrendColor()}`}>
          {value}
        </div>
        {subtitle && (
          <div className="text-purple-300 text-xs">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
