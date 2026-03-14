import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "driver" ? "driver" : "owner";
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", full_name: "", phone: "", city: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      toast.success("Please check your email for the verification code.");
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    }
    setLoading(false);
  };

  const Icon = role === "owner" ? Truck : Users;
  const roleLabel = role === "owner" ? "Truck Owner" : "Driver";
  const roleColor = role === "owner" ? "text-primary" : "text-accent";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="rounded-xl border bg-card p-8">
          <div className="text-center mb-6">
            <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary ${roleColor}`}>
              <Icon className="h-7 w-7" />
            </div>
            <h1 className="font-slab text-2xl font-bold text-card-foreground">Sign up as {roleLabel}</h1>
            <p className="text-sm text-muted-foreground mt-1">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Rajesh Kumar" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Mumbai" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
