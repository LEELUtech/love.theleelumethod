"use client";
import UserDataModal from "@/components/ui/modals/UserDataModal";

export default function JoinProgramButton() {
	return (
		<UserDataModal
			trigger={(open) => (
				<button
					className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-12 rounded-full text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
					onClick={open}
				>
					Join Program
				</button>
			)}
			title="Join Program"
		/>
	);
}
