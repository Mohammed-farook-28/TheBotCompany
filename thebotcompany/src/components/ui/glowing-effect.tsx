"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { animate } from "motion/react";

interface GlowingEffectProps {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  spread?: number;
  movementDuration?: number;
  borderWidth?: number;
  disabled?: boolean;
}

export function GlowingEffect({
  children,
  className,
  blur = 0,
  spread = 20,
  movementDuration = 2,
  borderWidth = 1,
  disabled = false,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  const handleMove = useCallback(
    (e?: MouseEvent | { x: number; y: number }) => {
      if (!containerRef.current || disabled) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const element = containerRef.current;
        if (!element) return;

        const { left, top, width, height } = element.getBoundingClientRect();
        const mouseX = e?.x ?? lastPosition.current.x;
        const mouseY = e?.y ?? lastPosition.current.y;

        if (e) {
          lastPosition.current = { x: mouseX, y: mouseY };
        }

        // Check if mouse is near the element
        const isActive =
          mouseX > left - 50 &&
          mouseX < left + width + 50 &&
          mouseY > top - 50 &&
          mouseY < top + height + 50;

        element.style.setProperty("--active", isActive ? "1" : "0");

        if (!isActive) return;

        // Calculate angle from center to cursor
        const center = [left + width * 0.5, top + height * 0.5];
        const currentAngle =
          parseFloat(element.style.getPropertyValue("--start")) || 0;

        let targetAngle =
          (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
            Math.PI +
          90;

        // Normalize angle difference
        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + angleDiff;

        // Animate the angle smoothly
        animate(currentAngle, newAngle, {
          duration: movementDuration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (value) => {
            element.style.setProperty("--start", String(value));
          },
        });
      });
    },
    [disabled, movementDuration]
  );

  useEffect(() => {
    if (disabled) return;

    const handlePointerMove = (e: PointerEvent) => handleMove(e);
    const handleScroll = () => handleMove();

    document.body.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleMove, disabled]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={
        {
          "--blur": `${blur}px`,
          "--spread": spread,
          "--start": "0",
          "--active": "0",
          "--border-width": `${borderWidth}px`,
          "--gradient": `
            radial-gradient(circle, #00baff 15%, #00baff00 30%),
            repeating-conic-gradient(
              from 236.84deg at 50% 50%,
              #00baff 0%,
              #00baff calc(100% / 5)
            )
          `,
        } as React.CSSProperties
      }
    >
      {children}
      {/* Glowing border effect */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit]",
          blur > 0 && "blur-[var(--blur)]",
          "transition-opacity duration-300",
          "opacity-[var(--active)]",
          "z-10"
        )}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={cn(
            "rounded-[inherit]",
            "after:content-[''] after:absolute after:inset-[calc(-1*var(--border-width))] after:rounded-[inherit]",
            "after:[border:var(--border-width)_solid_transparent]",
            "after:[background:var(--gradient)] after:[background-attachment:fixed]",
            "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
            "after:[mask-clip:padding-box,border-box]",
            "after:[mask-composite:intersect]",
            "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
          )}
        />
      </div>
      {/* Outer glow blur effect - blue only */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-[2px] rounded-[inherit]",
          "blur-xl",
          "transition-opacity duration-300",
          "opacity-[calc(var(--active)*0.5)]",
          "-z-10"
        )}
        style={{
          background: `radial-gradient(circle, #00baff40 15%, transparent 40%)`,
        }}
      />
    </div>
  );
}
