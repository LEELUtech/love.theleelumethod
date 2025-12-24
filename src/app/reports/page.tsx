import FreeReportsModalButton from '@/components/ui/buttons/FreeReportsModalButton';

export default function ReportsPage() {
	return (
		<main className="max-w-2xl mx-auto py-12 px-4">
			<h1 className="text-3xl font-bold mb-4">Reports</h1>
			<p className="mb-8 text-zinc-600">This is the reports page.</p>
			<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10">
				<FreeReportsModalButton />
			</div>
		</main>
	);
}
