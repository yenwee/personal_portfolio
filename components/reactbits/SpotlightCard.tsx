'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightSize?: number;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightSize = 300,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !overlayRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const spotlightColor = isDark
      ? 'rgba(140, 140, 255, 0.15)'
      : 'rgba(100, 100, 255, 0.12)';

    overlayRef.current.style.background =
      `radial-gradient(${spotlightSize}px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`;
  }, [isDark, spotlightSize]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (overlayRef.current) {
      overlayRef.current.style.background = 'transparent';
    }
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden border border-border ${className}`}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        {children}
      </div>
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 300ms ease',
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default SpotlightCard;
