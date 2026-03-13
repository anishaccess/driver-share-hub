import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Truck, Users, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Truck className="h-4 w-4" />
            India's Trucking Network
          </div>
          <h1 className="font-slab text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Connect Truck Owners with Verified Drivers
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find the right driver or vehicle owner instantly. Browse profiles, unlock contacts, and get moving.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/browse">
              <Button size="lg" className="gap-2">
                Browse Profiles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-card">
        <div className="container mx-auto px-4 py-16">
          <h2 className="font-slab text-2xl font-bold text-center text-card-foreground mb-10">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              { icon: Users, title: "Browse Profiles", desc: "Search drivers and truck owners by location, vehicle type, and experience." },
              { icon: Shield, title: "Unlock Contacts", desc: "Purchase an unlock pack and get direct phone numbers instantly." },
              { icon: Truck, title: "Get Moving", desc: "Connect directly, negotiate terms, and start your journey." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-slab font-semibold text-card-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-slab text-2xl font-bold text-foreground mb-3">Ready to find your next driver or vehicle?</h2>
        <p className="text-muted-foreground mb-6">Start with just ₹299 for 10 contact unlocks.</p>
        <Link to="/pricing">
          <Button size="lg" className="bg-accent hover:bg-accent/90 gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <span className="font-slab font-semibold text-foreground">TrukConnect</span>
          </div>
          <p>© 2026 TrukConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
