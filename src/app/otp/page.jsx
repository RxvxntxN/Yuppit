"use client";
import {Suspense} from "react";
import {useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";

// Force dynamic rendering - this prevents static generation
export const dynamic = "force-dynamic";

function OTPForm() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, otp}),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("OTP Verified! 🎉");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setMessage(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600">
            No email provided. Please go back and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          We sent a code to <strong>{email}</strong>
        </p>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest"
            maxLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center ${message.includes("🎉") ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OTPForm />
    </Suspense>
  );
}
