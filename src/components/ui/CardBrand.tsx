import Image from "next/image";

export default function CardBrand({ label }: { label: string }) {
	const src = `/icons/${label.toLowerCase()}.png`;

	return (
			<Image
				src={src}
				alt={label}
				width={24}
				height={14}
				quality={85}
			/>

	);
}
