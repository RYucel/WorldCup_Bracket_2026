/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Match, Team } from "../types";
import { HelpCircle } from "lucide-react";

interface BracketNodeProps {
  key?: React.Key;
  match: Match;
  team1: Team | null;
  team2: Team | null;
  isActive: boolean;
  onSelect: () => void;
}

export default function BracketNode({ match, team1, team2, isActive, onSelect }: BracketNodeProps) {
  const getFlagUrl = (flagCode?: string) => {
    return flagCode ? `https://flagcdn.com/w80/${flagCode}.png` : "";
  };

  const isT1Winner = match.winnerId && match.winnerId === team1?.id;
  const isT2Winner = match.winnerId && match.winnerId === team2?.id;

  return (
    <button
      id={`bracket-node-${match.id}`}
      onClick={onSelect}
      className={`group relative text-left w-24 md:w-28 xl:w-32 rounded-sm border transition-all duration-300 focus:outline-none ${
        isActive
          ? "border-yellow-500 bg-blue-950/50 ring-1 ring-yellow-500/30 scale-[1.03] shadow-[0_0_20px_rgba(234,179,8,0.25)] z-10"
          : "border-white/10 bg-white/5 hover:border-yellow-500/40 hover:scale-[1.01] hover:shadow-md hover:bg-blue-900/20"
      }`}
    >
      {/* Small Stage Indicator on Top */}
      <div className="px-2.5 py-1 bg-slate-900/90 border-b border-white/5 rounded-t-sm flex justify-between items-center">
        <span className="text-[9px] font-mono font-bold tracking-wider text-yellow-500 uppercase">
          {match.id}
        </span>
        <span className="text-[8px] font-sans font-bold text-blue-400 uppercase tracking-widest">
          {match.stage === "son32"
            ? "Son 32"
            : match.stage === "son16"
            ? "Son 16"
            : match.stage === "ceyrek"
            ? "Çeyrek F."
            : match.stage === "yarifinal"
            ? "Yarı F."
            : "FİNAL"}
        </span>
      </div>

      <div className="p-2 space-y-1">
        {/* Team 1 Slot */}
        <div
          className={`flex items-center justify-between p-1.5 rounded-sm transition-all ${
            isT1Winner
              ? "bg-yellow-500/20 text-yellow-200 font-bold border border-yellow-500/30"
              : match.winnerId
              ? "opacity-40 text-slate-500 font-normal"
              : "text-slate-300"
          }`}
        >
          <div className="flex items-center space-x-2 min-w-0">
            {team1 ? (
              <>
                <img
                  src={getFlagUrl(team1.flagCode)}
                  alt={team1.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-4 object-cover rounded-sm shadow-sm shrink-0 border border-white/10"
                />
                <span className="font-sans text-xs font-bold uppercase tracking-wide truncate">
                  {team1.code}
                </span>
              </>
            ) : (
              <>
                <HelpCircle className="w-5 h-5 text-slate-700 shrink-0" />
                <span className="font-mono text-[10px] text-slate-600 tracking-wider">Bekleniyor</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {match.score1 !== undefined && match.score1 !== null && (
              <span className="font-mono text-xs font-bold text-slate-200">{match.score1}</span>
            )}
            {team1 && isT1Winner && (
              <span className="text-[9px] bg-yellow-500 text-slate-950 px-1 rounded-sm font-mono font-black leading-none py-0.5 shadow-sm">
                ✓
              </span>
            )}
          </div>
        </div>

        {/* Divider line */}
        <div className="h-[1px] bg-white/5" />

        {/* Team 2 Slot */}
        <div
          className={`flex items-center justify-between p-1.5 rounded-sm transition-all ${
            isT2Winner
              ? "bg-yellow-500/20 text-yellow-200 font-bold border border-yellow-500/30"
              : match.winnerId
              ? "opacity-40 text-slate-500 font-normal"
              : "text-slate-300"
          }`}
        >
          <div className="flex items-center space-x-2 min-w-0">
            {team2 ? (
              <>
                <img
                  src={getFlagUrl(team2.flagCode)}
                  alt={team2.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-4 object-cover rounded-sm shadow-sm shrink-0 border border-white/10"
                />
                <span className="font-sans text-xs font-bold uppercase tracking-wide truncate">
                  {team2.code}
                </span>
              </>
            ) : (
              <>
                <HelpCircle className="w-5 h-5 text-slate-700 shrink-0" />
                <span className="font-mono text-[10px] text-slate-600 tracking-wider">Bekleniyor</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {match.score2 !== undefined && match.score2 !== null && (
              <span className="font-mono text-xs font-bold text-slate-200">{match.score2}</span>
            )}
            {team2 && isT2Winner && (
              <span className="text-[9px] bg-yellow-500 text-slate-950 px-1 rounded-sm font-mono font-black leading-none py-0.5 shadow-sm">
                ✓
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
