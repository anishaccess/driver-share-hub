import { Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground tracking-tight">TrukConnect</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/browse" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Find Profiles
          </Link>
          <Link to="/pricing" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button size="sm" variant="outline" className="font-semibold">{profile?.full_name ?? "Dashboard"}</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={signOut} className="text-muted-foreground">Logout</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="font-semibold px-5">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
