
import FreeReportsModalButton from "@/components/ui/buttons/FreeReportsModalButton";
import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton";

export default function AboutPage() {
	return (
		<main className="max-w-2xl mx-auto py-12 px-4">
			<h1 className="text-3xl font-bold mb-4">About</h1>
			<p className="mb-8 text-zinc-600">This is the about page.</p>
			<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10">
				{/* Free Report CTA */}
				<FreeReportsModalButton />
				{/* Join Program CTA */}
				<button
					className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-xl text-lg shadow-md transition-all duration-200"
				>
					Join Program
				</button>
				{/* Free Quiz CTA */}
				<FreeQuizButton />
			</div>
		</main>
	);
}
