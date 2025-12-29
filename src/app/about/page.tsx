import FreeReportsModalButton from "@/components/ui/buttons/FreeReportsModalButton";
import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton";
import JoinProgramButton from "@/components/ui/buttons/JoinProgramButton";

export default function AboutPage() {
	return (
		<main className="max-w-2xl mx-auto py-12 px-4">
			<h1 className="text-3xl font-bold mb-4">About</h1>
			<p className="mb-8 text-zinc-600">This is the about page.</p>
			<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10">
				{/* Free Report CTA */}
				<FreeReportsModalButton />
				{/* Join Program CTA */}
				<JoinProgramButton />
				{/* Free Quiz CTA */}
				<FreeQuizButton />
			</div>
		</main>
	);
}
