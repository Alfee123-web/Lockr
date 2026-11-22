export default function HelloKitty({ className = "kitty-mascot" }) {
  return (
    <svg
      viewBox="0 0 180 175"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Hello Kitty"
    >
      {/* Floating Hearts & Stars */}
      <g className="kitty-sparkles">
        {/* Top-right heart */}
        <path
          d="M148 36 C148 32, 142 32, 142 36 C142 40, 148 44, 148 44 C148 44, 154 40, 154 36 C154 32, 148 32, 148 36 Z"
          fill="#FF7AA8"
        />
        {/* Mid-right heart */}
        <path
          d="M156 98 C156 93, 148 93, 148 98 C148 103, 156 108, 156 108 C156 108, 164 103, 164 98 C164 93, 156 93, 156 98 Z"
          fill="#FF5C93"
        />
        {/* Lower-right small heart */}
        <path
          d="M144 122 C144 119, 139 119, 139 122 C139 125, 144 128, 144 128 C144 128, 149 125, 149 122 C149 119, 144 119, 144 122 Z"
          fill="#FF9EBB"
        />
        {/* Left tiny heart */}
        <path
          d="M24 118 C24 115, 19 115, 19 118 C19 121, 24 124, 24 124 C24 124, 29 121, 29 118 C29 115, 24 115, 24 118 Z"
          fill="#FF7AA8"
        />
        {/* Stars */}
        <path
          d="M158 64 L160 69 L165 71 L160 73 L158 78 L156 73 L151 71 L156 69 Z"
          fill="#FFD166"
          stroke="#FF85B3"
          strokeWidth="1"
        />
        <path
          d="M26 48 L28 52 L32 54 L28 56 L26 60 L24 56 L20 54 L24 52 Z"
          fill="#FF85B3"
        />
      </g>

      {/* Little Fluffy Tail */}
      <circle
        cx="126"
        cy="132"
        r="10"
        fill="#FFFFFF"
        stroke="#5A2D42"
        strokeWidth="3.2"
      />

      {/* Sitting Body (Pink Outfit) */}
      <path
        d="M54 102 C48 118, 48 144, 62 148 L108 148 C122 144, 122 118, 116 102 Z"
        fill="#FF6B9D"
        stroke="#5A2D42"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Outfit Highlight / Collar */}
      <path
        d="M64 106 Q85 116 106 106 L104 122 Q85 128 66 122 Z"
        fill="#FF9EBB"
      />

      {/* Left Foot */}
      <ellipse
        cx="64"
        cy="148"
        rx="16"
        ry="13"
        transform="rotate(-18 64 148)"
        fill="#FF7AA8"
        stroke="#5A2D42"
        strokeWidth="3.2"
      />
      <ellipse
        cx="62"
        cy="145"
        rx="7"
        ry="5"
        transform="rotate(-18 62 145)"
        fill="#FFB3CC"
        opacity="0.7"
      />

      {/* Right Foot */}
      <ellipse
        cx="106"
        cy="148"
        rx="16"
        ry="13"
        transform="rotate(18 106 148)"
        fill="#FF7AA8"
        stroke="#5A2D42"
        strokeWidth="3.2"
      />
      <ellipse
        cx="108"
        cy="145"
        rx="7"
        ry="5"
        transform="rotate(18 108 145)"
        fill="#FFB3CC"
        opacity="0.7"
      />

      {/* Left Ear */}
      <path
        d="M46 52 C38 22, 54 16, 72 34 Z"
        fill="#FFFFFF"
        stroke="#5A2D42"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      {/* Right Ear */}
      <path
        d="M124 52 C132 22, 116 16, 98 34 Z"
        fill="#FFFFFF"
        stroke="#5A2D42"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />

      {/* Head */}
      <ellipse
        cx="85"
        cy="72"
        rx="46"
        ry="36"
        fill="#FFFFFF"
        stroke="#5A2D42"
        strokeWidth="3.4"
      />

      {/* Whiskers - Left */}
      <line x1="28" y1="65" x2="45" y2="68" stroke="#5A2D42" strokeWidth="3" strokeLinecap="round" />
      <line x1="25" y1="76" x2="44" y2="76" stroke="#5A2D42" strokeWidth="3" strokeLinecap="round" />
      <line x1="29" y1="87" x2="46" y2="84" stroke="#5A2D42" strokeWidth="3" strokeLinecap="round" />

      {/* Whiskers - Right */}
      <line x1="142" y1="65" x2="125" y2="68" stroke="#5A2D42" strokeWidth="3" strokeLinecap="round" />
      <line x1="145" y1="76" x2="126" y2="76" stroke="#5A2D42" strokeWidth="3" strokeLinecap="round" />
      <line x1="141" y1="87" x2="124" y2="84" stroke="#5A2D42" strokeWidth="3" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="64" cy="74" rx="4" ry="5.5" fill="#5A2D42" />
      <ellipse cx="106" cy="74" rx="4" ry="5.5" fill="#5A2D42" />

      {/* Nose */}
      <ellipse
        cx="85"
        cy="81"
        rx="5"
        ry="3.6"
        fill="#FFD166"
        stroke="#5A2D42"
        strokeWidth="2.2"
      />

      {/* Blush */}
      <ellipse cx="53" cy="82" rx="6" ry="3.2" fill="#FF9EBB" opacity="0.7" />
      <ellipse cx="117" cy="82" rx="6" ry="3.2" fill="#FF9EBB" opacity="0.7" />

      {/* Tucked Cute Paws */}
      <ellipse
        cx="71"
        cy="112"
        rx="12"
        ry="10"
        fill="#FFFFFF"
        stroke="#5A2D42"
        strokeWidth="3.2"
      />
      <ellipse
        cx="99"
        cy="112"
        rx="12"
        ry="10"
        fill="#FFFFFF"
        stroke="#5A2D42"
        strokeWidth="3.2"
      />

      {/* Big Puffy Pink Bow */}
      <g transform="translate(111, 35) rotate(22)">
        <ellipse cx="-14" cy="0" rx="13" ry="10.5" fill="#FF5C93" stroke="#5A2D42" strokeWidth="3" />
        <ellipse cx="14" cy="0" rx="13" ry="10.5" fill="#FF5C93" stroke="#5A2D42" strokeWidth="3" />
        <ellipse cx="-8" cy="-1" rx="4" ry="3" fill="#FF9EBB" />
        <ellipse cx="8" cy="-1" rx="4" ry="3" fill="#FF9EBB" />
        <circle cx="0" cy="0" r="6.5" fill="#FF5C93" stroke="#5A2D42" strokeWidth="3" />
      </g>
    </svg>
  );
}