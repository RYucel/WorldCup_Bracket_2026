/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Team } from "../types";
import { Shield, Swords, Star, Flame, User } from "lucide-react";

interface TeamCardProps {
  key?: React.Key;
  team: Team;
  isSelected?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
  variant?: "compact" | "detailed" | "voting";
}

export default function TeamCard({ team, isSelected = false, isLocked = false, onClick, variant = "detailed" }: TeamCardProps) {
  const flagUrl = `https://flagcdn.com/w160/${team.flagCode}.png`;

  if (variant === "voting") {
    return (
      <button
        id={`team-voting-card-${team.id}`}
        onClick={onClick}
        disabled={isLocked}
        className={`relative w-full text-left overflow-hidden rounded-sm border-2 p-6 transition-all duration-300 transform ${!isLocked ? "active:scale-[0.98]" : ""} focus:outline-none ${
          isSelected
            ? "border-yellow-500 bg-blue-950/40 shadow-[0_0_20px_rgba(234,179,8,0.25)] scale-[1.01]"
            : `border-white/10 bg-white/5 ${!isLocked ? "hover:border-yellow-500/50 hover:bg-blue-900/20 hover:scale-[1.01]" : "opacity-60 grayscale-[50%]"}`
        }`}
      >
        {/* Color Accent Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${team.colors.primary}, ${team.colors.secondary})`,
          }}
        />

        <div className="flex flex-col items-center text-center space-y-4">
          {/* Large Flag with shadow */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity blur" />
            <img
              src={flagUrl}
              alt={`${team.name} Bayrağı`}
              referrerPolicy="no-referrer"
              className="relative w-28 h-18 object-cover rounded-lg shadow-md border border-slate-700"
            />
          </div>

          <div>
            <span className="font-mono text-xs text-yellow-500 tracking-wider font-semibold uppercase">
              {team.id}
            </span>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight mt-0.5">
              {team.name}
            </h3>
            <div className="mt-1 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase bg-slate-900/50 inline-block px-2 py-0.5 rounded border border-slate-800">
              ELO: <span className="text-yellow-400">{team.rating.overall}</span>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(team.stars)
                    ? "text-yellow-400 fill-yellow-400"
                    : team.stars % 1 !== 0 && i === Math.floor(team.stars)
                    ? "text-yellow-400 fill-yellow-400 opacity-50"
                    : "text-slate-600"
                }`}
              />
            ))}
          </div>

          {/* Core Stats Progress Bars */}
          <div className="w-full space-y-2 pt-2 border-t border-slate-800/80">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Swords className="w-3.5 h-3.5 text-red-400" /> Hücum
                </span>
                <span className="text-white font-semibold">{team.rating.attack}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${team.rating.attack}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-blue-400" /> Orta Saha
                </span>
                <span className="text-white font-semibold">{team.rating.midfield}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${team.rating.midfield}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-green-400" /> Savunma
                </span>
                <span className="text-white font-semibold">{team.rating.defense}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${team.rating.defense}%` }}
                />
              </div>
            </div>
          </div>

          {/* Coach & Star Player Info */}
          <div className="w-full pt-3 mt-1 border-t border-slate-800/80 flex flex-col space-y-1.5 text-left text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-yellow-500/80 shrink-0" />
              <span className="truncate">
                <strong className="text-slate-300">Yıldız:</strong> {team.keyPlayer}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-500/80 shrink-0 font-semibold">T.D:</span>
              <span className="truncate">
                <strong className="text-slate-300">Hoca:</strong> {team.coach}
              </span>
            </div>
          </div>

          {/* Action Choice Button */}
          <div
            className={`w-full py-2.5 rounded-sm font-bold text-xs uppercase italic transform skew-x-[-10deg] transition-all text-center ${
              isSelected
                ? isLocked ? "bg-yellow-500 text-slate-950 font-black" : "bg-yellow-500 text-slate-950 font-black shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                : isLocked ? "bg-white/5 text-slate-500" : "bg-white/10 text-slate-200 hover:bg-yellow-500/20 hover:text-yellow-400"
            }`}
          >
            <span className="inline-block transform skew-x-[10deg]">
              {isLocked 
                ? (isSelected ? "TUR ATLADI" : "ELENDİ")
                : (isSelected ? "SEÇİLDİ" : "BUNU SEÇ")}
            </span>
          </div>
        </div>
      </button>
    );
  }

  // Detailed Dictionary Card
  return (
    <div
      id={`team-card-${team.id}`}
      className="relative overflow-hidden rounded-sm border border-white/10 bg-white/5 p-4 transition-all hover:border-yellow-500/40 hover:bg-blue-950/20 flex flex-col justify-between"
    >
      <div className="flex items-center space-x-3">
        <img
          src={flagUrl}
          alt={`${team.name} flag`}
          referrerPolicy="no-referrer"
          className="w-12 h-8 object-cover rounded shadow border border-slate-800"
        />
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] text-yellow-500 tracking-wider font-semibold">
              {team.id}
            </span>
            <span className="font-mono text-[9px] px-1 bg-yellow-500/20 text-yellow-300 rounded border border-yellow-500/30">
              ELO: {team.rating.overall}
            </span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(team.stars)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-800"
                  }`}
                />
              ))}
            </div>
          </div>
          <h4 className="font-display text-base font-bold text-white truncate">
            {team.name}
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-900 text-center">
        <div>
          <span className="text-[10px] text-slate-500 block">HÜCUM</span>
          <span className="text-xs font-semibold text-red-400 font-mono">{team.rating.attack}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">ORTA</span>
          <span className="text-xs font-semibold text-blue-400 font-mono">{team.rating.midfield}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">SAVUNMA</span>
          <span className="text-xs font-semibold text-green-400 font-mono">{team.rating.defense}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-900/60 flex flex-col space-y-1 text-[11px] text-slate-400">
        <div className="truncate">
          <span className="text-slate-500">Yıldız:</span> {team.keyPlayer}
        </div>
        <div className="truncate">
          <span className="text-slate-500">Teknik:</span> {team.coach}
        </div>
      </div>
    </div>
  );
}
