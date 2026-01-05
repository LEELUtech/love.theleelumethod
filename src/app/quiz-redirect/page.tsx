"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { quizResults } from "@/utils/quiz-results";
import Image from "next/image";

function QuizRedirectContent() {
	const searchParams = useSearchParams();
	const type = searchParams.get("type");
	
	const result = quizResults.find((r) => r.type === type) || quizResults[0];

	if (!result) {
		return (
			<main className="flex flex-col items-center justify-center min-h-[60vh] p-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
				<p className="mt-4 text-gray-600">Loading your results...</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen p-4 md:p-8">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Your Quiz Result
					</h1>
					<p className="text-lg text-gray-600">
						Discover what this means for your journey
					</p>
				</div>

				{/* Main Result Card */}
				<div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
					{/* Image Section */}
					<div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-pink-100 to-purple-100">
						<Image
							src={result.imageUrl}
							alt={result.title}
							fill
							className="object-cover"
							priority
						/>
					</div>

					{/* Content Section */}
					<div className="p-8 md:p-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
							{result.title}
						</h2>
						<div className="prose prose-lg max-w-none">
							<p className="text-gray-700 leading-relaxed whitespace-pre-line">
								{result.description}
							</p>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-xl border border-gray-200">
					<h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
						💝 Ready to Transform Your Love Life?
					</h3>
					<p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-600">
						Join Lily&apos;s exclusive masterclass and discover the proven strategies
						that will help you overcome your challenges and attract the love you
						deserve.
					</p>
					<button
						onClick={() =>
							(window.location.href =
								"https://leelutech.ewebinar.com/webinar/decoded-love-22610")
						}
						className="bg-pink-600 text-white hover:bg-pink-700 px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
					>
						Join the Free Masterclass Now
					</button>
				</div>
			</div>
		</main>
	);
}

export default function QuizRedirectPage() {
	return (
		<Suspense
			fallback={
				<main className="flex flex-col items-center justify-center min-h-[60vh] p-4">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-gray-600">Loading your results...</p>
				</main>
			}
		>
			<QuizRedirectContent />
		</Suspense>
	);
}
