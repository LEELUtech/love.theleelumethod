import { Flex } from "antd";
import { ProgramsReceive } from "../components/receive";
import { vipImmersionModuleData } from "./static";
import Image from "next/image";
import { ArrowList } from "@/components/ui/lists/ArrowList";
import { Section } from "@/components/ui/containers/section";

const vipImmersionModuleAdditionalData = {
	title: "Private Chat Support With Lily (1 MONTH)",
	subtitle:
		"You have direct access to Lily throughout the month via WhatsApp or direct messages.",
	list: [
		"Priority response time: within 24 hours on business days",
		"Personal guidance as your situation unfolds in real time",
		"Support for decisions, conversations, emotional triggers, and next steps",
	],
	description: {
		content: "This goes beyond a single strategy session.",
		highlight: "This is private access.",
	},
};

export const VIPImmersionReceive = () => {
	const { title, subtitle, description, list } =
		vipImmersionModuleAdditionalData;

	return (
		<div className="relative">
      <div className="absolute inset-0 -z-10">
				<Image
					src="/noise_bg.svg"
					alt=""
					fill
					quality={85}
					sizes="100vw"
					className="object-cover"
				/>
			</div>
			{/* <div className="absolute bottom-0 left-0 right-0 -z-10 pointer-events-none">
				<Image
					src="/gradiend.svg"
					alt=""
					width={1440}
					height={400}
					className="w-full h-[500px] object-cover lg:h-auto lg:object-fill"
				/>
			</div> */}
			<Section>
				<div className="text-center mb-[60px] lg:mb-[150px] flex flex-col gap-10 xl:gap-[145px]">
					<ProgramsReceive {...vipImmersionModuleData} />

					<Flex
						component="article"
						className="flex flex-col md:flex-row lg:space-between gap-10 lg:gap-[90px] xl:gap-[110px] 2xl:gap-[130px]"
					>
						<div className="flex-1 flex w-full max-w-full lg:max-w-[496px] flex-col items-center justify-center">
							<div className="relative w-full max-w-[496px] aspect-[496/535] overflow-hidden rounded-t-[999px]">
								<Image
									src="/images/lily/lily_1.png"
									alt={title}
									fill
									quality={85}
								/>
							</div>
						</div>

						<Flex
							vertical
							className="flex-1 lg:mt-[115px] flex-col items-center lg:items-start"
						>
							<h3 className="text-[32px]/[126%] lg:text-[48px]/[126%] max-w-[600px] mb-4 text-left font-light font-canela text-brand-deep">
								{title}
							</h3>
							<h6 className="text-[17px]/[26px] mb-[30px] text-left font-lato text-brand-gray">
								{subtitle}
							</h6>
							<ArrowList list={list} boldFirst />

							<p className="text-[17px]/[26px] text-left mt-10 font-lato text-brand-gray">
								{description.content}{" "}
								<span className="font-bold">{description.highlight}</span>
							</p>
						</Flex>
					</Flex>
				</div>
			</Section>
		</div>
	);
};
