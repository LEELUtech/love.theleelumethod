export default function Input({ placeholder }: { placeholder: string }) {
	return (
		<input
			placeholder={placeholder}
			className="
				w-full
				rounded-[6px]
				border border-[#C3C6D1]
				bg-white
				px-[18px] py-[10px]
				font-lato font-normal text-body
				text-[#757986]
				placeholder:text-[#757986]
				outline-none
			"
		/>
	);
}