import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Truck, Users, Shield, ArrowRight, CheckCircle2, Zap, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(38,95%,54%,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(222,55%,40%,0.3),transparent_60%)]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full px-5 py-2 text-sm font-semibold mb-8 border border-white/10 animate-fade-up">
              <Zap className="h-4 w-4 text-accent" />
              India's Premier Trucking Network
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Connect with{" "}
              <span className="text-gradient-gold">Verified Drivers</span>{" "}
              Across India
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
              The trusted platform connecting truck owners with experienced, verified drivers — fast and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/signup?role=owner">
                <Button size="lg" className="gradient-accent text-accent-foreground font-bold px-8 h-13 text-base accent-glow hover:opacity-90 transition-opacity w-full sm:w-auto">
                  I Own Trucks <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
              <Link to="/signup?role=driver">
                <Button size="lg" variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10 font-bold px-8 h-13 text-base backdrop-blur-sm w-full sm:w-auto">
                  I'm a Driver <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 40 720 40C360 40 0 0 0 0L0 60Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-4 relative z-10">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { value: "10K+", label: "Active Drivers" },
            { value: "5K+", label: "Truck Owners" },
            { value: "50+", label: "Cities Covered" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center rounded-xl bg-card p-5 premium-shadow border border-border/50">
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">Three simple steps to connect with the right people</p>
        </div>
        <div className="grid gap-6 md:gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
          {[
            { icon: Users, title: "Browse Profiles", desc: "Search drivers and truck owners by location, vehicle type, and experience.", step: "01" },
            { icon: Shield, title: "Unlock Contacts", desc: "Purchase an unlock pack and get direct phone numbers instantly.", step: "02" },
            { icon: Truck, title: "Get Moving", desc: "Connect directly, negotiate terms, and start your journey.", step: "03" },
          ].map(({ icon: Icon, title, desc, step }) => (
            <div key={title} className="group rounded-2xl bg-card border border-border/50 p-8 premium-shadow hover:elevated-shadow transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-bold text-accent tracking-widest uppercase">Step {step}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-card-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-card border-y border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">Why Choose TrukConnect?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">We verify every driver profile so you can hire with confidence. Our platform ensures safety, reliability, and transparency.</p>
                <Link to="/browse">
                  <Button className="gap-2 font-semibold">
                    <Globe className="h-4 w-4" /> Explore Profiles
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  "License & ID verified drivers",
                  "Direct contact — no middlemen",
                  "Transparent pricing, no hidden fees",
                  "Ratings & reviews from real owners",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-background p-4">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-xl mx-auto gradient-hero rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(38,95%,54%,0.1),transparent_70%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to Get Started?</h2>
            <p className="text-white/60 mb-8">Join thousands of truck owners and drivers across India.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup?role=owner">
                <Button size="lg" className="gradient-accent text-accent-foreground font-bold px-8 accent-glow w-full sm:w-auto">
                  Get Started Free <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10 font-bold w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">TrukConnect</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/browse" className="hover:text-foreground transition-colors">Browse</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 TrukConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
