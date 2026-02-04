"use client";

import Image from "next/image";
import React from "react";

type QuizResultOrbProps = {
	bgColor?: string;
	ornamentSrc: string;

	topBadgeIcon?: string;
	bottomBadgeIcon?: string;

	showTopBadge?: boolean;
	showBottomBadge?: boolean;

	badgeBgColor?: string;
	topBadgeBgColor?: string;
	bottomBadgeBgColor?: string;
	withNoise?: boolean;

	className?: string;
};

const NOISE_CLASS =
	"before:content-[''] before:absolute before:inset-0 before:bg-[url('/icons/noise.png')] before:opacity-15 before:mix-blend-overlay before:pointer-events-none before:z-[1]";

export function QuizResultOrb({
	bgColor = "#B02F44",
	ornamentSrc,

	topBadgeIcon,
	bottomBadgeIcon,

	showTopBadge = true,
	showBottomBadge = true,

	badgeBgColor = "#F5E9E9",
	topBadgeBgColor,
	bottomBadgeBgColor,
	withNoise = false,

	className = "",
}: QuizResultOrbProps) {
	const topBg = topBadgeBgColor ?? badgeBgColor;
	const bottomBg = bottomBadgeBgColor ?? badgeBgColor;

	return (
		<div className={`relative z-[30] w-full mx-auto lg:mx-0 ${className}`}>
			<div
				className={`
          relative z-[30]
          w-[181px] h-[214px]
          md:w-[300px] md:h-[380px]
          lg:w-[416px] lg:h-[554px]
          rounded-full mx-auto lg:mx-0 overflow-hidden
          ${withNoise ? NOISE_CLASS : ""}
        `}
			>
				{/* background oval */}
				<div
					className="absolute inset-0 rounded-full"
					style={{ backgroundColor: bgColor }}
				/>

				{/* ornament */}
				<div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
					<div className="relative w-[85%] aspect-square">
						<Image
							src={ornamentSrc}
							alt=""
							fill
							priority
							className="object-contain select-none"
						/>
					</div>
				</div>

				{/* badge top */}
				{showTopBadge && topBadgeIcon && (
					<div
						className="
              absolute z-[3] top-[23%] right-[18%]
              w-[37px] h-[37px]
              md:w-[56px] md:h-[56px]
              lg:w-[81px] lg:h-[81px]
              rounded-full flex items-center justify-center
              shadow-[0_6px_16px_rgba(0,0,0,0.25),0_20px_60px_rgba(0,0,0,0.35)]
            "
						style={{ backgroundColor: topBg }}
					>
						<div className="relative w-[16px] h-[16px] md:w-[22px] md:h-[22px] lg:w-[32px] lg:h-[39px]">
							<Image src={topBadgeIcon} alt="" fill className="object-contain" />
						</div>
					</div>
				)}

				{/* badge bottom */}
				{showBottomBadge && bottomBadgeIcon && (
					<div
						className="
              absolute z-[3] bottom-[22%] left-[16%]
              w-[37px] h-[37px]
              md:w-[56px] md:h-[56px]
              lg:w-[81px] lg:h-[81px]
              rounded-full flex items-center justify-center
              shadow-[0_6px_16px_rgba(0,0,0,0.25),0_20px_60px_rgba(0,0,0,0.35)]
            "
						style={{ backgroundColor: bottomBg }}
					>
						<div className="relative w-[18px] h-[18px] md:w-[24px] md:h-[24px] lg:w-[42px] lg:h-[26px] translate-y-1">
							<Image
								src={bottomBadgeIcon}
								alt=""
								fill
								className="object-contain"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
