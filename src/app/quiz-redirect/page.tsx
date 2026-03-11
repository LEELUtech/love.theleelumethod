import FixSection from '@/components/sections/QuizResult/FixSection';
import HeroSection from '@/components/sections/QuizResult/HeroSection';
import ProfileGlitchSection from '@/components/sections/QuizResult/ProfileGlitchSection';
import QuizResultTagger from '@/components/sections/QuizResult/QuizResultTagger';
import { quizResults } from '@/utils/quiz-results';
import { redirect } from 'next/navigation';
import React from 'react';

interface QuizResultPageProps {
  searchParams: { type: string };
}

const QuizResultPage = ({ searchParams }: QuizResultPageProps) => {
  const type = searchParams.type;

  const result = quizResults.find((r) => r.type === type);

  if (!result) {
    redirect('/');
  }

  return (
    <main>
      <QuizResultTagger type={type!} />
      <HeroSection title={result.title} />
      <ProfileGlitchSection description={result.description} secondaryDescription={result.secondaryDescription} />
      <FixSection />
    </main>
  );
};

export default QuizResultPage;
