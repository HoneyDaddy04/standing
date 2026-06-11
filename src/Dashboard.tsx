import { useEffect, useRef, useState } from "react";
import {
  COMPANY,
  DOC_TYPES,
  DocRequest,
  DocType,
  FILINGS,
  Filing,
  PipelineStage,
  STAGE_LABEL,
  TEAM,
  naira,
} from "./data";
import RequestModal from "./RequestModal";
import Logo from "./Logo";
import { Icon } from "./icons";
import Channel, { QUICK_PROMPTS } from "./Channel";

const NAV = [
  { id: "overview", icon: Icon.grid, label: "Overview" },
  { id: "compliance", icon: Icon.calendar, label: "Compliance" },
  { id: "documents", icon: Icon.doc, label: "Documents" },
  { id: "channel", icon: Icon.chat, label: "Channel" },
] as const;

type Tab = (typeof NAV)[number]["id"];

const STAGE_ORDER: PipelineStage[] = ["queued", "ai-drafting", "human-review", "ready", "filed"];

function daysUntil(iso: string): number {
  const today = new Date("2026-06-10").getTime();
  const due = new Date(iso).getTime();
  return Math.round((due - today) / 86400000);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function Dashboard({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [picker, setPicker] = useState(false);
  const [activeDoc, setActiveDoc] = useState<DocType | null>(null);
  const [requests, setRequests] = useState<DocRequest[]>([
    { id: "r0", docName: "Employment Contract", brief: "Operations Manager · ₦450,000", createdAt: "2026-06-10", stage: "human-review", reviewer: "Barr. Chidi Nwosu" },
  ]);
  const [toast, setToast] = useState<string | null>(null);

  const overdue = FILINGS.filter((f) => f.status === "overdue").length;
  const dueSoon = FILINGS.filter((f) => f.status === "due-soon").length;
  const filed = FILINGS.filter((f) => f.status === "filed").length;
  const health = Math.round(((FILINGS.length - overdue * 2 - dueSoon) / FILINGS.length) * 100);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function completeRequest(doc: DocType, brief: string) {
    const r: DocRequest = {
      id: "r" + Date.now(),
      docName: doc.name,
      brief,
      createdAt: "2026-06-10",
      stage: "ready",
      reviewer: doc.category === "Secretarial" ? "Funke Adeyemi" : "Barr. Chidi Nwosu",
    };
    setRequests((prev) => [r, ...prev]);
    setActiveDoc(null);
    setToast(`${doc.name} ready to sign`);
    setTab("documents");
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="side">
        <div style={{ marginBottom: 24, padding: "0 6px" }}>
          <Logo size={28} light />
        </div>
        <div className="side-co">
          <div className="nm">{COMPANY.name}</div>
          <div className="rc">{COMPANY.rcNumber} · TIN {COMPANY.tin}</div>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <button key={n.id} className={tab === n.id ? "on" : ""} onClick={() => setTab(n.id)}>
              <span className="ic">{n.icon({ size: 18 })}</span> {n.label}
              {n.id === "compliance" && overdue > 0 && (
                <span style={{ marginLeft: "auto", background: "var(--red)", color: "#fff", borderRadius: 999, fontSize: 11, padding: "1px 7px" }}>{overdue}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <button onClick={() => setPicker(true)}><Icon.plus size={15} /> &nbsp;New request</button>
          <button onClick={onExit}><Icon.back size={15} /> &nbsp;Back to site</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="main-head">
          <div>
            <h1>
              {tab === "overview" && "Good standing overview"}
              {tab === "compliance" && "Compliance calendar"}
              {tab === "documents" && "Documents"}
              {tab === "channel" && "Your private channel"}
            </h1>
            <p>
              {tab === "overview" && `${COMPANY.type} · incorporated ${COMPANY.incorporated}`}
              {tab === "compliance" && "Every statutory obligation, tracked across CAC, FIRS, State IRS, SCUML and NDPC."}
              {tab === "documents" && "Reviewed and signed by a licensed professional."}
              {tab === "channel" && "Your private, encrypted workspace. A named professional owns every matter."}
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setPicker(true)}><Icon.plus size={16} /> Request a document</button>
        </div>

        <div className="main-body">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <>
              <div className="health">
                <div className="gauge" style={{ ["--p" as string]: `${health}%` }}>{health}</div>
                <div>
                  <h3>{overdue > 0 ? "Action needed" : "You're in good standing"}</h3>
                  <p>
                    {overdue} overdue, {dueSoon} due soon, {filed} filed this year.{" "}
                    {overdue > 0 ? "Clear the overdue items to restore full standing." : "Your Letter of Good Standing is available."}
                  </p>
                </div>
                <button className="btn btn-gold btn-sm" onClick={() => setTab("compliance")}>Review filings</button>
              </div>

              <div className="grid-2">
                <div className="panel">
                  <div className="panel-head">
                    <h3>Upcoming deadlines</h3>
                    <span className="link" onClick={() => setTab("compliance")} style={{ cursor: "pointer" }}>View all</span>
                  </div>
                  {[...FILINGS]
                    .filter((f) => f.status !== "filed")
                    .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))
                    .slice(0, 4)
                    .map((f) => (
                      <FilingRow key={f.id} f={f} />
                    ))}
                </div>

                <div className="panel">
                  <div className="panel-head">
                    <h3>Your team</h3>
                    <span className="link" onClick={() => setTab("channel")} style={{ cursor: "pointer" }}>Message</span>
                  </div>
                  <div className="team-panel">
                    {TEAM.map((m) => (
                      <div className="team-row" key={m.initials}>
                        <div className={`avatar ${m.tone}`}>{m.initials}</div>
                        <div>
                          <div className="nm">{m.name}</div>
                          <div className="rl">{m.role}</div>
                        </div>
                        <span className="status-dot">online</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel" style={{ marginTop: 24 }}>
                <div className="panel-head">
                  <h3>In progress</h3>
                  <span className="link" onClick={() => setTab("documents")} style={{ cursor: "pointer" }}>All documents</span>
                </div>
                {requests.slice(0, 3).map((r) => (
                  <RequestCard key={r.id} r={r} />
                ))}
                {requests.length === 0 && <div className="empty">No active requests.</div>}
              </div>
            </>
          )}

          {/* COMPLIANCE */}
          {tab === "compliance" && (
            <div className="panel">
              <div className="panel-head">
                <h3>All obligations · 2026</h3>
                <span className="link">{filed} of {FILINGS.length} on track</span>
              </div>
              {[...FILINGS]
                .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))
                .map((f) => (
                  <FilingRow key={f.id} f={f} expanded />
                ))}
            </div>
          )}

          {/* DOCUMENTS */}
          {tab === "documents" && (
            <>
              <div className="panel" style={{ marginBottom: 28 }}>
                <div className="panel-head">
                  <h3>Your requests</h3>
                </div>
                {requests.map((r) => (
                  <RequestCard key={r.id} r={r} />
                ))}
                {requests.length === 0 && <div className="empty">No documents yet. Request one below.</div>}
              </div>

              <div className="sec-eyebrow" style={{ marginBottom: 16 }}>REQUEST A NEW DOCUMENT</div>
              <div className="dt-grid">
                {DOC_TYPES.map((d) => (
                  <button key={d.id} className="dt-card" onClick={() => setActiveDoc(d)}>
                    <div className="cat">{d.category}</div>
                    <h4>{d.name}</h4>
                    <div className="bl">{d.blurb}</div>
                    <div className="ft">
                      <span className="fee">{naira(d.feeNaira)}</span>
                      <span className="ta"><Icon.clock size={14} /> {d.turnaround}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* CHANNEL */}
          {tab === "channel" && (
            <div className="channel-wrap">
              <div className="channel-side">
                <h3>Ask for anything. Get it back sorted.</h3>
                <p>
                  Your private, encrypted workspace. It feels as easy as a chat, but
                  your records stay secure and personal data is redacted before it ever
                  sends. Try typing an account number to see it.
                </p>
                <div className="ch-points">
                  <div className="ch-pt">
                    <span className="ic"><Icon.lock size={18} /></span>
                    <div>
                      <h4>Encrypted by default</h4>
                      <p>Confidential matters stay inside your secure workspace.</p>
                    </div>
                  </div>
                  <div className="ch-pt">
                    <span className="ic"><Icon.shield size={18} /></span>
                    <div>
                      <h4>Automatic PII redaction</h4>
                      <p>NINs, BVNs, account numbers and the like are masked as you type.</p>
                    </div>
                  </div>
                  <div className="ch-pt">
                    <span className="ic"><Icon.user size={18} /></span>
                    <div>
                      <h4>A real person is accountable</h4>
                      <p>A named professional signs off on everything you receive.</p>
                    </div>
                  </div>
                </div>
                <div className="channel-prompts">
                  <div className="lbl">Try sending</div>
                  {QUICK_PROMPTS.map((p) => (
                    <span className="chip" key={p}><Icon.chat size={13} /> {p}</span>
                  ))}
                </div>
              </div>
              <Channel mode="live" tall />
            </div>
          )}
        </div>
      </main>

      {/* doc type picker */}
      {picker && (
        <div className="scrim" onClick={() => setPicker(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>What do you need?</h3>
                <p>Pick a document. Flat fee, signed off by your professional.</p>
              </div>
              <button className="x" onClick={() => setPicker(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="dt-grid">
                {DOC_TYPES.map((d) => (
                  <button
                    key={d.id}
                    className="dt-card"
                    onClick={() => {
                      setPicker(false);
                      setActiveDoc(d);
                    }}
                  >
                    <div className="cat">{d.category}</div>
                    <h4>{d.name}</h4>
                    <div className="ft">
                      <span className="fee">{naira(d.feeNaira)}</span>
                      <span className="ta"><Icon.clock size={14} /> {d.turnaround}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* live request pipeline */}
      {activeDoc && (
        <RequestModal
          doc={activeDoc}
          onClose={() => setActiveDoc(null)}
          onComplete={(brief) => completeRequest(activeDoc, brief)}
        />
      )}

      {toast && <div className="toast"><Icon.check size={16} /> {toast}</div>}
    </div>
  );
}

function FilingRow({ f, expanded }: { f: Filing; expanded?: boolean }) {
  const d = daysUntil(f.dueDate);
  const when =
    f.status === "filed"
      ? "Filed"
      : d < 0
      ? `${Math.abs(d)} days overdue`
      : d === 0
      ? "Due today"
      : `Due in ${d} days · ${fmtDate(f.dueDate)}`;
  return (
    <div className="filing">
      <div className={`reg ${f.regulator}`}>{f.regulator}</div>
      <div>
        <div className="ttl">{f.title}</div>
        <div className="dt">{expanded ? f.detail : when}</div>
        {expanded && <div className="dt" style={{ marginTop: 2 }}>{when} · Standing fee {naira(f.feeNaira)}</div>}
      </div>
      <div className={`badge-status s-${f.status}`}>
        {f.status === "in-progress" ? "Filing now" : f.status.replace("-", " ")}
      </div>
    </div>
  );
}

function RequestCard({ r }: { r: DocRequest }) {
  const idx = STAGE_ORDER.indexOf(r.stage);
  const done = r.stage === "ready" || r.stage === "filed";
  return (
    <div className="doc-card">
      <div className="top">
        <div>
          <div className="nm">{r.docName}</div>
          <div className="br">{r.brief}</div>
        </div>
        <span className={`badge-status ${done ? "s-filed" : "s-in-progress"}`}>
          {STAGE_LABEL[r.stage]}
        </span>
      </div>
      <div className="pipe">
        {STAGE_ORDER.slice(0, 4).map((s, i) => (
          <div key={s} className={`node ${i < idx ? "done" : i === idx ? "active" : ""}`} />
        ))}
      </div>
      <div className="pipe-label">
        <span>Received</span>
        <span>Drafting</span>
        <span>Review</span>
        <span>Ready</span>
      </div>
      {r.reviewer && (
        <div className="signed">
          {done ? <Icon.seal size={15} /> : <Icon.user size={15} />}
          {done ? "Signed off by " : "With "}{r.reviewer}
        </div>
      )}
    </div>
  );
}
