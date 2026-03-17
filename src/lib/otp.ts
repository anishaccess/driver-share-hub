import { supabase } from "@/lib/backend";

export type OtpSendType = "email" | "sms";

interface RequestOtpParams {
  email: string;
  phone?: string;
  sendType: OtpSendType;
}

export const requestOtp = async ({ email, phone, sendType }: RequestOtpParams) => {
  const { data, error } = await supabase.functions.invoke("send-otp", {
    body: {
      email,
      phone: sendType === "sms" ? phone : undefined,
      sendType,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to send verification code");
  }

  const otp = (data as { otp?: string } | null)?.otp;

  if (!otp) {
    throw new Error("Failed to send verification code");
  }

  const { error: insertError } = await supabase.from("otp_codes").insert({
    user_email: email,
    phone_number: sendType === "sms" ? phone ?? null : null,
    code: otp,
    type: sendType,
    is_verified: false,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return otp;
};
