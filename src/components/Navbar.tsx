import { Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Truck className="h-7 w-7 text-primary" />
          <span className="font-slab text-xl font-bold text-foreground">TrukConnect</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Find Profiles
          </Link>
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button size="sm" variant="outline">{profile?.full_name ?? "Dashboard"}</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={signOut}>Logout</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
