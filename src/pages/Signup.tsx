import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "driver" ? "driver" : "owner";
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", full_name: "", phone: "", city: "" });
  const [sendSMS, setSendSMS] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async (email: string, phone: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !anonKey) {
        throw new Error("Missing Supabase configuration");
      }

      const apiUrl = `${supabaseUrl}/functions/v1/send-otp`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          email,
          phone: sendSMS ? phone : undefined,
          sendType: sendSMS ? "sms" : "email",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OTP API Error:", errorText);
        throw new Error("Failed to send verification code");
      }

      const data = await response.json();

      await supabase.from("otp_codes").insert({
        user_email: email,
        phone_number: sendSMS ? phone : null,
        code: data.otp,
        type: sendSMS ? "sms" : "email",
        is_verified: false,
      });

      return true;
    } catch (error) {
      console.error("OTP sending error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            role,
            full_name: form.full_name,
            phone: form.phone,
            city: form.city,
            avatar_emoji: role === "owner" ? "🚛" : "🧑‍✈️",
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await sendOTP(form.email, form.phone);
        toast.success(`Verification code sent to your ${sendSMS ? "email and phone" : "email"}!`);
        navigate(`/verify-otp?email=${encodeURIComponent(form.email)}&phone=${encodeURIComponent(form.phone)}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const Icon = role === "owner" ? Truck : Users;
  const roleLabel = role === "owner" ? "Truck Owner" : "Driver";
  const roleDesc = role === "owner" ? "List your vehicles and find reliable drivers" : "Find truck owners and start earning";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(38,95%,54%,0.08),transparent_60%)]" />
        <div className="relative text-center px-12">
          <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/10">
            <Icon className="h-10 w-10 text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">Join as {roleLabel}</h2>
          <p className="text-white/60 text-lg max-w-sm">{roleDesc}</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-10 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back to home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${role === "owner" ? "bg-primary/10" : "bg-accent/10"}`}>
              <Icon className={`h-6 w-6 ${role === "owner" ? "text-primary" : "text-accent"}`} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Create Account</h1>
              <p className="text-sm text-muted-foreground">Sign up as {roleLabel}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="font-semibold">Full Name</Label>
              <Input id="full_name" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Rajesh Kumar" className="h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold">Phone</Label>
                <Input id="phone" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="font-semibold">City</Label>
                <Input id="city" required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Mumbai" className="h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <Input id="password" type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" className="h-11" />
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3 bg-accent/5">
              <Checkbox
                id="sendSMS"
                checked={sendSMS}
                onCheckedChange={(checked) => setSendSMS(checked as boolean)}
                className="h-4 w-4"
              />
              <Label htmlFor="sendSMS" className="text-sm font-medium cursor-pointer flex-1 mb-0">
                Verify with mobile number
              </Label>
            </div>
            <Button type="submit" className="w-full h-12 font-bold text-base mt-2" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
