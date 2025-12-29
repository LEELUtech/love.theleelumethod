"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const quizResults = [
  { id: 1, type: "analyst", title: "The Analyst", description: "You love structure, data, and logic. You're detail-oriented and excel in technical fields.", color: "#3B82F6", icon: "📊" },
  { id: 2, type: "team", title: "Team Player", description: "You thrive in collaborative environments and know how to motivate others.", color: "#10B981", icon: "👥" },
  { id: 3, type: "creator", title: "Creative Innovator", description: "You need creative freedom and space for innovation to do your best work.", color: "#8B5CF6", icon: "🎨" },
  { id: 4, type: "strategist", title: "Business Strategist", description: "You see the big picture and excel at strategic planning and decision-making.", color: "#F59E0B", icon: "♟️" },
];

export default function QuizRedirectPage() {
  const searchParams = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(10);
  const [result, setResult] = useState<any>(null);
  
  const type = searchParams.get("type");
  const score = searchParams.get("score");

  useEffect(() => {
    const foundResult = quizResults.find(r => r.type === type) || quizResults[0];
    setResult(foundResult);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "https://leelutech.ewebinar.com/webinar/decoded-love-22610";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [type]);

  if (!result) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading your results...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Quiz Results
          </h1>
          <p className="text-gray-600">Based on your answers, here's your professional profile</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border-l-4" style={{ borderLeftColor: result.color }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full text-3xl" style={{ backgroundColor: `${result.color}20` }}>
              {result.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: result.color }}>
                  {result.type?.toUpperCase()}
                </span>
                {score && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                    Score: {score}
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{result.title}</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">{result.description}</p>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🎯 Personalized Recommendation:</h3>
              <p className="text-blue-800">
                Based on your {result.title} profile, our upcoming webinar will provide specific insights and strategies tailored to your strengths.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-4">🎁 Special Webinar Invitation</h3>
          <p className="text-lg mb-6 opacity-90">
            Join our exclusive webinar to learn how to leverage your {result.title} strengths for career success
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl font-bold">{timeLeft}</span>
              </div>
              <div className="text-left">
                <p className="text-sm opacity-80">Redirecting in</p>
                <p className="text-xl font-bold">seconds</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.href = "https://leelutech.ewebinar.com/webinar/decoded-love-22610"}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Go Now
              </button>
              <button
                onClick={() => {
                  setTimeLeft(prev => prev + 30);
                }}
                className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Wait {timeLeft + 30}s
              </button>
            </div>
            
            <p className="text-sm opacity-80 mt-4">
              You will be automatically redirected to the webinar registration page
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">📊 What This Means</h4>
            <p className="text-gray-600 text-sm">
              Your {result.title} profile indicates specific strengths and working preferences that can guide your career decisions.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Webinar Focus</h4>
            <p className="text-gray-600 text-sm">
              The webinar will cover practical strategies for leveraging your unique strengths in professional settings.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Quick Tip</h4>
            <p className="text-gray-600 text-sm">
              Take notes during the webinar about how the concepts apply to your specific result type.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Other Result Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quizResults.slice(0, 4).map((res) => (
              <div
                key={res.id}
                className={`p-3 rounded-lg border ${result.id === res.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{res.icon}</span>
                  <span className="font-medium text-sm">{res.title}</span>
                </div>
                <div className="text-xs text-gray-500 capitalize">{res.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}