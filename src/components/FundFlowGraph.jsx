import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Info, 
  ArrowRight, 
  ExternalLink, 
  ShieldAlert, 
  Coins, 
  Check, 
  Copy,
  Layers,
  Sparkles,
  GitBranch
} from 'lucide-react';

export default function FundFlowGraph({ traceData, chainId = 56 }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [copiedText, setCopiedText] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterAsset, setFilterAsset] = useState('ALL');
  const containerRef = useRef(null);

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getExplorerUrl = (address) => {
    return chainId === 1
      ? `https://etherscan.io/address/${address}`
      : `https://bscscan.com/address/${address}`;
  };

  const getTxUrl = (txHash) => {
    return chainId === 1
      ? `https://etherscan.io/tx/${txHash}`
      : `https://bscscan.com/tx/${txHash}`;
  };

  // Group nodes into topological hop columns: L0 (Attacker/Seed), L1, L2, L3...
  const { columns, availableAssets, filteredEdges } = useMemo(() => {
    if (!traceData || !traceData.nodes) {
      return { columns: [], availableAssets: [], filteredEdges: [] };
    }

    const assets = new Set();
    (traceData.edges || []).forEach(e => {
      if (e.asset) assets.add(e.asset);
    });

    const fEdges = (traceData.edges || []).filter(e => {
      if (filterAsset === 'ALL') return true;
      return e.asset === filterAsset;
    });

    // Determine highest depth in nodes or edges
    const colMap = new Map();
    
    // In-degrees and Out-degrees calculation for node sizing/metrics
    const inDegrees = new Map();
    const outDegrees = new Map();
    const totalVolumeIn = new Map();
    const totalVolumeOut = new Map();

    fEdges.forEach(e => {
      const from = (e.from || '').toLowerCase();
      const to = (e.to || '').toLowerCase();
      outDegrees.set(from, (outDegrees.get(from) || 0) + 1);
      inDegrees.set(to, (inDegrees.get(to) || 0) + 1);

      const amt = parseFloat(e.amount) || 0;
      totalVolumeOut.set(from, (totalVolumeOut.get(from) || 0) + amt);
      totalVolumeIn.set(to, (totalVolumeIn.get(to) || 0) + amt);
    });

    traceData.nodes.forEach(n => {
      const depth = n.depth !== undefined ? n.depth : 0;
      if (!colMap.has(depth)) colMap.set(depth, []);
      colMap.get(depth).push({
        ...n,
        inDegree: inDegrees.get(n.address.toLowerCase()) || 0,
        outDegree: outDegrees.get(n.address.toLowerCase()) || 0,
        volumeIn: totalVolumeIn.get(n.address.toLowerCase()) || 0,
        volumeOut: totalVolumeOut.get(n.address.toLowerCase()) || 0,
      });
    });

    // Sort column keys ascending (0, 1, 2, ...)
    const sortedDepths = Array.from(colMap.keys()).sort((a, b) => a - b);
    const cols = sortedDepths.map(d => ({
      depth: d,
      title: d === 0 ? 'Seed / Attacker (L0)' : `Hop Level ${d} (L${d})`,
      nodes: colMap.get(d) || []
    }));

    return {
      columns: cols,
      availableAssets: Array.from(assets),
      filteredEdges: fEdges
    };
  }, [traceData, filterAsset]);

  // Default selection to first node
  useEffect(() => {
    if (!selectedNode && traceData?.nodes?.length > 0) {
      setSelectedNode(traceData.nodes[0]);
    }
  }, [traceData]);

  if (!traceData || !traceData.nodes || traceData.nodes.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        No graph flow data available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Interactive Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 mr-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Interactive Fund Flow Diagram
          </span>

          {/* Asset filter pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterAsset('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                filterAsset === 'ALL'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Assets ({traceData.edges?.length || 0})
            </button>
            {availableAssets.map(sym => (
              <button
                key={sym}
                onClick={() => setFilterAsset(sym)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  filterAsset === sym
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* View Controls & Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 min-w-[45px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Visual Board Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Diagram Canvas */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-gradient-to-br from-[#0b0f19] via-[#090d16] to-[#070a10] border border-cyan-500/20 shadow-2xl overflow-hidden relative min-h-[520px] flex flex-col justify-between">
          
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '18px 18px' }} 
          />

          {/* Scrollable Columns Container */}
          <div 
            ref={containerRef}
            className="overflow-x-auto overflow-y-auto pb-6 relative z-10 custom-scrollbar"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', transition: 'transform 0.15s ease' }}
          >
            <div className="flex items-start gap-8 min-w-[700px] pt-2">
              {columns.map((col, colIdx) => (
                <div key={col.depth} className="flex-1 min-w-[220px] max-w-[280px] flex flex-col space-y-3">
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        col.depth === 0 ? 'bg-amber-400 animate-pulse' :
                        col.depth === 1 ? 'bg-cyan-400' :
                        'bg-violet-400'
                      }`} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {col.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {col.nodes.length}
                    </span>
                  </div>

                  {/* Nodes List */}
                  <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                    {col.nodes.map((node) => {
                      const isSelected = selectedNode?.address?.toLowerCase() === node.address.toLowerCase();
                      const isSeed = node.depth === 0;
                      const isCex = node.role === 'CEX';
                      const isBridge = node.role === 'BRIDGE';
                      const isMixer = node.role === 'MIXER';
                      const isProtocol = node.role === 'PROTOCOL';

                      return (
                        <div
                          key={node.address}
                          onClick={() => {
                            setSelectedNode(node);
                            setSelectedEdge(null);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                            isSelected
                              ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                              : isSeed
                              ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10'
                              : isCex
                              ? 'bg-cyan-950/20 border-cyan-500/30 hover:border-cyan-400'
                              : isBridge
                              ? 'bg-blue-950/20 border-blue-500/30 hover:border-blue-400'
                              : isMixer
                              ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400'
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              isSeed ? 'bg-amber-500/20 text-amber-300' :
                              isCex ? 'bg-cyan-500/20 text-cyan-300' :
                              isBridge ? 'bg-blue-500/20 text-blue-300' :
                              isMixer ? 'bg-rose-500/20 text-rose-300' :
                              isProtocol ? 'bg-purple-500/20 text-purple-300' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {node.label || (isSeed ? 'Attacker Seed' : `Wallet L${node.depth}`)}
                            </span>

                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                              <span>In:{node.inDegree}</span>
                              <span>•</span>
                              <span>Out:{node.outDegree}</span>
                            </div>
                          </div>

                          <div className="text-xs font-mono font-semibold text-slate-200 truncate mt-1">
                            {node.address.slice(0, 10)}…{node.address.slice(-6)}
                          </div>

                          {/* Quick Outflow preview indicator */}
                          {node.outDegree > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono mt-1.5">
                              <ArrowRight className="w-2.5 h-2.5" />
                              <span>Fanned to {node.outDegree} target(s)</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom helper tip */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 z-10">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Click any wallet node to view inbound & outbound fund movements.
            </span>
            <span className="font-mono text-slate-500">
              Total Flow Nodes: {traceData.nodes?.length || 0}
            </span>
          </div>
        </div>

        {/* Right Column: Node / Edge Detailed Inspector Panel */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    L{selectedNode.depth}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      {selectedNode.label || 'Wallet Inspector'}
                    </h5>
                    <span className="text-[10px] text-slate-400">{selectedNode.role || 'EOA / Contract'}</span>
                  </div>
                </div>
                <a
                  href={getExplorerUrl(selectedNode.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
                  title="View on Explorer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Address with Copy Button */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Address</label>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 mt-1">
                  <span className="text-xs font-mono text-cyan-300 truncate mr-2" title={selectedNode.address}>
                    {selectedNode.address}
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedNode.address)}
                    className="p-1 text-slate-400 hover:text-white transition"
                    title="Copy Address"
                  >
                    {copiedText === selectedNode.address ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Hop Metrics */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Incoming Transfers</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {selectedNode.inDegree || 0}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Outgoing Transfers</div>
                  <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">
                    {selectedNode.outDegree || 0}
                  </div>
                </div>
              </div>

              {/* Outgoing Flows from this Node */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase flex items-center justify-between mb-2">
                  <span>Outgoing Transfers ({filteredEdges.filter(e => e.from.toLowerCase() === selectedNode.address.toLowerCase()).length})</span>
                </label>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {filteredEdges
                    .filter(e => e.from.toLowerCase() === selectedNode.address.toLowerCase())
                    .map((edge, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedEdge(edge)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          selectedEdge === edge
                            ? 'bg-cyan-500/20 border-cyan-400'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white font-mono">{edge.amount} {edge.asset}</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                            {edge.actionType?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span className="truncate max-w-[130px]">→ {edge.toLabel || `${edge.to.slice(0, 6)}…${edge.to.slice(-4)}`}</span>
                          <span className="text-slate-500 font-mono">Blk #{edge.blockNumber}</span>
                        </div>
                      </div>
                    ))}
                  {filteredEdges.filter(e => e.from.toLowerCase() === selectedNode.address.toLowerCase()).length === 0 && (
                    <div className="p-3 rounded-xl bg-slate-950 text-slate-500 text-xs text-center">
                      No outgoing transfers recorded in this window.
                    </div>
                  )}
                </div>
              </div>

              {/* Inbound Flows to this Node */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase flex items-center justify-between mb-2">
                  <span>Incoming Transfers ({filteredEdges.filter(e => e.to.toLowerCase() === selectedNode.address.toLowerCase()).length})</span>
                </label>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {filteredEdges
                    .filter(e => e.to.toLowerCase() === selectedNode.address.toLowerCase())
                    .map((edge, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedEdge(edge)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          selectedEdge === edge
                            ? 'bg-cyan-500/20 border-cyan-400'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white font-mono">{edge.amount} {edge.asset}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Blk #{edge.blockNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 truncate">
                          From: {edge.from.slice(0, 8)}…{edge.from.slice(-6)}
                        </div>
                      </div>
                    ))}
                  {filteredEdges.filter(e => e.to.toLowerCase() === selectedNode.address.toLowerCase()).length === 0 && (
                    <div className="p-3 rounded-xl bg-slate-950 text-slate-500 text-xs text-center">
                      No incoming transfers recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
              Select a wallet from the graph to inspect its flows.
            </div>
          )}

          {/* Selected Edge Details (if an edge was clicked) */}
          {selectedEdge && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">Selected Transfer Detail</span>
                <a
                  href={getTxUrl(selectedEdge.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  TX <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="text-xs text-white font-bold font-mono">
                {selectedEdge.amount} {selectedEdge.asset}
              </div>
              <div className="text-[11px] font-mono text-slate-400 break-all">
                <div>From: <span className="text-slate-300">{selectedEdge.from}</span></div>
                <div className="mt-0.5">To: <span className="text-cyan-300">{selectedEdge.to}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
