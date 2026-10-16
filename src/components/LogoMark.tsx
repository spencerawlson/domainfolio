/**
 * Domainfolio tag mark. `tone="dark"` is the reversed version for dark
 * backgrounds (the sidebar): light tag with a slate "D", so the tag shape
 * doesn't disappear into the background.
 */
export function LogoMark({ size = 30, tone = "light" }: { size?: number; tone?: "light" | "dark" }) {
  const tag = tone === "dark" ? "#F8FAFC" : "#1E293B";
  const letter = tone === "dark" ? "#1E293B" : "#FFFFFF";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", flexShrink: 0 }}
    >
      <g transform="rotate(-24 60 60)">
        <path fill={tag} d="M16 34a10 10 0 0 1 10-10h46l34 36-34 36H26a10 10 0 0 1-10-10z" />
        <circle cx="93" cy="60" r="6.5" fill="#F59E0B" />
        <g transform="translate(23.5 36.6) scale(0.45)">
          <path
            fill={letter}
            d="M14 8h44c30 0 48 22 48 52s-18 52-48 52H14zm16 16v72h26c19 0 32-14 32-36s-13-36-32-36z"
          />
        </g>
      </g>
    </svg>
  );
}
