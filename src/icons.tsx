// Minimal, consistent 24x24 stroke icons. One visual language across the whole
// product, replacing emoji so it reads like a professional service tool.
import { ReactNode } from "react";

function I({ children, size = 22 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const Icon = {
  grid: (p?: { size?: number }) => (
    <I size={p?.size}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></I>
  ),
  calendar: (p?: { size?: number }) => (
    <I size={p?.size}><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /><path d="M7.5 13.5l1.6 1.6 3-3.2" /></I>
  ),
  doc: (p?: { size?: number }) => (
    <I size={p?.size}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M8.5 13h7M8.5 16.5h5" /></I>
  ),
  chat: (p?: { size?: number }) => (
    <I size={p?.size}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-3.8-.8L3 21l1.9-5.2A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z" /></I>
  ),
  plus: (p?: { size?: number }) => (<I size={p?.size}><path d="M12 5v14M5 12h14" /></I>),
  back: (p?: { size?: number }) => (<I size={p?.size}><path d="M19 12H5M12 19l-7-7 7-7" /></I>),
  scales: (p?: { size?: number }) => (
    <I size={p?.size}><path d="M12 3v18M7 21h10M5 7h14M5 7l-2.5 6a3 3 0 0 0 5 0L5 7zM19 7l-2.5 6a3 3 0 0 0 5 0L19 7z" /><path d="M12 4.2 5 7M12 4.2 19 7" /></I>
  ),
  flag: (p?: { size?: number }) => (
    <I size={p?.size}><path d="M5 21V4M5 4s1.5-1 4-1 4 2 6.5 2S20 4 20 4v9s-1.5 1-4.5 1-4-2-6.5-2-4 1-4 1" /></I>
  ),
  lock: (p?: { size?: number }) => (
    <I size={p?.size}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5M12 14.5v2.5" /></I>
  ),
  seal: (p?: { size?: number }) => (
    <I size={p?.size}><path d="M12 2.5l2.3 1.5 2.7-.3 1 2.6 2.3 1.5-.8 2.6.8 2.6-2.3 1.5-1 2.6-2.7-.3L12 21.5l-2.3-1.5-2.7.3-1-2.6L3.7 16l.8-2.6L3.7 11l2.3-1.5 1-2.6 2.7.3z" /><path d="M9 12l2.2 2.2L15.5 10" /></I>
  ),
  check: (p?: { size?: number }) => (<I size={p?.size}><path d="M4 12.5l5 5 11-11" /></I>),
  bolt: (p?: { size?: number }) => (<I size={p?.size}><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" /></I>),
  shield: (p?: { size?: number }) => (
    <I size={p?.size}><path d="M12 2.5l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10v-6z" /><path d="M8.5 12l2.3 2.3 4.7-4.8" /></I>
  ),
  clock: (p?: { size?: number }) => (<I size={p?.size}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></I>),
  arrowRight: (p?: { size?: number }) => (<I size={p?.size}><path d="M5 12h14M13 5l7 7-7 7" /></I>),
  sparkle: (p?: { size?: number }) => (
    <I size={p?.size}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5L15 9M9 15l-2.5 2.5" /></I>
  ),
  user: (p?: { size?: number }) => (
    <I size={p?.size}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></I>
  ),
};

export type IconName = keyof typeof Icon;
