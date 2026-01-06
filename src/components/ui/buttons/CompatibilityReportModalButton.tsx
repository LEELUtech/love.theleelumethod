"use client";
import CompatibilityModal from "@/components/ui/modals/CompatibilityModal";
import { useRouter } from "next/navigation";
import { useCompatibilityReport } from "@/hooks/useCompatibilityReport";

interface CompatibilityReportModalButtonProps {
	text?: string;
}

export default function CompatibilityReportModalButton({ text = "Get Free Report" }: CompatibilityReportModalButtonProps) {
	const router = useRouter();
	const { handleCompatibilityReport } = useCompatibilityReport();
	
	return (
		<CompatibilityModal
			trigger={(open) => (
				<button
					className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-12 rounded-full text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
					onClick={open}
				>
					{text}
				</button>
			)}
			title="Get Your Compatibility Report!"
			onSubmit={handleCompatibilityReport}
			onSuccess={() => {
				router.replace("/confirmation");
			}}
		/>
	);
}
