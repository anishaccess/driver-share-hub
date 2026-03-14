import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { Truck, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Create profile after successful verification
    if (data.user) {
      const meta = data.user.user_metadata;
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: data.user.id,
        role: meta.role ?? "owner",
        full_name: meta.full_name ?? "",
        phone: meta.phone ?? "",
        city: meta.city ?? "",
        avatar_emoji: meta.avatar_emoji ?? "👤",
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error("Profile setup failed. Please try logging in.");
        setLoading(false);
        return;
      }
    }

    toast.success("Email verified! Welcome to TrukConnect.");
    navigate("/dashboard");
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification code resent!");
    }
    setResending(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/signup" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to sign up
        </Link>

        <div className="rounded-xl border bg-card p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-slab text-2xl font-bold text-card-foreground">Verify Your Email</h1>
            <p className="text-sm text-muted-foreground mt-1">
              We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button onClick={handleVerify} className="w-full" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
