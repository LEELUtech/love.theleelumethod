import CompatibilityReportModalButton from "@/components/ui/buttons/CompatibilityReportModalButton";
import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton";
import JoinProgramButton from "@/components/ui/buttons/JoinProgramButton";

export default function AboutPage() {
	return (
		<main className="max-w-2xl mx-auto py-12 px-4 space-y-6">
			<header className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">About</h1>
				<p className="text-zinc-600">This is the about page.</p>
			</header>
			<section className="flex flex-col sm:flex-row gap-6 justify-center items-center">
				<CompatibilityReportModalButton />
				<JoinProgramButton />
				<FreeQuizButton />
			</section>
		</main>
	);
}
