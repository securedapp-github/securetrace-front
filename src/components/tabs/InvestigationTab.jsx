import React, { useState, useEffect, useRef } from 'react';
import {
  Network,
  Search,
  Zap,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Share2,
  Download,
  Play,
  FileCode,
  ShieldCheck,
  Coins,
  Crosshair,
  UserCheck,
  Flame,
  HelpCircle,
  Tag,
  Clock,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  GitBranch,
  Radar,
  SplitSquareHorizontal,
  LogOut,
  Loader2,
  RefreshCw
} from 'lucide-react';
import FundFlowGraph from '../FundFlowGraph';
import HackForensicCard from '../HackForensicCard';

export default function InvestigationTab() {
  const [txHash, setTxHash] = useState('0xb8502e9fd5f5737de0f3e3139be8df8fcd6e7fa6e43b5ff05c27dcaa57b81eee'); // PancakeBunny BSC Exploit
  const [chain, setChain] = useState('56'); // BSC Chain ID 56
  const [tracingDepth, setTracingDepth] = useState('3');
  const [maxWallets, setMaxWallets] = useState('20');
  const [forwardPeriodSec, setForwardPeriodSec] = useState('172800'); // Default 2 days = 172800s
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [whitelistedAssets, setWhitelistedAssets] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('summary');

  // Advanced trace polling state
  const [traceData, setTraceData] = useState(null);
  const [tracePolling, setTracePolling] = useState(false);
  const tracePollerRef = useRef(null);

  // Poll for advanced fund trace (runs in background after primary analysis)
  const startTracePolling = (caseId) => {
    if (tracePollerRef.current) clearInterval(tracePollerRef.current);
    setTracePolling(true);
    setTraceData(null);
    let attempts = 0;
    const MAX_ATTEMPTS = 40; // 40 × 15s = 10 min max

    tracePollerRef.current = setInterval(async () => {
      attempts++;
      try {
        const token = localStorage.getItem('securetrace_token');
        const res = await fetch(`/api/analysis/trace/${caseId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const json = await res.json();
        if (json.success && json.traceReady && json.trace) {
          setTraceData(json.trace);
          setTracePolling(false);
          clearInterval(tracePollerRef.current);
        } else if (attempts >= MAX_ATTEMPTS) {
          setTracePolling(false);
          clearInterval(tracePollerRef.current);
        }
      } catch {
        if (attempts >= MAX_ATTEMPTS) {
          setTracePolling(false);
          clearInterval(tracePollerRef.current);
        }
      }
    }, 15000); // poll every 15s
  };

  useEffect(() => {
    return () => { if (tracePollerRef.current) clearInterval(tracePollerRef.current); };
  }, []);

  // Fetch Whitelisted Assets for the chain
  useEffect(() => {
    fetch(`/api/whitelisted-assets?chainId=${chain}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.assets) {
          setWhitelistedAssets(data.assets);
        }
      })
      .catch(() => {
        setWhitelistedAssets([
          { symbol: 'BNB', name: 'Native BNB', is_native: true },
          { symbol: 'USDT', name: 'Tether USD', token_address: '0x55d398326f99059ff775485246999027b3197955' },
        ]);
      });
  }, [chain]);

  // Execute Primary Transaction Analysis API call
  const handleRunAnalysis = async () => {
    if (!txHash || !txHash.startsWith('0x') || txHash.trim().length !== 66) {
      setErrorMsg('Please enter a valid 66-character EVM transaction hash (starting with 0x).');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem('securetrace_token');
      const response = await fetch('/api/analysis/primary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          txHash: txHash.trim(),
          chainId: parseInt(chain, 10),
          depth: parseInt(tracingDepth, 10),
          maxWallets: parseInt(maxWallets, 10) || 20,
          forwardPeriodSec: parseInt(forwardPeriodSec, 10) || 172800,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setAnalysisData(json.data);
        // Start polling for advanced fund trace if depth > 1
        if (parseInt(tracingDepth, 10) > 1 && json.data.caseId) {
          startTracePolling(json.data.caseId);
        }
      } else {
        setErrorMsg(json.message || 'Transaction analysis failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error connecting to backend API: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            Crypto Forensics: Primary Transaction Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            RPC-driven transaction dissection with Onchain batch address tags and DB whitelisted asset filtering.
          </p>
        </div>

        {/* Whitelisted Assets Tag Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-amber-400" /> Filtered Whitelist:
          </span>
          {whitelistedAssets.map((w, idx) => (
            <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-cyan-300 font-mono">
              {w.symbol}
            </span>
          ))}
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-4 relative">
          <label className="text-[11px] font-semibold uppercase text-slate-400 mb-1 block">
            Transaction Hash (e.g. PancakeBunny Hack)
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-[11px] font-semibold uppercase text-slate-400 mb-1 block">Blockchain</label>
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="56">BSC (Chain ID 56)</option>
            <option value="1">Ethereum (Chain ID 1)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-[11px] font-semibold uppercase text-slate-400 mb-1 block">Tracing Depth</label>
          <select
            value={tracingDepth}
            onChange={(e) => setTracingDepth(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="1">1 Hop (Primary)</option>
            <option value="2">2 Hops</option>
            <option value="3">3 Hops (Standard)</option>
            <option value="5">5 Hops (Deep)</option>
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="text-[11px] font-semibold uppercase text-slate-400 mb-1 block" title="Maximum unique wallets to investigate in multi-hop trace">
            Wallets
          </label>
          <select
            value={maxWallets}
            onChange={(e) => setMaxWallets(e.target.value)}
            className="w-full py-2.5 px-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="text-[11px] font-semibold uppercase text-slate-400 mb-1 block" title="Forward time window to search logs">
            Window
          </label>
          <select
            value={forwardPeriodSec}
            onChange={(e) => setForwardPeriodSec(e.target.value)}
            className="w-full py-2.5 px-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="3600">1h</option>
            <option value="21600">6h</option>
            <option value="86400">1d</option>
            <option value="172800">2d</option>
            <option value="604800">7d</option>
          </select>
        </div>

        <div className="md:col-span-2 flex items-end">
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isAnalyzing ? (
              <>
                <Zap className="w-3.5 h-3.5 animate-spin" />
                Querying RPC...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Analyze Txn
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ─── PRIMARY TRANSACTION ANALYSIS SECTION ─── */}
      {analysisData ? (
        <div className="space-y-6">
          {/* Header Summary Dossier */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#101726] border border-cyan-500/30 shadow-xl shadow-cyan-500/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {analysisData.caseId}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Chain: {analysisData.chainName} ({analysisData.chainId})
                  </span>

                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300">
                    RPC Native Direct
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Primary Transaction Analysis Dossier</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${analysisData.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {analysisData.status}
                  </span>
                </h3>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Total Drain from Victim</div>
                <div className="text-base sm:text-lg font-bold font-mono text-rose-400">
                  {analysisData.drainedSummary?.netDrainedEstimate ||
                    (analysisData.drainedSummary?.bnbDrained ? `${analysisData.drainedSummary.bnbDrained} BNB` : '0')}
                </div>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Block & Time</div>
                <div className="text-xs font-mono font-bold text-white mt-1">#{analysisData.blockNumber || 'N/A'}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{analysisData.timestamp || 'N/A'}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Gas Used / TX Fee</div>
                <div className="text-xs font-mono font-bold text-white mt-1">{analysisData.gasUsed}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{analysisData.txFee} BNB fee</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Function Called</div>
                <div className="text-xs font-semibold text-cyan-400 mt-1 truncate" title={analysisData.functionCalled}>
                  {analysisData.functionCalled}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">{analysisData.selector || '0x'}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Interacted With</div>
                <div className="text-xs font-semibold text-white mt-1">
                  {analysisData.isReceiverContract ? 'Smart Contract' : 'EOA Wallet'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono truncate">{analysisData.receiver}</div>
              </div>
            </div>
          </div>

          {/* AI Hack Incident Root Cause Forensics Banner */}
          {analysisData.hackAnalysis && (
            <HackForensicCard hackAnalysis={analysisData.hackAnalysis} />
          )}

          {/* Sub Navigation Bar for Sections */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveSubTab('summary')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${activeSubTab === 'summary' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
            >
              Parties (Victims & Attackers)
            </button>
            <button
              onClick={() => setActiveSubTab('movement')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${activeSubTab === 'movement' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
            >
              Movement Map ({analysisData.movementMap?.length || 0})
            </button>
            <button
              onClick={() => setActiveSubTab('contracts')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${activeSubTab === 'contracts' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
            >
              Intermediate Contracts ({analysisData.intermediateContracts?.length || 0})
            </button>
            <button
              onClick={() => setActiveSubTab('labels')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${activeSubTab === 'labels' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
            >
              Web3 Address Labels ({analysisData.addressTags?.length || 0})
            </button>
            {parseInt(tracingDepth, 10) > 1 && (
              <button
                onClick={() => setActiveSubTab('fundtrace')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'fundtrace' ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
              >
                {tracePolling
                  ? <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
                  : <GitBranch className="w-3 h-3" />
                }
                Fund Trace Graph
                {tracePolling && <span className="text-[10px] text-violet-300 ml-1">Running…</span>}
                {traceData && <span className="text-[10px] text-emerald-300 ml-1">✓ Ready</span>}
              </button>
            )}
          </div>

          {/* TAB 1: Victims & Attackers */}
          {activeSubTab === 'summary' && (
            <div className="space-y-6">
              {/* Core Forensic Parties: Victims & Attackers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Victims Card */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      Part A · Victim Wallets (Net Whitelisted Loss)
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                      Outflow &gt; Inflow
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Wallets and vaults that suffered net losses of native BNB or whitelisted tokens.
                  </p>

                  <div className="space-y-2.5">
                    {analysisData.victims && analysisData.victims.length > 0 ? (
                      analysisData.victims.map((v, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                          <div className="overflow-hidden mr-2">
                            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                              <span>{v.role}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">{v.kind}</span>
                            </div>
                            <div className="text-[11px] font-mono text-rose-400 truncate mt-0.5">{v.address}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold font-mono text-rose-400">-{v.netLoss}</div>
                            <div className="text-[10px] text-slate-400">Drained</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-400">
                        No clear victim wallet registered net whitelisted losses in this tx.
                      </div>
                    )}
                  </div>
                </div>

                {/* Attackers / Beneficiaries Card */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-cyan-400" />
                      Part B · Attacker & Suspected Wallets
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                      Inflow &gt; Outflow
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Wallets and suspect beneficiaries that accrued net whitelisted assets.
                  </p>

                  <div className="space-y-2.5">
                    {analysisData.attackers && analysisData.attackers.length > 0 ? (
                      analysisData.attackers.map((atk, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                          <div className="overflow-hidden mr-2">
                            <div className="text-xs font-semibold text-white flex items-center gap-2">
                              <span>{atk.role}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">{atk.kind}</span>
                            </div>
                            <div className="text-[11px] font-mono text-cyan-400 truncate mt-0.5">{atk.address}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold font-mono text-emerald-400">+{atk.gain}</div>
                            <div className="text-[10px] text-slate-400">Net Gain</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-400">
                        No beneficiary net gains identified.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Assets Array & Initial Destinations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Assets */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    Active Assets Array (Whitelisted Tokens Involved)
                  </h4>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {analysisData.activeAssets && analysisData.activeAssets.length > 0 ? (
                      analysisData.activeAssets.map((asset, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">{asset.name}</span>
                            <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10">
                              {asset.symbol}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Transfer Events: <span className="text-white font-mono font-semibold">{asset.movesCount}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 truncate mt-1">
                            {asset.token_address}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-xs text-slate-400">No whitelisted assets involved.</div>
                    )}
                  </div>
                </div>

                {/* Part D: Initial Destination Wallets */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    Part D · Attacker Destination Wallets
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    First recipient addresses for each asset event.
                  </p>
                  <div className="space-y-2.5">
                    {analysisData.initialDestinations && analysisData.initialDestinations.length > 0 ? (
                      analysisData.initialDestinations.map((d, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="overflow-hidden mr-2">
                            <div className="text-xs font-semibold text-white">{d.asset}</div>
                            <div className="text-[11px] font-mono text-cyan-400 truncate">{d.addr}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-mono font-bold text-slate-200">{d.humanAmount}</div>
                            <div className="text-[10px] text-slate-500">Log #{d.logIndex}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400">None detected.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Full Token & Native Coin Movement Map */}
          {activeSubTab === 'movement' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Part E · Token & Native Coin Movement Map (Chronological)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Every whitelisted asset transfer decoded from RPC transaction receipts and event logs.
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  Total Moves: {analysisData.movementMap?.length || 0}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Asset</th>
                      <th className="py-2.5 px-3">From Address</th>
                      <th className="py-2.5 px-3">To Address</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {analysisData.movementMap && analysisData.movementMap.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 text-slate-500 font-sans">{m.idx}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold">
                            {m.asset}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-300 truncate max-w-[200px]" title={m.from}>{m.from}</td>
                        <td className="py-2 px-3 text-cyan-400 truncate max-w-[200px]" title={m.to}>{m.to}</td>
                        <td className="py-2 px-3 text-right font-bold text-white">{m.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Intermediate Contracts */}
          {activeSubTab === 'contracts' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                Part C · Intermediate Contracts & Verified Source Code
              </h4>
              <div className="space-y-4">
                {analysisData.intermediateContracts && analysisData.intermediateContracts.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{c.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{c.role}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${c.verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                            {c.verified ? '✓ Verified on BSCScan' : 'Unverified Bytecode'}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-cyan-400 mt-1">{c.address}</div>
                      </div>
                      <div className="text-xs text-slate-400">
                        <div>Compiler: <span className="font-mono text-slate-300">{c.compiler}</span></div>
                      </div>
                    </div>
                    {c.sourceSnippet && (
                      <div className="p-3 rounded-lg bg-[#070a11] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Source Snippet:</div>
                        <pre className="whitespace-pre-wrap">{c.sourceSnippet}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Bitquery Address Labels */}
          {activeSubTab === 'labels' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    Consolidated Address Tags (GraphQL Batch Resolution)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Resolved in a single batch query via GraphQL Metadata API.
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {analysisData.addressTags?.length || 0} Entities
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                      <th className="py-2.5 px-3">Address</th>
                      <th className="py-2.5 px-3">RPC Classification</th>
                      <th className="py-2.5 px-3">Resolved Tag / Entity</th>
                      <th className="py-2.5 px-3">Tag Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {analysisData.addressTags && analysisData.addressTags.map((tag, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 text-cyan-400">{tag.address}</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">{tag.type}</td>
                        <td className="py-2 px-3 font-semibold text-white font-sans">{tag.tag}</td>
                        <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">{tag.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Advanced Fund Trace Graph */}
          {activeSubTab === 'fundtrace' && (
            <div className="space-y-5">
              {/* Status Banner */}
              {tracePolling && !traceData && (
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-violet-300">Advanced Fund Trace Running…</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Following funds from attacker wallets using RPC eth_getLogs across a 2-day forward window. Polling every 15s…
                    </div>
                  </div>
                </div>
              )}

              {!tracePolling && !traceData && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-slate-500" />
                  Advanced fund trace not yet available. Re-run analysis with depth &gt; 1 to trigger tracing.
                </div>
              )}

              {traceData && (
                <div className="space-y-5">
                  {/* Summary Stats */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#100f1e] border border-violet-500/30 shadow-xl shadow-violet-500/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-violet-400" />
                          Advanced Multi-Hop Fund Trace
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${traceData.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                            traceData.status === 'PARTIAL' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-slate-700 text-slate-400'
                            }`}>{traceData.status}</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Forward BFS from attacker wallets · Blocks {traceData.startBlock?.toLocaleString()} → {traceData.endBlock?.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        <div>Completed: <span className="text-slate-300">{traceData.completedAt ? new Date(traceData.completedAt).toLocaleString() : '—'}</span></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Wallets Investigated</div>
                        <div className="text-xl font-bold text-violet-400 mt-1">{traceData.totalWalletsInvestigated}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Transfer Edges</div>
                        <div className="text-xl font-bold text-cyan-400 mt-1">{traceData.totalEdges}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Max Depth</div>
                        <div className="text-xl font-bold text-white mt-1">{traceData.depth} hops</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Exit Points</div>
                        <div className="text-xl font-bold text-rose-400 mt-1">{traceData.exitPoints?.length || 0}</div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Multi-Hop Fund Flow Chart */}
                  <FundFlowGraph traceData={traceData} chainId={parseInt(chain, 10)} />

                  {/* Exit Points (CEX / Bridge / Mixer) */}
                  {traceData.exitPoints && traceData.exitPoints.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/20 space-y-3">
                      <h5 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-rose-400" />
                        Exit Points Detected (CEX / Bridge / Mixer)
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {traceData.exitPoints.map((ep, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                            <div className="overflow-hidden">
                              <div className="text-xs font-semibold text-white">{ep.label || 'Unknown Entity'}</div>
                              <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">{ep.address}</div>
                            </div>
                            <div className="shrink-0 ml-2 text-right">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${ep.type === 'EXCHANGE' ? 'bg-cyan-500/20 text-cyan-300' :
                                ep.type === 'BRIDGE' ? 'bg-blue-500/20 text-blue-300' :
                                  ep.type === 'MIXER' ? 'bg-rose-500/20 text-rose-300' :
                                    'bg-slate-700 text-slate-300'
                                }`}>{ep.type}</span>
                              <div className="text-[10px] text-slate-500 mt-0.5">Depth {ep.depth}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Split Events */}
                  {traceData.splits && traceData.splits.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/20 space-y-3">
                      <h5 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                        <SplitSquareHorizontal className="w-4 h-4 text-amber-400" />
                        Split Events — Funds fanned to &gt;5 wallets (expansion stopped)
                      </h5>
                      <div className="space-y-3">
                        {traceData.splits.map((sp, i) => (
                          <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="text-xs font-mono text-amber-300 truncate">{sp.wallet}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  Depth {sp.depth} · {sp.recipientCount} unique recipients
                                </div>
                              </div>
                              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                {sp.recipientCount} Splits
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {sp.recipients.slice(0, 10).map((r, ri) => (
                                <span key={ri} className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded">
                                  {r.slice(0, 8)}…{r.slice(-4)}
                                </span>
                              ))}
                              {sp.recipients.length > 10 && (
                                <span className="text-[10px] text-slate-500 px-1.5 py-0.5">+{sp.recipients.length - 10} more</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transfer Edge Table */}
                  {traceData.edges && traceData.edges.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          Forward Transfer Edges (Chronological)
                        </h5>
                        <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          {traceData.edges.length} Edges
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                              <th className="py-2.5 px-3">Hop</th>
                              <th className="py-2.5 px-3">From</th>
                              <th className="py-2.5 px-3">To</th>
                              <th className="py-2.5 px-3">Asset</th>
                              <th className="py-2.5 px-3 text-right">Amount</th>
                              <th className="py-2.5 px-3">Action</th>
                              <th className="py-2.5 px-3">Block</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono">
                            {traceData.edges.slice(0, 200).map((e, idx) => (
                              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-2 px-3">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">L{e.depth}</span>
                                </td>
                                <td className="py-2 px-3 text-slate-400 max-w-[130px] truncate" title={e.from}>
                                  {e.from?.slice(0, 10)}…{e.from?.slice(-4)}
                                </td>
                                <td className="py-2 px-3 text-cyan-400 max-w-[160px]" title={e.to}>
                                  {e.toLabel
                                    ? <span className="text-emerald-300 font-semibold font-sans">{e.toLabel}</span>
                                    : <span>{e.to?.slice(0, 10)}…{e.to?.slice(-4)}</span>
                                  }
                                </td>
                                <td className="py-2 px-3">
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">{e.asset}</span>
                                </td>
                                <td className="py-2 px-3 text-right font-bold text-white">{e.amount}</td>
                                <td className="py-2 px-3">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-sans ${e.actionType === 'CEX_DEPOSIT' ? 'bg-cyan-500/20 text-cyan-300' :
                                    e.actionType === 'DEX_SWAP' ? 'bg-purple-500/20 text-purple-300' :
                                      e.actionType === 'BRIDGE_TRANSFER' ? 'bg-blue-500/20 text-blue-300' :
                                        e.actionType === 'MIXER_DEPOSIT' ? 'bg-rose-500/20 text-rose-300' :
                                          'bg-slate-800 text-slate-400'
                                    }`}>{e.actionType?.replace('_', ' ')}</span>
                                </td>
                                <td className="py-2 px-3 text-slate-500 font-sans">{e.blockNumber?.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {traceData.edges.length > 200 && (
                          <div className="text-center text-xs text-slate-500 mt-3">
                            Showing 200 of {traceData.edges.length} edges. Full data stored in DB.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Node Map */}
                  {traceData.nodes && traceData.nodes.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Radar className="w-4 h-4 text-violet-400" />
                        Graph Nodes ({traceData.nodes.length} Wallets / Contracts)
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {traceData.nodes.map((n, i) => (
                          <div key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono ${n.role === 'CEX' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' :
                            n.role === 'BRIDGE' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
                              n.role === 'MIXER' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
                                n.role === 'PROTOCOL' ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' :
                                  n.depth === 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                                    'bg-slate-800 border-slate-700 text-slate-400'
                            }`} title={n.address}>
                            <span className="text-[9px] font-bold uppercase font-sans opacity-70">L{n.depth}</span>
                            {n.label ? <span className="font-sans font-semibold">{n.label}</span> : `${n.address?.slice(0, 8)}…`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Empty Prompt */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 mb-4">
            <Crosshair className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">Ready for Primary Transaction Analysis</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
            Direct JSON-RPC transaction extraction with GraphQL batch entity labeling. Evaluates net losses and gains exclusively for DB whitelisted assets.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleRunAnalysis}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Analyze PancakeBunny Flash-Loan Hack
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
