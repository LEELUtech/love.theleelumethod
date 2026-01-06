"use client";
import UserDataModal from "@/components/ui/modals/UserDataModal";
import { redirectToWebinar } from "@/utils/redirectToWebinar";

export default function WebinarModalButton() {
	return (
		<UserDataModal
			trigger={(open) => (
				<button
					className="px-4 py-2 border rounded hover:bg-gray-100 transition"
					onClick={open}
				>
					Webinar CTA
				</button>
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
