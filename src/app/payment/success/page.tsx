"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface PaymentStatus {
  payment_status: string;
  circle_access_granted: boolean;
  circle_member_id?: string;
  course_url?: string;
  email?: string;
  product_id?: string;
  error?: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [resendingLink, setResendingLink] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 30; // 30 attempts * 2 seconds = 1 minute max

    // Polling function
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/payment/status?session_id=${sessionId}`);
        const data = await res.json();
        
        setStatus(data);

        // If Circle access is granted or error occurred - stop polling
        if (data.circle_access_granted || data.payment_status === "error") {
          setLoading(false);
          return;
        }

        // If still processing and haven't reached max attempts - continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000); // Check again in 2 seconds
        } else {
          // Timeout reached
          setStatus({
            ...data,
            error: "Processing is taking longer than expected. Please check your email for access link."
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setStatus({ 
          payment_status: "error", 
          circle_access_granted: false,
          error: "Failed to fetch payment status"
        });
        setLoading(false);
      }
    };

    // Start polling
    checkStatus();
  }, [sessionId]);

  const handleResendLink = async () => {
    if (!status?.email) return;
    
    setResendingLink(true);
    try {
      const response = await fetch("/api/payment/resend-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: status.email }),
      });
      
      if (response.ok) {
        alert("✅ Access link sent! Check your email.");
      } else {
        alert("❌ Failed to resend link. Please contact support.");
      }
    } catch (error) {
      console.error("Error resending link:", error);
      alert("❌ Failed to resend link. Please try again.");
    } finally {
      setResendingLink(false);
    }
  };

  if (!sessionId) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md text-center">
          <p className="text-xl text-gray-600">No payment session found.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Creating your access...
          </h2>
          <p className="text-gray-600">
            Please wait while we set up your course access.
          </p>
        </div>
      </main>
    );
  }

  if (status?.error || status?.payment_status !== "paid") {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md text-center bg-white rounded-3xl shadow-xl p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Issue
          </h2>
          <p className="text-gray-600 mb-4">
            {status?.error || "There was an issue with your payment."}
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="btn-pill"
          >
            <span>Return to Home</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 rounded-full p-6 mb-6">
            <svg 
              className="w-16 h-16 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Your course access is ready
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Welcome to Decoded Love! 💖
            </h2>
            <p className="text-lg opacity-90">
              Your account has been created automatically
            </p>
          </div>

          <div className="p-8 md:p-12">
            {status?.circle_access_granted ? (
              <>
                <div className="flex items-start gap-4 mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-3xl">✅</span>
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">
                      Access Granted Successfully
                    </h3>
                    <p className="text-green-700 text-sm">
                      You&apos;re all set! Click the button below to enter the course.
                    </p>
                  </div>
                </div>

                {/* Primary CTA */}
                <a
                  href={status.course_url || "#"}
                  className="btn-pill w-full inline-flex items-center justify-center mb-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-xl">🚀 Enter the Course</span>
                  <span aria-hidden className="btn-pill__icon text-2xl">
                    →
                  </span>
                </a>

                {/* Info Box */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <span>ℹ️</span>
                    First Time Accessing?
                  </h4>
                  <p className="text-blue-800 text-sm mb-3">
                    If you&apos;re not logged in automatically, check your email for a secure 
                    magic link that will log you in instantly - no password needed!
                  </p>
                  <button
                    onClick={handleResendLink}
                    disabled={resendingLink}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm underline disabled:opacity-50"
                  >
                    {resendingLink ? "Sending..." : "📧 Resend Access Link"}
                  </button>
                </div>

                {/* Details */}
                <div className="text-sm text-gray-600 space-y-2 bg-gray-50 rounded-xl p-4">
                  <p>
                    <strong>Email:</strong> {status.email}
                  </p>
                  {status.product_id && (
                    <p>
                      <strong>Product:</strong> {status.product_id}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Setting up your access...
                </h3>
                <p className="text-gray-600 mb-6">
                  Your payment was successful! We&apos;re currently setting up your course access.
                  <br />
                  This usually takes just a few seconds.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-pill"
                >
                  <span>Refresh Status</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center text-gray-600 text-sm">
          <p>
            Need help? Contact us at{" "}
            <a 
              href="mailto:support@leelutech.com" 
              className="text-pink-600 hover:underline"
            >
              support@leelutech.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
