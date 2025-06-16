import {sendOTP} from "@/lib/otpService";

// Named export for POST method
export async function POST(req) {
  try {
    const {email} = await req.json();

    if (!email) {
      return Response.json({error: "Email is required"}, {status: 400});
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({error: "Invalid email format"}, {status: 400});
    }

    console.log("Sending OTP to:", email);

    await sendOTP(email);

    console.log("OTP sent successfully to:", email);
    return Response.json({message: "OTP sent successfully"});
  } catch (error) {
    console.error("Send OTP error:", error);
    return Response.json(
      {error: error.message || "Failed to send OTP"},
      {status: 500}
    );
  }
}

// Explicitly declare other unused HTTP methods
export function GET() {
  return Response.json({error: "Method not allowed"}, {status: 405});
}

export function PUT() {
  return Response.json({error: "Method not allowed"}, {status: 405});
}
