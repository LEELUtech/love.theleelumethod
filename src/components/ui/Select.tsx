export default function Select({ placeholder }: { placeholder: string }) {
	return (
		<div className="relative w-full">
			<select
				defaultValue=""
				className="
					w-full appearance-none
					rounded-[6px]
					border border-[#C3C6D1]
					bg-white
					px-[18px] py-[10px]
					font-lato font-normal text-body
					text-[#757986]
					outline-none
				"
			>
				<option value="" disabled className="text-[#757986]">
					{placeholder}
				</option>
				<option value="option1" className="text-[#757986]">
					Option
				</option>
			</select>

			<div className="pointer-events-none absolute right-[18px] top-1/2 -translate-y-1/2 text-[#757986]">
				▾
			</div>
		</div>
	);
}
