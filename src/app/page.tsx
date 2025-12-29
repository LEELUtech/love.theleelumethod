import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton"
import FreeReportsModalButton from "@/components/ui/buttons/FreeReportsModalButton"
import WebinarModalButton from "@/components/ui/buttons/WebinarModalButton"

export default function HomePage() {
	return (
		<main>
			<div className="flex gap-2">
				<FreeReportsModalButton />
				<WebinarModalButton />
				<FreeQuizButton />
			</div>
		</main>
	);
}
