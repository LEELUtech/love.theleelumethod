"use client";

import React from "react";
import { PhoneInput, type PhoneInputProps } from "react-international-phone";
import "react-international-phone/style.css";

type Props = Omit<PhoneInputProps, "value" | "onChange"> & {
	value?: string;
	onChange?: (value: string) => void;
	onBlur?: () => void;
};

export const PhoneNumberInput: React.FC<Props> = ({
	value,
	onChange,
	onBlur,
	...rest
}) => {
	const wrapRef = React.useRef<HTMLDivElement>(null);
	const [menuW, setMenuW] = React.useState<number>(320);

	React.useLayoutEffect(() => {
		const el = wrapRef.current;
		if (!el) return;

		const update = () => setMenuW(el.getBoundingClientRect().width);
		update();

		const ro = new ResizeObserver(update);
		ro.observe(el);
		window.addEventListener("resize", update);

		return () => {
			ro.disconnect();
			window.removeEventListener("resize", update);
		};
	}, []);

	return (
		<div ref={wrapRef} style={{ width: "100%" }}>
			<PhoneInput
				{...rest}
				value={value}
				onChange={(val) => onChange?.(val)}
				onBlur={onBlur}
				style={{
					width: "100%",
					boxSizing: "border-box",
					display: "flex",
					alignItems: "center",
					borderRadius: "6px",
					border: "1px solid #C3C6D1",
					backgroundColor: "#fff",
					padding: "5.5px 18px",
					fontFamily: "Lato, sans-serif",
					fontWeight: 400,
					fontSize: "16px",
					lineHeight: "24px",
					color: "#757986",
					position: "relative",
				}}
				inputStyle={{
					flex: 1,
					minWidth: 0,
					border: "none",
					outline: "none",
					background: "transparent",
					padding: 0,
					margin: 0,
					fontFamily: "Lato, sans-serif",
					fontWeight: 400,
					fontSize: "16px",
					lineHeight: "24px",
					color: "#757986",
				}}
				countrySelectorStyleProps={{
					buttonStyle: {
						border: "none",
						background: "transparent",
						padding: 0,
						marginRight: "10px",
						display: "flex",
						alignItems: "center",
						flexShrink: 0,
					},
					dropdownStyleProps: {
						style: {
							boxSizing: "border-box",
							width: menuW,
							minWidth: menuW,
							maxWidth: "calc(100vw - 24px)",

							left: 0,
							right: "auto",
						transform: "none",
						marginLeft: "-18px",

						backgroundColor: "#FFFFFF",
						border: "none",
							borderRadius: "12px",
							boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
							padding: "6px",
							marginTop: "6px",
							overflow: "auto",
							zIndex: 9999,
						},
					},
				}}
			/>
		</div>
	);
};
