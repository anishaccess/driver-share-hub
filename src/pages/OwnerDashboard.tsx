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
      <nav className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-primary" />
            <span className="font-slab text-xl font-bold text-foreground">TrukConnect</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/browse">
              <Button variant="ghost" size="sm">Find Drivers</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut} className="gap-1.5">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Owner Profile Card */}
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">{profile.avatar_emoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-slab text-xl font-bold text-card-foreground">{profile.full_name}</h1>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">Truck Owner</span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.city}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-accent fill-accent" />{profile.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4 text-center">
            <Unlock className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-card-foreground">{unlockBalance?.remaining_unlocks ?? 0}</p>
            <p className="text-xs text-muted-foreground">Remaining Unlocks</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <Lock className="h-5 w-5 mx-auto text-accent mb-1" />
            <p className="text-2xl font-bold text-card-foreground">{unlockBalance?.total_purchased ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Purchased</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <Users className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-card-foreground">{recentUnlocks?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Drivers Found</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-accent mb-1" />
            <p className="text-2xl font-bold text-card-foreground">{profile.rating}</p>
            <p className="text-xs text-muted-foreground">Your Rating</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Link to="/browse" className="rounded-lg border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-slab font-semibold text-card-foreground">Find Drivers</h3>
                <p className="text-xs text-muted-foreground">Browse verified drivers in your area</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </div>
          </Link>
          <Link to="/pricing" className="rounded-lg border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Unlock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-slab font-semibold text-card-foreground">Buy Unlocks</h3>
                <p className="text-xs text-muted-foreground">Get more contact unlocks</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </div>
          </Link>
        </div>

        {/* Analytics Overview */}
        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-slab text-lg font-bold text-card-foreground">Your Fleet Overview</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Vehicle Type</p>
              <p className="font-semibold text-card-foreground">{profile.vehicle_type ?? "Not set"}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Experience</p>
              <p className="font-semibold text-card-foreground">{profile.experience ?? "Not set"}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Profile Views</p>
              <p className="font-semibold text-card-foreground">Coming soon</p>
            </div>
          </div>
        </div>

        {/* Recent Unlocked Drivers */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-slab text-lg font-bold text-card-foreground mb-4">Recently Unlocked Drivers</h2>
          {recentUnlocks && recentUnlocks.length > 0 ? (
            <div className="space-y-3">
              {recentUnlocks.map((unlock: any) => (
                <div key={unlock.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <span className="text-xl">{unlock.profiles?.avatar_emoji ?? "👤"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-card-foreground truncate">{unlock.profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {unlock.profiles?.city} · {unlock.profiles?.experience ?? "N/A"} experience
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-card-foreground">{unlock.profiles?.phone}</p>
                    <p className="text-xs text-muted-foreground">{unlock.profiles?.vehicle_type ?? "General"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No drivers unlocked yet. Start browsing!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
