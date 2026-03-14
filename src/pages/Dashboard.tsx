import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import OwnerDashboard from "./OwnerDashboard";
import DriverDashboard from "./DriverDashboard";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!profile) return <Navigate to="/" replace />;

  return profile.role === "owner" ? <OwnerDashboard /> : <DriverDashboard />;
};

export default Dashboard;
