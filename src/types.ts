/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Team {
  id: string; // Three-letter code, e.g., "ALM", "FRA"
  code: string;
  name: string;
  flagCode: string; // ISO 3166-1 alpha-2 code for flags
  rating: {
    attack: number;
    midfield: number;
    defense: number;
    overall: number;
  };
  stars: number;
  coach: string;
  keyPlayer: string;
  colors: {
    primary: string; // Tailwind hex or class color
    secondary: string;
  };
}

export interface Match {
  id: string;
  team1Id: string | null;
  team2Id: string | null;
  winnerId: string | null;
  score1?: number | null;
  score2?: number | null;
  stage: 'son32' | 'son16' | 'ceyrek' | 'yarifinal' | 'final';
  nextMatchId: string | null;
  nextMatchSlot: 1 | 2; // Feeds team1 (1) or team2 (2) of next match
  side: 'left' | 'right' | 'center';
  label: string; // Turkish stage label, e.g., "Son 32 - Maç 1"
}

export const TEAMS: Record<string, Team> = {
  ALM: {
    id: "ALM",
    code: "ALM",
    name: "Almanya",
    flagCode: "de",
    rating: { attack: 88, midfield: 90, defense: 86, overall: 88 },
    stars: 5,
    coach: "Julian Nagelsmann",
    keyPlayer: "Jamal Musiala",
    colors: { primary: "#000000", secondary: "#DD0000" }
  },
  PAR: {
    id: "PAR",
    code: "PAR",
    name: "Paraguay",
    flagCode: "py",
    rating: { attack: 74, midfield: 75, defense: 76, overall: 75 },
    stars: 3,
    coach: "Daniel Garnero",
    keyPlayer: "Miguel Almirón",
    colors: { primary: "#D52B1E", secondary: "#0038A8" }
  },
  FRA: {
    id: "FRA",
    code: "FRA",
    name: "Fransa",
    flagCode: "fr",
    rating: { attack: 92, midfield: 89, defense: 88, overall: 90 },
    stars: 5,
    coach: "Didier Deschamps",
    keyPlayer: "Kylian Mbappé",
    colors: { primary: "#002395", secondary: "#ED2939" }
  },
  ISV: {
    id: "ISV",
    code: "ISV",
    name: "İsveç",
    flagCode: "se",
    rating: { attack: 80, midfield: 78, defense: 77, overall: 78 },
    stars: 3.5,
    coach: "Jon Dahl Tomasson",
    keyPlayer: "Viktor Gyökeres",
    colors: { primary: "#006AA7", secondary: "#FECC00" }
  },
  GAF: {
    id: "GAF",
    code: "GAF",
    name: "Güney Afrika",
    flagCode: "za",
    rating: { attack: 72, midfield: 73, defense: 71, overall: 72 },
    stars: 3,
    coach: "Hugo Broos",
    keyPlayer: "Percy Tau",
    colors: { primary: "#007A4D", secondary: "#F4B21F" }
  },
  KAN: {
    id: "KAN",
    code: "KAN",
    name: "Kanada",
    flagCode: "ca",
    rating: { attack: 78, midfield: 76, defense: 75, overall: 76 },
    stars: 3.5,
    coach: "Jesse Marsch",
    keyPlayer: "Alphonso Davies",
    colors: { primary: "#FF0000", secondary: "#FFFFFF" }
  },
  HOL: {
    id: "HOL",
    code: "HOL",
    name: "Hollanda",
    flagCode: "nl",
    rating: { attack: 84, midfield: 86, defense: 87, overall: 86 },
    stars: 4.5,
    coach: "Ronald Koeman",
    keyPlayer: "Virgil van Dijk",
    colors: { primary: "#FF4F00", secondary: "#21468B" }
  },
  FAS: {
    id: "FAS",
    code: "FAS",
    name: "Fas",
    flagCode: "ma",
    rating: { attack: 82, midfield: 84, defense: 83, overall: 83 },
    stars: 4,
    coach: "Walid Regragui",
    keyPlayer: "Achraf Hakimi",
    colors: { primary: "#C1272D", secondary: "#006233" }
  },
  POR: {
    id: "POR",
    code: "POR",
    name: "Portekiz",
    flagCode: "pt",
    rating: { attack: 89, midfield: 88, defense: 85, overall: 87 },
    stars: 4.5,
    coach: "Roberto Martínez",
    keyPlayer: "Cristiano Ronaldo",
    colors: { primary: "#046A38", secondary: "#DA291C" }
  },
  HIR: {
    id: "HIR",
    code: "HIR",
    name: "Hırvatistan",
    flagCode: "hr",
    rating: { attack: 79, midfield: 85, defense: 81, overall: 82 },
    stars: 4,
    coach: "Zlatko Dalić",
    keyPlayer: "Luka Modrić",
    colors: { primary: "#C8102E", secondary: "#002F6C" }
  },
  ISP: {
    id: "ISP",
    code: "ISP",
    name: "İspanya",
    flagCode: "es",
    rating: { attack: 87, midfield: 91, defense: 85, overall: 88 },
    stars: 5,
    coach: "Luis de la Fuente",
    keyPlayer: "Lamine Yamal",
    colors: { primary: "#C8102E", secondary: "#FFB81C" }
  },
  AUT: {
    id: "AUT",
    code: "AUT",
    name: "Avusturya",
    flagCode: "at",
    rating: { attack: 78, midfield: 80, defense: 79, overall: 79 },
    stars: 3.5,
    coach: "Ralf Rangnick",
    keyPlayer: "Marcel Sabitzer",
    colors: { primary: "#ED2939", secondary: "#FFFFFF" }
  },
  ABD: {
    id: "ABD",
    code: "ABD",
    name: "ABD",
    flagCode: "us",
    rating: { attack: 79, midfield: 78, defense: 77, overall: 78 },
    stars: 3.5,
    coach: "Mauricio Pochettino",
    keyPlayer: "Christian Pulisic",
    colors: { primary: "#0A3161", secondary: "#B31942" }
  },
  BOS: {
    id: "BOS",
    code: "BOS",
    name: "Bosna Hersek",
    flagCode: "ba",
    rating: { attack: 73, midfield: 74, defense: 72, overall: 73 },
    stars: 3,
    coach: "Sergej Barbarez",
    keyPlayer: "Edin Džeko",
    colors: { primary: "#002F6C", secondary: "#FFCD00" }
  },
  BEL: {
    id: "BEL",
    code: "BEL",
    name: "Belçika",
    flagCode: "be",
    rating: { attack: 85, midfield: 84, defense: 80, overall: 83 },
    stars: 4,
    coach: "Domenico Tedesco",
    keyPlayer: "Kevin De Bruyne",
    colors: { primary: "#E30A17", secondary: "#000000" }
  },
  SEN: {
    id: "SEN",
    code: "SEN",
    name: "Senegal",
    flagCode: "sn",
    rating: { attack: 79, midfield: 78, defense: 80, overall: 79 },
    stars: 3.5,
    coach: "Aliou Cissé",
    keyPlayer: "Sadio Mané",
    colors: { primary: "#00853F", secondary: "#FDEF42" }
  },
  BRE: {
    id: "BRE",
    code: "BRE",
    name: "Brezilya",
    flagCode: "br",
    rating: { attack: 91, midfield: 86, defense: 85, overall: 87 },
    stars: 5,
    coach: "Dorival Júnior",
    keyPlayer: "Vinícius Júnior",
    colors: { primary: "#009B3A", secondary: "#FEDF00" }
  },
  JPN: {
    id: "JPN",
    code: "JPN",
    name: "Japonya",
    flagCode: "jp",
    rating: { attack: 81, midfield: 83, defense: 80, overall: 81 },
    stars: 4,
    coach: "Hajime Moriyasu",
    keyPlayer: "Kaoru Mitoma",
    colors: { primary: "#000000", secondary: "#BC002D" }
  },
  FIL: {
    id: "FIL",
    code: "FIL",
    name: "Fildişi Sahili",
    flagCode: "ci",
    rating: { attack: 78, midfield: 81, defense: 79, overall: 79 },
    stars: 3.5,
    coach: "Emerse Faé",
    keyPlayer: "Franck Kessié",
    colors: { primary: "#F77F00", secondary: "#009E60" }
  },
  NOR: {
    id: "NOR",
    code: "NOR",
    name: "Norveç",
    flagCode: "no",
    rating: { attack: 83, midfield: 81, defense: 75, overall: 80 },
    stars: 3.5,
    coach: "Ståle Solbakken",
    keyPlayer: "Erling Haaland",
    colors: { primary: "#EF2B2D", secondary: "#002868" }
  },
  MEK: {
    id: "MEK",
    code: "MEK",
    name: "Meksika",
    flagCode: "mx",
    rating: { attack: 78, midfield: 77, defense: 76, overall: 77 },
    stars: 3.5,
    coach: "Javier Aguirre",
    keyPlayer: "Santiago Giménez",
    colors: { primary: "#006847", secondary: "#CE1126" }
  },
  EKV: {
    id: "EKV",
    code: "EKV",
    name: "Ekvador",
    flagCode: "ec",
    rating: { attack: 76, midfield: 78, defense: 81, overall: 78 },
    stars: 3.5,
    coach: "Sebastián Beccacece",
    keyPlayer: "Piero Hincapié",
    colors: { primary: "#FFDD00", secondary: "#0033A0" }
  },
  ING: {
    id: "ING",
    code: "ING",
    name: "İngiltere",
    flagCode: "gb-eng",
    rating: { attack: 91, midfield: 90, defense: 85, overall: 89 },
    stars: 5,
    coach: "Thomas Tuchel",
    keyPlayer: "Jude Bellingham",
    colors: { primary: "#FFFFFF", secondary: "#000080" }
  },
  KDC: {
    id: "KDC",
    code: "KDC",
    name: "D. Kongo",
    flagCode: "cd",
    rating: { attack: 73, midfield: 72, defense: 74, overall: 73 },
    stars: 3,
    coach: "Sébastien Desabre",
    keyPlayer: "Chancel Mbemba",
    colors: { primary: "#007FFF", secondary: "#F9D616" }
  },
  ARJ: {
    id: "ARJ",
    code: "ARJ",
    name: "Arjantin",
    flagCode: "ar",
    rating: { attack: 90, midfield: 89, defense: 87, overall: 89 },
    stars: 5,
    coach: "Lionel Scaloni",
    keyPlayer: "Lionel Messi",
    colors: { primary: "#75AADB", secondary: "#FFFFFF" }
  },
  KAP: {
    id: "KAP",
    code: "KAP",
    name: "Yeşil Burun",
    flagCode: "cv",
    rating: { attack: 72, midfield: 74, defense: 70, overall: 72 },
    stars: 3,
    coach: "Bubista",
    keyPlayer: "Ryan Mendes",
    colors: { primary: "#003893", secondary: "#CF2027" }
  },
  AUS: {
    id: "AUS",
    code: "AUS",
    name: "Avustralya",
    flagCode: "au",
    rating: { attack: 74, midfield: 75, defense: 74, overall: 74 },
    stars: 3,
    coach: "Tony Popovic",
    keyPlayer: "Harry Souttar",
    colors: { primary: "#00003E", secondary: "#FFCD00" }
  },
  MIS: {
    id: "MIS",
    code: "MIS",
    name: "Mısır",
    flagCode: "eg",
    rating: { attack: 79, midfield: 74, defense: 75, overall: 76 },
    stars: 3.5,
    coach: "Hossam Hassan",
    keyPlayer: "Mohamed Salah",
    colors: { primary: "#C09300", secondary: "#C00000" }
  },
  ISVR: {
    id: "ISVR",
    code: "ISVR",
    name: "İsviçre",
    flagCode: "ch",
    rating: { attack: 79, midfield: 83, defense: 82, overall: 81 },
    stars: 4,
    coach: "Murat Yakın",
    keyPlayer: "Granit Xhaka",
    colors: { primary: "#D52B1E", secondary: "#FFFFFF" }
  },
  CEZ: {
    id: "CEZ",
    code: "CEZ",
    name: "Cezayir",
    flagCode: "dz",
    rating: { attack: 77, midfield: 78, defense: 76, overall: 77 },
    stars: 3.5,
    coach: "Vladimir Petković",
    keyPlayer: "Riyad Mahrez",
    colors: { primary: "#006233", secondary: "#FFFFFF" }
  },
  KOL: {
    id: "KOL",
    code: "KOL",
    name: "Kolombiya",
    flagCode: "co",
    rating: { attack: 83, midfield: 82, defense: 81, overall: 82 },
    stars: 4,
    coach: "Néstor Lorenzo",
    keyPlayer: "James Rodríguez",
    colors: { primary: "#FCD116", secondary: "#003893" }
  },
  GAN: {
    id: "GAN",
    code: "GAN",
    name: "Gana",
    flagCode: "gh",
    rating: { attack: 75, midfield: 77, defense: 74, overall: 75 },
    stars: 3,
    coach: "Otto Addo",
    keyPlayer: "Mohammed Kudus",
    colors: { primary: "#DA291C", secondary: "#FCD116" }
  }
};

export const INITIAL_MATCHES: Match[] = [
  // --- SON 32 - LEFT SIDE (8 matches: L1 to L8) ---
  {
    id: "L1",
    team1Id: "ALM",
    team2Id: "PAR",
    winnerId: null,
    stage: "son32",
    nextMatchId: "L17",
    nextMatchSlot: 1,
    side: "left",
    label: "Son 32 - Maç 1"
  },
  {
    id: "L2",
    team1Id: "FRA",
    team2Id: "ISV",
    winnerId: null,
    stage: "son32",
    nextMatchId: "L17",
    nextMatchSlot: 2,
    side: "left",
    label: "Son 32 - Maç 2"
  },
  {
    id: "L3",
    team1Id: "GAF",
    team2Id: "KAN",
    winnerId: "KAN",
    score1: 0,
    score2: 1,
    stage: "son32",
    nextMatchId: "L18",
    nextMatchSlot: 1,
    side: "left",
    label: "Son 32 - Maç 3"
  },
  {
    id: "L4",
    team1Id: "HOL",
    team2Id: "FAS",
    winnerId: null,
    stage: "son32",
    nextMatchId: "L18",
    nextMatchSlot: 2,
    side: "left",
    label: "Son 32 - Maç 4"
  },
  {
    id: "L5",
    team1Id: "POR",
    team2Id: "HIR",
    winnerId: null,
    stage: "son32",
    nextMatchId: "L19",
    nextMatchSlot: 1,
    side: "left",
    label: "Son 32 - Maç 5"
  },
  {
    id: "L6",
    team1Id: "ISP",
    team2Id: "AUT",
    winnerId: null,
    stage: "son32",
    nextMatchId: "L19",
    nextMatchSlot: 2,
    side: "left",
    label: "Son 32 - Maç 6"
  },
  {
    id: "L7",
    team1Id: "ABD",
    team2Id: "BOS",
    winnerId: null,
    stage: "son32",
    nextMatchId: "L20",
    nextMatchSlot: 1,
    side: "left",
    label: "Son 32 - Maç 7"
  },
  {
    id: "L8",
    team1Id: "BEL",
    team2Id: "SEN",
    winnerId: null,
    stage: "son32",
    nextMatchId: "L20",
    nextMatchSlot: 2,
    side: "left",
    label: "Son 32 - Maç 8"
  },

  // --- SON 32 - RIGHT SIDE (8 matches: R9 to R16) ---
  {
    id: "R9",
    team1Id: "BRE",
    team2Id: "JPN",
    winnerId: null,
    stage: "son32",
    nextMatchId: "R21",
    nextMatchSlot: 1,
    side: "right",
    label: "Son 32 - Maç 9"
  },
  {
    id: "R10",
    team1Id: "FIL",
    team2Id: "NOR",
    winnerId: null,
    stage: "son32",
    nextMatchId: "R21",
    nextMatchSlot: 2,
    side: "right",
    label: "Son 32 - Maç 10"
  },
  {
    id: "R11",
    team1Id: "MEK",
    team2Id: "EKV",
    winnerId: null,
    stage: "son32",
    nextMatchId: "R22",
    nextMatchSlot: 1,
    side: "right",
    label: "Son 32 - Maç 11"
  },
  {
    id: "R12",
    team1Id: "ING",
    team2Id: "KDC",
    winnerId: null,
    stage: "son32",
    nextMatchId: "R22",
    nextMatchSlot: 2,
    side: "right",
    label: "Son 32 - Maç 12"
  },
  {
    id: "R13",
    team1Id: "ARJ",
    team2Id: "KAP",
    winnerId: null,
    stage: "son32",
    nextMatchId: "R23",
    nextMatchSlot: 1,
    side: "right",
    label: "Son 32 - Maç 13"
  },
  {
    id: "R14",
    team1Id: "AUS",
    team2Id: "MIS",
    winnerId: null,
    stage: "son32",
    nextMatchId: "R23",
    nextMatchSlot: 2,
    side: "right",
    label: "Son 32 - Maç 14"
  },
  {
    id: "R15",
    team1Id: "ISVR",
    team2Id: "CEZ",
    winnerId: null,
    stage: "son32",
    nextMatchId: "R24",
    nextMatchSlot: 1,
    side: "right",
    label: "Son 32 - Maç 15"
  },
  {
    id: "R16",
    team1Id: "KOL",
    team2Id: "GAN",
    winnerId: null,
    stage: "son32",
    nextMatchId: "R24",
    nextMatchSlot: 2,
    side: "right",
    label: "Son 32 - Maç 16"
  },

  // --- SON 16 - LEFT SIDE (4 matches: L17 to L20) ---
  {
    id: "L17",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "son16",
    nextMatchId: "L25",
    nextMatchSlot: 1,
    side: "left",
    label: "Son 16 - Maç 1"
  },
  {
    id: "L18",
    team1Id: "KAN",
    team2Id: null,
    winnerId: null,
    stage: "son16",
    nextMatchId: "L25",
    nextMatchSlot: 2,
    side: "left",
    label: "Son 16 - Maç 2"
  },
  {
    id: "L19",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "son16",
    nextMatchId: "L26",
    nextMatchSlot: 1,
    side: "left",
    label: "Son 16 - Maç 3"
  },
  {
    id: "L20",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "son16",
    nextMatchId: "L26",
    nextMatchSlot: 2,
    side: "left",
    label: "Son 16 - Maç 4"
  },

  // --- SON 16 - RIGHT SIDE (4 matches: R21 to R24) ---
  {
    id: "R21",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "son16",
    nextMatchId: "R27",
    nextMatchSlot: 1,
    side: "right",
    label: "Son 16 - Maç 5"
  },
  {
    id: "R22",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "son16",
    nextMatchId: "R27",
    nextMatchSlot: 2,
    side: "right",
    label: "Son 16 - Maç 6"
  },
  {
    id: "R23",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "son16",
    nextMatchId: "R28",
    nextMatchSlot: 1,
    side: "right",
    label: "Son 16 - Maç 7"
  },
  {
    id: "R24",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "son16",
    nextMatchId: "R28",
    nextMatchSlot: 2,
    side: "right",
    label: "Son 16 - Maç 8"
  },

  // --- ÇEYREK FİNAL - LEFT SIDE (2 matches: L25, L26) ---
  {
    id: "L25",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "ceyrek",
    nextMatchId: "L29",
    nextMatchSlot: 1,
    side: "left",
    label: "Çeyrek Final 1"
  },
  {
    id: "L26",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "ceyrek",
    nextMatchId: "L29",
    nextMatchSlot: 2,
    side: "left",
    label: "Çeyrek Final 2"
  },

  // --- ÇEYREK FİNAL - RIGHT SIDE (2 matches: R27, R28) ---
  {
    id: "R27",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "ceyrek",
    nextMatchId: "R30",
    nextMatchSlot: 1,
    side: "right",
    label: "Çeyrek Final 3"
  },
  {
    id: "R28",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "ceyrek",
    nextMatchId: "R30",
    nextMatchSlot: 2,
    side: "right",
    label: "Çeyrek Final 4"
  },

  // --- YARI FİNAL - LEFT SIDE (1 match: L29) ---
  {
    id: "L29",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "yarifinal",
    nextMatchId: "F31",
    nextMatchSlot: 1,
    side: "left",
    label: "Yarı Final 1"
  },

  // --- YARI FİNAL - RIGHT SIDE (1 match: R30) ---
  {
    id: "R30",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "yarifinal",
    nextMatchId: "F31",
    nextMatchSlot: 2,
    side: "right",
    label: "Yarı Final 2"
  },

  // --- FİNAL (1 match: F31) ---
  {
    id: "F31",
    team1Id: null,
    team2Id: null,
    winnerId: null,
    stage: "final",
    nextMatchId: null,
    nextMatchSlot: 1,
    side: "center",
    label: "Büyük Final"
  }
];
