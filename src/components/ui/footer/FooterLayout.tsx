import { FooterLabel } from "./FooterLabel";
import { FooterNavigation } from "./FooterNavigation";

interface Props {
	className?: string;
	withNavigation?: boolean;
	backgroundImage?: string;
	noise?: boolean;
}

const FooterLayout = (props: Props) => {
	const { className = "", withNavigation = true, backgroundImage, noise } = props;

	const bgStyle = backgroundImage
		? {
				backgroundImage: `url('${backgroundImage}')`,
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
			}
		: {};

	return (
		<footer
			style={bgStyle}
			className={`relative bg-white pb-[72px] pt-6 lg:pb-[180px]  ${className}`}
		>
			{noise && (
				<div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: "url('/noise_bg.svg')", backgroundSize: "cover" }} />
			)}
			<div
				className={`relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[40px] 4xl:px-[180px]`}
			>
				<FooterLabel mb={10} />
				{withNavigation && <FooterNavigation />}
			</div>
		</footer>
	);
};

export default FooterLayout;
