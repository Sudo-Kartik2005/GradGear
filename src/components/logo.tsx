// Your provided SVG, converted to a React component.

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" {...props}>
      <title>Student Budget Laptop Logo</title>
      <desc>Minimal laptop with graduation cap and rupee coin on a blue background.</desc>
    
      {/* Background */}
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2F80ED"/>
          <stop offset="100%" stopColor="#1877E6"/>
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#97C7FF"/>
          <stop offset="100%" stopColor="#6AB0FF"/>
        </linearGradient>
        <linearGradient id="coinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD76A"/>
          <stop offset="100%" stopColor="#F5B73C"/>
        </linearGradient>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0B3A74" floodOpacity="0.35"/>
        </filter>
      </defs>
    
      <rect width="400" height="400" fill="url(#bg)"/>
    
      {/* Laptop */}
      <g transform="translate(45,120)" filter="url(#softShadow)">
        <rect x="10" y="10" rx="12" ry="12" width="230" height="150" fill="#FFFFFF" stroke="#0E3A68" strokeWidth="8"/>
        <rect x="26" y="26" rx="8" ry="8" width="198" height="118" fill="url(#screenGrad)" stroke="#0E3A68" strokeWidth="6"/>
        <path d="M0 180 H260 a12 12 0 0 1 -12 12 H12 A12 12 0 0 1 0 180 Z" fill="#FFFFFF" stroke="#0E3A68" strokeWidth="8"/>
        <rect x="112" y="180" width="36" height="10" rx="5" fill="#9DB9D6"/>
      </g>
    
      {/* Graduation cap */}
      <g transform="translate(130,96)" filter="url(#softShadow)">
        <path d="M0 22 L70 0 L140 22 L70 44 Z" fill="#0E3A68"/>
        <rect x="48" y="38" width="44" height="16" rx="6" fill="#0E3A68"/>
        <path d="M118 26 v26" stroke="#0E3A68" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="118" cy="56" r="6" fill="#0E3A68"/>
      </g>
    
      {/* Rupee coin */}
      <g transform="translate(245,180)" filter="url(#softShadow)">
        <circle cx="70" cy="70" r="66" fill="url(#coinGrad)" stroke="#0E3A68" strokeWidth="8"/>
        <circle cx="70" cy="70" r="52" fill="none" stroke="#0E3A68" strokeWidth="6" opacity="0.25"/>
        <text x="70" y="85" textAnchor="middle" fontSize="70" fontWeight="800"
              fontFamily="ui-sans-serif, -apple-system, Segoe UI, Roboto, Noto Sans, Arial, sans-serif"
              fill="#0E3A68">₹</text>
      </g>
    </svg>
  )
}
