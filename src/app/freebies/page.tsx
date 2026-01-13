import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton";
import CompatibilityReportModalButton from "@/components/ui/buttons/CompatibilityReportButton";
import JoinProgramButton from "@/components/ui/buttons/JoinProgramButton";

export default function FreebiesPage() {
	return (
		<main className="max-w-2xl mx-auto py-12 px-4 space-y-6">
			<header className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">Freebies</h1>
				<p className="text-zinc-600">Get your free resources below!</p>
			</header>
			<section className="flex flex-col sm:flex-row gap-6 justify-center items-center">
				<CompatibilityReportModalButton />
				<JoinProgramButton />
				<FreeQuizButton />
			</section>
		</main>
	);
}
