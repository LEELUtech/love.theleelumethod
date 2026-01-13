"use client";
import { ReactNode } from "react";
import UserDataModal from "@/components/ui/modals/UserDataModal";
import { redirectToWebinar } from "@/utils/redirectToWebinar";
import PillButton from "@/components/ui/buttons/PillButton";

interface WebinarModalButtonProps {
	text?: string;
	className?: string;
	showArrow?: boolean;
	icon?: ReactNode;
	iconPosition?: "left" | "right";
	children?: ReactNode;
}


export default function WebinarModalButton({
	text = "Webinar CTA",
	className,
	showArrow = true,
	icon,
	iconPosition = "right",
	children,
}: WebinarModalButtonProps) {
	const content = children ?? (
		<span className="inline-flex items-center gap-4">
			{iconPosition === "left" && icon}
			<span>{text}</span>
			{iconPosition === "right" && icon}
		</span>
	);

	return (
		<UserDataModal
			trigger={(open) => (
				<PillButton onClick={open} type="button" className={className} showArrow={showArrow}>
					{content}
				</PillButton>
			)}
	      title="Join Webinar"
			onSuccess={(values) => {
				redirectToWebinar({
					name: `${values.firstName} ${values.lastName}`,
					email: values.email,
				});
			}}
		/>
	);
}
