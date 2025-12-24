

import FreeReportsModalButton from '@/components/ui/buttons/FreeReportsModalButton'
import FreeQuizButton from '@/components/ui/buttons/FreeQuizButton';
import Link from 'next/link';
import WebinarModalButton from '@/components/ui/buttons/WebinarModalButton'

export default function Page() {
	return (
		<main className="p-8">
			<div className="flex flex-wrap items-center justify-between w-full gap-4">
				{/* Кнопки слева */}
				<div className="flex gap-2">
					<FreeReportsModalButton />
					<WebinarModalButton />
					<FreeQuizButton />
				</div>

				{/* Линки справа */}
				<div className="flex gap-2">
					<Link
						href="/about"
						className="px-4 py-2 border-2 border-blue-500 rounded text-blue-700 font-medium hover:bg-blue-50 hover:underline transition"
					>
						About
					</Link>
					<Link
						href="/program"
						className="px-4 py-2 border-2 border-blue-500 rounded text-blue-700 font-medium hover:bg-blue-50 hover:underline transition"
					>
						Program Page
					</Link>
					<Link
						href="/reports"
						className="px-4 py-2 border-2 border-blue-500 rounded text-blue-700 font-medium hover:bg-blue-50 hover:underline transition"
					>
						Reports
					</Link>
					<Link
						href="/freebies"
						className="px-4 py-2 border-2 border-blue-500 rounded text-blue-700 font-medium hover:bg-blue-50 hover:underline transition"
					>
						Freebies
					</Link>
				</div>
			</div>
		</main>
	);
}
