import { useState, useEffect } from 'react';

/**
 * Hook for smooth, GPU-accelerated scroll-based parallax.
 * Uses requestAnimationFrame and passive event listeners to maintain 60/120fps.
 * @param speed Parallax speed multiplier (e.g. 0.3 = moves at 30% of scroll speed)
 * @param maxOffset Maximum pixel displacement to prevent overflow
 */
export function useScrollParallax(speed: number = 0.3, maxOffset: number = 180): number {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      const scrollPos = window.scrollY || window.pageYOffset;
      const rawOffset = scrollPos * speed;
      const clampedOffset = Math.min(Math.max(rawOffset, -maxOffset), maxOffset);
      setOffsetY(clampedOffset);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updatePosition();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [speed, maxOffset]);

  return offsetY;
}
