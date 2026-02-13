import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RING_LABELS_1 = ["Signals", "Patterns", "Insights"];
const RING_LABELS_2 = ["Support Circles", "Therapist", "Deeper Reflection"];

function FloatingLabel({
  label,
  angle,
  radius,
  className = "",
}: {
  label: string;
  angle: number;
  radius: number;
  className?: string;
}) {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;
  return (
    <span
      className={`absolute text-[11px] sm:text-xs tracking-wide text-muted-foreground/70 select-none whitespace-nowrap ${className}`}
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {label}
    </span>
  );
}

export default function OrbitalHero() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const ring1Progress = Math.min(1, Math.max(0, (scrollY - vh * 0.15) / (vh * 0.15)));
  const ring2Progress = Math.min(1, Math.max(0, (scrollY - vh * 0.45) / (vh * 0.2)));

  // Subtle rotation driven by scroll
  const ring1Rotation = scrollY * 0.012;
  const ring2Rotation = -(scrollY * 0.008);

  const nucleusSize = "clamp(120px, 28vw, 180px)";
  const ring1Radius = "clamp(160px, 38vw, 260px)";
  const ring2Radius = "clamp(220px, 52vw, 360px)";

  // Label orbit radii in px (approximate midpoints)
  const labelR1 = 130;
  const labelR2 = 190;

  return (
    <section
      ref={heroRef}
      className="relative min-h-[140vh] flex flex-col items-center overflow-hidden gradient-hero"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-lilac-200/15 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-mint-200/15 blur-[100px]" />
      </div>

      {/* Sticky orbital system */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className="relative" style={{ width: ring2Radius, height: ring2Radius }}>
          {/* Ring 2 — Support Layer */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
            style={{ opacity: ring2Progress * 0.45 }}
          >
            <div
              className="rounded-full border border-muted-foreground/10"
              style={{
                width: ring2Radius,
                height: ring2Radius,
                transform: `rotate(${ring2Rotation}deg)`,
              }}
            />
          </div>
          {/* Ring 2 labels */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: ring2Progress * 0.5,
              transform: `rotate(${ring2Rotation}deg)`,
            }}
          >
            {RING_LABELS_2.map((label, i) => (
              <FloatingLabel
                key={label}
                label={label}
                angle={60 + i * 120}
                radius={labelR2}
              />
            ))}
          </div>

          {/* Ring 1 — Intelligence Layer */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
            style={{ opacity: ring1Progress * 0.6 }}
          >
            <div
              className="rounded-full border border-muted-foreground/15"
              style={{
                width: ring1Radius,
                height: ring1Radius,
                transform: `rotate(${ring1Rotation}deg)`,
              }}
            />
          </div>
          {/* Ring 1 labels */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: ring1Progress * 0.7,
              transform: `rotate(${ring1Rotation}deg)`,
            }}
          >
            {RING_LABELS_1.map((label, i) => (
              <FloatingLabel
                key={label}
                label={label}
                angle={-30 + i * 120}
                radius={labelR1}
              />
            ))}
          </div>

          {/* Nucleus */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Link to="/companion" className="tap-scale group">
              <div
                className="rounded-full flex items-center justify-center shadow-soft"
                style={{
                  width: nucleusSize,
                  height: nucleusSize,
                  background:
                    "radial-gradient(circle at 40% 40%, hsl(270 45% 88%), hsl(165 35% 88%))",
                  animation: "nucleus-breathe 6s ease-in-out infinite",
                }}
              >
                <span className="font-serif text-lg sm:text-xl text-foreground/80 group-hover:text-foreground transition-colors">
                  Start here.
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom text — visible after scrolling through the rings */}
      <div
        className="relative z-10 -mt-32 pb-28 text-center transition-opacity duration-700"
        style={{ opacity: ring2Progress }}
      >
        <p className="font-serif text-xl sm:text-2xl text-muted-foreground">
          Everything begins with a conversation.
        </p>
      </div>
    </section>
  );
}
