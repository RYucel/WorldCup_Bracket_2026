/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Team, Match } from "../types";
import { Trophy, Share2, RotateCcw, Flame, Sparkles, Award, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TrophyCeremonyProps {
  winner: Team;
  matches: Match[];
  onRestart: () => void;
  onViewBracket?: () => void;
}

export default function TrophyCeremony({ winner, matches, onRestart, onViewBracket }: TrophyCeremonyProps) {
  const [particles, setParticles] = useState<{ id: number; left: string; delay: string; duration: string; scale: number }[]>([]);

  useEffect(() => {
    // Generate beautiful random golden sparkles
    const generated = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${3 + Math.random() * 4}s`,
      scale: 0.5 + Math.random() * 1.5,
    }));
    setParticles(generated);
  }, [winner]);

  // Find the path to championship
  // Let's filter matches won by the champion
  const championMatches = matches.filter(m => m.winnerId === winner.id);
  // Sort stages chronologically
  const stageOrder = { son32: 1, son16: 2, ceyrek: 3, yarifinal: 4, final: 5 };
  const sortedPath = [...championMatches].sort((a, b) => stageOrder[a.stage] - stageOrder[b.stage]);

  const getOpponentName = (match: Match, championId: string) => {
    const oppId = match.team1Id === championId ? match.team2Id : match.team1Id;
    return oppId || "Bilinmiyor";
  };

  const getStageTurkish = (stage: string) => {
    switch (stage) {
      case "son32": return "Son 32";
      case "son16": return "Son 16";
      case "ceyrek": return "Çeyrek Final";
      case "yarifinal": return "Yarı Final";
      case "final": return "BÜYÜK FİNAL";
      default: return stage;
    }
  };

  const [copied, setCopied] = useState(false);

  const copyRecapText = () => {
    const recap = sortedPath.map(m => {
      const opp = getOpponentName(m, winner.id);
      return `${getStageTurkish(m.stage)}: ${winner.name} vs ${opp}`;
    }).join("\n");
    
    const textToCopy = `🏆 2026 DÜNYA KUPASI ŞAMPİYONUM: ${winner.name}! 🏆\n\nŞampiyonluk Yolculuğu:\n${recap}\n\nSen de kendi braketini oluştur ve şampiyonunu bul!`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#060813]/98 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Falling Golden Confetti Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ y: "-10%", opacity: 0, rotate: 0 }}
            animate={{ y: "110%", opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{
              duration: parseFloat(p.duration),
              repeat: Infinity,
              delay: parseFloat(p.delay),
              ease: "linear",
            }}
            className="absolute text-yellow-400 font-mono text-xl select-none"
            style={{
              left: p.left,
              transform: `scale(${p.scale})`,
            }}
          >
            {["★", "✦", "♦", "●", "★"][p.id % 5]}
          </motion.div>
        ))}
      </div>

      <div className="relative w-full max-w-4xl bg-slate-950/90 border border-white/10 rounded-sm p-6 md:p-10 shadow-2xl shadow-yellow-500/5 my-8">
        {/* Glow behind trophy */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-6 relative">
          
          {/* Trophy Header Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="relative bg-yellow-500 p-5 rounded-sm shadow-lg shadow-yellow-500/20"
          >
            <Trophy className="w-16 h-16 text-slate-950 stroke-[2]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-sm border-2 border-dashed border-yellow-200/50 pointer-events-none"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs md:text-sm font-mono text-yellow-500 font-bold tracking-widest uppercase flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" /> 2026 DÜNYA KUPASI ŞAMPİYONU <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.span>

          {/* Champion Flag & Name */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-sm blur opacity-50 group-hover:opacity-70 transition duration-1000" />
              <img
                src={`https://flagcdn.com/w320/${winner.flagCode}.png`}
                alt={winner.name}
                referrerPolicy="no-referrer"
                className="relative w-48 md:w-64 h-32 md:h-44 object-cover rounded-sm border-4 border-slate-950 shadow-2xl"
              />
            </div>
            
            <div>
              <h1 className="font-sans text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md uppercase italic transform skew-x-[-5deg]">
                {winner.name}
              </h1>
              <p className="text-xs font-black text-yellow-500 tracking-widest mt-2 uppercase italic">
                KUPAYI MÜZESİNE GÖTÜRÜYOR!
              </p>
            </div>
          </motion.div>

          {/* Golden Stars display */}
          <div className="flex justify-center space-x-1.5 py-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
            ))}
          </div>

          {/* Coach and Key player spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl bg-white/5 rounded-sm p-4 border border-white/10 text-left">
            <div className="flex items-center space-x-3.5 p-1">
              <div className="bg-yellow-500/10 p-2.5 rounded-sm border border-yellow-500/20 text-yellow-500 shrink-0">
                <Award className="w-6 h-6 animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Turnuvanın Yıldızı</span>
                <span className="text-base font-black text-white uppercase truncate block italic">{winner.keyPlayer}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-1">
              <div className="bg-yellow-500/10 p-2.5 rounded-sm border border-yellow-500/20 text-yellow-500 shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold tracking-wider">Altın Beyin (Teknik Direktör)</span>
                <span className="text-base font-black text-white uppercase truncate block italic">{winner.coach}</span>
              </div>
            </div>
          </div>

          {/* Path of Victory Section */}
          <div className="w-full max-w-2xl text-left space-y-3">
            <h3 className="font-sans text-sm font-black text-slate-200 border-b border-white/10 pb-2 flex items-center gap-2 uppercase tracking-wider italic">
              🏆 ŞAMPİYONLUK YOLU
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {sortedPath.map((m, index) => {
                const opponentCode = getOpponentName(m, winner.id);
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-sm bg-white/5 border border-white/10 hover:border-white/20 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-[9px] font-mono font-black bg-yellow-500 text-slate-950 px-2 py-0.5 rounded-sm uppercase tracking-wider italic transform skew-x-[-10deg]">
                        <span className="inline-block transform skew-x-[10deg]">{getStageTurkish(m.stage)}</span>
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        {winner.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2.5 text-xs">
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-400">Rakip:</span>
                      <span className="font-black text-yellow-500 tracking-wide bg-white/5 px-2.5 py-1 rounded-sm border border-white/10 text-[10px] uppercase">
                        {opponentCode}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 w-full max-w-2xl pt-4">
            <button
              onClick={copyRecapText}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold uppercase italic tracking-wider py-3.5 px-6 rounded-sm border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2 transform skew-x-[-10deg]"
            >
              <span className="inline-block transform skew-x-[10deg] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-yellow-500" />
                {copied ? "Panoya Kopyalandı!" : "Yolculuğu Paylaş"}
              </span>
            </button>
            
            {onViewBracket && (
              <button
                onClick={onViewBracket}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold uppercase italic tracking-wider py-3.5 px-6 rounded-sm border border-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 transform skew-x-[-10deg]"
              >
                <span className="inline-block transform skew-x-[10deg] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  Braket Ağacını İncele
                </span>
              </button>
            )}

            <button
              onClick={onRestart}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black uppercase italic tracking-widest py-3.5 px-6 rounded-sm shadow-lg shadow-yellow-500/10 transition-all active:scale-95 flex items-center justify-center gap-2 transform skew-x-[-10deg]"
            >
              <span className="inline-block transform skew-x-[10deg] flex items-center gap-2">
                <RotateCcw className="w-4 h-4 stroke-[3]" />
                Yeniden Tahmin Et
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
