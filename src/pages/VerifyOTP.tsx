import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/backend";
import { requestOtp } from "@/lib/otp";
import { ArrowLeft, Mail, Phone, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifyType, setVerifyType] = useState<"email" | "sms">("email");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedOtp = localStorage.getItem("demo_otp");
    if (storedOtp) {
      setDemoOtp(storedOtp);
    }
  }, []);

  const copyToClipboard = () => {
    if (demoOtp) {
      navigator.clipboard.writeText(demoOtp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setLoading(true);

    try {
      const { data: otpRecord } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("code", otp)
        .eq("user_email", email)
        .maybeSingle();

      if (!otpRecord) {
        toast.error("Invalid verification code");
        setLoading(false);
        return;
      }

      if (new Date(otpRecord.expires_at) < new Date()) {
        toast.error("Verification code has expired");
        setLoading(false);
        return;
      }

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
        await supabase
          .from("otp_codes")
          .update({ is_verified: true })
          .eq("id", otpRecord.id);

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

      toast.success("Verification complete! Welcome to TrukConnect.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await requestOtp({
        email,
        phone,
        sendType: verifyType,
      });

      toast.success(`Verification code resent to your ${verifyType === "sms" ? "phone" : "email"}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/signup" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-10 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back to sign up
        </Link>

        <div className="rounded-2xl border border-border/50 bg-card p-8 premium-shadow">
          <Tabs value={verifyType} onValueChange={(val) => setVerifyType(val as "email" | "sms")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              {phone && (
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Phone</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="email">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold text-card-foreground">Verify Your Email</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>
                </p>
              </div>

              {demoOtp && (
                <div className="mb-6 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <p className="text-xs text-yellow-800 font-semibold mb-2">Demo Mode - Your OTP:</p>
                  <div className="flex items-center justify-between bg-white p-3 rounded border border-yellow-100">
                    <code className="text-lg font-mono font-bold text-yellow-900">{demoOtp}</code>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-yellow-100 rounded transition-colors"
                      title="Copy OTP"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-yellow-800" />}
                    </button>
                  </div>
                </div>
              )}

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
            </TabsContent>

            {phone && (
              <TabsContent value="sms">
                <div className="text-center mb-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/8">
                    <Phone className="h-8 w-8 text-accent" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-card-foreground">Verify Your Phone</h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    We sent a 6-digit code to <span className="font-semibold text-foreground">{phone}</span>
                  </p>
                </div>

                {demoOtp && (
                  <div className="mb-6 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                    <p className="text-xs text-yellow-800 font-semibold mb-2">Demo Mode - Your OTP:</p>
                    <div className="flex items-center justify-between bg-white p-3 rounded border border-yellow-100">
                      <code className="text-lg font-mono font-bold text-yellow-900">{demoOtp}</code>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-yellow-100 rounded transition-colors"
                        title="Copy OTP"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-yellow-800" />}
                      </button>
                    </div>
                  </div>
                )}

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
                    {loading ? "Verifying..." : "Verify Phone"}
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
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
