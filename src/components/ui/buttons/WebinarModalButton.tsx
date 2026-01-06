"use client";
import UserDataModal from "@/components/ui/modals/UserDataModal";
import { redirectToWebinar } from "@/utils/redirectToWebinar";
import PillButton from "@/components/ui/buttons/PillButton";

interface WebinarModalButtonProps {
	text?: string;
}

export default function WebinarModalButton({ text = "Webinar CTA" }: WebinarModalButtonProps) {
	return (
		<UserDataModal
			trigger={(open) => (
				<PillButton onClick={open} type="button">
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
