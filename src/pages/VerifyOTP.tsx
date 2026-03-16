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
        <Link to="/signup" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-10 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back to sign up
        </Link>

        <div className="rounded-2xl border border-border/50 bg-card p-8 premium-shadow">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-card-foreground">Verify Your Email</h1>
            <p className="text-sm text-muted-foreground mt-2">
              We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>
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

            <Button onClick={handleVerify} className="w-full h-12 font-bold text-base" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary hover:underline font-semibold disabled:opacity-50"
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
