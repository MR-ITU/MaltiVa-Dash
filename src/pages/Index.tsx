
import React from 'react';
import Header from '../components/Header';
import InteractiveGlobe from '../components/Globe';
import DecentralizationCard from '../components/DecentralizationCard';
import MetricsGrid from '../components/MetricsGrid';
import TransactionCards from '../components/TransactionCards';
import CycleBurnCard from '../components/CycleBurnCard';

const Index = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      <Header />
      
      <div className="p-6 grid grid-cols-12 gap-6 min-h-[calc(100vh-88px)]">
        {/* Left Column - Globe and Burn Rate */}
       <div className="col-span-12 lg:col-span-7 flex flex-col">
          {/* Centered Globe Container */}
          <div className="flex-1 flex items-center justify-center mb-6">
            <div className="w-full max-w-3xl h-96 lg:h-[500px] bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md rounded-xl overflow-hidden relative">
              <InteractiveGlobe 
                // locations={locations} 
                width="100%"
                height="100%"
                backgroundColor="transparent"
              />
              
              {/* Floating connection indicators */}
              <div className="absolute top-4 left-4 space-y-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    <div className="w-16 h-1 bg-gradient-to-r from-cyan-400/60 to-transparent rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Cycle Burn Rate */}
          {/* <CycleBurnCard /> */}
        </div>
        
        {/* Right Column - Stats */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <DecentralizationCard />
          <MetricsGrid />
        </div>
        
        {/* Bottom Row - Transaction Cards */}
        <div className="col-span-12">
          <TransactionCards />
        </div>
      </div>
    </div>
  );
};

export default Index;
