import { useId } from "react";

type DecorativeArcProps = {
	className?: string;
};

export default function DecorativeArc({ className }: DecorativeArcProps) {
	const gradientId = useId();
	const wrapperClassName = ["relative hidden lg:block h-[720px] z-10", className]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={wrapperClassName}>
			<svg
				className="absolute top-0 left-[250px] -translate-x-1/2"
				width="450"
				height="260"
				viewBox="0 0 470 220"
				fill="none"
			>
				<defs>
					<linearGradient
						id={gradientId}
						x1="0"
						y1="0"
						x2="450"
						y2="0"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#FDC5B7" stopOpacity="0" />
						<stop offset="8%" stopColor="#FDC5B7" stopOpacity="0.3" />
						<stop offset="15%" stopColor="#B69D96" stopOpacity="0.4" />
						<stop offset="40%" stopColor="#B69D96" stopOpacity="1" />
						<stop offset="60%" stopColor="#B69D96" stopOpacity="1" />
						<stop offset="85%" stopColor="#B69D96" stopOpacity="0.2" />
						<stop offset="100%" stopColor="#FDC5B7" stopOpacity="0" />
					</linearGradient>
				</defs>

				<path
					d="M35 210 C160 40 330 70 420 125"
					stroke={`url(#${gradientId})`}
					strokeWidth="5"
					strokeLinecap="round"
				/>
			</svg>

			<div className="absolute top-[150px] left-1/2 -translate-x-1/2">
				<div className="w-[460px] h-[650px] rounded-[230px] bg-[#fff5f2]" />
			</div>
		</div>
	);
}
