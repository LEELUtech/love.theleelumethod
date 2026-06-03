export const metadata = { title: "Quiz Results | The Leelu Method" };

import FixSection from '@/components/sections/QuizResult/FixSection';
import HeroSection from '@/components/sections/QuizResult/HeroSection';
import ProfileGlitchSection from '@/components/sections/QuizResult/ProfileGlitchSection';
import QuizResultGate from '@/components/sections/QuizResult/QuizResultGate';
import Footer from '@/components/ui/Footer';
import { quizResults } from '@/utils/quiz-results';
import { redirect } from 'next/navigation';
import React from 'react';

interface QuizResultPageProps {
  searchParams: Promise<{ type: string }>;
}

const QuizResultPage = async ({ searchParams }: QuizResultPageProps) => {
  const { type } = await searchParams;

  const result = quizResults.find((r) => r.type === type);

  if (!result) {
    redirect('/');
  }

  return (
    <QuizResultGate type={type!}>
      <main>
        <HeroSection title={result.title} subtitle={result.subtitle} />
        <ProfileGlitchSection psychologicalProfile={result.psychologicalProfile} pattern={result.pattern} />
        <FixSection fix={result.fix} />
        <Footer />
      </main>
    </QuizResultGate>
  );
};

export default QuizResultPage;
