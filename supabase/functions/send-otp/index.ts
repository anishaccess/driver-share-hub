import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OTPRequest {
  email: string;
  phone?: string;
  sendType: "email" | "sms" | "both";
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

async function sendEmailOtp(email: string, otp: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!resendApiKey) {
    console.log("Demo mode: Email OTP generated - " + otp);
    return { status: "demo", message: "OTP stored in database for testing" };
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: "noreply@trukconnect.com",
      to: email,
      subject: "Your TrukConnect Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; color: white; text-align: center;">
            <h2 style="margin: 0;">TrukConnect Verification</h2>
          </div>
          <div style="padding: 40px 20px; text-align: center;">
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">Your verification code is:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #333; margin: 0;">${otp}</p>
            </div>
            <p style="color: #999; font-size: 12px;">This code will expire in 15 minutes.</p>
          </div>
        </div>
      `,
    }),
  });

  if (!emailResponse.ok) {
    console.error("Email sending failed:", await emailResponse.text());
    return { status: "failed" };
  }

  return { status: "sent" };
}

async function sendSmsOtp(phone: string, otp: string) {
  const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioFromNumber = Deno.env.get("TWILIO_FROM_NUMBER");

  if (!twilioAccountSid || !twilioAuthToken || !twilioFromNumber) {
    console.log("Demo mode: SMS OTP generated - " + otp);
    return { status: "demo", message: "OTP stored in database for testing" };
  }

  const smsResponse = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
      },
      body: new URLSearchParams({
        From: twilioFromNumber,
        To: phone,
        Body: `Your TrukConnect verification code is: ${otp}. This code will expire in 15 minutes.`,
      }).toString(),
    }
  );

  if (!smsResponse.ok) {
    console.error("SMS sending failed:", await smsResponse.text());
    return { status: "failed" };
  }

  return { status: "sent" };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, phone, sendType } = (await req.json()) as OTPRequest;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const otp = generateOTP();
    const delivery = {
      email: "not_requested",
      sms: "not_requested",
    };

    if (sendType === "email" || sendType === "both") {
      const result = await sendEmailOtp(email, otp);
      delivery.email = result.status;
    }

    if ((sendType === "sms" || sendType === "both") && phone) {
      const result = await sendSmsOtp(phone, otp);
      delivery.sms = result.status;
    }

    const isDemo = delivery.email === "demo" || delivery.sms === "demo";

    return new Response(
      JSON.stringify({
        success: true,
        message: isDemo ? "Demo mode: OTP stored in database for testing" : "OTP generated successfully",
        otp,
        delivery,
        demo: isDemo,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send OTP",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
