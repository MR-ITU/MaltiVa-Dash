
import React from 'react';
import { Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-b border-purple-500/20">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">PKI</span>
          </div>
          <span className="text-white font-semibold text-lg">MultiVA</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {/* <a href="#" className="text-purple-200 hover:text-white transition-colors">Network</a>
          <a href="#" className="text-purple-200 hover:text-white transition-colors">Governance</a>
          <a href="#" className="text-purple-200 hover:text-white transition-colors">DAOs</a>
          <a href="#" className="text-purple-200 hover:text-white transition-colors">Chain Fusion</a>
          <a href="#" className="text-purple-200 hover:text-white transition-colors">Tokens</a> */}
        </nav>
      </div>
      
 
    </header>
  );
};

export default Header;
