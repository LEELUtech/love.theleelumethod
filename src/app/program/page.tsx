import JoinProgramButton from "@/components/ui/buttons/JoinProgramButton";

export default function ProgramPage() {
	return (
		<main className="max-w-2xl mx-auto py-12 px-4 space-y-6">
			<header className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">Program</h1>
				<p className="text-zinc-600">This is the program page.</p>
			</header>
			<section className="flex flex-col sm:flex-row gap-6 justify-center items-center">
				<JoinProgramButton />
			</section>
		</main>
	);
}
