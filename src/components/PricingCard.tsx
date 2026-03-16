import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  title: string;
  unlocks: number;
  price: number;
  features: string[];
  popular?: boolean;
  onSelect: () => void;
}

const PricingCard = ({ title, unlocks, price, features, popular, onSelect }: PricingCardProps) => {
  return (
    <div className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${popular ? "gradient-hero text-white elevated-shadow ring-2 ring-accent/30" : "bg-card border border-border/50 premium-shadow"}`}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-accent text-accent-foreground text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 accent-glow">
          <Sparkles className="h-3 w-3" /> Most Popular
        </span>
      )}
      <h3 className={`font-display text-xl font-bold ${popular ? "text-white" : "text-card-foreground"}`}>{title}</h3>
      <p className={`text-sm mt-1 ${popular ? "text-white/60" : "text-muted-foreground"}`}>{unlocks} contact unlocks</p>
      <div className="my-6">
        <span className={`font-display text-4xl font-bold ${popular ? "text-white" : "text-foreground"}`}>₹{price}</span>
        <span className={`text-sm ${popular ? "text-white/50" : "text-muted-foreground"}`}> /pack</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className={`flex items-center gap-2.5 text-sm ${popular ? "text-white/80" : "text-muted-foreground"}`}>
            <Check className={`h-4 w-4 shrink-0 ${popular ? "text-accent" : "text-primary"}`} />
            {f}
          </li>
        ))}
      </ul>
      <Button 
        onClick={onSelect} 
        className={`w-full h-12 font-bold text-base ${popular ? "gradient-accent text-accent-foreground accent-glow hover:opacity-90" : ""}`}
        variant={popular ? "default" : "default"}
      >
        Buy Now
      </Button>
    </div>
  );
};

export default PricingCard;
