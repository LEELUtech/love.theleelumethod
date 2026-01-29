import React from "react";
import Image from "next/image";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import { QUIZ_URL } from "@/utils/constants"

interface ResourceCard {
	title: string;
	description: string;
	cta: string;
	href?: string;
	imageAlt: string;
	imageSrc: string;
	ctaType?: "compatibility" | "quiz" | "secrets";
}

const resources: ResourceCard[] = [
	{
		title: "7 Secrets to Mend a Broken Heart",
		description:
			"This guide gives you 7 evidence-based strategies to reclaim your nervous system and your life.",
		cta: "Download free guide",
		href: "#",
		ctaType: "secrets",
		imageAlt: "Woman smiling in a red sweater",
		imageSrc: "/images/resources/resources-section-1.png",
	},
	{
		title: "The Compatibility Report",
		description:
			"This guide gives you 7 evidence-based strategies to reclaim your nervous system and your life.",
		cta: "GET THE REPORT",
		href: "#",
		ctaType: "compatibility",
		imageAlt: "Hands holding each other",
		imageSrc: "/images/resources/resources-section-2.png",
	},
	{
		title: "The Love Questionnaire",
		description:
			"I will show you the exact mechanics of why men pull away and how to shift the power dynamic instantly.",
		cta: "Start quiz",
		href: "#",
		ctaType: "quiz",
		imageAlt: "Woman sitting by window smiling",
		imageSrc: "/images/resources/resources-section-3.png",
	},
];

export function ResourceCardsSection() {
	return (
		<section
			className=" text-brand-deep bg-cover"
			style={{ backgroundImage: "url(/images/bg/resources-bg.png)" }}
		>
			<Header />

			<div className="max-w-[1224px] mx-auto mt-10 md:mt-16 lg:mt-[80px] px-4 md:px-6 lg:px-8">
				<h1 className="text-h1 font-canela mb-8 md:mb-10 lg:mb-12 font-thin lg:text-left text-center">
					Resources
				</h1>
			</div>

			<div className="container px-4 pb-16 md:pb-20 lg:pb-[112px]">
				<div className="grid gap-12 md:gap-16 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
					{resources.map((item) => (
						<article
							key={item.title}
							className="flex flex-col px-[12px] lg:px-0"
						>
							<div className="relative mb-8 md:mb-8 overflow-hidden w-full aspect-[336/322]">
								<Image
									src={item.imageSrc}
									alt={item.imageAlt}
									fill
									quality={100}
									sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
									className="object-cover"
								/>
							</div>
							<h3 className="text-[32px] md:text-[30px] font-light leading-[100%] font-canela mb-4 md:mb-4 text-brand-deep">
								{item.title}
							</h3>
							<p className="text-body text-[#5A5757] mb-6 md:mb-8 font-lato font-medium leading-[26px] tracking-[0.03em]">
								{item.description}
							</p>
							<div className="mt-auto">
								{item.ctaType === "secrets" ? (
									<Button
										variant="primary"
										size="md"
										className="w-full py-[12px]"
										href="/resources/secrets"
									>
										{item.cta}
									</Button>
								) : item.ctaType === "compatibility" ? (
									<Button
										variant="primary"
										size="md"
										className="w-full py-[12px]"
										href="/resources/compatibility-report"
									>
										{item.cta}
									</Button>
								) : item.ctaType === "quiz" ? (
									<Button
										variant="primary"
										size="md"
										className="w-full py-[12px]"
										href={QUIZ_URL}
									>
										{item.cta}
									</Button>
								) : null}
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
