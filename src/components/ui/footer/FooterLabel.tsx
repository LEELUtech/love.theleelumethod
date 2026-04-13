import Image from "next/image";
import Link from "next/link";

export const FooterLabel = () => {
	return (
		<div className="flex flex-col">
			{/* Logo + title: column on phone, row on tablet+ */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
				<span className="inline-block w-[57px] h-[57px] relative flex-shrink-0 mb-3 sm:mb-0">
					<Image
						src="/leelu_logo.svg"
						width={57}
						height={57}
						alt="Lily Chystofat Logo"
						className="object-contain"
						priority
						quality={100}
					/>
				</span>

				<Link
					href="/"
					className="outline-none focus:outline-none text-inherit hover:text-inherit active:text-inherit"
				>
					<div className="text-[32px] leading-[130%]">
						<span className="font-canela font-light">THE</span>
						<span className="font-medium font-canela tracking-tight mr-1">
							{" "}
							LEELU
						</span>
						<span className="font-canela font-light">METHOD</span>
					</div>
				</Link>
			</div>

			{/* Subtitle below, offset on desktop to align under title */}
			<p className="mt-2 text-black font-medium font-lato leading-6 text-[11px] uppercase max-w-xs sm:ml-[77px]">
				Stop Guessing. Start Calculating.
			</p>
		</div>
	);
};
