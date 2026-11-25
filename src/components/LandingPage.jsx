import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Search,
  Lock,
  Activity,
  Network,
  Layers,
  CheckCircle2,
  FileText,
  Zap,
  ChevronRight,
  TrendingUp,
  Cpu,
  LogIn
} from 'lucide-react';

export default function LandingPage({ onLoginClick, onDemoLogin }) {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 shadow-lg shadow-cyan-500/10">
              <img src="/securetrace.png" alt="SecureTrace Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SecureTrace
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                by SecuredApp
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#investigation" className="hover:text-cyan-400 transition-colors">Forensics Engine</a>
            <a href="#scoring" className="hover:text-cyan-400 transition-colors">Credit Scoring</a>
            <a href="#specs" className="hover:text-cyan-400 transition-colors">Enterprise API</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-cyan-400 mb-8 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Gen Autonomous Crypto Forensics & Risk Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Institutional Grade <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              On-Chain Intelligence & Fund Tracing
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Investigate hacks, track illicit asset flow with bidirectional graph analytics, evaluate wallet credit scores, and audit smart contracts in real-time. Powered by SecuredApp.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-base hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl shadow-cyan-500/25 group cursor-pointer"
            >
              Launch SecureTrace Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onDemoLogin()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 font-medium text-base transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              Explore Instant Live Preview
            </button>
          </div>

          {/* Interactive Feature Pills */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left">
              <Network className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="font-semibold text-sm text-slate-200">Txn Graph Tracing</div>
              <div className="text-xs text-slate-400 mt-1">Multi-hop bidirectional flow</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left">
              <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
              <div className="font-semibold text-sm text-slate-200">Portfolio Intelligence</div>
              <div className="text-xs text-slate-400 mt-1">DeFi asset breakdown & PnL</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-semibold text-sm text-slate-200">Wallet Credit Score</div>
              <div className="text-xs text-slate-400 mt-1">Sybil, AML & credit rating</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left">
              <Cpu className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="font-semibold text-sm text-slate-200">Contract Credit Score</div>
              <div className="text-xs text-slate-400 mt-1">Bytecode & vulnerability audit</div>
            </div>
          </div>
        </section>

        {/* Live Preview Mockup */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24">
          <div className="relative rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl shadow-blue-500/10 overflow-hidden">
            <div className="h-10 border-b border-slate-800 bg-slate-950/60 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-mono ml-2">securetrace.securedapp.io/app/investigation</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">SecuredApp Core Engine v2.4</div>
            </div>

            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6 bg-gradient-to-b from-slate-900 to-[#0c121e]">
              <div className="space-y-4">
                <div className="text-xs uppercase font-semibold tracking-wider text-slate-400">Target Investigation</div>
                <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 font-mono text-xs text-cyan-300 break-all">
                  0x38b9...e491 (Drainer Exploit)
                </div>
                <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Stolen Native:</span>
                    <span className="text-slate-100 font-semibold font-mono">148.5 BNB</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Hops Traced:</span>
                    <span className="text-cyan-400 font-semibold">4 Forward / 2 Backward</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Mixers Detected:</span>
                    <span className="text-rose-400 font-semibold">Tornado.Cash Cashier</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl bg-slate-950/80 border border-slate-800 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-semibold text-slate-300">Live Visual Transaction Graph</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ● Realtime Path Convergence
                  </span>
                </div>
                <div className="h-44 border border-dashed border-slate-800 rounded-lg flex items-center justify-center p-4 relative overflow-hidden bg-slate-900/30">
                  <div className="flex items-center justify-around w-full">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-300 text-xs font-bold">
                        Victim
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">0x4a1...9b2</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-rose-500/40 via-cyan-500/40 to-amber-500/40 mx-2 relative">
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-cyan-400 font-mono">120 ETH</span>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300 text-xs font-bold">
                        Interm.
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Split Wallet</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500/40 to-purple-500/40 mx-2 relative">
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-purple-400 font-mono">Bridge</span>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300 text-xs font-bold">
                        DEX
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">PancakeSwap</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
                  <span>Interactive node inspector enabled</span>
                  <span className="text-cyan-400 hover:underline cursor-pointer" onClick={onLoginClick}>Sign in to trace any hash →</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-20 border-t border-slate-800/80 bg-slate-950/40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">Everything You Need for Web3 Investigation & Risk</h2>
            <p className="mt-3 text-slate-400 text-base">Engineered for security analysts, Web3 protocols, compliance teams, and DeFi investigators.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Txn Graph Analysis</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Reconstruct complex hack topologies. Trace BNB, ETH, and ERC20/BEP20 token movements across infinite hops with dual priority queues.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Funds Tracing</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Forward and backward fund analysis to identify victim addresses, hacker root wallets, swap liquidity pools, and CEX deposits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Wallet Credit Score</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Instant 0-1000 reputation score based on wallet age, transaction volume, gas utilization, sanctions blacklists, and Sybil resistance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Contract Credit Score</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automated security audit ranking. Scans for reentrancy, unverified bytecode, proxy delegate vulnerabilities, and flash-loan risk.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/securetrace.png" alt="SecureTrace" className="w-5 h-5 object-contain" />
            <span className="font-semibold text-slate-300">SecureTrace</span>
            <span>— Developed by SecuredApp</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Powered By Arkham Intelligence</span>
            <span className="text-slate-500">© 2026 SecuredApp Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
