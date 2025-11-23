
"use client";

import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.ComponentProps<typeof Card> {
    spotlightColor?: string;
    borderColor?: string;
}

export const SpotlightCard = ({
    className,
    children,
    spotlightColor = "rgba(0, 186, 255, 0.2)",
    borderColor = "#00baff",
    ...props
}: SpotlightCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const borderRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleUpdatePosition = (clientX: number, clientY: number) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: clientX - rect.left, y: clientY - rect.top });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        handleUpdatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        // Prevent scrolling when touching the card to allow spotlight interaction? 
        // No, better to let scroll happen but update position.
        const touch = e.touches[0];
        handleUpdatePosition(touch.clientX, touch.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setOpacity(1);
        const touch = e.touches[0];
        handleUpdatePosition(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    React.useEffect(() => {
        const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
            if (!divRef.current || !borderRef.current) return;

            const rect = divRef.current.getBoundingClientRect();
            let clientX, clientY;

            if (window.TouchEvent && e instanceof TouchEvent) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            }

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            borderRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${borderColor}, transparent 40%)`;
        };

        window.addEventListener("mousemove", handleGlobalMove);
        window.addEventListener("touchmove", handleGlobalMove);

        return () => {
            window.removeEventListener("mousemove", handleGlobalMove);
            window.removeEventListener("touchmove", handleGlobalMove);
        };
    }, [borderColor]);

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative rounded-xl overflow-hidden p-[1px] bg-zinc-800/50",
                className
            )}
        >
            {/* Spotlight Border Layer */}
            <div
                ref={borderRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                    opacity: 1,
                }}
            />

            <Card
                className="relative h-full w-full border-0 bg-black/90 rounded-xl"
                {...props}
            >
                <div
                    className="pointer-events-none absolute -inset-px transition duration-300"
                    style={{
                        opacity,
                        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                    }}
                />
                {children}
            </Card>
        </div>
    );
};
