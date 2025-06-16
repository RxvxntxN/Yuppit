import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing!");
} else {
  console.log("✅ RESEND_API_KEY loaded");
}

const OTP_EXPIRY_MINUTES = 5;

// In-memory store (works for development)
const otpStore = {};

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(email) {
  try {
    const otp = generateOTP();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
    };

    console.log("Attempting to send OTP to:", email, "Code:", otp);

    // Send email - Fixed the template literal syntax
    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Use Resend's default domain
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`, // Fixed: Use template literal
    });

    console.log("✅ Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
}

export function verifyOTP(email, otp) {
  const record = otpStore[email];

  console.log("Verifying OTP for:", email);
  console.log("Stored record:", record);
  console.log("Provided OTP:", otp);

  if (!record) {
    console.log("❌ No OTP record found for email");
    return false;
  }

  if (record.otp !== otp) {
    console.log("❌ OTP mismatch");
    return false;
  }

  if (Date.now() > record.expiresAt) {
    console.log("❌ OTP expired");
    return false;
  }

  console.log("✅ OTP verified successfully");

  // Clean up the OTP after successful verification
  delete otpStore[email];

  return true;
}
