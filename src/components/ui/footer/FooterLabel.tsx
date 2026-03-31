import { Flex } from "antd";
import Image from "next/image";
import Link from "next/link";

interface Props {
	mb?: number;
}

export const FooterLabel = ({ mb = 12 }: Props) => {
	return (
		<Flex vertical>
			<span
				className="inline-block w-[57px] h-[57px] relative"
				style={{ marginBottom: mb }}
			>
				<Image
					src="/leelu_logo.svg"
					width={57}
					height={57}
					alt="Lily Chystofat Logo"
					className="object-contain"
					priority
				/>
			</span>

			<Link
				href="/"
				className="outline-none focus:outline-none text-inherit hover:text-inherit active:text-inherit"
			>
				<div className="text-[32px] md:text-[32px] leading-[130%]">
					<span className="font-canela font-light">THE</span>
					<span className="font-medium font-canela tracking-tight mr-1">
						{" "}
						LEELU
					</span>
					<span className="font-canela font-light">METHOD</span>
				</div>

				<p className="mt-2 text-black font-medium font-lato leading-6  text-[11px] uppercase max-w-xs">
					Stop Guessing. Start Calculating.
				</p>
			</Link>
		</Flex>
	);
};
