"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useInView } from "framer-motion";
import useMediaQuery from "@/hooks/use-media-query";

type ArcPoint = { x: number; y: number };

type ArcAutoOnceProps = {
	imgW?: number;
	imgH?: number;

	biasLeft?: number;
	scale?: number;
	yUp?: number;

	durMs?: number;
	startDelayMs?: number;

	flightStart?: number;

	endAt?: number;
	endAtByDevice?: Partial<
		Record<"mobile" | "tablet" | "mdTablet" | "desktop", number>
	>;
	strokeWidth?: number;

	disableAnimation?: boolean;

	className?: string;

	arrowPathD?: string;
	arrowScale?: number;
	arrowRotateDeg?: number;
	arrowCenterX?: number;
	arrowCenterY?: number;
	arrowOffsetX?: number;
	arrowOffsetY?: number;

	arcStart?: ArcPoint;
	arcEnd?: ArcPoint;
	arcRx?: number;
	arcRy?: number;
	arcSweep?: 0 | 1;
	arcLarge?: 0 | 1;
	flatStart?: number;
};

export default function ArcAutoOnce({
	imgW,
	imgH,
	biasLeft = 0.7,
	scale = 1.8,
	yUp = 0.26,
	durMs = 1600,
	startDelayMs = 500,

	flightStart = 0,

	endAtByDevice,
	endAt = 1,
	className = "",
	strokeWidth = 2,

	disableAnimation = false,

	arrowPathD,
	arrowScale = 0.85,
	arrowRotateDeg = 270,
	arrowCenterX = 6.5,
	arrowCenterY = 16,
	arrowOffsetX = 0,
	arrowOffsetY = 0,

	arcStart = { x: 437, y: 219 },
	arcEnd = { x: 1, y: 219 },
	arcRx = 218,
	arcRy = 218,
	arcSweep = 0,
	arcLarge = 0,
	flatStart
}: ArcAutoOnceProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const inView = useInView(ref, { once: true, amount: 0.55 });
	const [play, setPlay] = useState(false);
	const { device } = useMediaQuery();

	const uid = useId();
	const arcPathId = `arcPath-${uid}`;
	const gradId = `paint0-${uid}`;

	const endAtFinal =
		endAtByDevice?.[device ?? "desktop"] ?? endAtByDevice?.desktop ?? endAt;

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (inView) setPlay(true);
	}, [inView]);

	const flat = flatStart ?? 0;

	const arcD =
  flat > 0
    ? `M ${arcStart.x} ${arcStart.y}
       L ${arcStart.x - flat} ${arcStart.y}
       A ${arcRx} ${arcRy} 0 ${arcLarge} ${arcSweep} ${arcEnd.x} ${arcEnd.y}`
    : `M ${arcStart.x} ${arcStart.y}
       A ${arcRx} ${arcRy} 0 ${arcLarge} ${arcSweep} ${arcEnd.x} ${arcEnd.y}`;

	const arrowD =
		arrowPathD ??
		"M10.7385 7.81063C10.2885 5.42671 9.93632 2.09445 9.77636 0.439626C9.73615 0.0287619 9.32542 -0.146711 9.08244 0.143167C8.09664 1.30851 6.09036 3.63317 4.49739 5.14432C2.81316 6.74283 1.06024 7.89486 0.335476 8.34321C0.145124 8.46167 0.0619075 8.73752 0.145338 8.97588C0.538109 10.1015 1.38559 13.8686 1.37791 17.9314C1.37154 21.2838 0.61866 27.1025 0.0080538 30.99C-0.0793941 31.5461 0.551859 31.8158 0.773338 31.3169C2.32509 27.8285 4.76632 22.7312 6.50569 20.1221C8.61386 16.9596 11.2347 14.6712 12.126 14.0942C12.3149 13.9722 12.3938 13.6945 12.3075 13.4579C11.978 12.5562 11.2139 10.3318 10.7363 7.8097L10.7385 7.81063Z";

	const style: React.CSSProperties | undefined =
		imgW && imgH
			? {
					width: imgW * scale,
					left: -(imgW * scale * biasLeft - imgW / 2),
					top: -(imgH * yUp),
					position: "absolute",
					pointerEvents: "none",
					opacity: 0.95,
				}
			: undefined;

	const dur = `${durMs}ms`;
	const delay = `${startDelayMs}ms`;

	const clampedStart = Math.max(0, Math.min(1, flightStart));
	const clampedEnd = Math.max(0, Math.min(1, endAtFinal));

	const start = Math.min(clampedStart, clampedEnd);
	const end = Math.max(clampedEnd, start);

	const fromDashOffset = 100 - 100 * start;
	const toDashOffset = 100 - 100 * end;

	const cx = arrowCenterX * arrowScale - arrowOffsetX;
	const cy = arrowCenterY * arrowScale - arrowOffsetY;

	return (
		<div ref={ref} className={className} style={style} aria-hidden="true">
			{play && (
				<svg viewBox="0 0 438 659" className="w-full h-auto overflow-visible">
					<defs>
						<linearGradient
							x1="219"
							y1="2"
							x2="252.431"
							y2="91.4463"
							gradientUnits="userSpaceOnUse"
							id={gradId}
						>
							<stop stopColor="#B69D96" />
							<stop offset="1" stopColor="#FDC5B7" stopOpacity="0" />
						</linearGradient>
					</defs>

					<path
						id={arcPathId}
						d={arcD}
						fill="none"
						stroke={`url(#${gradId})`}
						// stroke={`#B69D96`}
						strokeWidth={strokeWidth}
						strokeLinecap="round"
						pathLength={100}
						strokeDasharray={100}
						strokeDashoffset={disableAnimation ? toDashOffset : fromDashOffset}
					>
						{!disableAnimation && (
							<animate
								attributeName="stroke-dashoffset"
								from={String(fromDashOffset)}
								to={String(toDashOffset)}
								dur={dur}
								begin={delay}
								fill="freeze"
								calcMode="linear"
							/>
						)}
					</path>

					<g opacity={disableAnimation ? "1" : "0"}>
						{!disableAnimation && (
							<animate
								attributeName="opacity"
								from="0"
								to="1"
								dur="350ms"
								begin={delay}
								fill="freeze"
							/>
						)}

						{/* scale -> translate(-centerScaled) -> rotate(custom) */}
						<path
							d={arrowD}
							fill="black"
							transform={`scale(${arrowScale}) translate(${-cx} ${-cy}) rotate(${arrowRotateDeg})`}
						/>

						{!disableAnimation && (
							<animateMotion
								dur={dur}
								begin={delay}
								fill="freeze"
								rotate="auto"
								calcMode="linear"
								keyTimes="0;1"
								keyPoints={`${start};${end}`}
							>
								<mpath href={`#${arcPathId}`} />
							</animateMotion>
						)}
					</g>

					<style>{`
            @media (prefers-reduced-motion: reduce) {
              #${arcPathId} { stroke-dashoffset: ${toDashOffset} !important; }
              g { display: none; }
            }
          `}</style>
				</svg>
			)}
		</div>
	);
}
