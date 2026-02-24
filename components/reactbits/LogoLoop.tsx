'use client';

import { useCallback, useEffect, useMemo, useRef, useState, memo, type ReactNode } from 'react';
import './LogoLoop.css';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

interface LogoItem {
  node: ReactNode;
  alt?: string;
  title?: string;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  className?: string;
}

const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 80,
  direction = 'left',
  logoHeight = 28,
  gap = 32,
  pauseOnHover = true,
  className = '',
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    const dirMult = direction === 'left' ? 1 : -1;
    return magnitude * dirMult;
  }, [speed, direction]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth = seqRef.current?.getBoundingClientRect()?.width ?? 0;
    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !seqRef.current) return;
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(containerRef.current);
    ro.observe(seqRef.current);
    updateDimensions();
    return () => ro.disconnect();
  }, [updateDimensions, logos, gap, logoHeight]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth <= 0) return;

    let raf: number;
    let last: number | null = null;
    let offset = 0;
    let velocity = 0;

    const animate = (ts: number) => {
      if (last === null) last = ts;
      const dt = Math.max(0, ts - last) / 1000;
      last = ts;

      const target = isHovered && pauseOnHover ? 0 : targetVelocity;
      const easing = 1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU);
      velocity += (target - velocity) * easing;

      offset = ((offset + velocity * dt) % seqWidth + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover]);

  const cssVars = useMemo(() => ({
    '--logoloop-gap': `${gap}px`,
    '--logoloop-logoHeight': `${logoHeight}px`,
  } as React.CSSProperties), [gap, logoHeight]);

  return (
    <div
      ref={containerRef}
      className={`logoloop logoloop--horizontal ${className}`}
      style={{ width: '100%', ...cssVars }}
    >
      <div
        ref={trackRef}
        className="logoloop__track"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="logoloop__list"
            key={copyIndex}
            ref={copyIndex === 0 ? seqRef : undefined}
            aria-hidden={copyIndex > 0}
          >
            {logos.map((item, i) => (
              <li className="logoloop__item" key={`${copyIndex}-${i}`}>
                <span className="logoloop__node">{item.node}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
});

export default LogoLoop;
