import FreeQuizButton from "@/components/ui/buttons/FreeQuizButton";
import FreeReportsModalButton from "@/components/ui/buttons/FreeReportsModalButton";
import JoinProgramButton from '@/components/ui/buttons/JoinProgramButton';

export default function FreebiesPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Freebies</h1>
      <p className="mb-8 text-zinc-600">Get your free resources below!</p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10">
        <FreeReportsModalButton />
        <JoinProgramButton />
        <FreeQuizButton />
      </div>
    </main>
  );
}
