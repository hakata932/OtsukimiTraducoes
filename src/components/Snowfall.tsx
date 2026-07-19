import { useMemo } from "react";

interface Flake {
  left: string;
  size: number;
  duration: string;
  delay: string;
  opacity: number;
}

// Neve sutil em CSS puro; some automaticamente com prefers-reduced-motion.
export function Snowfall({ count = 32 }: { count?: number }) {
  const flakes = useMemo<Flake[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        duration: `${7 + Math.random() * 8}s`,
        delay: `${-Math.random() * 15}s`,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {flakes.map((flake, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
          }}
        />
      ))}
    </div>
  );
}
