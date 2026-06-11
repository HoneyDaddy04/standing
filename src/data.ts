// Mock data for the Standing app shell. In production this comes from the
// client's entity record + the compliance engine. Naira amounts are in kobo-free
// whole naira for readability.

export type FilingStatus = "filed" | "due-soon" | "overdue" | "upcoming" | "in-progress";

export interface Filing {
  id: string;
  regulator: "CAC" | "FIRS" | "State IRS" | "SCUML" | "NDPC";
  title: string;
  detail: string;
  dueDate: string; // ISO
  status: FilingStatus;
  feeNaira: number; // Standing's flat fee for handling it
}

export interface DocType {
  id: string;
  name: string;
  category: "Legal" | "Secretarial";
  blurb: string;
  feeNaira: number;
  turnaround: string;
  // questions the intake bot asks
  fields: { key: string; label: string; placeholder: string; type?: "text" | "textarea" }[];
}

export interface DocRequest {
  id: string;
  docName: string;
  brief: string;
  createdAt: string;
  stage: PipelineStage;
  reviewer?: string;
}

export type PipelineStage =
  | "queued"
  | "ai-drafting"
  | "human-review"
  | "ready"
  | "filed";

export const COMPANY = {
  name: "Bloom Foods Ltd",
  rcNumber: "RC 1842305",
  tin: "1842305-0001", // post-2026: CAC number doubles as TIN
  type: "Private Company Limited by Shares",
  shareCapital: 1_000_000,
  directors: ["Adaeze Bloom", "Tunde Okafor"],
  incorporated: "14 Mar 2022",
};

export const FILINGS: Filing[] = [
  {
    id: "f1",
    regulator: "CAC",
    title: "Annual Returns 2025",
    detail: "Statutory annual return + updated register of members and directors.",
    dueDate: "2026-06-30",
    status: "due-soon",
    feeNaira: 25_000,
  },
  {
    id: "f2",
    regulator: "FIRS",
    title: "Company Income Tax (CIT) 2025",
    detail: "CIT self-assessment return for year ended 31 Dec 2025.",
    dueDate: "2026-06-30",
    status: "due-soon",
    feeNaira: 35_000,
  },
  {
    id: "f3",
    regulator: "FIRS",
    title: "VAT, May 2026",
    detail: "Monthly value added tax return and remittance.",
    dueDate: "2026-06-21",
    status: "overdue",
    feeNaira: 10_000,
  },
  {
    id: "f4",
    regulator: "State IRS",
    title: "PAYE Remittance, May 2026",
    detail: "Pay-as-you-earn employee tax for Lagos State.",
    dueDate: "2026-06-10",
    status: "in-progress",
    feeNaira: 12_000,
  },
  {
    id: "f5",
    regulator: "SCUML",
    title: "SCUML Registration",
    detail: "Special Control Unit against Money Laundering registration.",
    dueDate: "2026-02-01",
    status: "filed",
    feeNaira: 15_000,
  },
  {
    id: "f6",
    regulator: "NDPC",
    title: "Data Protection Audit Filing 2026",
    detail: "NDPR annual audit return via a licensed DPCO.",
    dueDate: "2026-09-30",
    status: "upcoming",
    feeNaira: 40_000,
  },
];

export const DOC_TYPES: DocType[] = [
  {
    id: "d1",
    name: "Employment Contract",
    category: "Legal",
    blurb: "Offer letter + full employment agreement compliant with the Labour Act.",
    feeNaira: 25_000,
    turnaround: "Under 3 hours",
    fields: [
      { key: "role", label: "Role / job title", placeholder: "e.g. Operations Manager" },
      { key: "salary", label: "Gross monthly salary", placeholder: "e.g. ₦450,000" },
      { key: "terms", label: "Anything specific?", placeholder: "Probation period, notice, bonus, non-compete…", type: "textarea" },
    ],
  },
  {
    id: "d2",
    name: "Non-Disclosure Agreement",
    category: "Legal",
    blurb: "Mutual or one-way NDA for partners, vendors and contractors.",
    feeNaira: 20_000,
    turnaround: "Under 1 hour",
    fields: [
      { key: "counterparty", label: "Other party", placeholder: "e.g. Paystack Ltd" },
      { key: "direction", label: "One-way or mutual?", placeholder: "Mutual" },
      { key: "purpose", label: "Purpose of sharing", placeholder: "Evaluating a supply partnership", type: "textarea" },
    ],
  },
  {
    id: "d3",
    name: "Tenancy / Lease Agreement",
    category: "Legal",
    blurb: "Commercial or residential lease with Nigerian rent-law protections.",
    feeNaira: 30_000,
    turnaround: "Under 3 hours",
    fields: [
      { key: "property", label: "Property address", placeholder: "e.g. 12 Admiralty Way, Lekki" },
      { key: "rent", label: "Annual rent", placeholder: "e.g. ₦6,000,000" },
      { key: "term", label: "Lease term", placeholder: "2 years" },
    ],
  },
  {
    id: "d4",
    name: "Board Resolution",
    category: "Secretarial",
    blurb: "Directors' resolution for bank accounts, share changes, approvals.",
    feeNaira: 15_000,
    turnaround: "Under 1 hour",
    fields: [
      { key: "purpose", label: "What is being resolved?", placeholder: "Opening a corporate account with GTBank", type: "textarea" },
    ],
  },
  {
    id: "d5",
    name: "Vendor / Supply Agreement",
    category: "Legal",
    blurb: "Supply, distribution or services contract with clear payment terms.",
    feeNaira: 35_000,
    turnaround: "Under 3 hours",
    fields: [
      { key: "counterparty", label: "Vendor / customer", placeholder: "e.g. Shoprite Nigeria" },
      { key: "scope", label: "What's being supplied?", placeholder: "Weekly delivery of packaged goods", type: "textarea" },
      { key: "value", label: "Contract value", placeholder: "e.g. ₦2,000,000 / month" },
    ],
  },
  {
    id: "d6",
    name: "Shareholders' Agreement",
    category: "Secretarial",
    blurb: "Founder/SHA covering equity, vesting, control and exit.",
    feeNaira: 50_000,
    turnaround: "Same day",
    fields: [
      { key: "founders", label: "Shareholders & split", placeholder: "Adaeze 60%, Tunde 40%", type: "textarea" },
      { key: "notes", label: "Key terms", placeholder: "Vesting, board seats, drag-along…", type: "textarea" },
    ],
  },
];

// The independent, licensed professionals assigned to this company from Standing's
// vetted network: a Legal Practitioner and a chartered Company Secretary. Each
// issues work in their own name under their own licence; AI is their leverage.
export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  cred: string;
  tone: "legal" | "secretarial";
}

export const TEAM: TeamMember[] = [
  { initials: "CN", name: "Barr. Chidi Nwosu", role: "Your lawyer", cred: "NBA · called 2014 · SCN 48211", tone: "legal" },
  { initials: "FA", name: "Funke Adeyemi", role: "Your company secretary", cred: "ICSAN chartered · 11 yrs", tone: "secretarial" },
];

// The private channel is staffed by your team. AI triages instantly so a human
// can jump straight to the work, but a named person owns every matter.
export const SEED_MESSAGES = [
  { id: "m1", from: "Standing", role: "triage" as const, text: "Welcome to Bloom Foods' private channel. This is staffed by your team: Barr. Chidi (legal) and Funke (secretarial). Message anytime, I triage instantly so they can jump straight in." },
  { id: "m2", from: "Adaeze", role: "client" as const, text: "We're hiring an ops manager next week, need a proper contract." },
  { id: "m3", from: "Standing", role: "triage" as const, text: "Logged and routed to Chidi. I've pulled your RC details and last contract so he has everything to hand." },
  { id: "m4", from: "Barr. Chidi Nwosu", role: "team" as const, text: "Hi Adaeze, I'll handle this one personally. You'll have a draft within 3 hours. Quick one: any probation period or non-compete you'd like in there?" },
];

export function naira(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}

export const STAGE_LABEL: Record<PipelineStage, string> = {
  queued: "Received",
  "ai-drafting": "Drafting",
  "human-review": "In review",
  ready: "Ready to sign",
  filed: "Filed",
};
