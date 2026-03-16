"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "../lib/supabase";
import { ageColor, buildStandings, createScoreMap, resolveTeam, scoreNumber } from "../lib/logic";
import { initialFixtures, pitchOrder, timeOrder, u1112Groups, u78Teams, u910Teams } from "../lib/data";

const supabase = getSupabase();

const ALL_TEAMS = [
  ...u78Teams,
  ...u910Teams,
  ...u1112Groups.A,
  ...u1112Groups.B,
].filter((t) => t !== "TBC" && t !== "GIRLS TBC").sort();

const styles = `
  * { box-sizing: border-box; }

  /* ── Mobile tab bar ── */
  .mob-tabs {
    display: none;
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    border-bottom: 2px solid #e5e7eb;
  }
  .mob-tabs button {
    flex: 1;
    padding: 12px 4px;
    font-size: 13px;
    font-weight: 700;
    border: none;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
  }
  .mob-tabs button.active {
    color: #1d4ed8;
    border-bottom-color: #1d4ed8;
  }

  /* ── Mobile filter bar ── */
  .mob-filter-bar {
    display: none;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  .mob-filter-row {
    display: flex;
    gap: 8px;
  }
  .mob-filter-bar select {
    flex: 1;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1.5px solid #d1d5db;
    background: #fff;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    appearance: auto;
  }
  .mob-filter-bar select.team-select {
    border-color: #1d4ed8;
    color: #1d4ed8;
    font-weight: 700;
  }
  .mob-clear-btn {
    padding: 8px 14px;
    border-radius: 10px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    white-space: nowrap;
  }
  .mob-team-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #eff6ff;
    border: 1.5px solid #bfdbfe;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 700;
    color: #1d4ed8;
  }
  .mob-team-banner button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #1d4ed8;
    padding: 0 0 0 8px;
  }

  /* ── Mobile fixture cards ── */
  .mob-fixture-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }
  .mob-fixture-card .top-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .mob-fixture-card .pitch-label {
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
  }
  .mob-fixture-card .stage-label {
    font-size: 11px;
    color: #9ca3af;
    margin-left: auto;
  }
  .mob-fixture-card .teams {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    line-height: 1.3;
  }
  .mob-fixture-card .teams .vs {
    color: #9ca3af;
    font-weight: 400;
    font-size: 14px;
    margin: 0 6px;
  }
  .mob-fixture-card .score-display {
    margin-top: 8px;
    font-size: 26px;
    font-weight: 900;
    color: #1d4ed8;
    letter-spacing: 1px;
  }
  .mob-fixture-card .score-pending {
    margin-top: 6px;
    font-size: 12px;
    color: #d1d5db;
    font-style: italic;
  }
  .mob-fixture-card.highlight-team {
    border-color: #1d4ed8;
    background: #eff6ff;
  }
  .time-header {
    background: #1d4ed8;
    color: #fff;
    border-radius: 8px;
    padding: 6px 12px;
    font-weight: 800;
    font-size: 14px;
    margin: 16px 0 8px;
  }
  .time-header:first-child { margin-top: 0; }

  /* ── Pill badges ── */
  .pill {
    display: inline-block;
    padding: 2px 9px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }
  .pill-u78   { background: #fef3c7; color: #92400e; }
  .pill-u910  { background: #e0f2fe; color: #0c4a6e; }
  .pill-u1112 { background: #d1fae5; color: #065f46; }

  /* ── Mobile standings ── */
  .mob-standings {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    margin-bottom: 16px;
    overflow: hidden;
  }
  .mob-standings h3 {
    padding: 12px 14px;
    font-size: 15px;
    font-weight: 800;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
    margin: 0;
  }
  .mob-standings table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .mob-standings th {
    background: #f9fafb;
    padding: 8px 6px;
    text-align: center;
    color: #6b7280;
    font-weight: 700;
    font-size: 11px;
  }
  .mob-standings td {
    padding: 9px 6px;
    text-align: center;
    border-top: 1px solid #f3f4f6;
    color: #374151;
  }
  .mob-standings td.team-col { text-align: left; padding-left: 10px; font-weight: 600; }
  .mob-standings td.pts-col  { font-weight: 800; color: #111827; }
  .mob-standings tr.my-team td { background: #eff6ff !important; color: #1d4ed8; font-weight: 800; }
  .mob-standings tr:nth-child(even) td { background: #f9fafb; }

  /* ── Mobile finals ── */
  .mob-finals-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 12px;
  }
  .mob-finals-card .final-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #6b7280;
    margin-bottom: 4px;
  }
  .mob-finals-card .final-teams { font-size: 15px; font-weight: 700; color: #111827; }
  .mob-finals-card .final-tbc   { font-size: 13px; color: #9ca3af; }

  /* ── Desktop admin table fix ── */
  .admin-table-wrap {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .admin-table-wrap table {
    min-width: 750px;
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .admin-table-wrap th, .admin-table-wrap td {
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid #f3f4f6;
    white-space: nowrap;
  }
  .admin-table-wrap td.fixture-col {
    white-space: normal;
    min-width: 180px;
    max-width: 260px;
  }
  .score-inputs {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .score-inputs input {
    width: 48px;
    padding: 6px;
    text-align: center;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
  }

  /* ── Responsive show/hide ── */
  .desktop-only { display: block; }
  .mobile-only  { display: none !important; }

  @media (max-width: 768px) {
    .desktop-only  { display: none !important; }
    .mobile-only   { display: block !important; }
    .mob-tabs      { display: flex !important; }
    .mob-filter-bar { display: flex !important; }
    .page { overflow-x: hidden; padding: 0; }
    .wrap { padding: 0; }
    .mob-content { padding: 12px; }
  }
`;

const AGE_OPTIONS = ["All", "U7/8", "U9/10", "U11/12"];

export default function TournamentPanel({ mode = "public" }) {
  const isAdmin = mode === "admin";

  // Desktop state
  const [teamSearch, setTeamSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [showOnlyTeam, setShowOnlyTeam] = useState(false);
  const [email, setEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  const [scores, setScores] = useState(createScoreMap(initialFixtures));
  const [loading, setLoading] = useState(true);

  // Mobile state
  const [mobTab, setMobTab] = useState("fixtures");
  const [mobAge, setMobAge] = useState("All");
  const [mobTeam, setMobTeam] = useState("");

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
    u78:    buildStandings(u78Teams,       baseFixturesWithScores, "u78"),
    u910:   buildStandings(u910Teams,      baseFixturesWithScores, "u910"),
    u1112A: buildStandings(u1112Groups.A,  baseFixturesWithScores, "u1112A"),
    u1112B: buildStandings(u1112Groups.B,  baseFixturesWithScores, "u1112B"),
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

  // Mobile fixtures — filtered by age AND team
  const mobileFixtures = useMemo(() => {
    const needle = mobTeam.toLowerCase();
    const filtered = fixtures.filter((f) => {
      if (mobAge !== "All" && f.age !== mobAge) return false;
      if (!mobTeam) return true;
      return (
        (f.resolvedHome || "").toLowerCase().includes(needle) ||
        (f.resolvedAway || "").toLowerCase().includes(needle)
      );
    });
    return timeOrder.map((time) => ({
      time,
      fixtures: filtered
        .filter((f) => f.time === time)
        .sort((a, b) => pitchOrder.indexOf(a.pitch) - pitchOrder.indexOf(b.pitch)),
    })).filter(({ fixtures }) => fixtures.length > 0);
  }, [fixtures, mobAge, mobTeam]);

  function pillClass(age) {
    if (age === "U7/8")  return "pill pill-u78";
    if (age === "U9/10") return "pill pill-u910";
    return "pill pill-u1112";
  }

  function isMyTeam(name) {
    if (!mobTeam) return false;
    return (name || "").toLowerCase().includes(mobTeam.toLowerCase());
  }

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
    const newScores = { ...scores, [id]: { ...scores[id], [side]: value } };
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

  // Desktop standings card
  const standingsCard = (title, rows) => (
    <div className="card">
      <h2>{title}</h2>
      <div className="pad" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.team}>
                <td>{idx + 1}</td><td><strong>{row.team}</strong></td>
                <td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td>
                <td>{row.gf}</td><td>{row.ga}</td><td>{row.gd}</td><td><strong>{row.pts}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Mobile standings card — highlights selected team row
  const mobStandingsCard = (title, rows) => (
    <div className="mob-standings">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th style={{ textAlign: "left", paddingLeft: 10 }}>Team</th>
            <th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.team} className={isMyTeam(row.team) ? "my-team" : ""}>
              <td>{idx + 1}</td>
              <td className="team-col">{row.team}</td>
              <td>{row.p}</td><td>{row.w}</td><td>{row.d}</td><td>{row.l}</td>
              <td>{row.gd}</td>
              <td className="pts-col">{row.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const finalFixture = (id) => fixtures.find((f) => f.id === id);

  return (
    <div className="page" style={{ overflowX: "hidden" }}>
      <style>{styles}</style>

      {/* ── MOBILE: Tab bar ── */}
      <div className="mob-tabs mobile-only">
        {[
          { key: "fixtures", label: "📋 Fixtures" },
          { key: "tables",   label: "🏆 Tables"   },
          { key: "finals",   label: "⚡ Finals"    },
        ].map(({ key, label }) => (
          <button key={key} className={mobTab === key ? "active" : ""} onClick={() => setMobTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── MOBILE: Filter bar (fixtures + tables tabs) ── */}
      {(mobTab === "fixtures" || mobTab === "tables") && (
        <div className="mob-filter-bar mobile-only">
          <div className="mob-filter-row">
            {/* Age filter */}
            <select value={mobAge} onChange={(e) => setMobAge(e.target.value)}>
              {AGE_OPTIONS.map((a) => <option key={a}>{a}</option>)}
            </select>
            {/* Team dropdown */}
            <select
              value={mobTeam}
              onChange={(e) => setMobTeam(e.target.value)}
              className={mobTeam ? "team-select" : ""}
            >
              <option value="">All Teams</option>
              {ALL_TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {/* Team banner when a team is selected */}
          {mobTeam && (
            <div className="mob-team-banner">
              <span>📌 {mobTeam}</span>
              <button onClick={() => setMobTeam("")}>✕</button>
            </div>
          )}
        </div>
      )}

      {/* ── MOBILE: Content ── */}
      <div className="mobile-only mob-content">

        {/* FIXTURES TAB */}
        {mobTab === "fixtures" && (
          <div>
            {mobileFixtures.length === 0 && (
              <p style={{ color: "#9ca3af", textAlign: "center", marginTop: 40 }}>
                No fixtures found.
              </p>
            )}
            {mobileFixtures.map(({ time, fixtures: atTime }) => (
              <div key={time}>
                <div className="time-header">⏱ {time}</div>
                {atTime.map((f) => {
                  const hasScore = scoreNumber(f.homeScore) !== null || scoreNumber(f.awayScore) !== null;
                  const myGame = isMyTeam(f.resolvedHome) || isMyTeam(f.resolvedAway);
                  return (
                    <div key={f.id} className={`mob-fixture-card${myGame ? " highlight-team" : ""}`}>
                      <div className="top-row">
                        <span className="pitch-label">{f.pitch}</span>
                        <span className={pillClass(f.age)}>{f.age}</span>
                        <span className="stage-label">{f.label || f.stage}</span>
                      </div>
                      <div className="teams">
                        <span style={isMyTeam(f.resolvedHome) ? { color: "#1d4ed8" } : {}}>
                          {f.resolvedHome}
                        </span>
                        <span className="vs">vs</span>
                        <span style={isMyTeam(f.resolvedAway) ? { color: "#1d4ed8" } : {}}>
                          {f.resolvedAway}
                        </span>
                      </div>
                      {hasScore ? (
                        <div className="score-display">
                          {f.homeScore || 0} – {f.awayScore || 0}
                        </div>
                      ) : (
                        <div className="score-pending">Score pending</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* TABLES TAB */}
        {mobTab === "tables" && (
          <div>
            {(mobAge === "All" || mobAge === "U7/8")   && mobStandingsCard("U7/8 League Table",  standings.u78)}
            {(mobAge === "All" || mobAge === "U9/10")  && mobStandingsCard("U9/10 League Table", standings.u910)}
            {(mobAge === "All" || mobAge === "U11/12") && (
              <>
                {mobStandingsCard("U11/12 Group A", standings.u1112A)}
                {mobStandingsCard("U11/12 Group B", standings.u1112B)}
              </>
            )}
          </div>
        )}

        {/* FINALS TAB */}
        {mobTab === "finals" && (
          <div>
            <div style={{ marginBottom: 12, fontSize: 13, color: "#6b7280" }}>
              Finals auto-fill once all required league and group games are complete.
              {loading ? " Loading…" : " Live via Supabase."}
            </div>
            {[
              { title: "U7/8 Grand Final",   id: "u78-final"          },
              { title: "U9/10 Semi Final 1", id: "u910-top-semi-1"    },
              { title: "U9/10 Semi Final 2", id: "u910-top-semi-2"    },
              { title: "U9/10 Grand Final",  id: "u910-final"         },
              { title: "U11/12 Grand Final", id: "u1112-final"        },
              { title: "U11/12 3rd/4th",     id: "u1112-34"           },
              { title: "U11/12 5th/6th",     id: "u1112-56"           },
              { title: "U11/12 7th/8th",     id: "u1112-78"           },
            ].map(({ title, id }) => {
              const f = finalFixture(id);
              const isTBC  = !f || f.resolvedHome === "TBC" || f.resolvedAway === "TBC";
              const hasScore = f && (scoreNumber(f.homeScore) !== null || scoreNumber(f.awayScore) !== null);
              return (
                <div key={id} className="mob-finals-card">
                  <div className="final-title">{title}</div>
                  {isTBC ? (
                    <div className="final-tbc">Teams TBC — awaiting results</div>
                  ) : (
                    <>
                      <div className="final-teams">{f.resolvedHome} vs {f.resolvedAway}</div>
                      {hasScore && (
                        <div style={{ fontSize: 22, fontWeight: 900, color: "#1d4ed8", marginTop: 4 }}>
                          {f.homeScore || 0} – {f.awayScore || 0}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── DESKTOP ── */}
      <div className="desktop-only">
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
                <div className="small">Use your email to receive a magic link. Only authenticated users can write scores.</div>
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
                  <option>All</option><option>U7/8</option><option>U9/10</option><option>U11/12</option>
                </select>
                <button className="secondary" onClick={() => setShowOnlyTeam((v) => !v)}>
                  {showOnlyTeam ? "Showing team matches" : "Show team fixtures only"}
                </button>
              </div>
              <div className="small" style={{ marginTop: 8 }}>
                Ladder order: Points → Goal Difference → Goals For → Head-to-Head. Finals auto-fill when required league/group games are complete.
              </div>
            </div>
          </div>

          <div className="grid">
            <div>
              {isAdmin && (
                <div className="card">
                  <h2>Score Entry</h2>
                  <div className="pad">
                    <div className="admin-table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Pitch</th>
                            <th>Age</th>
                            <th>Stage</th>
                            <th className="fixture-col">Fixture</th>
                            <th>Score</th>
                          </tr>
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
                                <td className="fixture-col">
                                  <strong>{f.resolvedHome} vs {f.resolvedAway}</strong>
                                  <div className="small">{f.round}</div>
                                </td>
                                <td>
                                  <div className="score-inputs">
                                    <input
                                      value={scores[f.id]?.home ?? ""}
                                      onChange={(e) => setScore(f.id, "home", e.target.value)}
                                    />
                                    <span style={{ color: "#9ca3af", fontWeight: 700 }}>–</span>
                                    <input
                                      value={scores[f.id]?.away ?? ""}
                                      onChange={(e) => setScore(f.id, "away", e.target.value)}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              <div className="card">
                <h2>Six-Pitch Timeline</h2>
                <div className="pad" style={{ overflowX: "auto" }}>
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
              {standingsCard("U7/8 League Table",  standings.u78)}
              {standingsCard("U9/10 League Table", standings.u910)}
              {standingsCard("U11/12 Group A",     standings.u1112A)}
              {standingsCard("U11/12 Group B",     standings.u1112B)}
              <div className="card">
                <h2>Finals Check</h2>
                <div className="pad stack">
                  <div><strong>U7/8 Final:</strong> {finalFixture("u78-final")?.resolvedHome} vs {finalFixture("u78-final")?.resolvedAway}</div>
                  <div><strong>U9/10 Grand Final:</strong> {finalFixture("u910-final")?.resolvedHome} vs {finalFixture("u910-final")?.resolvedAway}</div>
                  <div><strong>U11/12 Grand Final:</strong> {finalFixture("u1112-final")?.resolvedHome} vs {finalFixture("u1112-final")?.resolvedAway}</div>
                  {loading
                    ? <div className="small">Loading live scores…</div>
                    : <div className="small">Live scores connected through Supabase.</div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
