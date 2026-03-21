"use client";

import { useMemo } from "react";

interface MeteorsProps {
  number?: number;
}

export function Meteors({ number = 20 }: MeteorsProps) {
  const meteors = useMemo(() => {
    return Array.from({ length: number }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 1 + Math.random() * 3,
    }));
  }, [number]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute rounded-full"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            width: "2px",
            height: "2px",
            background: "linear-gradient(135deg, #2563eb 0%, transparent 80%)",
            boxShadow: "0 0 2px 1px rgba(37, 99, 235, 0.3)",
            animation: `meteor-fall ${m.duration}s linear ${m.delay}s infinite`,
          }}
        />
      ))}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes meteor-fall {
              0% { transform: translate(0, 0) rotate(215deg); opacity: 1; }
              70% { opacity: 1; }
              100% { transform: translate(-500px, 500px) rotate(215deg); opacity: 0; }
            }
          `,
        }}
      />
    </div>
  );
}
