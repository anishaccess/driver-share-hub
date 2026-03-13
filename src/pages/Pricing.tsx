import Navbar from "@/components/Navbar";
import PricingCard from "@/components/PricingCard";
import { toast } from "sonner";

const Pricing = () => {
  const handleSelect = (plan: string) => {
    toast.info(`Payment integration coming soon for ${plan} plan!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-slab text-3xl font-bold text-foreground mb-2">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground">Pay per unlock. No hidden fees. Cancel anytime.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          <PricingCard
            title="Starter Pack"
            unlocks={10}
            price={299}
            features={["10 contact unlocks", "View all profiles", "Search & filter", "Valid for 30 days"]}
            onSelect={() => handleSelect("Starter")}
          />
          <PricingCard
            title="Pro Pack"
            unlocks={20}
            price={499}
            popular
            features={["20 contact unlocks", "View all profiles", "Search & filter", "Priority support", "Valid for 60 days"]}
            onSelect={() => handleSelect("Pro")}
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
