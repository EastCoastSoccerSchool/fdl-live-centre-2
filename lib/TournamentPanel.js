import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const u78Teams = [
  "Peninsular Raiders",
  "Central Coast Strikers",
  "Southern U8/1",
  "Flaming Foxes",
  "Young Guns",
  "GIRLS TBC",
];

const u910Teams = [
  "Sand Tigers",
  "Raving Roosters U9",
  "Southern Lakes United U9",
  "The Dinosaurs",
  "The Goats",
  "Barnyard Fowls U9",
  "The Gunners",
  "Repetech",
  "TUFC U9 B1",
  "Chicken Nuggets",
];

const u1112Groups = {
  A: [
    "Woy Woy U11A2",
    "Feisty Sharks U11",
    "Coastal United",
    "Turf Pandas 2.0",
  ],
  B: ["Avoca FC U11", "Rebel Roar", "Terrigal 11A1", "TBC"],
};

const completionTargets = {
  u78: 15,
  u910: 20,
  u1112A: 6,
  u1112B: 6,
  u910TopSemi: 2,
  u1112KO: 4,
};

const initialFixtures = [
  { id: "u78-r1-1", age: "U7/8", stage: "League", round: "Round 1", time: "8:00", pitch: "Pitch 1", home: "Peninsular Raiders", away: "GIRLS TBC", competitionKey: "u78" },
  { id: "u78-r1-2", age: "U7/8", stage: "League", round: "Round 1", time: "8:00", pitch: "Pitch 2", home: "Central Coast Strikers", away: "Young Guns", competitionKey: "u78" },
  { id: "u78-r1-3", age: "U7/8", stage: "League", round: "Round 1", time: "8:00", pitch: "Pitch 3", home: "Southern U8/1", away: "Flaming Foxes", competitionKey: "u78" },
  { id: "u910-r1-1", age: "U9/10", stage: "League", round: "Round 1", time: "8:00", pitch: "Pitch 4", home: "Sand Tigers", away: "Chicken Nuggets", competitionKey: "u910" },

  { id: "u910-r1-2", age: "U9/10", stage: "League", round: "Round 1", time: "8:20", pitch: "Pitch 1", home: "Raving Roosters U9", away: "TUFC U9 B1", competitionKey: "u910" },
  { id: "u910-r1-3", age: "U9/10", stage: "League", round: "Round 1", time: "8:20", pitch: "Pitch 2", home: "Southern Lakes United U9", away: "Repetech", competitionKey: "u910" },
  { id: "u910-r1-4", age: "U9/10", stage: "League", round: "Round 1", time: "8:20", pitch: "Pitch 3", home: "The Dinosaurs", away: "The Gunners", competitionKey: "u910" },
  { id: "u910-r1-5", age: "U9/10", stage: "League", round: "Round 1", time: "8:20", pitch: "Pitch 4", home: "The Goats", away: "Barnyard Fowls U9", competitionKey: "u910" },

  { id: "u78-r2-1", age: "U7/8", stage: "League", round: "Round 2", time: "8:40", pitch: "Pitch 1", home: "Peninsular Raiders", away: "Young Guns", competitionKey: "u78" },
  { id: "u78-r2-2", age: "U7/8", stage: "League", round: "Round 2", time: "8:40", pitch: "Pitch 2", home: "GIRLS TBC", away: "Flaming Foxes", competitionKey: "u78" },
  { id: "u78-r2-3", age: "U7/8", stage: "League", round: "Round 2", time: "8:40", pitch: "Pitch 3", home: "Central Coast Strikers", away: "Southern U8/1", competitionKey: "u78" },
  { id: "u910-r2-1", age: "U9/10", stage: "League", round: "Round 2", time: "8:40", pitch: "Pitch 4", home: "Raving Roosters U9", away: "The Gunners", competitionKey: "u910" },

  { id: "u910-r2-2", age: "U9/10", stage: "League", round: "Round 2", time: "9:00", pitch: "Pitch 1", home: "Sand Tigers", away: "TUFC U9 B1", competitionKey: "u910" },
  { id: "u910-r2-3", age: "U9/10", stage: "League", round: "Round 2", time: "9:00", pitch: "Pitch 2", home: "Southern Lakes United U9", away: "Chicken Nuggets", competitionKey: "u910" },
  { id: "u910-r2-4", age: "U9/10", stage: "League", round: "Round 2", time: "9:00", pitch: "Pitch 3", home: "The Dinosaurs", away: "Barnyard Fowls U9", competitionKey: "u910" },
  { id: "u910-r2-5", age: "U9/10", stage: "League", round: "Round 2", time: "9:00", pitch: "Pitch 4", home: "The Goats", away: "Repetech", competitionKey: "u910" },

  { id: "u78-r3-1", age: "U7/8", stage: "League", round: "Round 3", time: "9:20", pitch: "Pitch 1", home: "Peninsular Raiders", away: "Flaming Foxes", competitionKey: "u78" },
  { id: "u78-r3-2", age: "U7/8", stage: "League", round: "Round 3", time: "9:20", pitch: "Pitch 2", home: "Young Guns", away: "Southern U8/1", competitionKey: "u78" },
  { id: "u78-r3-3", age: "U7/8", stage: "League", round: "Round 3", time: "9:20", pitch: "Pitch 3", home: "GIRLS TBC", away: "Central Coast Strikers", competitionKey: "u78" },
  { id: "u910-r3-1", age: "U9/10", stage: "League", round: "Round 3", time: "9:20", pitch: "Pitch 4", home: "Chicken Nuggets", away: "Barnyard Fowls U9", competitionKey: "u910" },

  { id: "u910-r3-2", age: "U9/10", stage: "League", round: "Round 3", time: "9:40", pitch: "Pitch 1", home: "Sand Tigers", away: "The Gunners", competitionKey: "u910" },
  { id: "u910-r3-3", age: "U9/10", stage: "League", round: "Round 3", time: "9:40", pitch: "Pitch 2", home: "Raving Roosters U9", away: "The Goats", competitionKey: "u910" },
  { id: "u910-r3-4", age: "U9/10", stage: "League", round: "Round 3", time: "9:40", pitch: "Pitch 3", home: "Southern Lakes United U9", away: "The Dinosaurs", competitionKey: "u910" },
  { id: "u910-r3-5", age: "U9/10", stage: "League", round: "Round 3", time: "9:40", pitch: "Pitch 4", home: "TUFC U9 B1", away: "Repetech", competitionKey: "u910" },

  { id: "u78-r4-1", age: "U7/8", stage: "League", round: "Round 4", time: "10:00", pitch: "Pitch 1", home: "Peninsular Raiders", away: "Southern U8/1", competitionKey: "u78" },
  { id: "u78-r4-2", age: "U7/8", stage: "League", round: "Round 4", time: "10:00", pitch: "Pitch 2", home: "Flaming Foxes", away: "Central Coast Strikers", competitionKey: "u78" },
  { id: "u78-r4-3", age: "U7/8", stage: "League", round: "Round 4", time: "10:00", pitch: "Pitch 3", home: "Young Guns", away: "GIRLS TBC", competitionKey: "u78" },
  { id: "u910-r4-1", age: "U9/10", stage: "League", round: "Round 4", time: "10:00", pitch: "Pitch 4", home: "The Dinosaurs", away: "The Goats", competitionKey: "u910" },

  { id: "u910-r4-2", age: "U9/10", stage: "League", round: "Round 4", time: "10:20", pitch: "Pitch 1", home: "Sand Tigers", away: "Repetech", competitionKey: "u910" },
  { id: "u910-r4-3", age: "U9/10", stage: "League", round: "Round 4", time: "10:20", pitch: "Pitch 2", home: "Raving Roosters U9", away: "Southern Lakes United U9", competitionKey: "u910" },
  { id: "u910-r4-4", age: "U9/10", stage: "League", round: "Round 4", time: "10:20", pitch: "Pitch 3", home: "Barnyard Fowls U9", away: "The Gunners", competitionKey: "u910" },
  { id: "u910-r4-5", age: "U9/10", stage: "League", round: "Round 4", time: "10:20", pitch: "Pitch 4", home: "TUFC U9 B1", away: "Chicken Nuggets", competitionKey: "u910" },

  { id: "u78-r5-1", age: "U7/8", stage: "League", round: "Round 5", time: "10:40", pitch: "Pitch 1", home: "Peninsular Raiders", away: "Central Coast Strikers", competitionKey: "u78" },
  { id: "u78-r5-2", age: "U7/8", stage: "League", round: "Round 5", time: "10:40", pitch: "Pitch 2", home: "Southern U8/1", away: "GIRLS TBC", competitionKey: "u78" },
  { id: "u78-r5-3", age: "U7/8", stage: "League", round: "Round 5", time: "10:40", pitch: "Pitch 3", home: "Flaming Foxes", away: "Young Guns", competitionKey: "u78" },
  { id: "u910-top-semi-1", age: "U9/10", stage: "Semi Final", round: "Semi Final", time: "10:40", pitch: "Pitch 4", home: "1st U9/10", away: "4th U9/10", competitionKey: "u910TopSemi", dynamic: { home: { source: "standing", table: "u910", position: 1 }, away: { source: "standing", table: "u910", position: 4 } }, label: "Semi Final 1" },

  { id: "u910-top-semi-2", age: "U9/10", stage: "Semi Final", round: "Semi Final", time: "11:00", pitch: "Pitch 1", home: "2nd U9/10", away: "3rd U9/10", competitionKey: "u910TopSemi", dynamic: { home: { source: "standing", table: "u910", position: 2 }, away: { source: "standing", table: "u910", position: 3 } }, label: "Semi Final 2" },
  { id: "u910-place-56", age: "U9/10", stage: "Placing", round: "Placing", time: "11:00", pitch: "Pitch 2", home: "5th U9/10", away: "6th U9/10", competitionKey: "u910Placing", dynamic: { home: { source: "standing", table: "u910", position: 5 }, away: { source: "standing", table: "u910", position: 6 } }, label: "5th/6th Playoff" },
  { id: "u910-place-78", age: "U9/10", stage: "Placing", round: "Placing", time: "11:00", pitch: "Pitch 3", home: "7th U9/10", away: "8th U9/10", competitionKey: "u910Placing", dynamic: { home: { source: "standing", table: "u910", position: 7 }, away: { source: "standing", table: "u910", position: 8 } }, label: "7th/8th Playoff" },
  { id: "u910-place-910", age: "U9/10", stage: "Placing", round: "Placing", time: "11:00", pitch: "Pitch 4", home: "9th U9/10", away: "10th U9/10", competitionKey: "u910Placing", dynamic: { home: { source: "standing", table: "u910", position: 9 }, away: { source: "standing", table: "u910", position: 10 } }, label: "9th/10th Playoff" },

  { id: "u910-final", age: "U9/10", stage: "Final", round: "Final", time: "11:40", pitch: "Pitch 1", home: "Winner Semi 1", away: "Winner Semi 2", competitionKey: "u910TopSemi", dynamic: { home: { source: "winner", fixtureId: "u910-top-semi-1" }, away: { source: "winner", fixtureId: "u910-top-semi-2" } }, label: "Grand Final" },
  { id: "u78-final", age: "U7/8", stage: "Final", round: "Final", time: "11:40", pitch: "Pitch 2", home: "1st U7/8", away: "2nd U7/8", competitionKey: "u78Final", dynamic: { home: { source: "standing", table: "u78", position: 1 }, away: { source: "standing", table: "u78", position: 2 } }, label: "Grand Final" },

  { id: "u1112-a-r1-1", age: "U11/12", stage: "Group A", round: "Round 1", time: "8:00", pitch: "Pitch 5", home: "Woy Woy U11A2", away: "Turf Pandas 2.0", competitionKey: "u1112A" },
  { id: "u1112-a-r1-2", age: "U11/12", stage: "Group A", round: "Round 1", time: "8:00", pitch: "Pitch 6", home: "Feisty Sharks U11", away: "Coastal United", competitionKey: "u1112A" },
  { id: "u1112-b-r1-1", age: "U11/12", stage: "Group B", round: "Round 1", time: "8:20", pitch: "Pitch 5", home: "Avoca FC U11", away: "TBC", competitionKey: "u1112B" },
  { id: "u1112-b-r1-2", age: "U11/12", stage: "Group B", round: "Round 1", time: "8:20", pitch: "Pitch 6", home: "Rebel Roar", away: "Terrigal 11A1", competitionKey: "u1112B" },

  { id: "u1112-a-r2-1", age: "U11/12", stage: "Group A", round: "Round 2", time: "8:40", pitch: "Pitch 5", home: "Woy Woy U11A2", away: "Coastal United", competitionKey: "u1112A" },
  { id: "u1112-a-r2-2", age: "U11/12", stage: "Group A", round: "Round 2", time: "8:40", pitch: "Pitch 6", home: "Turf Pandas 2.0", away: "Feisty Sharks U11", competitionKey: "u1112A" },
  { id: "u1112-b-r2-1", age: "U11/12", stage: "Group B", round: "Round 2", time: "9:00", pitch: "Pitch 5", home: "Avoca FC U11", away: "Terrigal 11A1", competitionKey: "u1112B" },
  { id: "u1112-b-r2-2", age: "U11/12", stage: "Group B", round: "Round 2", time: "9:00", pitch: "Pitch 6", home: "TBC", away: "Rebel Roar", competitionKey: "u1112B" },

  { id: "u1112-a-r3-1", age: "U11/12", stage: "Group A", round: "Round 3", time: "9:20", pitch: "Pitch 5", home: "Woy Woy U11A2", away: "Feisty Sharks U11", competitionKey: "u1112A" },
  { id: "u1112-a-r3-2", age: "U11/12", stage: "Group A", round: "Round 3", time: "9:20", pitch: "Pitch 6", home: "Coastal United", away: "Turf Pandas 2.0", competitionKey: "u1112A" },
  { id: "u1112-b-r3-1", age: "U11/12", stage: "Group B", round: "Round 3", time: "9:40", pitch: "Pitch 5", home: "Avoca FC U11", away: "Rebel Roar", competitionKey: "u1112B" },
  { id: "u1112-b-r3-2", age: "U11/12", stage: "Group B", round: "Round 3", time: "9:40", pitch: "Pitch 6", home: "Terrigal 11A1", away: "TBC", competitionKey: "u1112B" },

  { id: "u1112-cross-top-1", age: "U11/12", stage: "Crossovers", round: "Crossovers", time: "10:00", pitch: "Pitch 5", home: "1st Group A", away: "2nd Group B", competitionKey: "u1112KO", dynamic: { home: { source: "standing", table: "u1112A", position: 1 }, away: { source: "standing", table: "u1112B", position: 2 } }, label: "Top Crossover 1" },
  { id: "u1112-cross-top-2", age: "U11/12", stage: "Crossovers", round: "Crossovers", time: "10:00", pitch: "Pitch 6", home: "2nd Group A", away: "1st Group B", competitionKey: "u1112KO", dynamic: { home: { source: "standing", table: "u1112A", position: 2 }, away: { source: "standing", table: "u1112B", position: 1 } }, label: "Top Crossover 2" },
  { id: "u1112-cross-bot-1", age: "U11/12", stage: "Crossovers", round: "Crossovers", time: "10:20", pitch: "Pitch 5", home: "3rd Group A", away: "4th Group B", competitionKey: "u1112KO", dynamic: { home: { source: "standing", table: "u1112A", position: 3 }, away: { source: "standing", table: "u1112B", position: 4 } }, label: "Bottom Crossover 1" },
  { id: "u1112-cross-bot-2", age: "U11/12", stage: "Crossovers", round: "Crossovers", time: "10:20", pitch: "Pitch 6", home: "4th Group A", away: "3rd Group B", competitionKey: "u1112KO", dynamic: { home: { source: "standing", table: "u1112A", position: 4 }, away: { source: "standing", table: "u1112B", position: 3 } }, label: "Bottom Crossover 2" },

  { id: "u1112-final", age: "U11/12", stage: "Final", round: "Final", time: "10:40", pitch: "Pitch 5", home: "Winner Pitch 5", away: "Winner Pitch 6", competitionKey: "u1112KO", dynamic: { home: { source: "winner", fixtureId: "u1112-cross-top-1" }, away: { source: "winner", fixtureId: "u1112-cross-top-2" } }, label: "Grand Final" },
  { id: "u1112-56", age: "U11/12", stage: "Placing", round: "Placing", time: "10:40", pitch: "Pitch 6", home: "Winner Bottom Crossover 1", away: "Winner Bottom Crossover 2", competitionKey: "u1112KO", dynamic: { home: { source: "winner", fixtureId: "u1112-cross-bot-1" }, away: { source: "winner", fixtureId: "u1112-cross-bot-2" } }, label: "5th/6th Playoff" },
  { id: "u1112-34", age: "U11/12", stage: "Placing", round: "Placing", time: "11:00", pitch: "Pitch 5", home: "Loser Pitch 5", away: "Loser Pitch 6", competitionKey: "u1112KO", dynamic: { home: { source: "loser", fixtureId: "u1112-cross-top-1" }, away: { source: "loser", fixtureId: "u1112-cross-top-2" } }, label: "3rd/4th Playoff" },
  { id: "u1112-78", age: "U11/12", stage: "Placing", round: "Placing", time: "11:00", pitch: "Pitch 6", home: "Loser Bottom Crossover 1", away: "Loser Bottom Crossover 2", competitionKey: "u1112KO", dynamic: { home: { source: "loser", fixtureId: "u1112-cross-bot-1" }, away: { source: "loser", fixtureId: "u1112-cross-bot-2" } }, label: "7th/8th Playoff" },
];

const timeOrder = ["8:00","8:20","8:40","9:00","9:20","9:40","10:00","10:20","10:40","11:00","11:20","11:40"];
const pitchOrder = ["Pitch 1", "Pitch 2", "Pitch 3", "Pitch 4", "Pitch 5", "Pitch 6"];
const mobilePitchOptions = ["All Pitches", ...pitchOrder];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean);
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function createScoreMap(fixtures) {
  const map = {};
  fixtures.forEach((f) => {
    map[f.id] = { home: "", away: "" };
  });
  return map;
}

function scoreNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function completedMatchCount(fixturesWithScores, competitionKey) {
  return fixturesWithScores.filter(
    (f) => f.competitionKey === competitionKey && scoreNumber(f.homeScore) !== null && scoreNumber(f.awayScore) !== null
  ).length;
}

function isTableComplete(fixturesWithScores, competitionKey) {
  return completedMatchCount(fixturesWithScores, competitionKey) >= (completionTargets[competitionKey] || 0);
}

function resolveTeam(ref, standings, fixturesWithScores) {
  if (!ref) return "TBC";
  if (ref.source === "standing") {
    if (!isTableComplete(fixturesWithScores, ref.table)) return "TBC";
    const table = standings[ref.table] || [];
    return table[ref.position - 1]?.team || "TBC";
  }
  const match = fixturesWithScores.find((f) => f.id === ref.fixtureId);
  if (!match) return "TBC";
  const hs = scoreNumber(match.homeScore);
  const as = scoreNumber(match.awayScore);
  if (hs === null || as === null || hs === as) return "TBC";
  if (ref.source === "winner") return hs > as ? match.resolvedHome : match.resolvedAway;
  if (ref.source === "loser") return hs > as ? match.resolvedAway : match.resolvedHome;
  return "TBC";
}

function getCompletedLeagueFixtures(fixtures, competitionKey) {
  return fixtures.filter(
    (f) =>
      f.competitionKey === competitionKey &&
      scoreNumber(f.homeScore) !== null &&
      scoreNumber(f.awayScore) !== null &&
      f.resolvedHome &&
      f.resolvedAway
  );
}

function buildStandings(teams, fixtures, competitionKey) {
  const rows = teams.map((team) => ({ team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }));
  const byTeam = Object.fromEntries(rows.map((r) => [r.team, r]));
  const completed = getCompletedLeagueFixtures(fixtures, competitionKey);

  completed.forEach((f) => {
    const h = byTeam[f.resolvedHome];
    const a = byTeam[f.resolvedAway];
    if (!h || !a) return;
    const hs = Number(f.homeScore);
    const as = Number(f.awayScore);
    h.p += 1;
    a.p += 1;
    h.gf += hs;
    h.ga += as;
    a.gf += as;
    a.ga += hs;
    if (hs > as) {
      h.w += 1;
      a.l += 1;
      h.pts += 3;
    } else if (hs < as) {
      a.w += 1;
      h.l += 1;
      a.pts += 3;
    } else {
      h.d += 1;
      a.d += 1;
      h.pts += 1;
      a.pts += 1;
    }
  });

  rows.forEach((r) => {
    r.gd = r.gf - r.ga;
  });

  const headToHead = (teamA, teamB) => {
    const match = completed.find(
      (f) =>
        (f.resolvedHome === teamA && f.resolvedAway === teamB) ||
        (f.resolvedHome === teamB && f.resolvedAway === teamA)
    );
    if (!match) return 0;
    const hs = Number(match.homeScore);
    const as = Number(match.awayScore);
    if (hs === as) return 0;
    const winner = hs > as ? match.resolvedHome : match.resolvedAway;
    return winner === teamA ? -1 : 1;
  };

  rows.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    const h2h = headToHead(a.team, b.team);
    if (h2h !== 0) return h2h;
    return a.team.localeCompare(b.team);
  });

  return rows;
}

function ageColor(age) {
  if (age === "U7/8") return "bg-amber-100 border-amber-300";
  if (age === "U9/10") return "bg-sky-100 border-sky-300";
  return "bg-emerald-100 border-emerald-300";
}

function groupBadge(stage) {
  if (stage === "League") return "bg-zinc-100 text-zinc-700";
  if (stage.startsWith("Group")) return "bg-purple-100 text-purple-700";
  if (stage === "Crossovers") return "bg-orange-100 text-orange-700";
  if (stage === "Final") return "bg-rose-100 text-rose-700";
  if (stage === "Semi Final") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
}

export default function FDLFixtureCentre() {
  const [scores, setScores] = useState(createScoreMap(initialFixtures));
  const [teamSearch, setTeamSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [showOnlyTeam, setShowOnlyTeam] = useState(false);
  const [viewMode, setViewMode] = useState("public");
  const [authEmail, setAuthEmail] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobilePitch, setMobilePitch] = useState("All Pitches");

  useEffect(() => {
    if (!supabase) {
      setAuthStatus("Supabase not connected yet. Add your env keys first.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadSessionAndScores = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted) {
        setSessionEmail(session?.user?.email?.toLowerCase() || "");
      }

      const { data, error } = await supabase.from("match_scores").select("fixture_id, home_score, away_score");
      if (!error && data && isMounted) {
        const newScores = createScoreMap(initialFixtures);
        data.forEach((row) => {
          newScores[row.fixture_id] = {
            home: row.home_score === null ? "" : String(row.home_score),
            away: row.away_score === null ? "" : String(row.away_score),
          };
        });
        setScores(newScores);
      }
      if (isMounted) setLoading(false);
    };

    loadSessionAndScores();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user?.email?.toLowerCase() || "");
    });

    const channel = supabase
      .channel("fdl-live-scores")
      .on("postgres_changes", { event: "*", schema: "public", table: "match_scores" }, async () => {
        const { data } = await supabase.from("match_scores").select("fixture_id, home_score, away_score");
        if (data && isMounted) {
          const newScores = createScoreMap(initialFixtures);
          data.forEach((row) => {
            newScores[row.fixture_id] = {
              home: row.home_score === null ? "" : String(row.home_score),
              away: row.away_score === null ? "" : String(row.away_score),
            };
          });
          setScores(newScores);
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe?.();
      supabase.removeChannel(channel);
    };
  }, []);

  const isAdmin = !!sessionEmail && (adminEmails.length === 0 || adminEmails.includes(sessionEmail));

  const baseFixturesWithScores = useMemo(
    () =>
      initialFixtures.map((f) => ({
        ...f,
        homeScore: scores[f.id]?.home ?? "",
        awayScore: scores[f.id]?.away ?? "",
        resolvedHome: f.home,
        resolvedAway: f.away,
      })),
    [scores]
  );

  const standings = useMemo(() => ({
    u78: buildStandings(u78Teams, baseFixturesWithScores, "u78"),
    u910: buildStandings(u910Teams, baseFixturesWithScores, "u910"),
    u1112A: buildStandings(u1112Groups.A, baseFixturesWithScores, "u1112A"),
    u1112B: buildStandings(u1112Groups.B, baseFixturesWithScores, "u1112B"),
  }), [baseFixturesWithScores]);

  const fixtures = useMemo(() => {
    return initialFixtures.map((f) => {
      let resolvedHome = f.home;
      let resolvedAway = f.away;
      if (f.dynamic) {
        resolvedHome = resolveTeam(f.dynamic.home, standings, baseFixturesWithScores);
        resolvedAway = resolveTeam(f.dynamic.away, standings, baseFixturesWithScores);
      }
      return {
        ...f,
        homeScore: scores[f.id]?.home ?? "",
        awayScore: scores[f.id]?.away ?? "",
        resolvedHome,
        resolvedAway,
      };
    });
  }, [scores, standings, baseFixturesWithScores]);

  const groupedSchedule = useMemo(() => {
    return timeOrder.map((time) => ({
      time,
      fixtures: pitchOrder.map((pitch) => fixtures.find((f) => f.time === time && f.pitch === pitch)).filter(Boolean),
    }));
  }, [fixtures]);

  const mobileTeamFixtures = useMemo(() => {
    if (!teamSearch.trim()) return [];
    const needle = teamSearch.toLowerCase();
    return fixtures
      .filter((f) => ageFilter === "All" || f.age === ageFilter)
      .filter(
        (f) =>
          (f.resolvedHome || "").toLowerCase().includes(needle) ||
          (f.resolvedAway || "").toLowerCase().includes(needle) ||
          (f.home || "").toLowerCase().includes(needle) ||
          (f.away || "").toLowerCase().includes(needle)
      )
      .sort((a, b) => timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time) || pitchOrder.indexOf(a.pitch) - pitchOrder.indexOf(b.pitch));
  }, [fixtures, teamSearch, ageFilter]);

  const mobilePitchFixtures = useMemo(() => {
    return groupedSchedule.map(({ time, fixtures }) => ({
      time,
      fixtures: fixtures.filter((f) => mobilePitch === "All Pitches" || f.pitch === mobilePitch),
    })).filter(({ fixtures }) => fixtures.length > 0);
  }, [groupedSchedule, mobilePitch]);

  const filteredFixtures = useMemo(() => {
    return fixtures.filter((f) => {
      if (ageFilter !== "All" && f.age !== ageFilter) return false;
      if (!showOnlyTeam || !teamSearch.trim()) return true;
      const needle = teamSearch.toLowerCase();
      return (
        (f.resolvedHome || "").toLowerCase().includes(needle) ||
        (f.resolvedAway || "").toLowerCase().includes(needle) ||
        (f.home || "").toLowerCase().includes(needle) ||
        (f.away || "").toLowerCase().includes(needle)
      );
    });
  }, [fixtures, ageFilter, showOnlyTeam, teamSearch]);

  const sendMagicLink = async () => {
    if (!supabase || !authEmail) return;
    const redirectTo = typeof window !== "undefined" ? window.location.href : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail,
      options: { emailRedirectTo: redirectTo },
    });
    setAuthStatus(error ? error.message : "Magic link sent. Open it on this device.");
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setViewMode("public");
  };

  const setScore = async (id, side, value) => {
    if (!isAdmin || value !== "" && !/^\d+$/.test(value)) return;

    const newScores = {
      ...scores,
      [id]: {
        ...scores[id],
        [side]: value,
      },
    };
    setScores(newScores);

    if (!supabase) return;
    const row = newScores[id];
    const { error } = await supabase.from("match_scores").upsert(
      {
        fixture_id: id,
        home_score: row.home === "" ? null : Number(row.home),
        away_score: row.away === "" ? null : Number(row.away),
        updated_by_email: sessionEmail || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "fixture_id" }
    );
    if (error) setAuthStatus(error.message);
  };

  const standingsCard = (title, rows) => (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b bg-zinc-50 font-semibold">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Team</th>
              <th className="px-2 py-2">P</th>
              <th className="px-2 py-2">W</th>
              <th className="px-2 py-2">D</th>
              <th className="px-2 py-2">L</th>
              <th className="px-2 py-2">GF</th>
              <th className="px-2 py-2">GA</th>
              <th className="px-2 py-2">GD</th>
              <th className="px-2 py-2">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.team} className={idx % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}>
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2 font-medium">{row.team}</td>
                <td className="px-2 py-2 text-center">{row.p}</td>
                <td className="px-2 py-2 text-center">{row.w}</td>
                <td className="px-2 py-2 text-center">{row.d}</td>
                <td className="px-2 py-2 text-center">{row.l}</td>
                <td className="px-2 py-2 text-center">{row.gf}</td>
                <td className="px-2 py-2 text-center">{row.ga}</td>
                <td className="px-2 py-2 text-center">{row.gd}</td>
                <td className="px-2 py-2 text-center font-semibold">{row.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-sm border bg-white">
          <div className="px-6 py-5 text-white bg-gradient-to-r from-blue-950 via-blue-900 to-red-600">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-white/90 text-blue-950 flex items-center justify-center font-black text-xl">FDL</div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">FDL Tournament Control Panel</h1>
                  <p className="text-white/85 mt-1">Live fixtures, ladders, score entry and finals generator</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewMode("public")} className={`rounded-xl px-4 py-2 font-semibold ${viewMode === "public" ? "bg-white text-zinc-900" : "bg-white/15 text-white"}`}>Public View</button>
                <button onClick={() => setViewMode("admin")} className={`rounded-xl px-4 py-2 font-semibold ${viewMode === "admin" ? "bg-white text-zinc-900" : "bg-white/15 text-white"}`}>Admin View</button>
              </div>
            </div>
          </div>
        </div>

        {!supabase && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
            Supabase is not connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment.
          </div>
        )}

        {viewMode === "admin" && (
          <div className="rounded-3xl bg-white shadow-sm border p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-blue-950">Admin Login</h2>
                <p className="text-zinc-600 mt-2">Use your admin email to receive a magic link. Public viewers can still use the same page in Public View, but they cannot edit scores.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                <input className="rounded-xl border px-3 py-2" placeholder="Admin email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                <button onClick={sendMagicLink} className="rounded-xl px-4 py-2 font-medium bg-blue-950 text-white">Send Magic Link</button>
                <button onClick={signOut} className="rounded-xl px-4 py-2 font-medium bg-zinc-200 text-zinc-800">Sign Out</button>
              </div>
            </div>
            <div className="mt-4 text-sm text-zinc-600">Signed in as: <span className="font-medium">{sessionEmail || "Not signed in"}</span>{sessionEmail && !isAdmin ? <span className="text-red-600"> — not in allowed admin list</span> : null}</div>
            {authStatus ? <div className="mt-2 text-sm text-zinc-600">{authStatus}</div> : null}
          </div>
        )}

        <div className="rounded-3xl bg-white shadow-sm border p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-blue-950">FDL Pre-Season Cup Fixture Centre</h2>
              <p className="text-zinc-600 mt-2">Live schedule, fixture finder, and auto-updating ladders for U7/8, U9/10, and U11/12 across all 6 pitches.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <input className="rounded-xl border px-3 py-2" placeholder="Find a team" value={teamSearch} onChange={(e) => setTeamSearch(e.target.value)} />
              <select className="rounded-xl border px-3 py-2" value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                <option>All</option>
                <option>U7/8</option>
                <option>U9/10</option>
                <option>U11/12</option>
              </select>
              <button onClick={() => setShowOnlyTeam((v) => !v)} className={`rounded-xl px-4 py-2 font-medium ${showOnlyTeam ? "bg-black text-white" : "bg-zinc-200 text-zinc-800"}`}>
                {showOnlyTeam ? "Showing team matches" : "Show team fixtures"}
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-zinc-600">
            Ladder order: <span className="font-medium">Points → Goal Difference → Goals For → Head-to-Head</span>. Finals only auto-fill once required league/group games are complete. {loading ? "Loading live scores..." : "Live scores connected across devices."}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 xl:hidden">
            <select className="rounded-xl border px-3 py-2" value={mobilePitch} onChange={(e) => setMobilePitch(e.target.value)}>
              {mobilePitchOptions.map((pitch) => <option key={pitch}>{pitch}</option>)}
            </select>
            <div className="rounded-xl border bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
              Mobile mode shows cleaner pitch cards and team search results.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {viewMode === "admin" && isAdmin && (
              <div className="rounded-3xl bg-white shadow-sm border overflow-hidden">
                <div className="px-4 py-3 border-b bg-zinc-50 font-semibold">Master Schedule & Score Entry</div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] text-sm">
                    <thead className="bg-zinc-50 text-zinc-600">
                      <tr>
                        <th className="px-3 py-2 text-left">Time</th>
                        <th className="px-3 py-2 text-left">Pitch</th>
                        <th className="px-3 py-2 text-left">Age</th>
                        <th className="px-3 py-2 text-left">Stage</th>
                        <th className="px-3 py-2 text-left">Fixture</th>
                        <th className="px-3 py-2 text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFixtures
                        .slice()
                        .sort((a, b) => timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time) || pitchOrder.indexOf(a.pitch) - pitchOrder.indexOf(b.pitch))
                        .map((f) => (
                          <tr key={f.id} className="border-t">
                            <td className="px-3 py-2 font-medium whitespace-nowrap">{f.time}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{f.pitch}</td>
                            <td className="px-3 py-2"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold border ${ageColor(f.age)}`}>{f.age}</span></td>
                            <td className="px-3 py-2"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${groupBadge(f.stage)}`}>{f.label || f.stage}</span></td>
                            <td className="px-3 py-2"><div className="font-medium">{f.resolvedHome} vs {f.resolvedAway}</div><div className="text-xs text-zinc-500">{f.round}</div></td>
                            <td className="px-3 py-2">
                              <div className="flex items-center justify-center gap-2">
                                <input value={scores[f.id]?.home ?? ""} onChange={(e) => setScore(f.id, "home", e.target.value)} className="w-14 rounded-lg border px-2 py-1 text-center" />
                                <span className="text-zinc-500">-</span>
                                <input value={scores[f.id]?.away ?? ""} onChange={(e) => setScore(f.id, "away", e.target.value)} className="w-14 rounded-lg border px-2 py-1 text-center" />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-white shadow-sm border overflow-hidden hidden xl:block">
              <div className="px-4 py-3 border-b bg-zinc-50 font-semibold">Six-Pitch Timeline</div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead className="bg-zinc-50 text-zinc-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Time</th>
                      {pitchOrder.map((pitch) => <th key={pitch} className="px-3 py-2 text-left">{pitch}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSchedule.map(({ time, fixtures }) => (
                      <tr key={time} className="border-t align-top">
                        <td className="px-3 py-3 font-semibold whitespace-nowrap">{time}</td>
                        {pitchOrder.map((pitch) => {
                          const fixture = fixtures.find((f) => f.pitch === pitch);
                          return (
                            <td key={pitch} className="px-2 py-2 min-w-[170px]">
                              {fixture ? (
                                <div className={`rounded-2xl border p-3 ${ageColor(fixture.age)}`}>
                                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600">{fixture.age}</div>
                                  <div className="text-xs mt-1 text-zinc-500">{fixture.label || fixture.stage}</div>
                                  <div className="mt-2 font-medium leading-snug">{fixture.resolvedHome} vs {fixture.resolvedAway}</div>
                                  {(scoreNumber(fixture.homeScore) !== null || scoreNumber(fixture.awayScore) !== null) ? (
                                    <div className="mt-3 text-base font-bold">{fixture.homeScore || 0} - {fixture.awayScore || 0}</div>
                                  ) : (
                                    <div className="mt-3 text-sm text-zinc-500">Score pending</div>
                                  )}
                                </div>
                              ) : (
                                <div className="rounded-2xl border border-dashed p-3 text-zinc-400">—</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="xl:hidden space-y-4">
              <div className="rounded-3xl bg-white shadow-sm border overflow-hidden">
                <div className="px-4 py-3 border-b bg-zinc-50 font-semibold">Mobile Pitch View</div>
                <div className="p-4 space-y-4">
                  {mobilePitchFixtures.map(({ time, fixtures }) => (
                    <div key={time} className="rounded-2xl border border-zinc-200 overflow-hidden">
                      <div className="bg-zinc-50 px-4 py-2 font-semibold text-sm">{time}</div>
                      <div className="p-3 space-y-3">
                        {fixtures.map((fixture) => (
                          <div key={fixture.id} className={`rounded-2xl border p-3 ${ageColor(fixture.age)}`}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600">{fixture.pitch}</div>
                              <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${groupBadge(fixture.stage)}`}>{fixture.label || fixture.stage}</div>
                            </div>
                            <div className="mt-2 text-xs text-zinc-500">{fixture.age}</div>
                            <div className="mt-1 font-semibold leading-snug">{fixture.resolvedHome}</div>
                            <div className="text-sm text-zinc-500">vs</div>
                            <div className="font-semibold leading-snug">{fixture.resolvedAway}</div>
                            {(scoreNumber(fixture.homeScore) !== null || scoreNumber(fixture.awayScore) !== null) ? (
                              <div className="mt-3 text-base font-bold">{fixture.homeScore || 0} - {fixture.awayScore || 0}</div>
                            ) : (
                              <div className="mt-3 text-sm text-zinc-500">Score pending</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white shadow-sm border overflow-hidden">
                <div className="px-4 py-3 border-b bg-zinc-50 font-semibold">Mobile Team Finder</div>
                <div className="p-4 space-y-3">
                  {!teamSearch.trim() ? (
                    <div className="text-sm text-zinc-500">Search for a team above to show their fixture list in a cleaner mobile layout.</div>
                  ) : mobileTeamFixtures.length === 0 ? (
                    <div className="text-sm text-zinc-500">No fixtures found for that team search.</div>
                  ) : (
                    mobileTeamFixtures.map((fixture) => (
                      <div key={fixture.id} className={`rounded-2xl border p-3 ${ageColor(fixture.age)}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold">{fixture.time}</div>
                          <div className="text-sm text-zinc-500">{fixture.pitch}</div>
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">{fixture.age} • {fixture.label || fixture.stage}</div>
                        <div className="mt-2 font-semibold leading-snug">{fixture.resolvedHome} vs {fixture.resolvedAway}</div>
                        {(scoreNumber(fixture.homeScore) !== null || scoreNumber(fixture.awayScore) !== null) && (
                          <div className="mt-2 text-sm font-bold">{fixture.homeScore || 0} - {fixture.awayScore || 0}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-blue-50 border-blue-200 p-4 text-sm text-blue-950 xl:hidden">
              <div className="font-semibold mb-1">Mobile-friendly upgrade live</div>
              Use the pitch dropdown for a cleaner matchday view, or search a team to show only their fixtures in card format.
            </div>
            {standingsCard("U7/8 League Table", standings.u78)}
            {standingsCard("U9/10 League Table", standings.u910)}
            {standingsCard("U11/12 Group A", standings.u1112A)}
            {standingsCard("U11/12 Group B", standings.u1112B)}

            <div className="rounded-2xl border bg-white shadow-sm p-4">
              <div className="font-semibold mb-3">Auto-Filled Finals Check</div>
              <div className="space-y-2 text-sm text-zinc-700">
                <div><span className="font-medium">U7/8 Final:</span> {fixtures.find((f) => f.id === "u78-final")?.resolvedHome} vs {fixtures.find((f) => f.id === "u78-final")?.resolvedAway}</div>
                <div><span className="font-medium">U9/10 Grand Final:</span> {fixtures.find((f) => f.id === "u910-final")?.resolvedHome} vs {fixtures.find((f) => f.id === "u910-final")?.resolvedAway}</div>
                <div><span className="font-medium">U11/12 Grand Final:</span> {fixtures.find((f) => f.id === "u1112-final")?.resolvedHome} vs {fixtures.find((f) => f.id === "u1112-final")?.resolvedAway}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
