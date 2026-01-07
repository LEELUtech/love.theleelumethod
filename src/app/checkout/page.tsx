"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [addPaidReport, setAddPaidReport] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("checkoutData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setUserData(parsed);
      } catch (e) {
        console.error("Failed to parse checkout data:", e);
        router.push("/program"); // Redirect back if no data
      }
    } else {
      // No data collected - redirect to program page
      router.push("/program");
    }
  }, [router]);

  const handlePayment = async () => {
    if (!userData) return;

    setError("");
    setLoading(true);

    try {
      // Create Stripe Checkout Session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          productId: "course_decodedlove",
          circleSpaceId: process.env.NEXT_PUBLIC_CIRCLE_DEFAULT_SPACE_ID || "",
          addPaidReport: addPaidReport,
          amount: addPaidReport ? 14700 : 9700, // $147 or $97
          productName: addPaidReport 
            ? "Decoded Love Course + Paid Report" 
            : "Decoded Love Course",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const basePrice = 97;
  const reportPrice = 50;
  const totalPrice = addPaidReport ? basePrice + reportPrice : basePrice;

  if (!userData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete Your Purchase 💖
          </h1>
          <p className="text-xl text-gray-600">
            Review your order and proceed to payment
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Your Information</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                {userData.phone && <p><strong>Phone:</strong> {userData.phone}</p>}
              </div>
              <button
                onClick={() => router.push("/program")}
                className="mt-3 text-sm text-pink-600 hover:underline"
              >
                ← Change information
              </button>
            </div>

            {/* Course Info */}
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Decoded Love Course
              </h3>
              <p className="text-gray-600 mb-4">
                Unlock the secrets to understanding yourself and your relationships.
                Get lifetime access to all course materials and updates.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Lifetime access to all content
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Private Circle community
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Automatic magic link login
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Regular updates and new content
                </li>
              </ul>
            </div>

            {/* Paid Report Upsell */}
            <div className="border-2 border-purple-200 rounded-2xl p-6 bg-purple-50 hover:bg-purple-100 transition-colors">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={addPaidReport}
                  onChange={(e) => setAddPaidReport(e.target.checked)}
                  className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Add Paid Report
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      +${reportPrice}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Get your personalized compatibility report with detailed insights
                    and actionable advice for your relationship journey.
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-gray-700">
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Deep personality analysis
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Compatibility scoring
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Relationship recommendations
                    </li>
                  </ul>
                </div>
              </label>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Decoded Love Course</span>
                <span>${basePrice}</span>
              </div>
              {addPaidReport && (
                <div className="flex justify-between text-gray-700">
                  <span>Paid Report</span>
                  <span>${reportPrice}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full btn-pill py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Pay ${totalPrice}
                  <span aria-hidden className="btn-pill__icon ml-2">→</span>
                </span>
              )}
            </button>

            {/* Security Badge */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500 flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>🔒 Your information is secure and encrypted</p>
          <p className="mt-2">💳 Cancel anytime within 30 days for a full refund</p>
        </div>
      </div>
    </main>
  );
}
