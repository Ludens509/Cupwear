import {useEffect, useRef} from 'react';
import type { Jersey } from '../../types';
import JerseyCard from '../cards/JerseyCard';
// import styles from './JerseyFan.module.css';
 
interface JerseyFanProps {
  jerseys: Jersey[];
}
 
interface FanPosition {
  xOffset: number;
  rotation: number;
  scale: number;
  zIndex: number;
  tag?: string;
  tagStyle?: 'dark' | 'light';
}
 
// FIX: Each card is positioned by translating from the stage center.
// transform-origin is bottom-center, so rotation pivots from the base of the card.
// The inline style sets BOTH translateX and rotate together in one transform string
// so they don't fight each other. No CSS vars needed.
const fanPositions: FanPosition[] = [
  { xOffset: -290, rotation: -22, scale: 0.70, zIndex: 1 },
  { xOffset: -185, rotation: -14, scale: 0.78, zIndex: 2 },
  { xOffset:  -90, rotation:  -7, scale: 0.87, zIndex: 3 },
  { xOffset:    0, rotation:   0, scale: 1.00, zIndex: 8, tag: 'featured', tagStyle: 'dark' },
  { xOffset:   90, rotation:   7, scale: 0.87, zIndex: 3 },
  { xOffset:  185, rotation:  14, scale: 0.78, zIndex: 2, tag: 'new arrival', tagStyle: 'light' },
  { xOffset:  290, rotation:  22, scale: 0.70, zIndex: 1 },
];
 
const BASE_W = 105;
const BASE_H = 136;
 
// Stage height must be tall enough for the largest card (BASE_H) plus pill label
const STAGE_H = BASE_H + 44;
 
function JerseyFan({ jerseys }: JerseyFanProps) {
  const stageRef = useRef<HTMLDivElement>(null);
 
  // Apply staggered animation-delay after mount so CSS animation fires correctly
  useEffect(() => {
    const items = stageRef.current?.querySelectorAll<HTMLDivElement>('[data-jersey-slot]');
    items?.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.07}s`;
    });
  }, []);
 
  return (
    // FIX: stage uses overflow-visible so rotated/translated cards outside the box
    // are not clipped. Position relative is the containing block for absolute children.
    <div
      ref={stageRef}
      className="relative w-full mx-auto"
      style={{
        maxWidth: 720,
        height: STAGE_H,
        // Extra bottom padding so tall cards don't get cut off
        paddingTop: 44,
        overflow: 'visible',
      }}
    >
      {jerseys.slice(0, 7).map((jersey, i) => {
        const pos = fanPositions[i];
        const w = Math.round(BASE_W * pos.scale);
        const h = Math.round(BASE_H * pos.scale);
 
        // FIX: Position each card at absolute center-bottom of stage.
        // Then translate X by the fan offset. left:50% + marginLeft:-w/2 centers it.
        // transform uses a SINGLE string: translateX then rotate, both applied inline.
        // transform-origin: bottom center ensures rotation pivots from the card base.
        return (
          <div
            key={jersey.id}
            data-jersey-slot
            className="absolute"
            style={{
              width: w,
              height: h,
              bottom: 0,
              left: '50%',
              marginLeft: -w / 2,
              // FIX: Single transform string — no separate CSS var needed
              transform: `translateX(${pos.xOffset}px) rotate(${pos.rotation}deg)`,
              transformOrigin: 'bottom center',
              zIndex: pos.zIndex,
              // FIX: animation drives opacity+translateY only; transform handles position
              animation: 'jerseyRise 0.55s cubic-bezier(0.34, 1.2, 0.64, 1) both',
            }}
          >
            {/* Pill tag — sits above the card, uses absolute positioning */}
            {pos.tag && (
              <span
                className="absolute whitespace-nowrap text-xs font-medium px-3 py-1 rounded-full pointer-events-none z-20"
                style={{
                  top: -32,
                  ...(pos.tagStyle === 'dark'
                    ? { background: '#111', color: '#fff', left: '50%', transform: 'translateX(-50%)' }
                    : { background: '#4ade80', color: '#14532d', right: -8, left: 'auto' }),
                }}
              >
                @{jersey.country.toLowerCase()}
              </span>
            )}
 
            {/* FIX: hover lift applied on the SVG wrapper div, not on jerseyWrap itself,
                so the hover transform doesn't override the fan position transform */}
            <div
              className="w-full h-full transition-transform duration-200 ease-out hover:-translate-y-2"
              style={{ borderRadius: 14 }}
            >
              <JerseyCard jersey={jersey} width={w} height={h} />
            </div>
          </div>
        );
      })}
 
      {/* FIX: keyframes injected via a style tag so they live in the component.
          Animation only drives opacity + Y offset — the fan transform is NOT touched. */}
      <style>{`
        @keyframes jerseyRise {
          from { opacity: 0; translate: 0 40px; }
          to   { opacity: 1; translate: 0 0px;  }
        }
      `}</style>
    </div>
  );
}

export default JerseyFan