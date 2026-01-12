import CompatibilityReportModalButton from "@/components/ui/buttons/CompatibilityReportButton";

export default function ReportsPage() {
	return (
		<main className="max-w-2xl mx-auto py-12 px-4 space-y-6">
			<header className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">Reports</h1>
				<p className="text-zinc-600">This is the reports page.</p>
			</header>
			<section className="flex flex-col sm:flex-row gap-6 justify-center items-center">
				<CompatibilityReportModalButton />
			</section>
		</main>
	);
}
