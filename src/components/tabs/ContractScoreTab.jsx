import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../config/api';
import {
  Cpu,
  Search,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Code2,
  FileCode,
  Layers,
  Zap,
  Lock,
  ExternalLink,
  RefreshCw,
  Info,
  Flame,
  Check,
  Copy,
  Sparkles,
  Database
} from 'lucide-react';

export default function ContractScoreTab() {
  const [contractAddress, setContractAddress] = useState(); // PancakeSwap Router V2
  const [chain, setChain] = useState('56'); // BSC by default
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const [contractData, setContractData] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const getExplorerUrl = (addr, chainId) => {
    return Number(chainId) === 1
      ? `https://etherscan.io/address/${addr}`
      : `https://bscscan.com/address/${addr}`;
  };

  const handleAudit = async (forceRefresh = false) => {
    if (!contractAddress || !contractAddress.startsWith('0x') || contractAddress.trim().length !== 42) {
      setErrorMsg('Please enter a valid 42-character EVM contract address starting with 0x.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem('securetrace_token');
      const res = await fetch(getApiUrl('/api/contract/score'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          address: contractAddress.trim(),
          chainId: parseInt(chain, 10),
          refresh: forceRefresh,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setContractData(json.data);
      } else {
        setErrorMsg(json.message || 'Failed to analyze smart contract.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error connecting to backend API: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Run audit for default contract on initial load
  useEffect(() => {
    handleAudit(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner & Search Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            Smart Contract Security & Credit Score
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            AI-driven Solidity source auditing, vulnerability counting, and on-chain formal risk index backed by OpenAI.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl w-full">
          {/* Chain Selector */}
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="56">BSC (Chain 56)</option>
            <option value="1">Ethereum (Chain 1)</option>
          </select>

          {/* Address Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Contract Address 0x..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <button
            onClick={() => handleAudit(false)}
            disabled={analyzing}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Audit Contract
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

      {/* Contract Metadata & Score */}
      {contractData && (
        <div className="space-y-6">
          {/* Cache Status Badge */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${contractData.cached
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                }`}>
                <Database className="w-3 h-3" />
                {contractData.cached ? 'Audited By SecureTrace AI Engine' : 'Audited By SecureTrace AI Engine'}
              </span>
              <span className="text-slate-500">
                Chain: {contractData.chainName} ({contractData.chainId})
              </span>
            </div>

            <button
              onClick={() => handleAudit(true)}
              disabled={analyzing}
              className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 cursor-pointer transition"
              title="Force re-audit bypassing cache"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              Re-Audit with AI
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Trust Score Radial & Architecture Metrics */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Contract Trust Index
              </div>

              <div className="relative flex items-center justify-center my-3">
                <div className={`w-40 h-40 rounded-full border-8 flex flex-col items-center justify-center shadow-lg ${contractData.score >= 80
                  ? 'border-slate-800 border-t-emerald-400 border-r-emerald-500 shadow-emerald-500/10'
                  : contractData.score >= 60
                    ? 'border-slate-800 border-t-amber-400 border-r-amber-500 shadow-amber-500/10'
                    : 'border-slate-800 border-t-rose-400 border-r-rose-500 shadow-rose-500/10'
                  }`}>
                  <span className="text-5xl font-black text-white font-mono">{contractData.score}</span>
                  <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">/ 100</span>
                </div>
              </div>

              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${contractData.score >= 80
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : contractData.score >= 60
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                  Grade: {contractData.grade}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-semibold mt-2">
                {contractData.riskTier}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 w-full text-xs space-y-2.5 text-left">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Compiler:</span>
                  <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={contractData.compiler}>
                    {contractData.compiler}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Source Verification:</span>
                  <span className={`font-semibold flex items-center gap-1 ${contractData.verified ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {contractData.verified ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Verified Match
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" /> Unverified Bytecode
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Proxy Pattern:</span>
                  <span className="text-slate-200 font-medium">
                    {contractData.proxy ? 'Upgradeable Proxy' : 'Immutable (No proxy)'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>License:</span>
                  <span className="text-slate-300 font-mono text-[11px]">{contractData.license || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Vulnerability Counters, Summary & Security Vectors */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-xl space-y-6">
              <div>
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{contractData.contractName}</span>
                      <a
                        href={getExplorerUrl(contractData.contractAddress, contractData.chainId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cyan-400 transition"
                        title="View on Blockchain Explorer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-cyan-400 truncate max-w-[280px]">
                        {contractData.contractAddress}
                      </span>
                      <button
                        onClick={() => copyToClipboard(contractData.contractAddress)}
                        className="p-1 text-slate-400 hover:text-white transition"
                        title="Copy Address"
                      >
                        {copiedAddr ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <span className={`self-start sm:self-auto px-3 py-1 rounded-lg text-xs font-bold border ${contractData.score >= 80
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                    {contractData.score >= 80 ? 'Audited & Low Risk' : 'Caution Advised'}
                  </span>
                </div>

                {/* AI Executive Summary */}
                {contractData.summary && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
                      AI Executive Audit Summary:
                    </span>
                    {contractData.summary}
                  </div>
                )}

                {/* Vulnerability Severity Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Critical</div>
                    <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                      {contractData.vulnerabilityCounters?.critical ?? 0}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">High</div>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                      {contractData.vulnerabilityCounters?.high ?? 0}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Medium</div>
                    <div className="text-xl font-bold font-mono text-yellow-400 mt-1">
                      {contractData.vulnerabilityCounters?.medium ?? 0}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Low</div>
                    <div className="text-xl font-bold font-mono text-blue-400 mt-1">
                      {contractData.vulnerabilityCounters?.low ?? 0}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Info</div>
                    <div className="text-xl font-bold font-mono text-slate-300 mt-1">
                      {contractData.vulnerabilityCounters?.informational ?? 0}
                    </div>
                  </div>
                </div>

                {/* Security Vectors List */}
                <div className="mt-6 space-y-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                    <span>Automated Security Vectors</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {contractData.auditChecks?.length || 0} Checks Evaluated
                    </span>
                  </div>

                  {contractData.auditChecks && contractData.auditChecks.map((chk, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {chk.status === 'Passed' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : chk.status?.includes('Critical') || chk.status?.includes('High') ? (
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-semibold text-white">{chk.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{chk.detail}</div>
                        </div>
                      </div>
                      <span className={`font-semibold text-[11px] px-2.5 py-0.5 rounded shrink-0 border ${chk.status === 'Passed'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : chk.status?.includes('Low')
                          ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        }`}>
                        {chk.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Specific Vulnerabilities List */}
                {contractData.vulnerabilities && contractData.vulnerabilities.length > 0 && (
                  <div className="mt-6 space-y-2.5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Identified Vulnerabilities & Warnings ({contractData.vulnerabilities.length})
                    </div>
                    {contractData.vulnerabilities.map((v, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-rose-400" />
                            {v.type}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${v.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                            v.severity === 'High' ? 'bg-amber-500/20 text-amber-400' :
                              v.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                            }`}>
                            {v.severity}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{v.description}</p>
                        {v.recommendation && (
                          <div className="text-[11px] text-indigo-300 font-mono mt-1">
                            💡 Remediation: {v.recommendation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
