"use client";
import { useState, useRef, useEffect } from "react";

interface Citation {
  act: string;
  section: string;
  relevance: string;
  source_url: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  next_steps?: string[];
  confidence?: number;
  disclaimer?: string;
  sources_used?: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

const SUGGESTED = [
  { icon: "🚨", title: "File a Complaint or FIR", sub: "Know where to file, what to write, and the correct legal steps" },
  { icon: "⚖️", title: "Resolve a Legal Issue", sub: "Guidance for disputes like rent, salary, fraud, or consumer problems" },
  { icon: "📝", title: "Draft Legal Documents", sub: "Create complaints, notices, and applications in minutes" },
  { icon: "🛡️", title: "Understand Your Rights", sub: "Quick answers on your rights in everyday legal situations" },
];

async function askAPI(query: string) {
  const res = await fetch("http://localhost:8000/api/v1/qa/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"fadein" | "hold" | "fadeout">("fadein");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 900);
    const t2 = setTimeout(() => setPhase("fadeout"), 2200);
    const t3 = setTimeout(() => onDone(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#EAEAF2",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "8px",
      opacity: phase === "fadeout" ? 0 : 1,
      transition: phase === "fadeout" ? "opacity 0.8s ease" : "none",
      zIndex: 9999,
    }}>
      <img
        src="/logo2.png"
        alt="NyaySetu"
        style={{
          width: "580px", height: "220px",
          objectFit: "contain",
          animation: "splashLogoIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      />
      <p style={{
        fontSize: "16px", color: "#6B7280",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 400, letterSpacing: "0.3px",
        animation: "fadeIn 0.8s ease 0.4s both",
        marginTop: "4px",
      }}>
        Justice, simplified for every Indian citizen.
      </p>
      <div style={{ display: "flex", gap: "8px", animation: "fadeIn 0.8s ease 0.6s both", marginTop: "8px" }}>
        {[0, 1, 2, 3].map(i => (
          <span key={i} style={{
            width: "9px", height: "9px", borderRadius: "50%",
            background: "#4F46E5", display: "inline-block",
            animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── User Bubble ───────────────────────────────────────────────────────────────
function UserBubble({ msg }: { msg: Message }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
      <div style={{
        maxWidth: "65%", background: "#EEEEF8",
        borderRadius: "18px 18px 4px 18px", padding: "14px 18px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <p style={{ fontSize: "14px", color: "#111827", lineHeight: "1.6", fontWeight: 500 }}>{msg.content}</p>
        <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px", textAlign: "right" }}>
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%", background: "#E5E7EB",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", fontWeight: 700, color: "#6B7280", flexShrink: 0,
      }}>AR</div>
    </div>
  );
}

// ── AI Bubble ─────────────────────────────────────────────────────────────────
function AiBubble({ msg }: { msg: Message }) {
  const [reactions, setReactions] = useState({ up: 0, down: 0, copy: false });

  function handleCopy() {
    navigator.clipboard.writeText(msg.content);
    setReactions(r => ({ ...r, copy: true }));
    setTimeout(() => setReactions(r => ({ ...r, copy: false })), 2000);
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%", background: "#EEF0FF",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "16px", flexShrink: 0,
      }}>⚖️</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#4F46E5", marginBottom: "8px", letterSpacing: "0.5px" }}>
          NyaySetu
        </p>

        <div style={{
          background: "white", border: "1px solid #E5E7EB",
          borderRadius: "4px 18px 18px 18px", padding: "16px 20px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: "14px", color: "#1F2937", lineHeight: "1.9" }}>
            {msg.content.split('\n').filter(line => line.trim()).map((line, i) => {
              const parts = line.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={i} style={{ marginBottom: "10px" }}>
                  {parts.map((part, j) =>
                    j % 2 === 1
                      ? <strong key={j} style={{ color: "#111827", fontWeight: 600 }}>{part}</strong>
                      : part
                  )}
                </p>
              );
            })}
          </div>

          {msg.confidence !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #F3F4F6" }}>
              <div style={{ flex: 1, height: "4px", background: "#F3F4F6", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{
                  height: "4px", borderRadius: "99px",
                  width: `${Math.round((msg.confidence || 0) * 100)}%`,
                  background: msg.confidence > 0.6 ? "#22c55e" : msg.confidence > 0.3 ? "#f59e0b" : "#4F46E5",
                  transition: "width 0.6s ease",
                }} />
              </div>
              <span style={{ fontSize: "11px", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                {Math.round((msg.confidence || 0) * 100)}% confidence
              </span>
              <span style={{ fontSize: "11px", color: "#D1D5DB" }}>·</span>
              <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                {msg.sources_used} sources
              </span>
            </div>
          )}
        </div>

        {msg.citations && msg.citations.length > 0 && (
          <div style={{ marginTop: "8px" }}>
            <p style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" }}>
              Legal References
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {msg.citations.map((c, i) => {
                const url = c.source_url && c.source_url !== "N/A" ? c.source_url : "#";
                return (
                  <a key={i} href={url} target="_blank" rel="noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    fontSize: "11px", padding: "5px 12px", borderRadius: "99px",
                    border: "1px solid #C7D2FE", color: "#4F46E5",
                    background: "#EEF2FF",
                    textDecoration: "none", fontWeight: 500, transition: "all 0.15s",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#E0E7FF";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "#4F46E5";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#EEF2FF";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "#C7D2FE";
                    }}
                  >
                    📖 {c.act} · {c.section}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {msg.next_steps && msg.next_steps.length > 0 && (
          <div style={{ marginTop: "10px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "16px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
              Next Steps
            </p>
            {msg.next_steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "#4F46E5", color: "white", fontSize: "10px",
                  fontWeight: 700, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}>{i + 1}</div>
                <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.5" }}>{s}</p>
              </div>
            ))}
          </div>
        )}

        {msg.disclaimer && (
          <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "8px", fontStyle: "italic", lineHeight: "1.5" }}>
            ⚠️ {msg.disclaimer}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "10px" }}>
          <button onClick={() => setReactions(r => ({ ...r, up: r.up + 1 }))} style={{
            display: "flex", alignItems: "center", gap: "4px",
            background: reactions.up > 0 ? "#EEF2FF" : "none",
            border: reactions.up > 0 ? "1px solid #C7D2FE" : "1px solid transparent",
            borderRadius: "8px", cursor: "pointer", padding: "4px 8px",
            fontSize: "13px", color: "#6B7280", transition: "all 0.15s",
          }}>
            👍 {reactions.up > 0 && <span style={{ fontSize: "11px", color: "#4F46E5", fontWeight: 600 }}>{reactions.up}</span>}
          </button>

          <button onClick={() => setReactions(r => ({ ...r, down: r.down + 1 }))} style={{
            display: "flex", alignItems: "center", gap: "4px",
            background: reactions.down > 0 ? "#FEF2F2" : "none",
            border: reactions.down > 0 ? "1px solid #FECACA" : "1px solid transparent",
            borderRadius: "8px", cursor: "pointer", padding: "4px 8px",
            fontSize: "13px", color: "#6B7280", transition: "all 0.15s",
          }}>
            👎 {reactions.down > 0 && <span style={{ fontSize: "11px", color: "#EF4444", fontWeight: 600 }}>{reactions.down}</span>}
          </button>

          <button onClick={handleCopy} style={{
            display: "flex", alignItems: "center", gap: "4px",
            background: reactions.copy ? "#F0FDF4" : "none",
            border: reactions.copy ? "1px solid #BBF7D0" : "1px solid transparent",
            borderRadius: "8px", cursor: "pointer", padding: "4px 8px",
            fontSize: "13px", color: reactions.copy ? "#16a34a" : "#6B7280",
            transition: "all 0.15s",
          }}>
            {reactions.copy ? "✅" : "📋"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Loading Bubble ────────────────────────────────────────────────────────────
function LoadingBubble() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%", background: "#EEF0FF",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0,
      }}>⚖️</div>
      <div style={{
        background: "white", border: "1px solid #E5E7EB",
        borderRadius: "4px 18px 18px 18px", padding: "14px 20px",
        display: "flex", alignItems: "center", gap: "6px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: "#4F46E5", display: "inline-block",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
        <span style={{ fontSize: "13px", color: "#9CA3AF", marginLeft: "4px" }}>NyaySetu is thinking...</span>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState("History");
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const active = convs.find(c => c.id === activeId) ?? null;
  const hasMessages = active && active.messages.length > 0;

  const handleSplashDone = () => {
    setShowSplash(false);
    setTimeout(() => setMainVisible(true), 50);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convs, loading]);

  function newChat() {
    const id = Date.now().toString();
    setConvs(p => [{ id, title: "New Chat", messages: [] }, ...p]);
    setActiveId(id);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function send(query: string) {
    if (!query.trim() || loading) return;
    let cid = activeId;
    if (!cid) {
      const id = Date.now().toString();
      setConvs(p => [{ id, title: query.slice(0, 30), messages: [] }, ...p]);
      setActiveId(id);
      cid = id;
    }
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: query };
    setConvs(p => p.map(c => c.id === cid
      ? { ...c, title: c.messages.length === 0 ? query.slice(0, 30) : c.title, messages: [...c.messages, userMsg] }
      : c
    ));
    setInput("");
    setLoading(true);
    try {
      const data = await askAPI(query);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), role: "assistant",
        content: data.answer, citations: data.citations,
        next_steps: data.next_steps, confidence: data.confidence,
        disclaimer: data.disclaimer, sources_used: data.sources_used,
      };
      setConvs(p => p.map(c => c.id === cid ? { ...c, messages: [...c.messages, aiMsg] } : c));
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(), role: "assistant",
        content: "Unable to connect to the backend. Make sure the server is running on port 8000.",
      };
      setConvs(p => p.map(c => c.id === cid ? { ...c, messages: [...c.messages, errMsg] } : c));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    let cid = activeId;
    if (!cid) {
      const id = Date.now().toString();
      setConvs(p => [{ id, title: `📄 ${file.name.slice(0, 25)}`, messages: [] }, ...p]);
      setActiveId(id);
      cid = id;
    }

    const userMsg: Message = {
      id: Date.now().toString(), role: "user",
      content: `📄 Uploaded: ${file.name}\n\nPlease analyze this document.`,
    };
    setConvs(p => p.map(c => c.id === cid
      ? { ...c, title: `📄 ${file.name.slice(0, 25)}`, messages: [...c.messages, userMsg] }
      : c
    ));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:8000/api/v1/documents/analyze", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Analysis failed");
      }
      const data = await res.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), role: "assistant",
        content: `**Document Summary**\n\n${data.summary}\n\n---\n\n**Detailed Legal Analysis**\n\n${data.analysis}`,
        citations: data.citations,
        next_steps: [],
        confidence: 0.9,
        disclaimer: data.disclaimer,
        sources_used: data.citations?.length || 0,
      };
      setConvs(p => p.map(c => c.id === cid ? { ...c, messages: [...c.messages, aiMsg] } : c));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      const errMsg: Message = {
        id: (Date.now() + 1).toString(), role: "assistant",
        content: `Sorry, I couldn't analyze this document. ${errorMsg}`,
      };
      setConvs(p => p.map(c => c.id === cid ? { ...c, messages: [...c.messages, errMsg] } : c));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; font-family: 'DM Sans', sans-serif; background: #EAEAF2; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(0.85) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        textarea::placeholder { color: #9CA3AF; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
        .nav-btn:hover { background: #EEF0FF !important; color: #4F46E5 !important; }
        .new-chat-btn:hover { opacity: 0.88 !important; transform: translateY(-1px) !important; box-shadow: 0 4px 14px rgba(79,70,229,0.4) !important; }
        .card:hover { border-color: #4F46E5 !important; background: #F5F5FF !important; transform: translateY(-2px) !important; box-shadow: 0 6px 20px rgba(79,70,229,0.12) !important; }
        .input-wrap:focus-within { border-color: #4F46E5 !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.1) !important; }
        .send-btn:hover:not(:disabled) { transform: scale(1.08) !important; box-shadow: 0 4px 12px rgba(79,70,229,0.5) !important; }
        .history-btn:hover { background: #EEF0FF !important; color: #4F46E5 !important; }
        .pdf-btn:hover { color: #4F46E5 !important; transform: scale(1.1) !important; }
      `}</style>

      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      <div style={{
        height: "100vh", width: "100vw",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", gap: "14px", background: "#EAEAF2",
        fontFamily: "'DM Sans', sans-serif",
        opacity: mainVisible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>

        {/* ── LEFT BOX ── */}
        <div style={{
          width: "210px", height: "100%", flexShrink: 0,
          background: "white", borderRadius: "20px",
          display: "flex", flexDirection: "column",
          padding: "20px 14px",
          boxShadow: "0 2px 20px rgba(79,70,229,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "18px", paddingLeft: "4px" }}>
            <img src="/logo.png" alt="NyaySetu" style={{ width: "36px", height: "36px", objectFit: "contain", flexShrink: 0 }} />
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#111827", letterSpacing: "-0.2px" }}>NyaySetu</span>
          </div>

          <button onClick={newChat} className="new-chat-btn" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "6px", width: "100%", padding: "10px 16px",
            borderRadius: "99px", background: "#4F46E5", color: "white",
            border: "none", fontSize: "13px", fontWeight: 600,
            cursor: "pointer", marginBottom: "20px",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
            transition: "all 0.2s ease",
          }}>
            + New Chat
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[
              { label: "History", icon: "🕐" },
              { label: "Case Study", icon: "📄" },
              { label: "Case Status", icon: "🔍" },
            ].map(item => (
              <button key={item.label} onClick={() => setActiveNav(item.label)}
                className="nav-btn"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "9px 12px", borderRadius: "12px", border: "none",
                  background: activeNav === item.label ? "#EEF0FF" : "transparent",
                  color: activeNav === item.label ? "#4F46E5" : "#6B7280",
                  fontSize: "13px", fontWeight: 500, cursor: "pointer",
                  textAlign: "left", fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s ease",
                }}>
                <span style={{ fontSize: "14px" }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {convs.length > 0 && (
            <div style={{ marginTop: "16px", flex: 1, overflowY: "auto" }}>
              <p style={{
                fontSize: "10px", color: "#9CA3AF", textTransform: "uppercase",
                letterSpacing: "0.8px", fontWeight: 600, paddingLeft: "12px", marginBottom: "6px",
              }}>Recent</p>
              {convs.map(c => (
                <button key={c.id} onClick={() => setActiveId(c.id)}
                  className="history-btn"
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    width: "100%", padding: "7px 12px", borderRadius: "10px",
                    border: "none", cursor: "pointer", textAlign: "left",
                    background: activeId === c.id ? "#EEF0FF" : "transparent",
                    color: activeId === c.id ? "#4F46E5" : "#6B7280",
                    fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s ease",
                  }}>
                  <span style={{ fontSize: "11px" }}>💬</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                    {c.title}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div style={{ flex: 1 }} />

          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 8px", borderTop: "1px solid #F3F4F6", marginTop: "8px",
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "#4F46E5", display: "flex", alignItems: "center",
              justifyContent: "center", color: "white",
              fontSize: "11px", fontWeight: 700, flexShrink: 0,
            }}>AR</div>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Aryan</span>
          </div>
        </div>

        {/* ── RIGHT BOX ── */}
        <div style={{
          flex: 1, height: "100%", background: "white",
          borderRadius: "20px", display: "flex", flexDirection: "column",
          overflow: "hidden", boxShadow: "0 2px 20px rgba(79,70,229,0.08)",
        }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "48px 56px 24px" }}>
            {!hasMessages ? (
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                height: "100%", textAlign: "center",
                animation: "fadeIn 0.5s ease",
              }}>
                <h1 style={{
                  fontSize: "52px", fontWeight: 700, color: "#111827",
                  letterSpacing: "-2px", marginBottom: "10px",
                }}>Hello, Aryan.</h1>
                <p style={{ fontSize: "16px", color: "#9CA3AF", marginBottom: "48px" }}>
                  I&apos;m NyaySetu, your personal legal assistant. How can I assist you?
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", width: "100%", maxWidth: "600px" }}>
                  {SUGGESTED.map((s, i) => (
                    <button key={i} onClick={() => send(s.title)}
                      className="card"
                      style={{
                        textAlign: "left", padding: "22px",
                        borderRadius: "16px", border: "1.5px solid #E5E7EB",
                        background: "white", cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.2s ease",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                        animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
                      }}>
                      <div style={{ fontSize: "26px", marginBottom: "10px" }}>{s.icon}</div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "5px" }}>{s.title}</p>
                      <p style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: "1.5" }}>{s.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: "700px", margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
                {active.messages.map(msg =>
                  msg.role === "user"
                    ? <UserBubble key={msg.id} msg={msg} />
                    : <AiBubble key={msg.id} msg={msg} />
                )}
                {(loading || uploading) && <LoadingBubble />}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "12px 56px 20px", flexShrink: 0 }}>
            <div className="input-wrap" style={{
              display: "flex", alignItems: "center", gap: "12px",
              background: "#F9FAFB", border: "1.5px solid #E5E7EB",
              borderRadius: "99px", padding: "10px 12px 10px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
            }}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                style={{ display: "none" }}
              />

              {/* PDF upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || loading}
                title="Upload PDF for analysis"
                className="pdf-btn"
                style={{
                  background: "none", border: "none",
                  cursor: uploading || loading ? "not-allowed" : "pointer",
                  fontSize: "18px", padding: "0", flexShrink: 0,
                  opacity: uploading || loading ? 0.4 : 0.6,
                  transition: "all 0.15s ease",
                }}
              >
                {uploading ? "⏳" : "📌"}
              </button>

              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask any legal query or describe your situation..."
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none",
                  outline: "none", resize: "none", fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif", color: "#111827",
                  lineHeight: "1.5", maxHeight: "100px",
                }}
              />
              <button onClick={() => send(input)} disabled={!input.trim() || loading || uploading}
                className="send-btn"
                style={{
                  width: "38px", height: "38px", borderRadius: "50%", border: "none",
                  background: input.trim() && !loading && !uploading ? "#4F46E5" : "#E5E7EB",
                  cursor: input.trim() && !loading && !uploading ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.2s ease",
                  boxShadow: input.trim() && !loading ? "0 2px 8px rgba(79,70,229,0.4)" : "none",
                }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M13 1L1 6l5 2.5 2 5L13 1z" fill="white" />
                </svg>
              </button>
            </div>
            <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", marginTop: "8px" }}>
              AI can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
