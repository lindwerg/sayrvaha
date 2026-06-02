interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export default function BrandLogo({
  className = "",
  size = "md",
  color = "currentColor",
}: BrandLogoProps) {
  const sizes = {
    sm: { width: 100, height: 44 },
    md: { width: 140, height: 62 },
    lg: { width: 200, height: 88 },
  };

  const { width, height } = sizes[size];

  return (
    <svg
      viewBox="0 0 200 88"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="BLISS brand"
    >
      {/* Decorative line left */}
      <line x1="20" y1="18" x2="82" y2="18" stroke={color} strokeWidth="1" />
      {/* Decorative dots */}
      <circle cx="82" cy="18" r="1.5" fill={color} />
      <circle cx="118" cy="18" r="1.5" fill={color} />
      {/* Heart */}
      <path
        d="M100 10 C96 4, 88 4, 88 10 C88 16, 100 24, 100 24 C100 24, 112 16, 112 10 C112 4, 104 4, 100 10Z"
        fill={color}
      />
      {/* Decorative line right */}
      <line x1="118" y1="18" x2="180" y2="18" stroke={color} strokeWidth="1" />

      {/* BLISS text */}
      <text
        x="100"
        y="52"
        textAnchor="middle"
        fontFamily="var(--font-serif), 'Playfair Display', Georgia, serif"
        fontSize="32"
        fontWeight="700"
        letterSpacing="4"
        fill={color}
      >
        BLISS
      </text>

      {/* brand text */}
      <text
        x="100"
        y="72"
        textAnchor="middle"
        fontFamily="var(--font-serif), 'Playfair Display', Georgia, serif"
        fontSize="14"
        fontWeight="400"
        letterSpacing="6"
        fill={color}
      >
        brand
      </text>
    </svg>
  );
}
