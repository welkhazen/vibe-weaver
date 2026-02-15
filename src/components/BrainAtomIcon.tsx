const BrainAtomIcon = ({ className = "w-7 h-7", themeColor = "currentColor" }: { className?: string; themeColor?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Brain outline - uses currentColor to match other icons */}
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* Left brain */}
      <path d="M20 52c-5 0-8-3-8-7 0-2 1-4 2-5-2-1-4-4-4-7 0-3 2-6 4-7-1-2-2-4-2-6 0-4 3-7 7-7 1-4 4-7 8-7" />
      {/* Right brain */}
      <path d="M44 52c5 0 8-3 8-7 0-2-1-4-2-5 2-1 4-4 4-7 0-3-2-6-4-7 1-2 2-4 2-6 0-4-3-7-7-7-1-4-4-7-8-7" />
      {/* Brain stem / center line */}
      <path d="M32 13v39" />
      {/* Brain folds */}
      <path d="M27 20c3 2 7 2 10 0" />
      <path d="M24 28c5 3 11 3 16 0" />
      <path d="M24 36c5 3 11 3 16 0" />
      <path d="M26 44c4 2 8 2 12 0" />
    </g>
    {/* Atom orbits - uses theme color */}
    <g stroke={themeColor} strokeWidth="2" fill="none" opacity="0.9">
      <ellipse cx="32" cy="32" rx="10" ry="4" transform="rotate(0 32 32)" />
      <ellipse cx="32" cy="32" rx="10" ry="4" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="10" ry="4" transform="rotate(120 32 32)" />
    </g>
    {/* Center dot */}
    <circle cx="32" cy="32" r="2" fill={themeColor} />
  </svg>
);

export default BrainAtomIcon;
