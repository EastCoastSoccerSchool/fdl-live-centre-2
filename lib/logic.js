import { completionTargets } from "./data";

export function scoreNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function createScoreMap(fixtures) {
  const map = {};
  fixtures.forEach((f) => { map[f.id] = { home: "", away: "" }; });
  return map;
}

export function completedMatchCount(fixturesWithScores, competitionKey) {
  return fixturesWithScores.filter(
    (f) => f.competitionKey === competitionKey &&
      scoreNumber(f.homeScore) !== null &&
      scoreNumber(f.awayScore) !== null
  ).length;
}

export function isTableComplete(fixturesWithScores, competitionKey) {
  return completedMatchCount(fixturesWithScores, competitionKey) >= (completionTargets[competitionKey] || 0);
}

export function resolveTeam(ref, standings, fixturesWithScores) {
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

export function getCompletedLeagueFixtures(fixtures, competitionKey) {
  return fixtures.filter(
    (f) => f.competitionKey === competitionKey &&
      scoreNumber(f.homeScore) !== null &&
      scoreNumber(f.awayScore) !== null &&
      f.resolvedHome &&
      f.resolvedAway
  );
}

export function buildStandings(teams, fixtures, competitionKey) {
  const rows = teams.map((team) => ({
    team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0,
  }));
  const byTeam = Object.fromEntries(rows.map((r) => [r.team, r]));
  const completed = getCompletedLeagueFixtures(fixtures, competitionKey);

  completed.forEach((f) => {
    const h = byTeam[f.resolvedHome];
    const a = byTeam[f.resolvedAway];
    if (!h || !a) return;
    const hs = Number(f.homeScore);
    const as = Number(f.awayScore);
    h.p += 1; a.p += 1;
    h.gf += hs; h.ga += as;
    a.gf += as; a.ga += hs;
    if (hs > as) { h.w += 1; a.l += 1; h.pts += 3; }
    else if (hs < as) { a.w += 1; h.l += 1; a.pts += 3; }
    else { h.d += 1; a.d += 1; h.pts += 1; a.pts += 1; }
  });

  rows.forEach((r) => { r.gd = r.gf - r.ga; });

  const headToHead = (teamA, teamB) => {
    const match = completed.find(
      (f) => (f.resolvedHome === teamA && f.resolvedAway === teamB) ||
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

export function ageColor(age) {
  if (age === "U7/8") return "u78";
  if (age === "U9/10") return "u910";
  return "u1112";
}