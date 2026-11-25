import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Search,
  Filter,
  Layers,
  Database,
  Coins,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function PortfolioTab() {
  const [addressInput, setAddressInput] = useState();
  const [selectedChain, setSelectedChain] = useState('All Chains');
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch portfolio data from backend API
  const fetchPortfolio = async (address, forceRefresh = false) => {
    if (!address || !address.startsWith('0x') || address.trim().length !== 42) {
      setErrorMsg('Please enter a valid 42-character EVM wallet address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem('securetrace_token');
      const url = `/api/portfolio/${address.trim()}${forceRefresh ? '?refresh=true' : ''}`;
      const res = await fetch(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();

      if (json.success) {
        setPortfolioData(json);
      } else {
        setErrorMsg(json.message || json.error || 'Failed to fetch wallet portfolio.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error connecting to Portfolio API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio(addressInput);
  }, []);

  // Filter positions by selected chain
  const filteredAssets = (portfolioData?.assets || []).filter((asset) => {
    if (selectedChain === 'All Chains') return true;
    const chainStr = (asset.chain || '').toLowerCase();
    const sel = selectedChain.toLowerCase();
    if (sel.includes('avalanche') && chainStr.includes('avalanche')) return true;
    if (sel.includes('ethereum') && chainStr.includes('ethereum')) return true;
    if (sel.includes('polygon') && chainStr.includes('polygon')) return true;
    if (sel.includes('bsc') && (chainStr.includes('binance') || chainStr.includes('bsc'))) return true;
    return chainStr.includes(sel);
  });

  const totalValue = portfolioData?.portfolio?.totalValueUsd ?? 0;
  const dailyAbs = portfolioData?.portfolio?.dailyChange?.absolute ?? 0;
  const dailyPct = portfolioData?.portfolio?.dailyChange?.percentage ?? 0;
  const isPositiveDaily = dailyPct >= 0;

  const distributionByChain = portfolioData?.portfolio?.distributionByChain || {};
  const distributionByType = portfolioData?.portfolio?.distributionByType || {};

  return (
    <div className="space-y-6">
      {/* Top Banner and Address Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-cyan-400" />
              Web3 Portfolio Intelligence
            </h2>
            {portfolioData?.cached && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <Database className="w-3 h-3" /> Onchain Intelligence
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-chain positions, protocol balances, and token valuations powered by SecureTrace Indexing API.
          </p>
        </div>

        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="0x Address..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            onClick={() => fetchPortfolio(addressInput, true)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Net Worth</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${isPositiveDaily ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositiveDaily ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>
              {isPositiveDaily ? '+' : ''}${dailyAbs.toFixed(2)} ({isPositiveDaily ? '+' : ''}{dailyPct.toFixed(2)}%) 24h
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Positions</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Coins className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {portfolioData?.assetCount ?? 0} Assets
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Across {Object.keys(distributionByChain).length} active blockchain networks
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Top Blockchain</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><Layers className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono capitalize">
            {Object.keys(distributionByChain)[0] || 'Multi-chain'}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            ${(Object.values(distributionByChain)[0] || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })} allocated
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Cache Status</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><Database className="w-4 h-4" /></span>
          </div>
          <div className="mt-2 text-xl font-bold text-white font-mono">
            {portfolioData?.cached ? 'Cached' : 'Live Sync'}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Updated: {portfolioData?.fetchedAt ? new Date(portfolioData.fetchedAt).toLocaleTimeString() : 'Just now'}</span>
          </div>
        </div>
      </div>

      {/* Chain Distribution Progress Bar */}
      {Object.keys(distributionByChain).length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Multi-Chain Allocation Breakdown
            </h3>
            <span className="text-xs text-slate-400">
              {Object.keys(distributionByChain).length} Chains
            </span>
          </div>

          {/* Stacked Bar */}
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
            {Object.entries(distributionByChain).map(([chainName, value], idx) => {
              const pct = totalValue > 0 ? (value / totalValue) * 100 : 0;
              const colors = ['bg-rose-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500', 'bg-cyan-500'];
              const color = colors[idx % colors.length];
              return (
                <div
                  key={chainName}
                  style={{ width: `${pct}%` }}
                  title={`${chainName}: $${value.toFixed(2)} (${pct.toFixed(1)}%)`}
                  className={`${color} h-full transition-all`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
            {Object.entries(distributionByChain).map(([chainName, value], idx) => {
              const pct = totalValue > 0 ? (value / totalValue) * 100 : 0;
              const colors = ['bg-rose-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500', 'bg-cyan-500'];
              const dotColor = colors[idx % colors.length];
              return (
                <div key={chainName} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 capitalize text-slate-300 font-medium">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span>{chainName.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between font-mono">
                    <span className="font-semibold text-white">${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    <span className="text-[10px] text-slate-400">{pct.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Asset Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">Holdings & Token Positions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Individual asset valuation, 24h delta, and contract identifiers</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Chain:</span>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none"
            >
              <option>All Chains</option>
              <option>Avalanche</option>
              <option>Ethereum</option>
              <option>Polygon</option>
              <option>BSC</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-5">Asset</th>
                <th className="py-3 px-5">Chain / Type</th>
                <th className="py-3 px-5">Price (USD)</th>
                <th className="py-3 px-5">Quantity</th>
                <th className="py-3 px-5">Position Value</th>
                <th className="py-3 px-5 text-right">24h Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset, idx) => {
                  const chgPct = asset.changes?.percent_1d;
                  const isPos = chgPct !== undefined && chgPct !== null && chgPct >= 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-5 flex items-center gap-3">
                        {asset.iconUrl ? (
                          <img
                            src={asset.iconUrl}
                            alt={asset.symbol}
                            className="w-8 h-8 rounded-full bg-slate-800 object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                            {asset.symbol?.slice(0, 3) || 'TOK'}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white text-xs">{asset.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{asset.symbol}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-xs text-slate-300 capitalize">{asset.chain || 'multi-chain'}</span>
                        <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {asset.positionType}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-300">
                        {asset.priceUsd !== null ? `$${asset.priceUsd.toFixed(4)}` : '$0.00'}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-300">
                        {asset.quantity !== null ? asset.quantity.toLocaleString('en-US', { maximumFractionDigits: 4 }) : '0'} {asset.symbol}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs font-semibold text-white">
                        ${asset.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-5 text-xs font-semibold text-right">
                        {chgPct !== undefined && chgPct !== null ? (
                          <span className={isPos ? 'text-emerald-400' : 'text-rose-400'}>
                            {isPos ? '+' : ''}{chgPct.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-slate-500">0.00%</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-slate-400">
                    No positions found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
