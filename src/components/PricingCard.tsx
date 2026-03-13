import { Check } from "lucide-react";
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
    <div className={`relative rounded-lg border p-6 ${popular ? "border-accent shadow-lg ring-2 ring-accent/20" : "bg-card"}`}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="font-slab text-lg font-bold text-card-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1">{unlocks} contact unlocks</p>
      <div className="my-4">
        <span className="font-slab text-3xl font-bold text-foreground">₹{price}</span>
        <span className="text-muted-foreground text-sm"> /pack</span>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Button onClick={onSelect} className={`w-full ${popular ? "bg-accent hover:bg-accent/90" : ""}`}>
        Buy Now
      </Button>
    </div>
  );
};

export default PricingCard;
