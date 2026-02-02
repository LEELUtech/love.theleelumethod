import Image from "next/image"
import React from "react";

const ProgramFooter = () => {
	return (
		<div className="relative z-10 mt-[60px] lg:mt-[80px] lg:top-[-80px] ">
			<div className="flex justify-start mb-4">
				<div className="relative w-[68px] h-[68px]">
					<Image
						src="/leelu_logo.svg"
						alt="Lily Chystofat Logo"
						fill
						className="object-contain"
						priority
					/>
				</div>
			</div>

			<div className="font-canela text-[28px] md:text-[32px] leading-[1.2] tracking-tight">
				<span className="font-medium">LILY</span>{" "}
				<span className="font-light">CHYSTOFAT</span>
			</div>

			<p className="mt-3 font-lato font-medium text-[11px] tracking-[0.05em] leading-[1.4] text-brand-black uppercase">
				STOP GUESSING. START CALCULATING.
			</p>
		</div>
	);
};

export default ProgramFooter;
