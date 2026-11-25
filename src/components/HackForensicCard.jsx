import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Key,
  Bug,
  Scale,
  Unlock,
  CheckCircle2,
  Copy,
  Check,
  Bot,
  BrainCircuit,
  FileCode,
  ArrowRight,
  Database,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function HackForensicCard({ hackAnalysis }) {
  const [copied, setCopied] = useState(false);
  const [showMechanism, setShowMechanism] = useState(true);

  if (!hackAnalysis) return null;

  const copyHeadline = () => {
    navigator.clipboard.writeText(hackAnalysis.rootCauseHeadline || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryConfig = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('private key') || c.includes('pvt key')) {
      return {
        label: 'Private Key Compromise',
        icon: Key,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        accent: 'from-rose-500/20 to-rose-950/40'
      };
    }
    if (c.includes('logic bug') || c.includes('contract bug') || c.includes('reentrancy')) {
      return {
        label: 'Smart Contract Logic Flaw',
        icon: Bug,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        accent: 'from-amber-500/20 to-amber-950/40'
      };
    }
    if (c.includes('flash loan') || c.includes('oracle')) {
      return {
        label: 'Oracle / Flash Loan Exploit',
        icon: Scale,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        accent: 'from-purple-500/20 to-purple-950/40'
      };
    }
    if (c.includes('approval') || c.includes('allowance')) {
      return {
        label: 'Approval / Allowance Exploit',
        icon: Unlock,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        accent: 'from-orange-500/20 to-orange-950/40'
      };
    }
    return {
      label: hackAnalysis.incidentCategory || 'Forensic Exploit Detection',
      icon: ShieldAlert,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      accent: 'from-cyan-500/20 to-cyan-950/40'
    };
  };

  const catCfg = getCategoryConfig(hackAnalysis.incidentCategory);
  const IconComponent = catCfg.icon;

  const severityColor = (sev = '') => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'HIGH':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${catCfg.accent} bg-slate-900 border ${catCfg.border} relative overflow-hidden shadow-xl`}>
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${catCfg.bg} border ${catCfg.border} flex items-center justify-center shrink-0`}>
            <IconComponent className={`w-6 h-6 ${catCfg.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${catCfg.badge}`}>
                {catCfg.label}
              </span>
              {hackAnalysis.severity && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${severityColor(hackAnalysis.severity)}`}>
                  {hackAnalysis.severity} SEVERITY
                </span>
              )}
              {hackAnalysis.confidenceScore && (
                <span className="text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1 bg-slate-950/60 px-2.5 py-0.5 rounded-full border border-slate-800">
                  <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" /> Confidence: {hackAnalysis.confidenceScore}%
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              AI Incident Root-Cause Analysis
            </h3>
          </div>
        </div>

        {/* Source Badge */}
        <div className="flex items-center gap-2 text-xs self-start md:self-auto">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            {hackAnalysis.fromCache ? 'SecureTrace AI Engine' : 'SecureTrace AI Engine'}
          </span>
          <button
            onClick={copyHeadline}
            className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Copy headline"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Headline Summary Banner */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-white/10">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" /> Root Cause Diagnosis
        </div>
        <p className="text-sm font-semibold text-white leading-relaxed">
          {hackAnalysis.rootCauseHeadline}
        </p>
      </div>

      {/* Exploit Mechanism Paragraphs */}
      {hackAnalysis.exploitMechanism && (
        <div className="mt-4">
          <button
            onClick={() => setShowMechanism(!showMechanism)}
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <span>Detailed Forensic Breakdown</span>
            {showMechanism ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showMechanism && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
              {hackAnalysis.exploitMechanism}
            </div>
          )}
        </div>
      )}

      {/* Key Attack Vector Attributes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-500">Compromised Entity</div>
          <div className="text-xs font-mono font-semibold text-rose-300 mt-1 truncate" title={hackAnalysis.compromisedEntity}>
            {hackAnalysis.compromisedEntity || 'Victim Address'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-500">Loss Assessment</div>
          <div className="text-xs font-bold text-white mt-1">
            {hackAnalysis.lossAssessment || 'Net Drained Assets'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-500">Attack Flaw Type</div>
          <div className="text-xs font-semibold text-amber-300 mt-1 truncate" title={hackAnalysis.attackVectorDetails?.flawType}>
            {hackAnalysis.attackVectorDetails?.flawType || 'Unauthorized State Modification'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-500">Entrypoint Invocation</div>
          <div className="text-xs font-mono text-cyan-300 mt-1 truncate" title={hackAnalysis.attackVectorDetails?.entrypointFunction}>
            {hackAnalysis.attackVectorDetails?.entrypointFunction || 'direct transfer'}
          </div>
        </div>
      </div>

      {/* Remediation & Indicators Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
        {/* Remediation Steps */}
        {hackAnalysis.remediationSteps && hackAnalysis.remediationSteps.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Immediate Incident Remediation
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {hackAnalysis.remediationSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">{idx + 1}.</span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Indicators of Compromise */}
        {hackAnalysis.indicatorsOfCompromise && hackAnalysis.indicatorsOfCompromise.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 shrink-0" /> Indicators of Compromise (IoCs)
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              {hackAnalysis.indicatorsOfCompromise.map((ioc, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 break-all">
                  <span className="text-rose-400 font-bold shrink-0">•</span>
                  <span>{ioc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
