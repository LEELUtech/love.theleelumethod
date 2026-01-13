"use client";
import { useRouter } from "next/navigation";
import UserDataModal from "@/components/ui/modals/UserDataModal";
import PillButton from "@/components/ui/buttons/PillButton";
import { useCheckoutStore } from "@/store/checkoutStore";

interface JoinProgramButtonProps {
	text?: string;
}

export default function JoinProgramButton({ text = "Join Program" }: JoinProgramButtonProps) {
	const router = useRouter();
	const setCheckoutData = useCheckoutStore((state) => state.setCheckoutData);

	const handleSuccess = (values: any) => {
		// Save user data to Zustand store
		setCheckoutData(values);
		
		// Redirect to checkout
		router.push("/checkout");
	};

	return (
		<UserDataModal
			trigger={(open) => (
				<PillButton onClick={open} type="button">
					<span>{text}</span>
				</PillButton>
			)}
			title="Join Program"
			onSuccess={handleSuccess}
		/>
	);
}
