// Standing logo. A fluted classical column (law, stability, "standing") set in a
// rounded seal tile, with a gold capital line nodding to a certificate of good
// standing. Pure SVG so it stays crisp at any size and can be themed.

export function LogoMark({ size = 32, gold = "#e7b94e" }: { size?: number; gold?: string }) {
  const id = "lg" + size;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c5a3a" />
          <stop offset="1" stopColor="#083f29" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${id})`} />
      <rect width="32" height="32" rx="9" fill="white" fillOpacity="0.04" />
      {/* capital + base in cream, gold accent on the capital */}
      <rect x="8" y="9.5" width="16" height="2.6" rx="1.3" fill={gold} />
      <rect x="7" y="22.4" width="18" height="2.8" rx="1.4" fill="#f4efe2" />
      {/* three flutes of the shaft */}
      <rect x="10.4" y="12.6" width="2.4" height="9.4" rx="1.2" fill="#f4efe2" />
      <rect x="14.8" y="12.6" width="2.4" height="9.4" rx="1.2" fill="#f4efe2" />
      <rect x="19.2" y="12.6" width="2.4" height="9.4" rx="1.2" fill="#f4efe2" />
    </svg>
  );
}

export default function Logo({
  size = 30,
  light = false,
  showWord = true,
}: {
  size?: number;
  light?: boolean;
  showWord?: boolean;
}) {
  return (
    <span className="logo" style={{ color: light ? "#fff" : "var(--ink)" }}>
      <LogoMark size={size} />
      {showWord && <span className="logo-word">Standing</span>}
    </span>
  );
}
