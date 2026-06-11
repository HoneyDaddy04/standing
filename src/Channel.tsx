import { ReactNode, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

/* ------------------------------------------------------------------ *
 * Standing's own secure in-app chat. Familiar and conversational, but
 * it is the encrypted Standing workspace, not a consumer messenger.
 * Personal data (NIN, BVN, account numbers, etc.) is detected and
 * redacted before a message is ever sent.
 * ------------------------------------------------------------------ */

type Side = "in" | "out";
type Part = string | { mask: string } | { risk: string };

interface Msg {
  id: string;
  side: Side;
  sender?: string;
  color?: string;
  ai?: boolean;
  parts: Part[];
  time: string;
  read?: boolean;
  secured?: boolean;
}

const TRIAGE = { name: "Standing", color: "#1f9b75" };
const HUMAN = { name: "Barr. Chidi Nwosu", color: "#9b2fae" };

// --- PII detection / redaction ------------------------------------
const RULES: { type: string; re: RegExp; mask: (m: string) => string }[] = [
  { type: "email", re: /[\w.+-]+@[\w-]+\.[\w.-]+/g, mask: (m) => (m[0] || "") + "•••@" + m.split("@")[1] },
  { type: "card", re: /\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, mask: (m) => "•••• •••• •••• " + m.replace(/\D/g, "").slice(-4) },
  { type: "phone", re: /(?:\+234|0)\d{9,10}\b/g, mask: (m) => m.slice(0, 4) + "••••" + m.slice(-2) },
  { type: "account no.", re: /\b\d{10}\b/g, mask: (m) => "••••••" + m.slice(-4) },
  { type: "NIN/BVN", re: /\b\d{11}\b/g, mask: (m) => "•••••••" + m.slice(-2) },
];

function scan(text: string) {
  const claimed: [number, number][] = [];
  const hits: { start: number; end: number; type: string; masked: string }[] = [];
  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.re.exec(text))) {
      const start = m.index;
      const end = start + m[0].length;
      if (claimed.some((c) => start < c[1] && end > c[0])) continue;
      claimed.push([start, end]);
      hits.push({ start, end, type: rule.type, masked: rule.mask(m[0]) });
    }
  }
  return hits.sort((a, b) => a.start - b.start);
}

function buildParts(text: string, redactOn: boolean): { parts: Part[]; found: string[] } {
  const hits = scan(text);
  const found = Array.from(new Set(hits.map((h) => h.type)));
  if (!hits.length) return { parts: [text], found: [] };
  const parts: Part[] = [];
  let i = 0;
  for (const h of hits) {
    if (h.start > i) parts.push(text.slice(i, h.start));
    parts.push(redactOn ? { mask: h.masked } : { risk: text.slice(h.start, h.end) });
    i = h.end;
  }
  if (i < text.length) parts.push(text.slice(i));
  return { parts, found };
}

function renderParts(parts: Part[]): ReactNode {
  return parts.map((p, i) => {
    if (typeof p === "string") return <span key={i}>{p}</span>;
    if ("mask" in p) return <span key={i} className="redacted">{p.mask}</span>;
    return <span key={i} style={{ color: "#b4452f", fontWeight: 600 }}>{p.risk}</span>;
  });
}

// --- inline icons --------------------------------------------------
const SendArrow = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.6 21 12 3.4 3.4l.1 6.7L15 12 3.5 13.9z" /></svg>);
const MicCam = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)" }}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>);
const DoubleTick = ({ read }: { read?: boolean }) => (
  <span className={"ch-ticks" + (read ? " read" : "")}>
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 5.8 4 8.8 9 2.5" /><path d="M7 8.8 12 2.5" /><path d="M11 8.8 16 2.5" />
    </svg>
  </span>
);

function nowTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
}

let seq = 0;
const uid = () => "m" + ++seq;

// --- auto-play script for the landing hero ------------------------
interface ScriptStep { side: Side; who?: "triage" | "human"; text: string; secured?: boolean; time: string }
const HERO_SCRIPT: ScriptStep[] = [
  { side: "out", text: "We're hiring an ops manager, salary ₦450,000.", time: "10:40" },
  { side: "in", who: "human", text: "I'll take care of it. Send the new hire's bank details for the offer.", time: "10:41" },
  { side: "out", text: "Sure, acct 0123456789, NIN 12345678901", secured: true, time: "10:42" },
  { side: "in", who: "triage", text: "Secured the account number and NIN before sending.", time: "10:42" },
  { side: "in", who: "human", text: "Got everything. Your employment contract will be ready to sign within 3 hours.", time: "10:43" },
];

function stepToMsg(s: ScriptStep): Msg {
  const who = s.who === "human" ? HUMAN : s.who === "triage" ? TRIAGE : undefined;
  return {
    id: uid(),
    side: s.side,
    sender: who?.name,
    color: who?.color,
    ai: s.who === "triage",
    parts: buildParts(s.text, true).parts,
    time: s.time,
    read: s.side === "out",
    secured: s.secured,
  };
}

export default function Channel({
  mode = "live",
  tall = false,
  floating = false,
}: {
  mode?: "live" | "auto";
  tall?: boolean;
  floating?: boolean;
}) {
  const [messages, setMessages] = useState<Msg[]>(
    mode === "auto"
      ? []
      : [
          { id: uid(), side: "in", ai: true, sender: TRIAGE.name, color: TRIAGE.color, parts: ["Welcome to your private, encrypted workspace. Tell us what you need and anything sensitive is redacted before it sends."], time: "09:30" },
          { id: uid(), side: "out", parts: ["We're hiring an ops manager next week, need a proper contract."], time: "09:31", read: true },
          { id: uid(), side: "in", sender: HUMAN.name, color: HUMAN.color, parts: ["Hi Adaeze, I'll take care of this. Ready to sign within 3 hours. Any probation period you'd like in?"], time: "09:32" },
        ]
  );
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [redact, setRedact] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);
  // Scroll only the chat container, never the page. (scrollIntoView would walk
  // up and scroll the whole window down to the hero chat on load.)
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (mode !== "auto") return;
    let i = 0;
    const run = () => {
      if (i >= HERO_SCRIPT.length) return;
      const step = HERO_SCRIPT[i];
      if (step.side === "in") {
        setTyping(true);
        timers.current.push(window.setTimeout(() => {
          setTyping(false);
          setMessages((p) => [...p, stepToMsg(step)]);
          i++;
          timers.current.push(window.setTimeout(run, 650));
        }, 1150));
      } else {
        setMessages((p) => [...p, stepToMsg(step)]);
        i++;
        timers.current.push(window.setTimeout(run, 900));
      }
    };
    timers.current.push(window.setTimeout(run, 700));
  }, [mode]);

  const preview = buildParts(draft, redact);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    const { parts, found } = buildParts(t, redact);
    setMessages((prev) => [
      ...prev.map((m) => (m.side === "out" ? { ...m, read: true } : m)),
      { id: uid(), side: "out", parts, time: nowTime(), read: false, secured: found.length > 0 && redact },
    ]);
    setDraft("");
    setTyping(true);

    if (found.length) {
      timers.current.push(window.setTimeout(() => {
        setMessages((p) => [...p, { id: uid(), side: "in", ai: true, sender: TRIAGE.name, color: TRIAGE.color, parts: [`Secured your ${found.join(" and ")} before sending.`], time: nowTime() }]);
      }, 750));
    }
    timers.current.push(window.setTimeout(() => {
      setTyping(false);
      setMessages((p) => [...p, { id: uid(), side: "in", sender: HUMAN.name, color: HUMAN.color, parts: ["On it. I'll have this back to you shortly. Anything specific you want covered?"], time: nowTime() }]);
    }, found.length ? 2150 : 1500));
  }

  const status = typing ? "typing…" : "end-to-end encrypted";

  return (
    <div className={"ch-surface" + (tall ? " tall" : "") + (floating ? " floating" : "")}>
      {/* header */}
      <div className="ch-bar">
        <div className="pic"><Icon.shield size={21} /></div>
        <div className="meta">
          <div className="nm">Standing</div>
          <div className={"st" + (typing ? " typing" : "")}>
            {!typing && <Icon.lock size={11} />}
            {status}
          </div>
        </div>
      </div>

      {/* chat */}
      <div className="ch-chat" ref={bodyRef}>
        <div className="ch-day">TODAY</div>
        <div className="ch-note"><Icon.lock size={11} /> Encrypted workspace. Personal data is redacted before it is stored or sent.</div>
        {messages.map((m, idx) => {
          const prev = messages[idx - 1];
          const grouped = prev && prev.side === m.side && prev.sender === m.sender;
          return (
            <div key={m.id} className={`ch-msg ${m.side}${grouped ? " grouped" : ""}`}>
              {m.side === "in" && m.sender && !grouped && (
                <div className="ch-sender" style={{ color: m.color }}>
                  {m.ai && <Icon.sparkle size={12} />}{m.sender}
                </div>
              )}
              <span className="ch-text">{renderParts(m.parts)}</span>
              {m.secured && (
                <div className="ch-secured"><Icon.lock size={12} /> Encrypted before sending</div>
              )}
              <span className="ch-foot">
                {m.time}
                {m.side === "out" && <DoubleTick read={m.read} />}
              </span>
            </div>
          );
        })}
        {typing && <div className="ch-typing"><span /><span /><span /></div>}
      </div>

      {/* PII warning (live only) */}
      {mode === "live" && preview.found.length > 0 && (
        <div className="ch-piiwarn">
          <Icon.shield size={16} />
          <span className="grow">
            <b>{preview.found.join(", ")}</b> detected. {redact ? "It will be redacted before sending." : "Sending in the clear."}
          </span>
          <span className="toggle" onClick={() => setRedact((r) => !r)} title="Toggle redaction">
            <span className={"track" + (redact ? " on" : "")} /> Redact
          </span>
        </div>
      )}

      {/* input */}
      {mode === "live" && (
        <form className="ch-input" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
          <div className="pill">
            <input placeholder="Type a message" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <MicCam />
          </div>
          <button className="send" type="submit" aria-label="Send"><SendArrow /></button>
        </form>
      )}
    </div>
  );
}

export const QUICK_PROMPTS = [
  "Need an NDA for a new supplier",
  "File our VAT for May",
  "Send the new hire's bank details: acct 0123456789",
  "Draft a tenancy agreement for our Lekki office",
];
