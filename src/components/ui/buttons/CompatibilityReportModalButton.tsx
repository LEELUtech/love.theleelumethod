"use client";
import CompatibilityModal from "@/components/ui/modals/CompatibilityModal";
import { useRouter } from "next/navigation";
import { useCompatibilityReport } from "@/hooks/useCompatibilityReport";
import PillButton from "@/components/ui/buttons/PillButton";

interface CompatibilityReportModalButtonProps {
	text?: string;
	className?: string;
}

export default function CompatibilityReportModalButton({ text = "Get Free Report", className }: CompatibilityReportModalButtonProps) {
	const router = useRouter();
	const { handleCompatibilityReport } = useCompatibilityReport();
	
	return (
		<CompatibilityModal
			trigger={(open) => (
				<PillButton onClick={open} type="button" className={className}>
					<span>{text}</span>
				</PillButton>
			)}
			title="Get Your Compatibility Report!"
			onSubmit={handleCompatibilityReport}
			onSuccess={() => {
				router.replace("/confirmation");
			}}
		/>
	);
}
