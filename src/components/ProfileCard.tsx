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
    <div className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
          <span className="text-2xl">{avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-slab font-semibold text-card-foreground truncate">{name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${type === "driver" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent"}`}>
              {type === "driver" ? "Driver" : "Owner"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1"><Truck className="h-3 w-3" />{vehicleType}</span>
            <span>{experience} exp</span>
            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-accent fill-accent" />{rating}</span>
          </div>
          {unlocked ? (
            <div className="text-sm bg-secondary rounded p-2">
              <p className="font-medium text-foreground">📞 +91 98765-XXXXX</p>
            </div>
          ) : (
            <Button size="sm" onClick={onUnlock} className="w-full gap-1.5">
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
