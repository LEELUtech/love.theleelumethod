"use client";
import CompatibilityModal from "@/components/ui/modals/CompatibilityModal";
import { useRouter } from "next/navigation";
import { useCompatibilityReport } from "@/hooks/useCompatibilityReport";
import PillButton from "@/components/ui/buttons/PillButton";

interface CompatibilityReportButtonProps {
	text?: string;
	className?: string;
	showArrow?: boolean;
}

export default function CompatibilityReportButton({
	text = "Get Free Report",
	className,
	showArrow,
}: CompatibilityReportButtonProps) {
	const router = useRouter();
	const { handleCompatibilityReport } = useCompatibilityReport();

	return (
		<CompatibilityModal
			trigger={(open) => (
				<PillButton
					onClick={open}
					type="button"
					className={className}
					showArrow={showArrow}
				>
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
