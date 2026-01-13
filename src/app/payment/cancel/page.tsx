"use client";
import CompatibilityReportModalButton from "@/components/ui/buttons/CompatibilityReportButton";
import Link from "next/link";

export default function PaymentCancelPage() {
	return (
		<main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-white to-purple-50">
			<div className="max-w-2xl w-full">
				<div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
					{/* Header Section with Gradient */}
					<div className="bg-gradient-to-r from-pink-100 to-purple-100 p-8 md:p-12 text-center">
						<div className="inline-block bg-white rounded-full p-6 mb-6 shadow-lg">
							<svg
								className="w-16 h-16 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>

						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Payment Cancelled
						</h1>

						<p className="text-lg text-gray-700">
							No worries! No charges were made to your account.
						</p>
					</div>

					{/* Content Section */}
					<div className="p-8 md:p-12">
						{/* Free Alternative Offer */}
						<div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-pink-200">
							<div className="text-center mb-6">
								<span className="text-5xl mb-4 block">💝</span>
								<h2 className="text-2xl font-bold text-gray-900 mb-3">
									Not Ready to Commit Yet?
								</h2>
								<p className="text-gray-700 mb-6">
									Try our free compatibility report first! Discover insights
									about your relationship patterns and compatibility dynamics.
								</p>
							</div>

							<div className="flex flex-col gap-4">
								<CompatibilityReportModalButton className="w-full" />
								<Link
									href="/"
									className="btn-pill w-full inline-flex items-center justify-center"
								>
									<span>Return to Home</span>
									<span aria-hidden className="btn-pill__icon">
										→
									</span>
								</Link>
							</div>
						</div>

						{/* Support Section */}
						<div className="mt-8 pt-8 border-t border-gray-200 text-center">
							<p className="text-sm text-gray-600 mb-2">
								Need help or have questions?
							</p>
							<a
								href="mailto:support@leelutech.com"
								className="text-pink-600 hover:underline font-medium"
							>
								Contact Support
							</a>
						</div>
					</div>
				</div>

				{/* Additional Info */}
				<div className="mt-6 text-center text-sm text-gray-600">
					<p>
						You can try again anytime. We&apos;re here to help you on your
						journey! 💖
					</p>
				</div>
			</div>
		</main>
	);
}
