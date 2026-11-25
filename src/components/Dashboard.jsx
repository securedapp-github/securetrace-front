import React, { useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  Network,
  Award,
  Cpu,
  LogOut,
  User,
  Bell,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Database
} from 'lucide-react';
import PortfolioTab from './tabs/PortfolioTab.jsx';
import InvestigationTab from './tabs/InvestigationTab.jsx';
import WalletScoreTab from './tabs/WalletScoreTab.jsx';
import ContractScoreTab from './tabs/ContractScoreTab.jsx';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('investigation');

  const navItems = [
    { id: 'investigation', label: 'Crypto Investigation', sublabel: 'Txn Graph & Funds Tracing', icon: Network, badge: 'Live' },
    { id: 'portfolio', label: 'Portfolio Intelligence', sublabel: 'Holdings & Multi-chain PnL', icon: Wallet },
    { id: 'walletScore', label: 'Wallet Credit Score', sublabel: 'AML & 0-1000 Risk Index', icon: Award },
    { id: 'contractScore', label: 'Contract Credit Score', sublabel: 'Smart Contract Audit Grade', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-[#0B0F19]/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/10">
              <img src="/securetrace.png" alt="SecureTrace Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">SecureTrace</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  By SecureDApp
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Institutional On-Chain Risk & Forensics</p>
            </div>
          </div>

          {/* Right Header Controls & User Pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Staus: Active</span>
            </div>

            {/* Profile Pill */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <img
                src={user?.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.email || 'user')}`}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full ring-2 ring-cyan-500/30 object-cover bg-slate-800"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">
                  {user?.name || 'Investigator'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {user?.email || 'authenticated'}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Tab Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40 sticky top-18 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <div className="font-semibold">{item.label}</div>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'investigation' && <InvestigationTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'walletScore' && <WalletScoreTab />}
        {activeTab === 'contractScore' && <ContractScoreTab />}
      </main>

      {/* Bottom Status Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src="/securetrace.png" alt="SecureTrace" className="w-4 h-4 object-contain" />
            <span className="font-semibold text-slate-300">SecureTrace Core Engine</span>
            <span>• GraphQL Engine API</span>
            <span>• Google SSO session verified</span>
          </div>
          <div>
            Built for SecuredApp Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
