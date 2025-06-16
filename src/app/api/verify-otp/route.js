import {verifyOTP} from "@/lib/otpService";

export async function POST(req) {
  try {
    const {email, otp} = await req.json();

    if (!email || !otp) {
      return Response.json(
        {error: "Email and OTP are required"},
        {status: 400}
      );
    }

    console.log("Verifying OTP for:", email);

    if (!verifyOTP(email, otp)) {
      return Response.json({error: "Invalid or expired OTP"}, {status: 400});
    }

    console.log("OTP verified successfully for:", email);
    return Response.json({message: "OTP verified successfully"});
  } catch (error) {
    console.error("Verify OTP error:", error);
    return Response.json({error: "Internal server error"}, {status: 500});
  }
}
