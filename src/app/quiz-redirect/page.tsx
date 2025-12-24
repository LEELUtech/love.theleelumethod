"use client";
import { useEffect } from "react";

export default function QuizRedirectPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://leelutech.ewebinar.com/webinar/decoded-love-22610";
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Thank you for taking the quiz!</h1>
      <p className="text-lg">You will be redirected to the webinar registration in a few seconds...</p>
    </main>
  );
}
