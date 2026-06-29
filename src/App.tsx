/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Team, Match, TEAMS, INITIAL_MATCHES } from "./types";
import TeamCard from "./components/TeamCard";
import BracketNode from "./components/BracketNode";
import TrophyCeremony from "./components/TrophyCeremony";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Dices,
  RotateCcw,
  BookOpen,
  GitBranch,
  Play,
  ArrowLeft,
  ArrowRight,
  Info,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Target,
  Swords,
  Flame,
  Shield,
  HelpCircle,
  Share2
} from "lucide-react";

const getCleanInitialMatches = (): Match[] => {
  return INITIAL_MATCHES.map(m => ({ ...m }));
};

export default function App() {
  // Main state
  const [matches, setMatches] = useState<Match[]>(() => {
    // Attempt local storage load
    const saved = localStorage.getItem("wc_predictions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getCleanInitialMatches();
      }
    }
    return getCleanInitialMatches();
  });

  const [activeMatchId, setActiveMatchId] = useState<string>("L1");
  const [activeTab, setActiveTab] = useState<"predictor" | "bracket" | "teams">("predictor");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bracketViewSegment, setBracketViewSegment] = useState<"left" | "center" | "right">("center");
  const [showCeremony, setShowCeremony] = useState<boolean>(false);

  // Save predictions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wc_predictions", JSON.stringify(matches));
  }, [matches]);

  // Audio synthesis feedback
  const playSound = (type: "click" | "success" | "fanfare" | "reset") => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "success") {
        const notes = [293.66, 349.23, 440.00, 587.33]; // D minor/F Major ascending feel
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06);
          gain.gain.setValueAtTime(0.0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + index * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.06 + 0.25);
          osc.start();
          osc.stop(ctx.currentTime + index * 0.06 + 0.3);
        });
      } else if (type === "fanfare") {
        const chords = [
          [261.63, 329.63, 392.00], // C major
          [349.23, 440.00, 523.25], // F major
          [392.00, 493.88, 587.33, 783.99] // G major & Octave G
        ];
        chords.forEach((chord, chordIndex) => {
          chord.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + chordIndex * 0.22);
            gain.gain.setValueAtTime(0.0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + chordIndex * 0.22 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + chordIndex * 0.22 + 0.45);
            osc.start();
            osc.stop(ctx.currentTime + chordIndex * 0.22 + 0.5);
          });
        });
      } else if (type === "reset") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // Ignored if browser blocks context
    }
  };

  // Get current match & team objects
  const activeMatch = matches.find(m => m.id === activeMatchId) || matches[0];
  const team1 = activeMatch.team1Id ? TEAMS[activeMatch.team1Id] : null;
  const team2 = activeMatch.team2Id ? TEAMS[activeMatch.team2Id] : null;

  // Auto-advance helper to find next match with both teams decided but unpredicted
  const findNextMatchToPredict = (currentMatches: Match[]): string | null => {
    const stages: ("son32" | "son16" | "ceyrek" | "yarifinal" | "final")[] = [
      "son32",
      "son16",
      "ceyrek",
      "yarifinal",
      "final"
    ];

    for (const stage of stages) {
      const stageMatches = currentMatches.filter(m => m.stage === stage);
      const unpredicted = stageMatches.find(
        m => m.team1Id !== null && m.team2Id !== null && m.winnerId === null
      );
      if (unpredicted) {
        return unpredicted.id;
      }
    }
    return null;
  };

  // Select match winner and propagate to subsequent match slots
  const selectWinner = (matchId: string, winnerId: string) => {
    playSound("success");

    let updated = matches.map(m => {
      if (m.id === matchId) {
        return { ...m, winnerId };
      }
      return m;
    });

    // Recursive cascade propagator
    const triggerCascadeReset = (mId: string, prevWinnerId: string | null) => {
      const parentMatch = updated.find(x => x.id === mId);
      if (!parentMatch || !parentMatch.nextMatchId) return;

      const nextId = parentMatch.nextMatchId;
      const slot = parentMatch.nextMatchSlot;

      const nextMatchIndex = updated.findIndex(x => x.id === nextId);
      if (nextMatchIndex === -1) return;

      const nextMatch = updated[nextMatchIndex];
      const oldCompetitor = slot === 1 ? nextMatch.team1Id : nextMatch.team2Id;

      // Put winner in appropriate slot of next match
      updated[nextMatchIndex] = {
        ...nextMatch,
        team1Id: slot === 1 ? winnerId : nextMatch.team1Id,
        team2Id: slot === 2 ? winnerId : nextMatch.team2Id
      };

      // If the team actually changed, reset the old prediction of that future match
      if (oldCompetitor !== winnerId) {
        const oldNextWinner = nextMatch.winnerId;
        updated[nextMatchIndex].winnerId = null;
        if (oldNextWinner) {
          triggerCascadeReset(nextId, oldNextWinner);
        }
      }
    };

    const originalMatch = matches.find(x => x.id === matchId);
    if (originalMatch && originalMatch.nextMatchId) {
      triggerCascadeReset(matchId, originalMatch.winnerId);
    }

    setMatches(updated);

    // Auto advance wizard to the next available match
    const nextId = findNextMatchToPredict(updated);
    if (nextId) {
      setActiveMatchId(nextId);
    } else {
      // If final is predicted, play grand victory music!
      const finalMatch = updated.find(m => m.id === "F31");
      if (finalMatch && finalMatch.winnerId) {
        playSound("fanfare");
      }
    }
  };

  // Reset all predictions
  const handleReset = () => {
    if (confirm("Tüm tahminlerinizi sıfırlamak istediğinize emin misiniz?")) {
      playSound("reset");
      setMatches(getCleanInitialMatches());
      setActiveMatchId("L1");
      setActiveTab("predictor");
    }
  };

  // Smart Auto-Fill (Simulator with stats + upset chance)
  const handleAutoFill = () => {
    playSound("success");
    let currentMatches = getCleanInitialMatches();

    const stages: ("son32" | "son16" | "ceyrek" | "yarifinal" | "final")[] = [
      "son32",
      "son16",
      "ceyrek",
      "yarifinal",
      "final"
    ];

    for (const stage of stages) {
      const stageMatches = currentMatches.filter(m => m.stage === stage);

      for (const match of stageMatches) {
        // Only simulate if both teams are decided
        if (match.team1Id && match.team2Id) {
          const t1 = TEAMS[match.team1Id];
          const t2 = TEAMS[match.team2Id];

          // Calculate winner probability based on overall rating
          const totalRating = t1.rating.overall + t2.rating.overall;
          const baseProb = t1.rating.overall / totalRating; // e.g. 88 / (88+75) = 54%

          // Exaggerate probability slightly for realism, adding standard deviation
          const t1Chance = baseProb + 0.1 * (baseProb - 0.5);
          const roll = Math.random();

          const winnerId = roll < t1Chance ? t1.id : t2.id;
          match.winnerId = winnerId;

          // Propagate to next stage match
          if (match.nextMatchId) {
            const nextIdx = currentMatches.findIndex(nm => nm.id === match.nextMatchId);
            if (nextIdx !== -1) {
              if (match.nextMatchSlot === 1) {
                currentMatches[nextIdx].team1Id = winnerId;
              } else {
                currentMatches[nextIdx].team2Id = winnerId;
              }
            }
          }
        }
      }
    }

    setMatches(currentMatches);
    setActiveMatchId("F31");
    setActiveTab("bracket");
    playSound("fanfare");
  };

  // Total predictions counter
  const completedPredictionsCount = matches.filter(m => m.winnerId !== null).length;
  const progressPercent = Math.round((completedPredictionsCount / 31) * 100);

  // Check if champion is found
  const finalMatch = matches.find(m => m.id === "F31");
  const champion = finalMatch && finalMatch.winnerId ? TEAMS[finalMatch.winnerId] : null;

  // Auto-manage ceremony overlay when champion is found
  useEffect(() => {
    if (champion) {
      setShowCeremony(true);
    } else {
      setShowCeremony(false);
    }
  }, [champion]);

  // Predictor navigation
  const navigatePredictor = (direction: "prev" | "next") => {
    playSound("click");
    // Sort matches in custom wizard order
    const orderedIds = [
      // Son 32 left
      "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8",
      // Son 32 right
      "R9", "R10", "R11", "R12", "R13", "R14", "R15", "R16",
      // Son 16 left
      "L17", "L18", "L19", "L20",
      // Son 16 right
      "R21", "R22", "R23", "R24",
      // Ceyrek left
      "L25", "L26",
      // Ceyrek right
      "R27", "R28",
      // Yari left
      "L29",
      // Yari right
      "R30",
      // Final
      "F31"
    ];

    const currentIdx = orderedIds.indexOf(activeMatchId);
    if (direction === "prev" && currentIdx > 0) {
      setActiveMatchId(orderedIds[currentIdx - 1]);
    } else if (direction === "next" && currentIdx < orderedIds.length - 1) {
      setActiveMatchId(orderedIds[currentIdx + 1]);
    }
  };

  // Supercomputer analysis commentary generator
  const getSupercomputerAnalysis = () => {
    if (!team1 || !team2) {
      return "Eşleşecek takımlar bekleniyor. Bir önceki turlardaki maçları tahmin ederek bu maçı aktif hale getirebilirsiniz.";
    }

    const diff = team1.rating.overall - team2.rating.overall;
    const favorite = diff >= 0 ? team1 : team2;
    const underdog = diff >= 0 ? team2 : team1;

    let text = "";
    if (Math.abs(diff) < 3) {
      text = `Süper Bilgisayar analizi bu maçı %50-%50 kafa kafaya görüyor. ${team1.name} ekibinin kreatif orta sahası (${team1.rating.midfield}) ile ${team2.name} ekibinin dinamik orta saha hattı (${team2.rating.midfield}) arasında müthiş bir taktik savaş yaşanacaktır. Karar tamamen sizde!`;
    } else {
      const chance = Math.round(55 + Math.min(Math.abs(diff) * 3, 35));
      text = `İstatistiksel modellemelere göre ${favorite.name} ekibi %${chance} ihtimalle turun net favorisi. ${favorite.name} kadrosundaki ${favorite.keyPlayer}, rakipleri ${underdog.name} savunmasını (${underdog.rating.defense}) sarsabilecek kalitede. Ancak Dünya Kupası sürprizlerle doludur!`;
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a_0%,_transparent_60%)]">
      
      {/* Dynamic Background Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Main Broadcast Header */}
      <header className="relative bg-gradient-to-b from-blue-900/30 to-slate-950/90 border-b border-white/10 backdrop-blur-md sticky top-0 z-40 px-4 py-4 md:py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Vibe */}
          <div className="flex items-center space-x-4 text-center md:text-left">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)] shrink-0">
              <Trophy className="w-7 h-7 text-slate-950 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
                DÜNYA KUPASI BRAKETİ
              </h1>
              <p className="text-[11px] font-mono text-blue-400 tracking-widest font-bold uppercase">
                SON 32 TAHMİN ARENASI
              </p>
            </div>
          </div>

          {/* Tournament Global Progress Bar */}
          <div className="w-full md:w-80 space-y-1.5 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium font-sans flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-yellow-500" /> Tahmin Tamamlandı
              </span>
              <span className="font-mono font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                {completedPredictionsCount} / 31
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2.5">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playSound("click");
              }}
              title="Sesi Aç/Kapat"
              className="p-2.5 rounded-sm bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10 active:scale-95"
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5 text-yellow-500" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>

            {/* Auto-Fill Sim */}
            <button
              onClick={handleAutoFill}
              title="Sürpriz Seçim Yap"
              className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs py-2.5 px-4 rounded-sm transition-colors uppercase italic transform skew-x-[-10deg] shadow-[0_0_15px_rgba(234,179,8,0.3)] active:scale-95"
            >
              <Dices className="w-4 h-4 text-slate-950 transform skew-x-[10deg]" />
              <span className="hidden sm:inline transform skew-x-[10deg]">Sürpriz Seçim</span>
            </button>

            {/* Clear All */}
            <button
              onClick={handleReset}
              title="Braketi Sıfırla"
              className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs py-2.5 px-3.5 rounded-sm transition border border-red-500/30 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Sıfırla</span>
            </button>
          </div>

        </div>
      </header>

      {/* Champion Celebration Floating Bar */}
      {champion && !showCeremony && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-500/10 via-amber-500/20 to-yellow-500/10 border-b border-yellow-500/30 py-3.5 px-4 text-center text-xs text-yellow-300 font-bold tracking-wider relative flex flex-col md:flex-row items-center justify-center gap-3 z-30 shadow-md"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500 animate-bounce" />
            <span>Tebrikler! 2026 Dünya Kupası Şampiyonunuz belirlendi: <span className="font-black text-white italic uppercase">{champion.name}</span></span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                playSound("success");
                setShowCeremony(true);
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-[10px] py-1.5 px-3.5 rounded-sm uppercase tracking-widest transition-all active:scale-95 transform skew-x-[-10deg]"
            >
              <span className="inline-block transform skew-x-[10deg]">Kupa Seremonisini İzle 🏆</span>
            </button>
            <button
              onClick={() => {
                playSound("click");
                setMatches(getCleanInitialMatches());
                setActiveMatchId("L1");
                setActiveTab("predictor");
              }}
              className="bg-white/15 hover:bg-white/20 text-white font-bold text-[10px] py-1.5 px-3.5 rounded-sm uppercase tracking-widest transition-all active:scale-95 transform skew-x-[-10deg] border border-white/10"
            >
              <span className="inline-block transform skew-x-[10deg] flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Yeniden Tahmin Et
              </span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="bg-slate-900/60 border-b border-white/10 py-3 px-4 sticky top-18 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-start gap-3">
          
          <button
            onClick={() => {
              playSound("click");
              setActiveTab("predictor");
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs uppercase font-black tracking-wider transition duration-200 transform skew-x-[-10deg] ${
              activeTab === "predictor"
                ? "bg-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.3)] font-black"
                : "text-slate-300 hover:text-slate-100 bg-white/5 hover:bg-white/10 border border-white/10"
            }`}
          >
            <div className="transform skew-x-[10deg] flex items-center gap-2">
              <Play className="w-4 h-4" />
              EŞLEŞME SEÇİM ALANI
            </div>
          </button>

          <button
            onClick={() => {
              playSound("click");
              setActiveTab("bracket");
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs uppercase font-black tracking-wider transition duration-200 transform skew-x-[-10deg] ${
              activeTab === "bracket"
                ? "bg-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.3)] font-black"
                : "text-slate-300 hover:text-slate-100 bg-white/5 hover:bg-white/10 border border-white/10"
            }`}
          >
            <div className="transform skew-x-[10deg] flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              TURNUVA AĞACI (BRAKET)
            </div>
          </button>

          <button
            onClick={() => {
              playSound("click");
              setActiveTab("teams");
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs uppercase font-black tracking-wider transition duration-200 transform skew-x-[-10deg] ${
              activeTab === "teams"
                ? "bg-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.3)] font-black"
                : "text-slate-300 hover:text-slate-100 bg-white/5 hover:bg-white/10 border border-white/10"
            }`}
          >
            <div className="transform skew-x-[10deg] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              TAKIM KILAVUZU
            </div>
          </button>

        </div>
      </div>

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">

        {/* 1. TAHMİN SİHİRBAZI TAB */}
        {activeTab === "predictor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Col: Match Prediction Arena (Cards) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Match Header Navigation Card */}
              <div className="bg-white/5 border border-white/10 rounded-sm p-4 flex justify-between items-center shadow-lg">
                <button
                  onClick={() => navigatePredictor("prev")}
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-sm border border-white/10 transition active:scale-95 flex items-center gap-1 text-xs font-bold uppercase italic transform skew-x-[-10deg]"
                >
                  <span className="flex items-center gap-1 transform skew-x-[10deg]"><ChevronLeft className="w-4 h-4" /> Geri</span>
                </button>
                
                <div className="text-center">
                  <span className="text-[10px] font-mono text-yellow-500 tracking-widest uppercase font-black">
                    AKTİF MAÇ {activeMatch.id}
                  </span>
                  <h2 className="text-sm font-black text-white mt-0.5 uppercase italic tracking-tight">
                    {activeMatch.label}
                  </h2>
                </div>

                <button
                  onClick={() => navigatePredictor("next")}
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-sm border border-white/10 transition active:scale-95 flex items-center gap-1 text-xs font-bold uppercase italic transform skew-x-[-10deg]"
                >
                  <span className="flex items-center gap-1 transform skew-x-[10deg]">İleri <ChevronRight className="w-4 h-4" /></span>
                </button>
              </div>

              {/* Central Dual Selection Area */}
              <div className="relative rounded-sm overflow-hidden border border-white/10 bg-white/5">
                {/* Visual Glow behind card based on team colors */}
                <div
                  className="absolute inset-0 opacity-10 transition-all duration-700 pointer-events-none blur-3xl"
                  style={{
                    background: team1 && team2
                      ? `linear-gradient(135deg, ${team1.colors.primary}, ${team2.colors.secondary})`
                      : "radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)"
                  }}
                />

                <div className="relative p-6 md:p-10 space-y-8">
                  {team1 && team2 ? (
                    <>
                      {/* Big Versus Header */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120px] md:-translate-y-[140px] z-10">
                        <div className="bg-slate-950 border-2 border-slate-800 text-yellow-400 text-sm md:text-base font-mono font-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-2xl">
                          VS
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 relative">
                        {/* Team 1 voting option */}
                        <TeamCard
                          team={team1}
                          isSelected={activeMatch.winnerId === team1.id}
                          variant="voting"
                          onClick={() => selectWinner(activeMatch.id, team1.id)}
                        />

                        {/* Team 2 voting option */}
                        <TeamCard
                          team={team2}
                          isSelected={activeMatch.winnerId === team2.id}
                          variant="voting"
                          onClick={() => selectWinner(activeMatch.id, team2.id)}
                        />
                      </div>

                      {/* Optional Score Input */}
                      {activeMatch.winnerId && (
                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Gerçek Maç Skoru (Opsiyonel)</span>
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center gap-1.5">
                              <span className="text-[10px] font-black text-slate-300 uppercase truncate w-20 text-center italic">{team1.code}</span>
                              <input 
                                type="number" 
                                min="0"
                                max="20"
                                value={activeMatch.score1 ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value ? parseInt(e.target.value) : null;
                                  setMatches(prev => prev.map(m => m.id === activeMatchId ? { ...m, score1: val } : m));
                                }}
                                className="w-16 h-12 bg-slate-950 border border-white/20 rounded-sm text-center text-lg font-mono font-black text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                              />
                            </div>
                            <span className="text-slate-600 font-bold text-xl">-</span>
                            <div className="flex flex-col items-center gap-1.5">
                              <span className="text-[10px] font-black text-slate-300 uppercase truncate w-20 text-center italic">{team2.code}</span>
                              <input 
                                type="number" 
                                min="0"
                                max="20"
                                value={activeMatch.score2 ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value ? parseInt(e.target.value) : null;
                                  setMatches(prev => prev.map(m => m.id === activeMatchId ? { ...m, score2: val } : m));
                                }}
                                className="w-16 h-12 bg-slate-950 border border-white/20 rounded-sm text-center text-lg font-mono font-black text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="bg-slate-900 p-4 rounded-full border border-slate-800">
                        <HelpCircle className="w-12 h-12 text-slate-600 animate-pulse" />
                      </div>
                      <div className="max-w-md">
                        <h3 className="font-display text-lg font-bold text-white">Eşleşen Takımlar Belirlenmedi</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          Bu çeyrek/yarı final maçı için takımların gelmesi gerekiyor. Lütfen turnuva ağacındaki önceki seviye maçlarının kazananlarını seçin.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Supercomputer analysis dashboard */}
              <div className="bg-white/5 border border-white/10 rounded-sm p-5 space-y-3.5 shadow-lg">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
                  <div className="bg-white/5 p-1.5 rounded-sm border border-white/10">
                    <Volume2 className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span>Süper Bilgisayar Maç Analizi</span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-normal">
                  {getSupercomputerAnalysis()}
                </p>
              </div>

            </div>

            {/* Right Col: Wizard Navigation Queue / Sidebars */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Quick Jump List */}
              <div className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-3 shadow-lg">
                <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
                  <span>Maç Atlama Paneli</span>
                  <span className="text-[10px] font-mono font-medium text-slate-400">Aşamalara Göre</span>
                </h3>

                <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
                  {/* Categorized Jump Nodes */}
                  {(["son32", "son16", "ceyrek", "yarifinal", "final"] as const).map(stage => {
                    const stageMatches = matches.filter(m => m.stage === stage);
                    const stageLabel = stage === "son32" ? "Son 32" : stage === "son16" ? "Son 16" : stage === "ceyrek" ? "Çeyrek F." : stage === "yarifinal" ? "Yarı F." : "Büyük Final";

                    return (
                      <div key={stage} className="space-y-1">
                        <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-wider block">
                          {stageLabel}
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {stageMatches.map(m => {
                            const isSelected = m.id === activeMatchId;
                            const isPredicted = m.winnerId !== null;
                            const isPlayable = m.team1Id !== null && m.team2Id !== null;

                            return (
                              <button
                                key={m.id}
                                onClick={() => {
                                  playSound("click");
                                  setActiveMatchId(m.id);
                                }}
                                className={`py-1.5 px-1 rounded-sm text-[10px] font-mono font-bold border transition ${
                                  isSelected
                                    ? "bg-yellow-500 text-slate-950 border-yellow-500"
                                    : isPredicted
                                    ? "bg-yellow-500/20 text-yellow-200 border-yellow-500/30 hover:bg-yellow-500/30"
                                    : isPlayable
                                    ? "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                                    : "bg-transparent text-slate-600 border-transparent cursor-not-allowed opacity-30"
                                }`}
                              >
                                {m.id}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tournament Legend */}
              <div className="bg-white/5 border border-white/10 rounded-sm p-4 text-xs space-y-2 text-slate-300 shadow-lg">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Nasıl Oynanır?</h4>
                <p>1. Yukarıdaki eşleşmelerden favori gördüğünüz ülkeye tıklayarak bir üst tura geçmesini sağlayın.</p>
                <p>2. Son 32 turları bitince, bir üst turdaki (Son 16) eşleşmeler otomatik olarak seçtiğiniz takımlara göre güncellenecektir.</p>
                <p>3. Büyük Final kazananını seçtiğinizde kupanın kazananını ve detaylı kupa seremonisini göreceksiniz!</p>
              </div>

            </div>
          </div>
        )}

        {/* 2. ETKİLEŞİMLİ TURNUVA AGACI (BRAKET) TAB */}
        {activeTab === "bracket" && (
          <div className="space-y-6">
            
            {/* Mobile View Segment Controls */}
            <div className="flex md:hidden justify-center bg-white/5 p-1.5 rounded-sm border border-white/10">
              <button
                onClick={() => {
                  playSound("click");
                  setBracketViewSegment("left");
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase italic transform skew-x-[-10deg] transition rounded-sm ${
                  bracketViewSegment === "left" ? "bg-yellow-500 text-slate-950 font-black shadow-md" : "text-slate-400"
                }`}
              >
                <span className="inline-block transform skew-x-[10deg]">Sol Kanat</span>
              </button>
              <button
                onClick={() => {
                  playSound("click");
                  setBracketViewSegment("center");
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase italic transform skew-x-[-10deg] transition rounded-sm ${
                  bracketViewSegment === "center" ? "bg-yellow-500 text-slate-950 font-black shadow-md" : "text-slate-400"
                }`}
              >
                <span className="inline-block transform skew-x-[10deg]">Kupa & Final</span>
              </button>
              <button
                onClick={() => {
                  playSound("click");
                  setBracketViewSegment("right");
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase italic transform skew-x-[-10deg] transition rounded-sm ${
                  bracketViewSegment === "right" ? "bg-yellow-500 text-slate-950 font-black shadow-md" : "text-slate-400"
                }`}
              >
                <span className="inline-block transform skew-x-[10deg]">Sağ Kanat</span>
              </button>
            </div>

            {/* Main Visual Bracket Container */}
            <div className="bg-white/5 border border-white/10 rounded-sm p-4 md:p-8 overflow-x-auto relative min-h-[500px] shadow-2xl">
              
              {/* Horizontal Scroll Guide on top on tablet */}
              <div className="hidden md:flex justify-between items-center text-[10px] font-mono text-slate-400 mb-6 bg-white/5 p-2.5 rounded-sm border border-white/10">
                <span className="font-bold uppercase tracking-wider text-blue-400">👈 SOL GRUP (A, B, C, D)</span>
                <span className="font-bold uppercase tracking-wider text-yellow-500">🏆 2026 DÜNYA KUPASI FİNAL ALANI 🏆</span>
                <span className="font-bold uppercase tracking-wider text-blue-400">SAĞ GRUP (E, F, G, H) 👉</span>
              </div>

              {/* Flex Columns Structure */}
              <div
                className="flex items-center justify-between gap-4 md:gap-8 min-w-[1200px] md:min-w-max h-[780px]"
                style={{
                  // On mobile, hide non-selected segments to fit the layout perfectly
                  justifyContent: "space-between"
                }}
              >
                
                {/* COLUMN 1: SON 32 SOL (Left Side Column 1) */}
                <div className={`flex flex-col justify-around h-full ${bracketViewSegment !== "left" ? "hidden md:flex" : "flex"}`}>
                  <div className="text-center font-sans text-[9px] font-black text-yellow-500 bg-white/5 py-1 px-2.5 rounded-sm border border-white/10 mb-1 tracking-widest uppercase italic transform skew-x-[-10deg]"><span className="inline-block transform skew-x-[10deg]">SON 32 (SOL)</span></div>
                  {["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"].map(id => {
                    const m = matches.find(x => x.id === id)!;
                    return (
                      <BracketNode
                        key={m.id}
                        match={m}
                        team1={m.team1Id ? TEAMS[m.team1Id] : null}
                        team2={m.team2Id ? TEAMS[m.team2Id] : null}
                        isActive={activeMatchId === m.id}
                        onSelect={() => {
                          playSound("click");
                          setActiveMatchId(m.id);
                          setActiveTab("predictor");
                        }}
                      />
                    );
                  })}
                </div>

                {/* COLUMN 2: SON 16 SOL */}
                <div className={`flex flex-col justify-around h-full ${bracketViewSegment !== "left" ? "hidden md:flex" : "flex"}`}>
                  <div className="text-center font-sans text-[9px] font-black text-yellow-500 bg-white/5 py-1 px-2.5 rounded-sm border border-white/10 mb-1 tracking-widest uppercase italic transform skew-x-[-10deg]"><span className="inline-block transform skew-x-[10deg]">SON 16 (SOL)</span></div>
                  {["L17", "L18", "L19", "L20"].map(id => {
                    const m = matches.find(x => x.id === id)!;
                    return (
                      <BracketNode
                        key={m.id}
                        match={m}
                        team1={m.team1Id ? TEAMS[m.team1Id] : null}
                        team2={m.team2Id ? TEAMS[m.team2Id] : null}
                        isActive={activeMatchId === m.id}
                        onSelect={() => {
                          playSound("click");
                          setActiveMatchId(m.id);
                          setActiveTab("predictor");
                        }}
                      />
                    );
                  })}
                </div>

                {/* COLUMN 3: ÇEYREK FİNAL SOL */}
                <div className={`flex flex-col justify-around h-full ${bracketViewSegment !== "left" ? "hidden md:flex" : "flex"}`}>
                  <div className="text-center font-sans text-[9px] font-black text-yellow-500 bg-white/5 py-1 px-2.5 rounded-sm border border-white/10 mb-1 tracking-widest uppercase italic transform skew-x-[-10deg]"><span className="inline-block transform skew-x-[10deg]">ÇEYREK F. (SOL)</span></div>
                  {["L25", "L26"].map(id => {
                    const m = matches.find(x => x.id === id)!;
                    return (
                      <BracketNode
                        key={m.id}
                        match={m}
                        team1={m.team1Id ? TEAMS[m.team1Id] : null}
                        team2={m.team2Id ? TEAMS[m.team2Id] : null}
                        isActive={activeMatchId === m.id}
                        onSelect={() => {
                          playSound("click");
                          setActiveMatchId(m.id);
                          setActiveTab("predictor");
                        }}
                      />
                    );
                  })}
                </div>

                {/* COLUMN 4: YARI FİNAL SOL */}
                <div className={`flex flex-col justify-around h-full ${bracketViewSegment !== "left" && bracketViewSegment !== "center" ? "hidden md:flex" : "flex"}`}>
                  <div className="text-center font-sans text-[9px] font-black text-yellow-500 bg-white/5 py-1 px-2.5 rounded-sm border border-white/10 mb-1 tracking-widest uppercase italic transform skew-x-[-10deg]"><span className="inline-block transform skew-x-[10deg]">YARI F. (SOL)</span></div>
                  {["L29"].map(id => {
                    const m = matches.find(x => x.id === id)!;
                    return (
                      <BracketNode
                        key={m.id}
                        match={m}
                        team1={m.team1Id ? TEAMS[m.team1Id] : null}
                        team2={m.team2Id ? TEAMS[m.team2Id] : null}
                        isActive={activeMatchId === m.id}
                        onSelect={() => {
                          playSound("click");
                          setActiveMatchId(m.id);
                          setActiveTab("predictor");
                        }}
                      />
                    );
                  })}
                </div>

                {/* COLUMN 5: CENTER STAGE (GRAND FINAL & TROPHY) */}
                <div className={`flex flex-col items-center justify-center h-full space-y-12 ${bracketViewSegment !== "center" ? "hidden md:flex" : "flex"}`}>
                  
                  {/* Glowing Grand Trophy display */}
                  <div className="text-center relative">
                    {/* Pulsing light */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-yellow-500/15 blur-2xl" />
                    
                    <div className="relative bg-gradient-to-br from-blue-950/40 to-slate-950 p-5 rounded-sm border-2 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.35)] flex flex-col items-center">
                      <Trophy className="w-14 h-14 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                      <span className="text-xs font-black text-white tracking-widest mt-2 uppercase italic">2026 KUPASI</span>
                    </div>
                  </div>

                  {/* FİNAL NODE */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-sans text-yellow-500 font-black tracking-wider mb-2 block bg-white/5 py-1 px-3.5 rounded-sm border border-white/10 uppercase italic transform skew-x-[-10deg]">
                      <span className="inline-block transform skew-x-[10deg]">BÜYÜK FİNAL</span>
                    </span>
                    {["F31"].map(id => {
                      const m = matches.find(x => x.id === id)!;
                      return (
                        <BracketNode
                          key={m.id}
                          match={m}
                          team1={m.team1Id ? TEAMS[m.team1Id] : null}
                          team2={m.team2Id ? TEAMS[m.team2Id] : null}
                          isActive={activeMatchId === m.id}
                          onSelect={() => {
                            playSound("click");
                            setActiveMatchId(m.id);
                            setActiveTab("predictor");
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Quick summary below final node */}
                  {champion ? (
                    <div className="bg-yellow-500 text-slate-950 py-3 px-6 rounded-sm border-2 border-yellow-400 font-black text-xs tracking-widest uppercase text-center shadow-[0_0_20px_rgba(234,179,8,0.4)] transform skew-x-[-10deg]">
                      <span className="inline-block transform skew-x-[10deg]">🏆 ŞAMPİYON: {champion.name}</span>
                    </div>
                  ) : (
                    <div className="bg-white/5 text-slate-500 py-2.5 px-4 rounded-sm border border-white/10 font-bold text-xs uppercase tracking-wider text-center">
                      Finalistleri Belirle
                    </div>
                  )}

                </div>

                {/* COLUMN 6: YARI FİNAL SAĞ */}
                <div className={`flex flex-col justify-around h-full ${bracketViewSegment !== "right" && bracketViewSegment !== "center" ? "hidden md:flex" : "flex"}`}>
                  <div className="text-center font-sans text-[9px] font-black text-yellow-500 bg-white/5 py-1 px-2.5 rounded-sm border border-white/10 mb-1 tracking-widest uppercase italic transform skew-x-[-10deg]"><span className="inline-block transform skew-x-[10deg]">YARI F. (SAĞ)</span></div>
                  {["R30"].map(id => {
                    const m = matches.find(x => x.id === id)!;
                    return (
                      <BracketNode
                        key={m.id}
                        match={m}
                        team1={m.team1Id ? TEAMS[m.team1Id] : null}
                        team2={m.team2Id ? TEAMS[m.team2Id] : null}
                        isActive={activeMatchId === m.id}
                        onSelect={() => {
                          playSound("click");
                          setActiveMatchId(m.id);
                          setActiveTab("predictor");
                        }}
                      />
                    );
                  })}
                </div>

                {/* COLUMN 7: ÇEYREK FİNAL SAĞ */}
                <div className={`flex flex-col justify-around h-full ${bracketViewSegment !== "right" ? "hidden md:flex" : "flex"}`}>
                  <div className="text-center font-sans text-[9px] font-black text-yellow-500 bg-white/5 py-1 px-2.5 rounded-sm border border-white/10 mb-1 tracking-widest uppercase italic transform skew-x-[-10deg]"><span className="inline-block transform skew-x-[10deg]">ÇEYREK F. (SAĞ)</span></div>
                  {["R27", "R28"].map(id => {
                    const m = matches.find(x => x.id === id)!;
                    return (
                      <BracketNode
                        key={m.id}
                        match={m}
                        team1={m.team1Id ? TEAMS[m.team1Id] : null}
                        team2={m.team2Id ? TEAMS[m.team2Id] : null}
                        isActive={activeMatchId === m.id}
                        onSelect={() => {
                          playSound("click");
                          setActiveMatchId(m.id);
                          setActiveTab("predictor");
                        }}
                      />
                    );
                  })}
                </div>

                {/* COLUMN 8: SON 16 SAĞ */}
                <div className={`flex flex-col justify-around h-full ${bracketViewSegment !== "right" ? "hidden md:flex" : "flex"}`}>
                  <div className="text-center font-sans text-[9px] font-black text-yellow-500 bg-white/5 py-1 px-2.5 rounded-sm border border-white/10 mb-1 tracking-widest uppercase italic transform skew-x-[-10deg]"><span className="inline-block transform skew-x-[10deg]">SON 16 (SAĞ)</span></div>
                  {["R21", "R22", "R23", "R24"].map(id => {
                    const m = matches.find(x => x.id === id)!;
                    return (
                      <BracketNode
                        key={m.id}
                        match={m}
                        team1={m.team1Id ? TEAMS[m.team1Id] : null}
                        team2={m.team2Id ? TEAMS[m.team2Id] : null}
                        isActive={activeMatchId === m.id}
                        onSelect={() => {
                          playSound("click");
                          setActiveMatchId(m.id);
                          setActiveTab("predictor");
                        }}
                      />
                    );
                  })}
                </div>

                {/* COLUMN 9: SON 32 SAĞ */}
                <div className={`flex flex-col justify-around h-full ${bracketViewSegment !== "right" ? "hidden md:flex" : "flex"}`}>
                  <div className="text-center font-sans text-[9px] font-black text-yellow-500 bg-white/5 py-1 px-2.5 rounded-sm border border-white/10 mb-1 tracking-widest uppercase italic transform skew-x-[-10deg]"><span className="inline-block transform skew-x-[10deg]">SON 32 (SAĞ)</span></div>
                  {["R9", "R10", "R11", "R12", "R13", "R14", "R15", "R16"].map(id => {
                    const m = matches.find(x => x.id === id)!;
                    return (
                      <BracketNode
                        key={m.id}
                        match={m}
                        team1={m.team1Id ? TEAMS[m.team1Id] : null}
                        team2={m.team2Id ? TEAMS[m.team2Id] : null}
                        isActive={activeMatchId === m.id}
                        onSelect={() => {
                          playSound("click");
                          setActiveMatchId(m.id);
                          setActiveTab("predictor");
                        }}
                      />
                    );
                  })}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 3. TAKIM KILAVUZU (DICTIONARY) TAB */}
        {activeTab === "teams" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-sans text-base font-black text-white uppercase italic tracking-tight">Takım Kılavuzu & İstatistikler</h3>
                <p className="text-xs text-slate-400 mt-0.5">Dünya Kupası'ndaki tüm 32 takımın sanal güçleri, hocaları ve kilit oyuncuları.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Güç sıralaması: En yüksek overall puanlarına göre sıralanmıştır.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.values(TEAMS)
                .sort((a, b) => b.rating.overall - a.rating.overall)
                .map(team => (
                  <TeamCard key={team.id} team={team} variant="detailed" />
                ))}
            </div>
          </div>
        )}

      </main>

      {/* 4. FULL-SCREEN TROPHY CEREMONY MODAL */}
      <AnimatePresence>
        {champion && showCeremony && (
          <TrophyCeremony
            winner={champion}
            matches={matches}
            onRestart={() => {
              playSound("reset");
              setMatches(getCleanInitialMatches());
              setActiveMatchId("L1");
              setActiveTab("predictor");
            }}
            onViewBracket={() => {
              playSound("click");
              setShowCeremony(false);
              setActiveTab("bracket");
            }}
          />
        )}
      </AnimatePresence>

      {/* Visual Stadium Margin Footer */}
      <footer className="mt-auto h-16 bg-slate-900 border-t border-white/5 flex flex-col md:flex-row items-center justify-between px-6 py-4 md:py-0 gap-2">
        <div className="flex gap-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span> SEÇİLDİ / KAZANDI
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border-2 border-white/20 rounded-full"></span> BEKLEYEN MAÇLAR
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono tracking-widest font-bold uppercase">
          © 2026 FIFA WORLD CUP PREDICTOR TOOL
        </p>
      </footer>

    </div>
  );
}
