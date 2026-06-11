import { useEffect, useRef, useState } from "react";
import { DocType, TEAM, naira } from "./data";
import { Icon } from "./icons";

type Phase = "intake" | "running" | "done";

interface RunStep {
  title: string;
  detail: string;
  stream?: string;
}

// Outcome-led pipeline: what is happening to your document, not who is doing it.
// The single human sign-off shows at the end.
function buildSteps(doc: DocType, brief: Record<string, string>): RunStep[] {
  const counterparty = brief.counterparty || brief.role || brief.property || "your needs";
  return [
    { title: "Reading your company details", detail: "Bloom Foods Ltd · RC 1842305" },
    { title: `Drafting your ${doc.name}`, detail: `Tailored to ${counterparty}` },
    {
      title: "Checking it against Nigerian law",
      detail: "CAMA 2020, Finance Act, Labour Act",
      stream: "Termination notice raised to the Labour Act minimum, governing law set to Lagos State.",
    },
    { title: "Final review and sign-off", detail: "By a licensed professional" },
    { title: "Ready to sign", detail: "Delivered to your workspace" },
  ];
}

export default function RequestModal({
  doc,
  onClose,
  onComplete,
}: {
  doc: DocType;
  onClose: () => void;
  onComplete: (brief: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>("intake");
  const [form, setForm] = useState<Record<string, string>>({});
  const [active, setActive] = useState(0);
  const steps = useRef<RunStep[]>([]);
  const timers = useRef<number[]>([]);

  const owner = doc.category === "Secretarial" ? TEAM[1] : TEAM[0];

  useEffect(() => {
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  function start() {
    steps.current = buildSteps(doc, form);
    setPhase("running");
    setActive(0);
    steps.current.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setActive(i + 1);
        if (i + 1 >= steps.current.length) {
          const t2 = window.setTimeout(() => setPhase("done"), 700);
          timers.current.push(t2);
        }
      }, 1100 * (i + 1));
      timers.current.push(t);
    });
  }

  const briefSummary =
    Object.values(form).filter(Boolean).slice(0, 2).join(" · ") || doc.name;

  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>{phase === "done" ? "Your document is ready" : doc.name}</h3>
            <p>
              {phase === "intake" && doc.blurb}
              {phase === "running" && "Working on it…"}
              {phase === "done" && `Reviewed and signed by ${owner.name} · ${doc.turnaround}`}
            </p>
          </div>
          <button className="x" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {phase === "intake" && (
            <>
              {doc.fields.map((f) => (
                <div className="field" key={f.key}>
                  <label>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      placeholder={f.placeholder}
                      value={form[f.key] || ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      placeholder={f.placeholder}
                      value={form[f.key] || ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <div className="fee-line">
                <div className="lbl">Flat fee · {doc.turnaround}</div>
                <div className="val">{naira(doc.feeNaira)}</div>
              </div>
              <button className="btn btn-primary btn-block" onClick={start}>
                Send securely
              </button>
            </>
          )}

          {(phase === "running" || phase === "done") && (
            <div className="run">
              {steps.current.map((s, i) => {
                const state = i < active ? "done" : i === active ? "active" : "pending";
                return (
                  <div className={`run-step ${state}`} key={i}>
                    <div className="marker">
                      {state === "done" ? <Icon.check size={13} /> : i + 1}
                    </div>
                    <div className="rs-body">
                      <h4>{s.title}</h4>
                      <p>{s.detail}</p>
                      {s.stream && state !== "pending" && (
                        <div className="stream">{s.stream}</div>
                      )}
                    </div>
                  </div>
                );
              })}

              {phase === "done" && (
                <>
                  <div className="run-owner" style={{ marginTop: 16, marginBottom: 0 }}>
                    <div className={`avatar ${owner.tone}`}>{owner.initials}</div>
                    <div className="t">
                      <b>Signed off by {owner.name}</b>
                      {owner.cred}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    style={{ marginTop: 16 }}
                    onClick={() => onComplete(briefSummary)}
                  >
                    Open in my workspace <Icon.arrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
