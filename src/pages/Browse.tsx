import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const profiles = [
  { id: 1, name: "Rajesh Kumar", type: "driver" as const, location: "Mumbai, MH", experience: "8 yrs", vehicleType: "16-Wheeler", rating: 4.8, avatar: "👤" },
  { id: 2, name: "Sunil Transporters", type: "owner" as const, location: "Delhi, DL", experience: "12 yrs", vehicleType: "Container Truck", rating: 4.5, avatar: "🏢" },
  { id: 3, name: "Mahesh Singh", type: "driver" as const, location: "Pune, MH", experience: "5 yrs", vehicleType: "10-Wheeler", rating: 4.6, avatar: "👤" },
  { id: 4, name: "Sharma Logistics", type: "owner" as const, location: "Jaipur, RJ", experience: "15 yrs", vehicleType: "Trailer", rating: 4.9, avatar: "🏢" },
  { id: 5, name: "Anil Yadav", type: "driver" as const, location: "Lucknow, UP", experience: "3 yrs", vehicleType: "Mini Truck", rating: 4.3, avatar: "👤" },
  { id: 6, name: "Bharat Transport Co.", type: "owner" as const, location: "Chennai, TN", experience: "20 yrs", vehicleType: "Flatbed", rating: 4.7, avatar: "🏢" },
  { id: 7, name: "Vikram Chauhan", type: "driver" as const, location: "Ahmedabad, GJ", experience: "10 yrs", vehicleType: "Tanker", rating: 4.4, avatar: "👤" },
  { id: 8, name: "Priya Fleet Services", type: "owner" as const, location: "Bangalore, KA", experience: "7 yrs", vehicleType: "Refrigerated", rating: 4.6, avatar: "🏢" },
];

const Browse = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "driver" | "owner">("all");
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set());
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [remainingUnlocks, setRemainingUnlocks] = useState(0);

  const filtered = profiles.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.type === filter;
    return matchSearch && matchFilter;
  });

  const handleUnlock = (id: number) => {
    if (remainingUnlocks > 0) {
      setUnlocked((prev) => new Set(prev).add(id));
      setRemainingUnlocks((r) => r - 1);
      toast.success("Contact unlocked!");
    } else {
      setSelectedProfile(id);
      setShowUnlockModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-slab text-2xl font-bold text-foreground mb-1">Find Drivers & Owners</h1>
          <p className="text-sm text-muted-foreground">
            {remainingUnlocks > 0 ? `${remainingUnlocks} unlocks remaining` : "Buy a plan to unlock contacts"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or location..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            {(["all", "driver", "owner"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm rounded-md border transition-colors ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-secondary"}`}
              >
                {f === "all" ? "All" : f === "driver" ? "Drivers" : "Owners"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProfileCard key={p.id} {...p} unlocked={unlocked.has(p.id)} onUnlock={() => handleUnlock(p.id)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No profiles found matching your search.</p>
        )}
      </div>

      <Dialog open={showUnlockModal} onOpenChange={setShowUnlockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-slab">Unlock Contact Details</DialogTitle>
            <DialogDescription>You have no unlocks remaining. Purchase a plan to unlock driver & owner contacts.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Link to="/pricing" className="flex-1">
              <Button className="w-full bg-accent hover:bg-accent/90">View Plans</Button>
            </Link>
            <Button variant="outline" onClick={() => setShowUnlockModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Browse;
