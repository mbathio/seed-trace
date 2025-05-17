
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import DashboardComponent from "@/components/dashboard/Dashboard";
import { User } from '@/utils/seedTypes';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('isra_user');
    if (!storedUser) {
      toast.error('Veuillez vous connecter pour accéder au tableau de bord');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem('isra_user');
      toast.error('Session invalide, veuillez vous reconnecter');
      navigate('/login');
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
          <DashboardComponent />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
