import React, { useState } from 'react';
import { getApiUrl } from '../../config/api';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Search,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Database,
  Zap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Award,
  Calendar,
  Lock,
  Skull,
  Radio,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

// ─── Chain Configuration ──────────────────────────────────────────────────────

const CHAIN_OPTIONS = [
  { label: 'Ethereum', value: 1, slug: 'ethereum', explorer: 'https://etherscan.io' },
  { label: 'BNB Smart Chain', value: 56, slug: 'bsc', explorer: 'https://bscscan.com' },
  { label: 'Polygon', value: 137, slug: 'polygon', explorer: 'https://polygonscan.com' },
  { label: 'Arbitrum', value: 42161, slug: 'arbitrum', explorer: 'https://arbiscan.io' },
  { label: 'Optimism', value: 10, slug: 'optimism', explorer: 'https://optimistic.etherscan.io' },
  { label: 'Base', value: 8453, slug: 'base', explorer: 'https://basescan.org' },
  { label: 'Avalanche', value: 43114, slug: 'avalanche', explorer: 'https://snowtrace.io' },
];

const RISK_PALETTES = {
  safe: {
    color: 'emerald',
    text: 'text-emerald-400',
    ring: 'stroke-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    lightBorder: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/20',
  },
  low: {
    color: 'cyan',
    text: 'text-cyan-400',
    ring: 'stroke-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    lightBorder: 'border-cyan-500/20',
    glow: 'shadow-cyan-500/20',
  },
  medium: {
    color: 'amber',
    text: 'text-amber-400',
    ring: 'stroke-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    lightBorder: 'border-amber-500/20',
    glow: 'shadow-amber-500/20',
  },
  high: {
    color: 'rose',
    text: 'text-rose-400',
    ring: 'stroke-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    lightBorder: 'border-rose-500/20',
    glow: 'shadow-rose-500/20',
  },
  critical: {
    color: 'red',
    text: 'text-red-400',
    ring: 'stroke-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    lightBorder: 'border-red-500/20',
    glow: 'shadow-red-500/30',
  },
  unknown: {
    color: 'slate',
    text: 'text-slate-400',
    ring: 'stroke-slate-500',
    bg: 'bg-slate-800',
    border: 'border-slate-700',
    badge: 'bg-slate-700 text-slate-300 border-slate-600',
    lightBorder: 'border-slate-700',
    glow: '',
  },
};

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500' },
  high: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-400' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  low: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', dot: 'bg-cyan-400' },
  info: { color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700', dot: 'bg-slate-400' },
};

function shortenHash(hash, chars = 6) {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}…${hash.slice(-chars)}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ScoreDualGuage({ riskScore, creditScore, riskLevel }) {
  const palette = RISK_PALETTES[riskLevel] || RISK_PALETTES.unknown;
  const r = 58;
  const circ = 2 * Math.PI * r;
  const dash = ((riskScore || 0) / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center my-1">
        <svg width="156" height="156" viewBox="0 0 156 156" className="-rotate-90">
          <circle cx="78" cy="78" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle
            cx="78"
            cy="78"
            r={r}
            fill="none"
            strokeWidth="12"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            className={`${palette.ring} transition-all duration-700`}
          />
        </svg>
        <div className="absolute flex flex-col items-center text-center">
          <span className={`text-4xl font-black font-mono tracking-tight ${palette.text}`}>
            {riskScore !== null ? riskScore : '—'}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            Risk Index
          </span>
        </div>
      </div>

      {/* Credit Reputation sub-metric */}
      <div className="mt-3 flex items-center justify-center gap-2 bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-800">
        <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="text-xs text-slate-400">Credit Score:</span>
        <span className="text-xs font-black font-mono text-white">
          {creditScore !== null ? creditScore : Math.max(0, (100 - (riskScore || 0)) * 10)}
        </span>
        <span className="text-[10px] text-slate-500 font-medium">/ 1000</span>
      </div>
    </div>
  );
}

function RiskLevelBadge({ level }) {
  const palette = RISK_PALETTES[level] || RISK_PALETTES.unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${palette.badge}`}>
      {level === 'safe' && <CheckCircle2 className="w-3.5 h-3.5" />}
      {level === 'low' && <ShieldCheck className="w-3.5 h-3.5" />}
      {level === 'medium' && <AlertTriangle className="w-3.5 h-3.5" />}
      {(level === 'high' || level === 'critical') && <ShieldAlert className="w-3.5 h-3.5" />}
      {!['safe', 'low', 'medium', 'high', 'critical'].includes(level) && <Info className="w-3.5 h-3.5" />}
      {level} RISK
    </span>
  );
}

function FindingCard({ finding, explorerBase }) {
  const [expanded, setExpanded] = useState(true);
  const sev = (finding.severity || 'info').toLowerCase();
  const m = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG.info;
  const evidenceList = Array.isArray(finding.evidence) ? finding.evidence : [];

  return (
    <div className={`rounded-xl border ${m.border} bg-slate-900/90 overflow-hidden transition-all duration-200`}>
      {/* Title Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-start gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${m.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${m.color} ${m.bg} ${m.border}`}>
              {sev}
            </span>
            <span className="text-sm font-semibold text-white tracking-tight">
              {finding.ruleName || finding.ruleId}
            </span>
            {finding.ruleId && (
              <span className="text-[11px] font-mono text-slate-500">({finding.ruleId})</span>
            )}
            {typeof finding.score === 'number' && (
              <span className="ml-auto text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Score Impact: +{finding.score}
              </span>
            )}
          </div>
          {finding.description && (
            <p className="text-xs text-slate-300 leading-relaxed pr-2">
              {finding.description}
            </p>
          )}
        </div>
        <button className="text-slate-500 p-1 shrink-0 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Evidence List */}
      {expanded && evidenceList.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-cyan-400" /> Evidence &amp; Behavioral Traces
          </div>

          <div className="space-y-2">
            {evidenceList.map((item, idx) => {
              if (typeof item === 'object' && item !== null) {
                const label = item.label || item.key || 'Detail';
                const detail = item.detail || '';
                const txRefs = Array.isArray(item.txRefs) ? item.txRefs : [];

                return (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 font-medium shrink-0">{label}:</span>
                      <span className="text-slate-200 font-mono text-right break-all">
                        {typeof detail === 'object' ? JSON.stringify(detail) : detail}
                      </span>
                    </div>

                    {/* Tx Hashes if present */}
                    {txRefs.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-medium">Tx Refs:</span>
                        {txRefs.slice(0, 5).map((hash, hIdx) => (
                          <a
                            key={hIdx}
                            href={`${explorerBase}/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50"
                          >
                            {shortenHash(hash, 4)}
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        ))}
                        {txRefs.length > 5 && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            +{txRefs.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <div key={idx} className="text-xs text-slate-300 font-mono">
                  {String(item)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AddressPoisoningCard({ poisoning, explorerBase }) {
  const [showAll, setShowAll] = useState(false);
  const attempts = poisoning?.attempts || [];
  const displayAttempts = showAll ? attempts : attempts.slice(0, 4);

  return (
    <div className="rounded-2xl bg-slate-900 border border-amber-500/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Skull className="w-4 h-4 text-amber-400" />
          Address Poisoning Detection
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {poisoning.totalAttempts || attempts.length} Attempts Identified
          </span>
        </h3>
        <span className="text-xs text-slate-500">
          Analyzed {poisoning.analyzedTransfers || 0} transfers
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Attackers generated vanity addresses matching prefix/suffix characters to bait zero-value or fake token transfers into this wallet's transaction history.
      </p>

      {/* Stats summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <div className="text-lg font-black font-mono text-amber-400">{poisoning.zeroValueTransfers || 0}</div>
          <div className="text-[10px] uppercase font-semibold text-slate-500 mt-0.5">Zero-Value Baits</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <div className="text-lg font-black font-mono text-rose-400">{poisoning.fakeTokenTransfers || 0}</div>
          <div className="text-[10px] uppercase font-semibold text-slate-500 mt-0.5">Fake Token Baits</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center col-span-2 sm:col-span-1">
          <div className="text-lg font-black font-mono text-cyan-400">{attempts.length}</div>
          <div className="text-[10px] uppercase font-semibold text-slate-500 mt-0.5">Mimic Target Addresses</div>
        </div>
      </div>

      {/* Attempts List */}
      <div className="space-y-2 pt-2">
        {displayAttempts.map((att, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Spoofed: {att.pattern?.start}…{att.pattern?.end}
                </span>
                {att.tokens?.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Token: {att.tokens.join(', ')}
                  </span>
                )}
                {att.methods?.length > 0 && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    [{att.methods.join(', ')}]
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-rose-400">Fake: {shortenHash(att.fakeAddress, 8)}</span>
                <span className="text-slate-600">→</span>
                <span className="text-emerald-400">Mimics: {shortenHash(att.mimics, 8)}</span>
              </div>
            </div>

            {att.txHashes && att.txHashes.length > 0 && (
              <a
                href={`${explorerBase}/tx/${att.txHashes[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono shrink-0"
              >
                View Bait Tx <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>

      {attempts.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
        >
          {showAll ? 'Show Fewer Poisoning Baits' : `View All ${attempts.length} Poisoning Attempts`}
        </button>
      )}
    </div>
  );
}

// ─── Main Tab Component ────────────────────────────────────────────────────────

export default function WalletScoreTab() {
  const [address, setAddress] = useState();
  const [chainId, setChainId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  const selectedChain = CHAIN_OPTIONS.find((c) => c.value === Number(chainId)) || CHAIN_OPTIONS[0];
  const explorerBase = selectedChain.explorer;

  const fetchScore = async (forceRefresh = false) => {
    if (!address || address.length !== 42 || !address.startsWith('0x')) {
      setError('Enter a valid 42-character EVM wallet address (0x...)');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('securetrace_token');
      const res = await fetch(getApiUrl('/api/wallet/score'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ address: address.trim(), chainId: Number(chainId), refresh: forceRefresh }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'API error occurred');
      setData(json.data);
    } catch (e) {
      setError(e.message || 'Failed to fetch score');
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    if (!data?.address) return;
    navigator.clipboard.writeText(data.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const palette = data ? (RISK_PALETTES[data.riskLevel] || RISK_PALETTES.unknown) : RISK_PALETTES.unknown;
  const sevCounts = data?.severityCounts || {};
  const findings = data?.engineFindings || [];
  const flags = data?.flags || [];
  const poisoning = data?.addressPoisoning || null;
  const meta = data?.metadata || {};

  return (
    <div className="space-y-6">

      {/* ── Top Header Banner & Query Bar ── */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Wallet Risk &amp; Credit Reputation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic wallet risk scoring via SecureTrace behavioral engine: exploit signatures, sweeps, graph centrality, &amp; poisoning.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl w-full">
          {/* Chain Selector */}
          <select
            value={chainId}
            onChange={(e) => setChainId(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 shrink-0 font-medium"
          >
            {CHAIN_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* Address input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchScore(false)}
              placeholder="0x… wallet address"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono placeholder-slate-600"
            />
          </div>

          {/* Scan button */}
          <button
            onClick={() => fetchScore(false)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/10"
          >
            {loading ? (
              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Evaluating…</>
            ) : (
              <><Zap className="w-3.5 h-3.5" /> Analyze Wallet</>
            )}
          </button>
        </div>
      </div>

      {/* ── Error Notification ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-red-300">
            <span className="font-semibold">Analysis Failed: </span>
            {error}
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {!data && !loading && !error && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
            <Radio className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Enter an EVM Address to Evaluate Risk Profile</h3>
            <p className="text-xs text-slate-400 max-w-lg">
              Performs live deep behavioral analysis covering allowance exploits, account sweeps, graph centrality, address poisoning attacks, and automated credit scoring.
            </p>
          </div>
          <button
            onClick={() => fetchScore(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5"
          >
            Scan Example Target (0x21ad…)
          </button>
        </div>
      )}

      {/* ── Result Presentation ── */}
      {data && (
        <>
          {/* Top Score Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Risk Index Gauge */}
            <div className={`rounded-2xl bg-slate-900 border ${palette.border} p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30 ${palette.bg}`} />

              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Composite Risk Assessment
              </div>

              {/* Gauge */}
              <ScoreDualGuage
                riskScore={data.riskScore}
                creditScore={data.creditScore}
                riskLevel={data.riskLevel}
              />

              {/* Risk Level Badge */}
              <RiskLevelBadge level={data.riskLevel} />

              {/* Metadata Details */}
              <div className="w-full pt-4 border-t border-slate-800/80 flex flex-col gap-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> Wallet Age:</span>
                  <span className="text-white font-mono font-semibold">
                    {meta.walletAgeDays ? `${meta.walletAgeDays} Days (~${(meta.walletAgeDays / 365).toFixed(1)}y)` : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> Scanned At:</span>
                  <span className="text-slate-300 font-mono">
                    {data.scannedAt ? new Date(data.scannedAt).toLocaleTimeString() : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-slate-500" /> Data Source:</span>
                  <span className={data.fromCache ? 'text-amber-400 font-semibold' : 'text-cyan-400 font-semibold'}>
                    {data.fromCache ? 'Behavioural Engine API' : 'Behavioural Engine API'}
                  </span>
                </div>
              </div>

              {/* Force Refresh Button */}
              <button
                onClick={() => fetchScore(true)}
                disabled={loading}
                className="w-full mt-1 py-2 rounded-xl border border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-scan with Fresh API
              </button>
            </div>

            {/* Right Column: AI Summary & Flags */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Wallet Address Banner */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Target Address</div>
                    <div className="text-xs font-mono font-bold text-white truncate">{data.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={copyAddress}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <a
                    href={`${explorerBase}/address/${data.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Explorer
                  </a>
                </div>
              </div>

              {/* AI & Forensic Summary */}
              {data.aiSummary && (
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" /> Forensics &amp; Risk Summary
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                      {data.aiSummary}
                    </p>
                  </div>

                  {/* Operational Tags / Flags */}
                  {flags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Triggered Behavioral Flags ({flags.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {flags.map((flag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Severity Counters Bar */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>Engine Rule Findings by Severity</span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {findings.length} rules triggered
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {['critical', 'high', 'medium', 'low', 'info'].map((s) => {
                    const cfg = SEVERITY_CONFIG[s];
                    const count = sevCounts[s] || 0;
                    return (
                      <div
                        key={s}
                        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border ${cfg.border} ${cfg.bg}`}
                      >
                        <span className={`text-lg font-black font-mono ${cfg.color}`}>{count}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color} mt-0.5`}>
                          {s}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ── Detailed Engine Findings Section ── */}
          {findings.length > 0 && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Rule Detections &amp; Exploitation Signals
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {findings.length} Anomalies
                  </span>
                </h3>
              </div>

              <div className="space-y-3">
                {findings.map((f, i) => (
                  <FindingCard key={i} finding={f} explorerBase={explorerBase} />
                ))}
              </div>
            </div>
          )}

          {/* ── Address Poisoning Detection Card ── */}
          {poisoning && (poisoning.attempts?.length > 0 || poisoning.totalAttempts > 0) && (
            <AddressPoisoningCard poisoning={poisoning} explorerBase={explorerBase} />
          )}

        </>
      )}

    </div>
  );
}
