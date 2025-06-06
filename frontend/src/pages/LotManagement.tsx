// frontend/src/pages/LotManagement.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MOCK_SEED_LOTS,
  MOCK_VARIETIES,
  SeedLot,
} from "@/utils/seedTypes";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import QRScanner from "@/components/seeds/QRScanner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus, QrCode, Filter } from "lucide-react";

const LotManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [filteredLots, setFilteredLots] = useState<SeedLot[]>(MOCK_SEED_LOTS);

  useEffect(() => {
    const storedUser = localStorage.getItem("isra_user");
    if (!storedUser) {
      toast.error("Veuillez vous connecter");
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem("isra_user");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Filtrer les lots
    let filtered = MOCK_SEED_LOTS;

    if (searchTerm) {
      filtered = filtered.filter(
        (lot) =>
          lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lot.variety.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((lot) => lot.level === levelFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lot) => lot.status === statusFilter);
    }

    setFilteredLots(filtered);
  }, [searchTerm, levelFilter, statusFilter]);

  const handleScanSuccess = (lotId: string) => {
    const lot = MOCK_SEED_LOTS.find((l) => l.id === lotId);
    if (lot) {
      setSearchTerm(lotId);
      toast.success(`Lot ${lotId} trouvé`);
    } else {
      toast.error(`Lot ${lotId} non trouvé dans la base de données`);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "certified":
        return "success";
      case "in-stock":
        return "default";
      case "pending":
        return "warning";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "certified":
        return "Certifié";
      case "in-stock":
        return "En stock";
      case "pending":
        return "En attente";
      case "rejected":
        return "Rejeté";
      case "sold":
        return "Vendu";
      case "active":
        return "Actif";
      case "distributed":
        return "Distribué";
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Chargement...</p>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-isra-green-dark">
                  Gestion des Lots
                </h1>
                <p className="text-gray-500">Gérez vos lots de semences</p>
              </div>
              {(user.role === "admin" ||
                user.role === "manager" ||
                user.role === "technician") && (
                <Button
                  onClick={() => navigate("/lots/register")}
                  className="bg-isra-green hover:bg-isra-green-dark gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouveau lot
                </Button>
              )}
            </div>
          </div>

          {/* Filtres et recherche */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par ID ou variété..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsScannerOpen(true)}
                  className="gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  Scanner QR
                </Button>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="GO">GO</SelectItem>
                    <SelectItem value="G1">G1</SelectItem>
                    <SelectItem value="G2">G2</SelectItem>
                    <SelectItem value="G3">G3</SelectItem>
                    <SelectItem value="G4">G4</SelectItem>
                    <SelectItem value="R1">R1</SelectItem>
                    <SelectItem value="R2">R2</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="certified">Certifié</SelectItem>
                    <SelectItem value="in-stock">En stock</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                    <SelectItem value="sold">Vendu</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="distributed">Distribué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des lots */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLots.map((lot) => {
              const variety = MOCK_VARIETIES.find(
                (v) => v.id === lot.varietyId
              );
              return (
                <Card
                  key={lot.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/lots/${lot.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{lot.id}</CardTitle>
                        <CardDescription>
                          {variety?.name || lot.variety}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusBadgeVariant(lot.status) as any}>
                        {getStatusLabel(lot.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Niveau:</span>
                        <span className="font-medium">{lot.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Quantité:</span>
                        <span className="font-medium">{lot.quantity} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Date de production:
                        </span>
                        <span className="font-medium">
                          {new Date(lot.productionDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                      {lot.parentLotId && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Lot parent:</span>
                          <span className="font-medium text-isra-green">
                            {lot.parentLotId}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredLots.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">
                  Aucun lot trouvé avec ces critères
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default LotManagement;
