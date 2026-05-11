import type { Jersey } from "../../types";

interface JerseyCardProps {
  jersey: Jersey;
  width: number;
  height: number;
}
 
function JerseyCard({ jersey, width, height }: JerseyCardProps) {
  const { homeColor, accentColor, numberColor, number, playerName } = jersey;
  const isLight =
    homeColor === '#FFFFFF' ||
    homeColor === '#f5f5f5' ||
    homeColor === '#74ACDF' ||
    homeColor === '#FFFFFF';
 
  const textColor = isLight ? numberColor : '#ffffff';
 
  return (
    // FIX: border on the wrapper div, not on <svg>.
    // SVG borders render inconsistently across browsers.
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        width,
        height,
        border: '2px solid rgba(255,255,255,0.65)',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 130"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Body */}
        <rect width="100" height="130" fill={homeColor} />
 
        {/* Shoulder wedges */}
        <polygon points="0,0 32,0 22,32 0,22" fill={accentColor} opacity="0.75" />
        <polygon points="100,0 68,0 78,32 100,22" fill={accentColor} opacity="0.75" />
 
        {/* Collar bar */}
        <rect x="34" y="0" width="32" height="18" fill={accentColor} opacity="0.6" rx="2" />
        {/* Collar cutout */}
        <rect x="42" y="0" width="16" height="10" fill={homeColor} rx="2" />
 
        {/* Sleeve edge bands */}
        <rect x="0" y="0" width="6" height="32" fill={accentColor} opacity="0.4" />
        <rect x="94" y="0" width="6" height="32" fill={accentColor} opacity="0.4" />
 
        {/* Lower hem band */}
        <rect x="0" y="95" width="100" height="35" fill={accentColor} opacity="0.18" />
        <rect x="0" y="124" width="100" height="6" fill={accentColor} opacity="0.4" />
 
        {/* Squad number */}
        <text
          x="50"
          y="82"
          textAnchor="middle"
          fontSize="44"
          fontWeight="700"
          fill={textColor}
          fontFamily="'Bebas Neue', sans-serif"
          opacity="0.92"
        >
          {number}
        </text>
 
        {/* Player name */}
        <text
          x="50"
          y="114"
          textAnchor="middle"
          fontSize="7.5"
          fill={textColor}
          fontFamily="'DM Sans', sans-serif"
          opacity="0.7"
          letterSpacing="1.5"
        >
          {playerName.toUpperCase()}
        </text>
 
        {/* Club badge placeholder */}
        <rect x="12" y="22" width="20" height="20" fill={accentColor} opacity="0.3" rx="3" />
        <circle cx="22" cy="32" r="6" fill={accentColor} opacity="0.5" />
      </svg>
    </div>
  );
}

export default JerseyCard;
