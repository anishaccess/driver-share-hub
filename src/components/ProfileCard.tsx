import { MapPin, Star, Truck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  name: string;
  type: "driver" | "owner";
  location: string;
  experience: string;
  vehicleType: string;
  rating: number;
  avatar: string;
  unlocked: boolean;
  onUnlock: () => void;
}

const ProfileCard = ({ name, type, location, experience, vehicleType, rating, avatar, unlocked, onUnlock }: ProfileCardProps) => {
  return (
    <div className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:elevated-shadow hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div className={`h-14 w-14 shrink-0 rounded-xl flex items-center justify-center ${type === "driver" ? "bg-primary/8" : "bg-accent/10"}`}>
          <span className="text-2xl">{avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="font-display font-bold text-card-foreground truncate">{name}</h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${type === "driver" ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent"}`}>
              {type === "driver" ? "Driver" : "Owner"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1 bg-secondary rounded-md px-2 py-1"><Truck className="h-3 w-3" />{vehicleType}</span>
            <span className="bg-secondary rounded-md px-2 py-1">{experience} exp</span>
            <span className="flex items-center gap-1 bg-secondary rounded-md px-2 py-1"><Star className="h-3 w-3 text-accent fill-accent" />{rating}</span>
          </div>
          {unlocked ? (
            <div className="text-sm bg-primary/5 border border-primary/10 rounded-xl p-3">
              <p className="font-semibold text-foreground">📞 +91 98765-XXXXX</p>
            </div>
          ) : (
            <Button size="sm" onClick={onUnlock} className="w-full gap-1.5 font-semibold">
              <Lock className="h-3.5 w-3.5" />
              Unlock Contact
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
