"use client";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="inline-block bg-gray-100 rounded-full p-6 mb-6">
            <svg 
              className="w-16 h-16 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>

          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Link
              href="/"
              className="btn-pill w-full inline-flex items-center justify-center"
            >
              <span>Return to Home</span>
              <span aria-hidden className="btn-pill__icon">
                →
              </span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Go Back
            </button>
          </div>

          {/* Support Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Need help or have questions?
            </p>
            <a 
              href="mailto:support@leelutech.com" 
              className="text-pink-600 hover:underline font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            You can try again anytime. We&apos;re here to help you on your journey! 💖
          </p>
        </div>
      </div>
    </main>
  );
}
