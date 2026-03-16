"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "../lib/supabase";
import { ageColor, buildStandings, createScoreMap, resolveTeam, scoreNumber } from "../lib/logic";
import { initialFixtures, pitchOrder, timeOrder, u1112Groups, u78Teams, u910Teams } from "../lib/data";

const supabase = getSupabase();

export default function TournamentPanel({ mode = "public" }) {
  const isAdmin = mode === "admin";
  const [teamSearch, setTeamSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [showOnlyTeam, setShowOnlyTeam] = useState(false);
  const [email, setEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  const [scores, setScores] = useState(createScoreMap(initialFixtures));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    async function boot() {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setSessionEmail(session?.user?.email || "");
      const { data, error } = await supabase.from("match_scores").select("*");
      if (!error && data && mounted) {
        const base = createScoreMap(initialFixtures);
        data.forEach((row) => {
          base[row.fixture_id] = {
            home: row.home_score === null ? "" : String(row.home_score),
            away: row.away_score === null ? "" : String(row.away_score),
          };
        });
        setScores(base);
      }
      if (mounted) setLoading(false);
    }

    boot();

    const channel = supabase
      .channel("fdl-match-scores")
      .on("postgres_changes", { event: "*", schema: "public", table: "match_scores" }, async () => {
        const { data } = await supabase.from("match_scores").select("*");
        if (data && mounted) {
          const base = createScoreMap(initialFixtures);
          data.forEach((row) => {
            base[row.fixture_id] = {
              home: row.home_score === null ? "" : String(row.home_score),
              away: row.away_score === null ? "" : String(row.away_score),
            };
          });
          setScores(base);
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      if (supabase) supabase.removeChannel(channel);
    };
  }, []);

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

  async function signIn() {
    if (!supabase || !email) return;
    const redirectTo = typeof window !== "undefined" ? window.location.origin + "/admin" : undefined;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setAuthMessage(error ? error.message : "Magic link sent. Open the email on this device.");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSessionEmail("");
  }

  async function setScore(id, side, value) {
    if (value !== "" && !/^\d+$/.test(value)) return;
    const newScores = {
      ...scores,
      [id]: {
        ...scores[id],
        [side]: value,
      },
    };
    setScores(newScores);

    if (!supabase || !sessionEmail || !isAdmin) return;
    const row = newScores[id];
    await supabase.from("match_scores").upsert({
      fixture_id: id,
      home_score: row.home === "" ? null : Number(row.home),
      away_score: row.away === "" ? null : Number(row.away),
      updated_by_email: sessionEmail,
      updated_at: new Date().toISOString(),
    }, { onConflict: "fixture_id" });
  }

  const standingsCard = (title, rows) => (
    <div className="card">
      <h2>{title}</h2>
      <div className="pad" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.team}>
                <td>{idx + 1}</td><td><strong>{row.team}</strong></td><td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td><td>{row.gf}</td><td>{row.ga}</td><td>{row.gd}</td><td><strong>{row.pts}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="wrap">
        <div className="header">
          <h1>FDL Tournament {isAdmin ? "Admin" : "Public"} Panel</h1>
          <p>{isAdmin ? "Secure score entry with Supabase login" : "Read-only live tournament centre for parents and teams"}</p>
        </div>

        {!supabase && (
          <div className="notice">Supabase environment variables are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.</div>
        )}

        {isAdmin && (
          <div className="card">
            <h2>Admin Login</h2>
            <div className="pad stack">
              <div className="small">Use your email to receive a magic link. Only authenticated users can write scores once your Supabase RLS policies are set.</div>
              <div className="filters">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" />
                <button onClick={signIn}>Send Magic Link</button>
                <button className="secondary" onClick={signOut}>Sign Out</button>
              </div>
              <div className="small">Signed in as: {sessionEmail || "Not signed in"}</div>
              {authMessage ? <div className="small">{authMessage}</div> : null}
            </div>
          </div>
        )}

        <div className="card">
          <h2>Filters</h2>
          <div className="pad">
            <div className="filters">
              <input value={teamSearch} onChange={(e) => setTeamSearch(e.target.value)} placeholder="Find a team" />
              <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
                <option>All</option>
                <option>U7/8</option>
                <option>U9/10</option>
                <option>U11/12</option>
              </select>
              <button className="secondary" onClick={() => setShowOnlyTeam((v) => !v)}>
                {showOnlyTeam ? "Showing team matches" : "Show team fixtures only"}
              </button>
            </div>
            <div className="small">Ladder order: Points → Goal Difference → Goals For → Head-to-Head. Finals auto-fill when required league/group games are complete.</div>
          </div>
        </div>

        <div className="grid">
          <div>
            {isAdmin && (
              <div className="card">
                <h2>Master Schedule & Score Entry</h2>
                <div className="pad" style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr><th>Time</th><th>Pitch</th><th>Age</th><th>Stage</th><th>Fixture</th><th>Score</th></tr>
                    </thead>
                    <tbody>
                      {filteredFixtures
                        .slice()
                        .sort((a, b) => timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time) || pitchOrder.indexOf(a.pitch) - pitchOrder.indexOf(b.pitch))
                        .map((f) => (
                          <tr key={f.id}>
                            <td>{f.time}</td>
                            <td>{f.pitch}</td>
                            <td><span className={`badge ${ageColor(f.age)}`}>{f.age}</span></td>
                            <td>{f.label || f.stage}</td>
                            <td><strong>{f.resolvedHome} vs {f.resolvedAway}</strong><div className="small">{f.round}</div></td>
                            <td>
                              <div className="score-box">
                                <input value={scores[f.id]?.home ?? ""} onChange={(e) => setScore(f.id, "home", e.target.value)} />
                                <span>-</span>
                                <input value={scores[f.id]?.away ?? ""} onChange={(e) => setScore(f.id, "away", e.target.value)} />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="card">
              <h2>Six-Pitch Timeline</h2>
              <div className="pad timeline">
                <div className="timeline-grid">
                  <div className="timeline-head">Time</div>
                  {pitchOrder.map((pitch) => <div key={pitch} className="timeline-head">{pitch}</div>)}
                  {groupedSchedule.map(({ time, fixtures: atTime }) => (
                    <>
                      <div key={`time-${time}`} className="timeline-head">{time}</div>
                      {pitchOrder.map((pitch) => {
                        const fixture = atTime.find((f) => f.pitch === pitch);
                        return (
                          <div key={`${time}-${pitch}`}>
                            {fixture ? (
                              <div className={`fixture-box ${ageColor(fixture.age)}`}>
                                <div className="small">{fixture.age} • {fixture.label || fixture.stage}</div>
                                <div><strong>{fixture.resolvedHome}</strong> vs <strong>{fixture.resolvedAway}</strong></div>
                                {(scoreNumber(fixture.homeScore) !== null || scoreNumber(fixture.awayScore) !== null) ? (
                                  <div style={{ marginTop: 6, fontWeight: "bold" }}>{fixture.homeScore || 0} - {fixture.awayScore || 0}</div>
                                ) : null}
                              </div>
                            ) : "—"}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            {standingsCard("U7/8 League Table", standings.u78)}
            {standingsCard("U9/10 League Table", standings.u910)}
            {standingsCard("U11/12 Group A", standings.u1112A)}
            {standingsCard("U11/12 Group B", standings.u1112B)}
            <div className="card">
              <h2>Finals Check</h2>
              <div className="pad stack">
                <div><strong>U7/8 Final:</strong> {fixtures.find((f) => f.id === "u78-final")?.resolvedHome} vs {fixtures.find((f) => f.id === "u78-final")?.resolvedAway}</div>
                <div><strong>U9/10 Grand Final:</strong> {fixtures.find((f) => f.id === "u910-final")?.resolvedHome} vs {fixtures.find((f) => f.id === "u910-final")?.resolvedAway}</div>
                <div><strong>U11/12 Grand Final:</strong> {fixtures.find((f) => f.id === "u1112-final")?.resolvedHome} vs {fixtures.find((f) => f.id === "u1112-final")?.resolvedAway}</div>
                {loading ? <div className="small">Loading live scores…</div> : <div className="small">Live scores connected through Supabase.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}