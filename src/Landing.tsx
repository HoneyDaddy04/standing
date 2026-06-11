import { useState } from "react";
import Logo from "./Logo";
import { Icon } from "./icons";
import { Reveal, useCountUp } from "./motion";
import { TEAM } from "./data";
import Channel from "./Channel";

const Check = () => (
  <span className="ico check-ico">
    <Icon.check size={16} />
  </span>
);

function Stat({ value, prefix = "", suffix = "", label }: { value: number; prefix?: string; suffix?: string; label: string }) {
  const { ref, val } = useCountUp(value);
  return (
    <div className="stat">
      <div className="big" ref={ref as any}>
        {prefix}
        {val.toLocaleString("en-NG")}
        {suffix}
      </div>
      <div className="lbl">{label}</div>
    </div>
  );
}

export default function Landing({ onEnter }: { onEnter: () => void }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Logo size={30} />
          <nav className="nav-links">
            <a href="#services">Services</a>
            <a href="#how">How it works</a>
            <a href="#team">Your team</a>
            <a href="#pricing">Pricing</a>
            <button className="btn btn-primary btn-sm" onClick={onEnter}>
              Open dashboard <Icon.arrowRight size={16} />
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="aurora a1" />
        <div className="aurora a2" />
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">
              <span className="dot" /> AI-native compliance and legal, done for you
            </span>
            <h1 className="hero-title">
              Never miss a filing. Never overpay for a <em>contract</em>.
            </h1>
            <p className="hero-sub">
              Standing keeps your Nigerian company compliant and contract-ready for a
              flat monthly fee. AI does the heavy lifting, and a licensed professional
              signs off on everything.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={onEnter}>
                See your dashboard <Icon.arrowRight size={16} />
              </button>
              <a className="btn btn-ghost" href="#pricing">
                View pricing
              </a>
            </div>
            <div className="hero-note">
              <span><Check /> A real professional on the hook</span>
              <span><Check /> Encrypted, with PII redaction</span>
              <span><Check /> Flat fees, no retainer</span>
            </div>
          </div>
          <Channel mode="auto" floating />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="band tint">
        <div className="wrap">
          <Reveal className="sec-head">
            <div className="sec-eyebrow">The problem</div>
            <h2 className="sec-title">Staying compliant in Nigeria is a part-time job nobody has time for.</h2>
            <p className="sec-sub">
              CAC, FIRS, State IRS, SCUML, NDPC. Overlapping deadlines, opaque fees,
              and penalties that compound monthly. Most companies only deal with it
              once something has already broken.
            </p>
          </Reveal>
          <div className="stat-row">
            <Reveal delay={0}><Stat value={5} label="separate regulators every company must keep current: CAC, FIRS, State IRS, SCUML and NDPC." /></Reveal>
            <Reveal delay={90}><Stat value={80} prefix="₦" suffix="k+" label="in professional fees per company, per compliance cycle, on top of government charges." /></Reveal>
            <Reveal delay={180}><Stat value={30} suffix=" Jun" label="is when CAC annual returns and FIRS company income tax both fall due, the same day every year." /></Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="band" id="services">
        <div className="wrap">
          <Reveal className="sec-head">
            <div className="sec-eyebrow">One service, two jobs</div>
            <h2 className="sec-title">Your company's back office and lawyer, under one roof.</h2>
            <p className="sec-sub">
              We merged the two services every Nigerian company pays for separately.
              Same people, same private channel, same flat fee.
            </p>
          </Reveal>
          <div className="split">
            <Reveal as="div" className="svc">
              <div className="tag">Compliance and secretarial</div>
              <h3>We keep you filed and in good standing.</h3>
              <p>A live calendar of every obligation, pre-filled forms, and a chartered secretary who files on your behalf.</p>
              <ul>
                <li><Check /> CAC annual returns and statutory registers</li>
                <li><Check /> FIRS company income tax and monthly VAT</li>
                <li><Check /> State PAYE and SCUML registration</li>
                <li><Check /> NDPC and data-protection audit filings</li>
                <li><Check /> Board resolutions and minute books</li>
              </ul>
            </Reveal>
            <Reveal as="div" className="svc" delay={100}>
              <div className="tag">Legal and contracts</div>
              <h3>We draft the agreements you actually use.</h3>
              <p>The everyday contracts founders go without because lawyers are slow and expensive. Drafted against Nigerian law, lawyer reviewed.</p>
              <ul>
                <li><Check /> Employment contracts and offer letters</li>
                <li><Check /> NDAs, vendor and supply agreements</li>
                <li><Check /> Tenancy and lease agreements</li>
                <li><Check /> Shareholders' and founders' agreements</li>
                <li><Check /> Demand letters and debt recovery</li>
              </ul>
            </Reveal>
          </div>
          <Reveal className="svc-join">
            <span className="pill"><Icon.lock size={18} /> Both run from one private, encrypted channel your team watches</span>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="band tint" id="how">
        <div className="wrap">
          <Reveal className="sec-head">
            <div className="sec-eyebrow">How it works</div>
            <h2 className="sec-title">Ask in plain words. Get it back sorted.</h2>
          </Reveal>
          <div className="steps">
            {[
              { n: 1, h: "Ask in plain words", p: "Tell your private, encrypted workspace what you need, like a quick message. No legal jargon, no forms to fill." },
              { n: 2, h: "We handle it", p: "Your filing or contract is drafted, checked against current Nigerian law, and signed off by a licensed professional." },
              { n: 3, h: "Back in hours", p: "Most documents land the same day, often within the hour. Statutory filings go in well before the deadline, every time." },
              { n: 4, h: "Always in good standing", p: "Your compliance calendar stays green and your Letter of Good Standing is ready whenever a bank or investor asks." },
            ].map((s, i) => (
              <Reveal as="div" className="step" key={s.n} delay={i * 80}>
                <div className="n">{s.n}</div>
                <h4>{s.h}</h4>
                <p>{s.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="band" id="team">
        <div className="wrap">
          <Reveal className="sec-head">
            <div className="sec-eyebrow">The people on your account</div>
            <h2 className="sec-title">Not a chatbot. Real professionals who pick up.</h2>
            <p className="sec-sub">
              Every company on Standing is assigned named professionals who own your
              matters and answer in your workspace, so there is always a real person
              accountable for your filings and contracts.
            </p>
          </Reveal>
          <div className="team-strip">
            {TEAM.map((m, i) => (
              <Reveal as="div" className="member" key={m.initials} delay={i * 90}>
                <div className={`avatar ${m.tone}`}>
                  <span className="ring" />
                  {m.initials}
                </div>
                <div>
                  <div className="nm">{m.name}</div>
                  <div className="rl">{m.role}</div>
                  <div className="cr">{m.cred}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="band tint" id="pricing">
        <div className="wrap">
          <Reveal className="sec-head">
            <div className="sec-eyebrow">Pricing</div>
            <h2 className="sec-title">Flat fees. Per company, per document. Never hourly.</h2>
            <p className="sec-sub">Subscribe for hands-off compliance, or pay once for a document. Cancel anytime.</p>
          </Reveal>
          <div className="price-grid">
            <Reveal as="div" className="plan">
              <h3>Pay per document</h3>
              <div className="amt">₦20k<small> to ₦50k</small></div>
              <div className="desc">One-off contracts and resolutions, no subscription.</div>
              <ul>
                <li><Check /> Any single contract or resolution</li>
                <li><Check /> Reviewed and signed by your lawyer</li>
                <li><Check /> Delivered in hours</li>
                <li><Check /> One round of edits included</li>
              </ul>
              <button className="btn btn-ghost btn-block" onClick={onEnter}>Request a document</button>
            </Reveal>

            <Reveal as="div" className="plan feature" delay={90}>
              <span className="pop">Most popular</span>
              <h3>Standing, Compliance</h3>
              <div className="amt">₦25k<small> / month</small></div>
              <div className="desc">Hands-off statutory compliance for one company.</div>
              <ul>
                <li><Check /> All CAC, FIRS, VAT and State filings handled</li>
                <li><Check /> Live deadline calendar and reminders</li>
                <li><Check /> Letter of Good Standing on demand</li>
                <li><Check /> Government fees billed at cost</li>
                <li><Check /> 3 documents a year included</li>
              </ul>
              <button className="btn btn-primary btn-block" onClick={onEnter}>Start with Standing</button>
            </Reveal>

            <Reveal as="div" className="plan" delay={180}>
              <h3>Standing, Full</h3>
              <div className="amt">₦60k<small> / month</small></div>
              <div className="desc">Compliance plus unlimited everyday legal work.</div>
              <ul>
                <li><Check /> Everything in Compliance</li>
                <li><Check /> Unlimited standard contracts</li>
                <li><Check /> Priority turnaround under an hour</li>
                <li><Check /> Dedicated lawyer and secretary</li>
                <li><Check /> Annual legal health review</li>
              </ul>
              <button className="btn btn-ghost btn-block" onClick={onEnter}>Talk to us</button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="band">
        <div className="wrap trust-grid">
          <Reveal>
            <div className="sec-eyebrow">Why trust Standing</div>
            <h2 className="sec-title">Every document carries a professional's name.</h2>
            <div className="trust-points">
              <div className="tp">
                <div className="ic"><Icon.scales size={20} /></div>
                <div>
                  <h4>A licensed human is accountable</h4>
                  <p>Every output is reviewed and signed by an NBA-called lawyer or an ICSAN-chartered secretary. Not a chatbot you are left to trust.</p>
                </div>
              </div>
              <div className="tp">
                <div className="ic"><Icon.flag size={20} /></div>
                <div>
                  <h4>Built for Nigerian law</h4>
                  <p>CAMA 2020, the Finance Acts, the Labour Act, the NDPR. Our engine is grounded in what actually applies here, not a US template.</p>
                </div>
              </div>
              <div className="tp">
                <div className="ic"><Icon.lock size={20} /></div>
                <div>
                  <h4>Secure by default</h4>
                  <p>Your records live in an encrypted workspace, and personal data like NINs, BVNs and account numbers is redacted before it ever sends. We never train public models on your data.</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal as="div" className="seal" delay={120}>
            <div className="badge"><Icon.seal size={28} /></div>
            <h3>Certificate of Good Standing, on demand</h3>
            <p>
              When you are current on every CAC and FIRS obligation, your secretary
              generates your Letter of Good Standing the same day. Useful for banks,
              tenders, grants and investors who want proof your company is clean.
            </p>
          </Reveal>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="band">
        <div className="wrap">
          <Reveal as="div" className="cta-band">
            <h2>Put your compliance on autopilot.</h2>
            <p>
              We are onboarding founders and SMEs in Lagos, Abuja and Port Harcourt
              first. Join the list, or jump straight into the live dashboard demo.
            </p>
            {joined ? (
              <div className="thanks"><Check /> You are on the list. We will reach out shortly.</div>
            ) : (
              <form
                className="waitlist"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setJoined(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="you@yourcompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-gold" type="submit">Join waitlist</button>
              </form>
            )}
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }} onClick={onEnter}>
                Or explore the dashboard demo <Icon.arrowRight size={16} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <Logo size={26} />
          <p className="foot-legal">
            Standing works with a vetted network of independent, licensed Nigerian
            professionals (NBA-registered Legal Practitioners and ICSAN-chartered
            Company Secretaries). We vet the professionals, manage the work and stand
            behind the service. Each contract, filing and certification is issued by
            the named professional in their own name and under their own licence.
            Standing is not a law firm and does not provide legal advice.
          </p>
          <p className="foot-copy">© 2026 Standing Technologies.</p>
        </div>
      </footer>
    </>
  );
}
