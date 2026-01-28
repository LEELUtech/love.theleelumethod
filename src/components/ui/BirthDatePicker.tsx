import { DatePicker } from "antd";
import React from "react";
import type { Dayjs } from "dayjs";
import { DATE_FORMAT } from "@/utils/constants"

export default function BirthDatePicker({
	placeholder,
	onChange,
}: {
	placeholder: string;
	onChange: (val: Dayjs | null) => void;
}) {
	const wrapRef = React.useRef<HTMLDivElement | null>(null);

	return (
		<div ref={wrapRef} className="relative w-full">
			<DatePicker
				getPopupContainer={() => wrapRef.current ?? document.body}
				classNames={{
					popup: { root: "date-popup-fit" },
				}}
				className="!w-full !rounded-[6px] !border-[#C3C6D1] !px-[18px] !py-[10px] font-lato text-body text-[#757986]"
				placeholder={placeholder}
				format={DATE_FORMAT}
				inputReadOnly
				onChange={onChange}
			/>
		</div>
	);
}
