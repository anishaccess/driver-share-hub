import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Unlock, Lock, Users, LogOut, MapPin, Star, Phone, ArrowRight, BarChart3, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const OwnerDashboard = () => {
  const { user, profile, signOut } = useAuth();

  const { data: unlockBalance } = useQuery({
    queryKey: ["unlock-balance", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("unlock_balances")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: recentUnlocks } = useQuery({
    queryKey: ["recent-unlocks", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("contact_unlocks")
        .select("*, profiles:unlocked_profile_id(full_name, role, city, phone, avatar_emoji, experience, vehicle_type)")
        .eq("unlocker_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      return data;
    },
    enabled: !!user,
  });

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">TrukConnect</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/browse">
              <Button variant="ghost" size="sm" className="font-semibold">Find Drivers</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut} className="gap-1.5 font-semibold">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Owner Profile Card */}
        <div className="rounded-2xl gradient-hero p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(38,95%,54%,0.1),transparent_50%)]" />
          <div className="relative flex items-start gap-5">
            <div className="h-18 w-18 shrink-0 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <span className="text-4xl">{profile.avatar_emoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="font-display text-2xl font-bold text-white">{profile.full_name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/20 text-accent border border-accent/20">Truck Owner</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{profile.city}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>
                <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-accent fill-accent" />{profile.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Unlock, value: unlockBalance?.remaining_unlocks ?? 0, label: "Remaining Unlocks", color: "text-primary" },
            { icon: Lock, value: unlockBalance?.total_purchased ?? 0, label: "Total Purchased", color: "text-accent" },
            { icon: Users, value: recentUnlocks?.length ?? 0, label: "Drivers Found", color: "text-primary" },
            { icon: TrendingUp, value: profile.rating, label: "Your Rating", color: "text-accent" },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="rounded-2xl border border-border/50 bg-card p-5 text-center premium-shadow hover:elevated-shadow transition-all">
              <Icon className={`h-5 w-5 mx-auto ${color} mb-2`} />
              <p className="text-2xl font-bold text-card-foreground">{value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link to="/browse" className="group rounded-2xl border border-border/50 bg-card p-6 hover:elevated-shadow transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-card-foreground">Find Drivers</h3>
                <p className="text-xs text-muted-foreground">Browse verified drivers in your area</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
          <Link to="/pricing" className="group rounded-2xl border border-border/50 bg-card p-6 hover:elevated-shadow transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                <Unlock className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-card-foreground">Buy Unlocks</h3>
                <p className="text-xs text-muted-foreground">Get more contact unlocks</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Fleet Overview */}
        <div className="rounded-2xl border border-border/50 bg-card p-7 mb-8 premium-shadow">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-card-foreground">Your Fleet Overview</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Vehicle Type", value: profile.vehicle_type ?? "Not set" },
              { label: "Experience", value: profile.experience ?? "Not set" },
              { label: "Profile Views", value: "Coming soon" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-secondary/50 p-4 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1 font-medium">{label}</p>
                <p className="font-semibold text-card-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Unlocked Drivers */}
        <div className="rounded-2xl border border-border/50 bg-card p-7 premium-shadow">
          <h2 className="font-display text-lg font-bold text-card-foreground mb-5">Recently Unlocked Drivers</h2>
          {recentUnlocks && recentUnlocks.length > 0 ? (
            <div className="space-y-3">
              {recentUnlocks.map((unlock: any) => (
                <div key={unlock.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center">
                    <span className="text-xl">{unlock.profiles?.avatar_emoji ?? "👤"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-card-foreground truncate">{unlock.profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {unlock.profiles?.city} · {unlock.profiles?.experience ?? "N/A"} experience
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-card-foreground">{unlock.profiles?.phone}</p>
                    <p className="text-xs text-muted-foreground">{unlock.profiles?.vehicle_type ?? "General"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No drivers unlocked yet. Start browsing!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
