"use client";
import UserDataModal from "@/components/ui/modals/UserDataModal";
import { redirectToWebinar } from "@/utils/redirectToWebinar";
import PillButton from "@/components/ui/buttons/PillButton";

interface WebinarModalButtonProps {
	text?: string;
	className?: string;
	showArrow?: boolean;
}

export default function WebinarModalButton({ text = "Webinar CTA", className, showArrow = true }: WebinarModalButtonProps) {
	return (
		<UserDataModal
			trigger={(open) => (
				<PillButton onClick={open} type="button" className={className} showArrow={showArrow}>
					<span>{text}</span>
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
