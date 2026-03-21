"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "../../lib/supabase";
import { createScoreMap, scoreNumber } from "../../lib/logic";
import { initialFixtures, pitchOrder, timeOrder } from "../../lib/data";

const supabase = getSupabase();

// ── Change this PIN to whatever you want refs to use ──
const REF_PIN = "1234";

function ageColor(age) {
  if (age === "U7/8")  return "#f59e0b";
  if (age === "U9/10") return "#3b82f6";
  return "#10b981";
}

export default function RefsPage() {
  const [pin, setPin]           = useState("");
  const [pinError, setPinError] = useState(false);
  const [authed, setAuthed]     = useState(false);
  const [pitch, setPitch]       = useState("Pitch 1");
  const [scores, setScores]     = useState(createScoreMap(initialFixtures));
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState({});

  // Load scores from Supabase on auth
  useEffect(() => {
    if (!authed || !supabase) return;
    let mounted = true;

    async function load() {
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

    load();

    const channel = supabase
      .channel("fdl-refs-scores")
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

    return () => { mounted = false; if (supabase) supabase.removeChannel(channel); };
  }, [authed]);

  // Fixtures for selected pitch, sorted by time
  const pitchFixtures = useMemo(() => {
    return initialFixtures
      .filter((f) => f.pitch === pitch)
      .sort((a, b) => timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time));
  }, [pitch]);

  function handlePin(e) {
    e.preventDefault();
    if (pin === REF_PIN) {
      setAuthed(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
    }
  }

  async function setScore(id, side, value) {
    if (value !== "" && !/^\d+$/.test(value)) return;
    const newScores = { ...scores, [id]: { ...scores[id], [side]: value } };
    setScores(newScores);

    if (!supabase) return;
    const row = newScores[id];

    // Only save if both sides have a value
    if (row.home === "" || row.away === "") return;

    const { error } = await supabase.from("match_scores").upsert({
      fixture_id: id,
      home_score: Number(row.home),
      away_score: Number(row.away),
      updated_at: new Date().toISOString(),
    }, { onConflict: "fixture_id" });

    if (!error) {
      setSaved((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [id]: false })), 2000);
    }
  }

  // ── PIN SCREEN ──
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "linear-gradient(135deg,#0a1628,#0d2147)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      }}>
        <div style={{
          background: "#fff", borderRadius: "20px", padding: "40px 32px",
          width: "100%", maxWidth: "340px", textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>⚽</div>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "22px", fontWeight: 900, color: "#0a1628", margin: "0 0 6px" }}>
            FDL Refs
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 28px" }}>
            Pre-Season Cup 2026 · Score Entry
          </p>

          <form onSubmit={handlePin}>
            <input
              type="password"
              inputMode="numeric"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              style={{
                width: "100%", padding: "14px 16px", fontSize: "20px", textAlign: "center",
                letterSpacing: "8px", border: `2px solid ${pinError ? "#dc2626" : "#e5e7eb"}`,
                borderRadius: "12px", outline: "none", marginBottom: "8px",
                boxSizing: "border-box",
              }}
              autoFocus
            />
            {pinError && (
              <p style={{ color: "#dc2626", fontSize: "13px", margin: "0 0 8px" }}>
                Incorrect PIN — try again
              </p>
            )}
            <button
              type="submit"
              style={{
                width: "100%", padding: "14px", fontSize: "15px", fontWeight: 700,
                background: "#0a1628", color: "#fff", border: "none", borderRadius: "12px",
                cursor: "pointer", marginTop: "8px",
              }}
            >
              Enter →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── SCORE ENTRY SCREEN ──
  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#0a1628,#0d2147)",
        borderBottom: "4px solid #dc2626", padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 900, color: "#f59e0b", letterSpacing: "1px" }}>
            ⚽ FDL Refs
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>
            Pre-Season Cup 2026 · Score Entry
          </div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.1)", borderRadius: "8px",
          padding: "4px 10px", fontSize: "11px", color: "rgba(255,255,255,0.6)",
        }}>
          {loading ? "Connecting…" : "🟢 Live"}
        </div>
      </div>

      {/* Pitch selector */}
      <div style={{ padding: "16px 16px 0" }}>
        <label style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
          Your Pitch
        </label>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {pitchOrder.map((p) => (
            <button
              key={p}
              onClick={() => setPitch(p)}
              style={{
                padding: "8px 16px", borderRadius: "10px", border: "2px solid",
                borderColor: pitch === p ? "#0a1628" : "#e5e7eb",
                background: pitch === p ? "#0a1628" : "#fff",
                color: pitch === p ? "#f59e0b" : "#374151",
                fontWeight: 700, fontSize: "13px", cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures */}
      <div style={{ padding: "16px" }}>
        {pitchFixtures.length === 0 && (
          <p style={{ textAlign: "center", color: "#9ca3af", marginTop: "40px" }}>No fixtures for this pitch.</p>
        )}

        {pitchFixtures.map((f) => {
          const s = scores[f.id] || { home: "", away: "" };
          const hasScore = scoreNumber(s.home) !== null && scoreNumber(s.away) !== null;
          const isSaved  = saved[f.id];

          return (
            <div key={f.id} style={{
              background: "#fff", borderRadius: "16px", padding: "16px",
              marginBottom: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
              borderLeft: `4px solid ${ageColor(f.age)}`,
            }}>
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    background: ageColor(f.age), color: "#fff",
                    borderRadius: "99px", padding: "2px 9px", fontSize: "10px", fontWeight: 700,
                  }}>{f.age}</span>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{f.label || f.stage}</span>
                </div>
                <span style={{
                  background: "#f59e0b", color: "#0a1628", fontWeight: 900,
                  borderRadius: "8px", padding: "3px 10px", fontSize: "13px",
                }}>
                  {f.time}
                </span>
              </div>

              {/* Teams */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <span style={{ flex: 1, fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>
                  {f.home}
                </span>
                <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 400 }}>vs</span>
                <span style={{ flex: 1, fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                  {f.away}
                </span>
              </div>

              {/* Score inputs */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={s.home}
                  onChange={(e) => setScore(f.id, "home", e.target.value)}
                  style={{
                    width: "70px", height: "56px", textAlign: "center",
                    fontSize: "28px", fontWeight: 900, color: "#0a1628",
                    border: "2px solid #e5e7eb", borderRadius: "12px", outline: "none",
                    boxSizing: "border-box",
                  }}
                  placeholder="0"
                />
                <span style={{ fontSize: "22px", fontWeight: 900, color: "#9ca3af" }}>–</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={s.away}
                  onChange={(e) => setScore(f.id, "away", e.target.value)}
                  style={{
                    width: "70px", height: "56px", textAlign: "center",
                    fontSize: "28px", fontWeight: 900, color: "#0a1628",
                    border: "2px solid #e5e7eb", borderRadius: "12px", outline: "none",
                    boxSizing: "border-box",
                  }}
                  placeholder="0"
                />
              </div>

              {/* Status */}
              <div style={{ textAlign: "center", marginTop: "10px", height: "18px" }}>
                {isSaved && (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#059669" }}>✓ Score saved</span>
                )}
                {!isSaved && hasScore && (
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>Score recorded</span>
                )}
                {!isSaved && !hasScore && (
                  <span style={{ fontSize: "11px", color: "#d1d5db", fontStyle: "italic" }}>Enter both scores to save</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
