import React from "react";
import Image from "next/image";
import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton";
import CompatibilityReportButton from "@/components/ui/buttons/CompatibilityReportButton";
import Header from "@/components/ui/header";

interface ResourceCard {
	title: string;
	description: string;
	cta: string;
	href?: string;
	imageAlt: string;
	imageSrc: string;
	ctaType?: "link" | "quiz" | "compatibility";
}

const resources: ResourceCard[] = [
	{
		title: "7 Secrets to Mend a Broken Heart",
		description:
			"This guide gives you 7 evidence-based strategies to reclaim your nervous system and your life.",
		cta: "Download free guide",
		href: "#",
		ctaType: "compatibility",
		imageAlt: "Woman smiling in a red sweater",
		imageSrc: "/images/resources-section-1.png",
	},
	{
		title: "The Compatibility Report",
		description:
			"This guide gives you 7 evidence-based strategies to reclaim your nervous system and your life.",
		cta: "Get free report",
		href: "#",
		ctaType: "compatibility",
		imageAlt: "Hands holding each other",
		imageSrc: "/images/resources-section-2.png",
	},
	{
		title: "The Love Questionnaire",
		description:
			"I will show you the exact mechanics of why men pull away and how to shift the power dynamic instantly.",
		cta: "Start quiz",
		href: "#",
		ctaType: "quiz",
		imageAlt: "Woman sitting by window smiling",
		imageSrc: "/images/resources-section-3.png",
	},
];

export function ResourceCardsSection() {
	return (
		<section className="bg-brand-blush text-brand-deep">
			<Header />

			<div className="max-w-[1224px] mx-auto mt-[80px]">
				<h1 className="text-h1 font-canela mb-12 font-thin">Resources</h1>
			</div>

			<div className="container pb-[112px]">
				<div className="grid gap-20 md:grid-cols-3">
					{resources.map((item) => (
						<article key={item.title} className="flex flex-col">
							<div className="relative mb-8 overflow-hidden min-w-[336px] min-h-[322px]">
								<Image src={item.imageSrc} alt={item.imageAlt} fill />
							</div>
							<h3 className="text-[32px] font-light leading-[100%] font-canela mb-4 text-brand-deep">
								{item.title}
							</h3>
							<p className="text-body text-[#5A5757] mb-8 font-lato font-medium leading-[26px] tracking-[0.03em]">
								{item.description}
							</p>
							<div className="mt-auto">
								{item.ctaType === "quiz" ? (
									<FreeQuizButton
										text={item.cta}
										className="w-full justify-center rounded-full bg-brand-primary px-5 py-3 text-brand-white text-cta leading-[173%] font-medium uppercase tracking-[1.5px] hover:bg-[#E13954]"
										showArrow={false}
									/>
								) : item.ctaType === "compatibility" ? (
									<CompatibilityReportButton
										text={item.cta}
										className="w-full justify-center rounded-full bg-brand-primary px-5 py-3 text-brand-white text-cta 
										leading-[173%] font-medium uppercase tracking-[1.5px] hover:bg-[#E13954]"
										showArrow={false}
									/>
								) : (
									<CompatibilityReportButton
										text={item.cta}
										className="w-full justify-center rounded-full bg-brand-primary px-5 py-3 text-brand-white text-cta leading-[173%] font-medium uppercase tracking-[1.5px] hover:bg-[#E13954]"
										showArrow={false}
									/>
								)}
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
