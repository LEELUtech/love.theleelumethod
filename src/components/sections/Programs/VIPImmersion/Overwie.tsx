import { Section } from "@/components/ui/containers/section";
import { ArrowList } from "@/components/ui/lists";
import { Flex } from "antd";
import Image from "next/image";

export interface IVIPImmersionOverview {
	id: number;
	title: string;
	isReversed?: boolean;
	subtitle?: string;
	description: string | string[];
	list?: string[];
	imgSrc: string;
	additional_list?: string[];
	subtitle_bottom?: string;
}

interface CardProps extends IVIPImmersionOverview {} // eslint-disable-line @typescript-eslint/no-empty-object-type

const Card = (props: CardProps) => {
	const {
		id,
		title,
		subtitle,
		description,
		list,
		isReversed,
		imgSrc,
		additional_list,
		subtitle_bottom,
	} = props;

	const titleClasses =
		id === 1 ? "md:mt-[60px] lg:mt-[148px]" : "md:mt-[50px] lg:mt-[106px]";

	return (
		<article
			key={id}
			className={`flex flex-col-reverse md:flex-row lg:space-between gap-10 lg:gap-[90px] xl:gap-[110px] 2xl:gap-[130px] ${isReversed ? "md:flex-row-reverse" : ""}`}
		>
			<div className="flex-1 flex w-full max-w-full lg:max-w-[496px] flex-col items-center justify-center">
				<div className="relative w-full max-w-[496px] aspect-[496/761] overflow-hidden rounded-[100px]">
					<Image src={imgSrc} alt={title} fill quality={100} />
				</div>
			</div>

			<div className={`col flex-1 ${titleClasses}`}>
				<h4 className="text-[48px]/[120%] text-left font-canela font-light mb-7 text-brand-deep">
					{title}
				</h4>

				{subtitle && (
					<h5 className="text-[32px]/[120%] text-left font-canela font-light mb-6 text-brand-deep">
						{subtitle}
					</h5>
				)}

				{list && <ArrowList list={list} />}

				{description &&
					(Array.isArray(description) ? (
						description.map((line, i) => (
							<p
								key={i}
								className="text-[17px]/[26px] text-left font-lato mb-3 text-brand-gray"
								style={{ marginTop: i === 0 ? 12 : 26 }}
							>
								{line}
							</p>
						))
					) : (
						<p className="text-[17px]/[26px] text-left font-lato mt-6 mb-6 text-brand-gray">
							{description}
						</p>
					))}

				{additional_list && (
					<div className="mt-12">
						<ArrowList list={additional_list} />
					</div>
				)}

				{subtitle_bottom && (
					<h4 className="text-[32px]/[120%] max-w-[500px] mt-[48px] text-left font-canela font-light text-brand-deep">
						{subtitle_bottom}
					</h4>
				)}
			</div>
		</article>
	);
};

interface Props {
	overviews: IVIPImmersionOverview[];
}

export const VIPImmersionOverview = ({ overviews }: Props) => {
	return (
		<div className="relative">
			<div className="absolute inset-0 -z-10">
				<Image
					src="/noise_bg.svg"
					alt=""
					fill
					priority
					quality={100}
					sizes="100vw"
					className="object-cover"
				/>
			</div>
			<div className="absolute bottom-0 left-0 right-0 -z-10 pointer-events-none">
				<Image
					src="/gradiend.svg"
					alt=""
					width={1440}
					height={400}
					className="w-full h-[500px] object-cover lg:h-auto lg:object-fill"
				/>
			</div>
			<Section wrapperClasses="py-[80px]">
				<Flex vertical gap={120}>
					{overviews.map((overview) => (
						<Card key={overview.id} {...overview} />
					))}
				</Flex>
			</Section>
		</div>
	);
};
