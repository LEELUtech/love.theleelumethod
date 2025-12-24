import Link from "next/link";

export default function ConfirmationPage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-white">
			<div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-zinc-200">
				<h1 className="text-3xl font-bold text-pink-600 mb-4">Thank you!</h1>
				<p className="text-zinc-700 text-lg mb-6">
					Your request has been received.<br />
					You will receive an email with your free resources and further instructions soon.<br />
					Please check your inbox (and spam folder) within the next few minutes.
				</p>
				<Link
					href="/"
					className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
				>
					Back to Home
				</Link>
			</div>
		</main>
	);
}
