import { Truck, Users, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => (
  <nav className="border-b bg-card">
    <div className="container mx-auto flex items-center justify-between py-3 px-4">
      <Link to="/" className="flex items-center gap-2">
        <Truck className="h-7 w-7 text-primary" />
        <span className="font-slab text-xl font-bold text-foreground">TrukConnect</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Find Drivers
        </Link>
        <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Pricing
        </Link>
        <Link to="/browse">
          <Button size="sm">Get Started</Button>
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
