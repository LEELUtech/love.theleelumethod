import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton"
import CompatibilityReportModalButton from "@/components/ui/buttons/CompatibilityReportModalButton"
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton"

export default function HomePage() {
	return (
		<main>
			<div className="flex gap-2">
				<CompatibilityReportModalButton />
				<WebinarModalButton />
				<FreeQuizButton />
			</div>
		</main>
	);
}
