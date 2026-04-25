export const metadata = { title: "Quiz Results | The Leelu Method" };

import FixSection from '@/components/sections/QuizResult/FixSection';
import HeroSection from '@/components/sections/QuizResult/HeroSection';
import ProfileGlitchSection from '@/components/sections/QuizResult/ProfileGlitchSection';
import QuizResultGate from '@/components/sections/QuizResult/QuizResultGate';
import FooterLayout from '@/components/ui/footer/FooterLayout';
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
    <QuizResultGate type={type!}>
      <main>
        <HeroSection title={result.title} subtitle={result.subtitle} />
        <ProfileGlitchSection psychologicalProfile={result.psychologicalProfile} pattern={result.pattern} />
        <FixSection fix={result.fix} />
        <FooterLayout withNavigation={false} />
      </main>
    </QuizResultGate>
  );
};

export default QuizResultPage;
