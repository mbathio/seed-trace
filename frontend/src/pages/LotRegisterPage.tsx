import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import LotRegistration from "@/components/seeds/LotRegistration";
import { User } from "@/utils/seedTypes";
import { toast } from "sonner";

const LotRegisterPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("isra_user");
    if (!storedUser) {
      toast.error("Veuillez vous connecter pour accéder à cette page");
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;

      // Check if user has the right permissions
      const allowedRoles = ["RESEARCHER", "TECHNICIAN", "ADMIN"];
      if (!allowedRoles.includes(parsedUser.role)) {
        toast.error(
          "Vous n'avez pas les permissions nécessaires pour cette page"
        );
        navigate("/dashboard");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem("isra_user");
      toast.error("Session invalide, veuillez vous reconnecter");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={user.role} userName={user.name} />
      <div className="flex pt-16">
        <Sidebar userRole={user.role} />
        <main className="flex-1 ml-0 md:ml-64 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-isra-green-dark">
              Enregistrement d'un Lot
            </h1>
            <p className="text-gray-500">
              Créez un nouveau lot de semences dans le système
            </p>
          </div>

          <LotRegistration />
        </main>
      </div>
    </div>
  );
};

export default LotRegisterPage;
