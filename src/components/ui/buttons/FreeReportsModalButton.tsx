"use client";
import UserDataModal from "@/components/ui/userModal/UserDataModal";
import { useRouter } from "next/navigation";
import { useFreeReport } from "@/hooks/useFreeReport";

export default function FreeReportsModalButton() {
	const router = useRouter();
	const { handleFreeReport } = useFreeReport();
	return (
		<UserDataModal
			trigger={(open) => (
				<button
					className="px-4 py-2 border rounded hover:bg-gray-100 transition"
					onClick={open}
				>
					Free Reports CTA
				</button>
			)}
			title="Get Free Reports!"
			onSubmit={handleFreeReport}
			onSuccess={() => {
				router.replace("/confirmation");
			}}
		/>
	);
}
