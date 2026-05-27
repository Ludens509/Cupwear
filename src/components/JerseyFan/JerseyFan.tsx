import { useEffect, useRef, useState } from 'react';
import type { Jersey } from '../../types';
import JerseyCard from '../cards/JerseyCard';

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
const STAGE_H = BASE_H + 44;

function getFanScale(width: number) {
  if (width < 480) return 0.5;
  if (width < 640) return 0.6;
  if (width < 768) return 0.72;
  if (width < 1024) return 0.88;
  return 1;
}

function JerseyFan({ jerseys }: JerseyFanProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [fanScale, setFanScale] = useState(() =>
    typeof window === 'undefined' ? 1 : getFanScale(window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => setFanScale(getFanScale(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const items = stageRef.current?.querySelectorAll<HTMLDivElement>('[data-jersey-slot]');
    items?.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.07}s`;
    });
  }, []);

  const scaledStageH = STAGE_H * fanScale;
  const scaledPaddingTop = 44 * fanScale;

  return (
    <div
      ref={stageRef}
      className="relative w-full mx-auto"
      style={{
        maxWidth: 720 * fanScale,
        height: scaledStageH,
        paddingTop: scaledPaddingTop,
        overflow: 'visible',
      }}
    >
      {jerseys.slice(0, 7).map((jersey, i) => {
        const pos = fanPositions[i];
        const w = Math.round(BASE_W * pos.scale * fanScale);
        const h = Math.round(BASE_H * pos.scale * fanScale);
        const x = pos.xOffset * fanScale;

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
              transform: `translateX(${x}px) rotate(${pos.rotation}deg)`,
              transformOrigin: 'bottom center',
              zIndex: pos.zIndex,
              animation: 'jerseyRise 0.55s cubic-bezier(0.34, 1.2, 0.64, 1) both',
            }}
          >
            {pos.tag && (
              <span
                className="absolute whitespace-nowrap text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-[3px] sm:py-1 rounded-full pointer-events-none z-20"
                style={{
                  top: -28 * fanScale - 4,
                  ...(pos.tagStyle === 'dark'
                    ? { background: '#111', color: '#fff', left: '50%', transform: 'translateX(-50%)' }
                    : { background: '#4ade80', color: '#14532d', right: -8, left: 'auto' }),
                }}
              >
                @{jersey.country.toLowerCase()}
              </span>
            )}

            <div
              className="w-full h-full transition-transform duration-200 ease-out hover:-translate-y-2"
              style={{ borderRadius: 14 }}
            >
              <JerseyCard jersey={jersey} width={w} height={h} />
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes jerseyRise {
          from { opacity: 0; translate: 0 40px; }
          to   { opacity: 1; translate: 0 0px;  }
        }
      `}</style>
    </div>
  );
}

export default JerseyFan;
