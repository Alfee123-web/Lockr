export default function Mascot({ size = 140 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      role="img"
      aria-label="Lockr cat mascot"
    >
      {/* Ears */}
      <path d="M30 64 L38 18 L74 44 Z" fill="#ffe3ec" stroke="#f0a3bd" strokeWidth="3" strokeLinejoin="round" />
      <path d="M130 64 L122 18 L86 44 Z" fill="#ffe3ec" stroke="#f0a3bd" strokeWidth="3" strokeLinejoin="round" />
      <path d="M40 54 L43 33 L61 45 Z" fill="#ffb3c9" />
      <path d="M120 54 L117 33 L99 45 Z" fill="#ffb3c9" />

      {/* Head */}
      <ellipse cx="80" cy="82" rx="54" ry="46" fill="#fff5f8" stroke="#f0a3bd" strokeWidth="3" />

      {/* Happy closed eyes */}
      <path d="M50 80 Q59 69 68 80" fill="none" stroke="#5a2a3c" strokeWidth="4" strokeLinecap="round" />
      <path d="M92 80 Q101 69 110 80" fill="none" stroke="#5a2a3c" strokeWidth="4" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="44" cy="95" rx="9" ry="6" fill="#ffb3c9" opacity="0.7" />
      <ellipse cx="116" cy="95" rx="9" ry="6" fill="#ffb3c9" opacity="0.7" />

      {/* Nose and smile */}
      <path d="M75 91 Q80 98 85 91 Z" fill="#f4628f" />
      <path d="M80 97 Q80 105 72 105 M80 97 Q80 105 88 105" fill="none" stroke="#5a2a3c" strokeWidth="3" strokeLinecap="round" />

      {/* Collar and key charm */}
      <path d="M50 124 Q80 140 110 124" fill="none" stroke="#f4628f" strokeWidth="6" strokeLinecap="round" />
      <circle cx="80" cy="141" r="6" fill="#ffd166" stroke="#e0a82e" strokeWidth="2" />
      <rect x="78.5" y="146" width="3" height="10" rx="1" fill="#e0a82e" />
      <rect x="81.5" y="150" width="4" height="2.5" rx="1" fill="#e0a82e" />
    </svg>
  );
}