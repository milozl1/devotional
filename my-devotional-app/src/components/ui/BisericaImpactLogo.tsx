/**
 * Biserica Impact Timișoara — inline SVG logo.
 * Symbol (circle + 3 rays) on the left, "BISERICA" / "IMPACT" text on the right.
 * Renders white by default; pass className to override color via `text-*` utilities.
 */
export function BisericaImpactLogo({ className = '', height = 48 }: { className?: string; height?: number }) {
  // The viewBox aspect ratio is roughly 5:2
  const width = Math.round(height * 2.5);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 200"
      width={width}
      height={height}
      className={className}
      aria-label="Biserica Impact Timișoara"
      role="img"
    >
      {/* Symbol: circle + 3 rays */}
      <g transform="translate(80, 100)">
        {/* Outer circle */}
        <circle cx="0" cy="0" r="68" fill="none" stroke="currentColor" strokeWidth="6.5" />
        {/* Inner circle */}
        <circle cx="0" cy="0" r="13" fill="none" stroke="currentColor" strokeWidth="5" />
        {/* Top ray */}
        <line x1="0" y1="-13" x2="0" y2="-68" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        {/* Bottom-left ray */}
        <line x1="-8" y1="10" x2="-47" y2="50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        {/* Bottom-right ray */}
        <line x1="8" y1="10" x2="47" y2="50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* Text */}
      <g transform="translate(310, 100)">
        <text
          x="0"
          y="-18"
          fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
          fontSize="46"
          fill="currentColor"
          textAnchor="middle"
          fontWeight="800"
          letterSpacing="6"
        >
          BISERICA
        </text>
        <text
          x="0"
          y="42"
          fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
          fontSize="56"
          fill="currentColor"
          textAnchor="middle"
          fontWeight="900"
          letterSpacing="8"
        >
          IMPACT
        </text>
      </g>
    </svg>
  );
}
