import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  UserRole,
  MOCK_USERS,
  MOCK_MULTIPLIERS,
  MultiplierStatus,
  CertificationLevel,
} from "@/utils/seedTypes";

const StatusBadge = ({ status }: { status: MultiplierStatus }) => {
  const statusConfig = {
    ACTIVE: { label: "Actif", className: "bg-green-500" },
    INACTIVE: { label: "Inactif", className: "bg-gray-500" },
  };

  return (
    <Badge className={statusConfig[status].className}>
      {statusConfig[status].label}
    </Badge>
  );
};

const CertificationBadge = ({ level }: { level: CertificationLevel }) => {
  const levelConfig = {
    BEGINNER: { label: "Débutant", className: "bg-blue-500" },
    INTERMEDIATE: { label: "Intermédiaire", className: "bg-yellow-500" },
    EXPERT: { label: "Expert", className: "bg-purple-500" },
  };

  return (
    <Badge className={levelConfig[level].className}>
      {levelConfig[level].label}
    </Badge>
  );
};

const Multipliers = () => {
  // Simuler un utilisateur connecté avec le rôle "manager"
  const userRole: UserRole = "MANAGER";
  const userName =
    MOCK_USERS.find((user) => user.role === userRole)?.name || "";
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtrer les multiplicateurs en fonction de l'onglet actif et de la recherche
  const filteredMultipliers = MOCK_MULTIPLIERS.filter((multiplier) => {
    const matchesTab = activeTab === "all" || multiplier.status === activeTab;
    const matchesSearch =
      multiplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      multiplier.latitude.toString().includes(searchQuery) ||
      multiplier.longitude.toString().includes(searchQuery) ||
      multiplier.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (multiplier.email &&
        multiplier.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (multiplier.phone && multiplier.phone.includes(searchQuery)) ||
      multiplier.specialization.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesTab && matchesSearch;
  });

  // Navigate to multiplier detail
  const handleViewMultiplierDetail = (multiplierId: number) => {
    navigate(`/multipliers/${multiplierId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} userName={userName} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 ml-64">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestion des Multiplicateurs</h1>
            <p className="text-gray-600">
              Suivi et gestion des multiplicateurs de semences
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="ACTIVE">Actifs</TabsTrigger>
                <TabsTrigger value="INACTIVE">Inactifs</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <Input
                placeholder="Rechercher un multiplicateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64"
              />
              <Button className="bg-isra-green hover:bg-isra-green-dark">
                Ajouter un multiplicateur
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMultipliers.map((multiplier) => (
              <Card key={multiplier.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{multiplier.name}</CardTitle>
                    <StatusBadge status={multiplier.status} />
                  </div>
                  <CardDescription>
                    {multiplier.address} • Spécialisation:{" "}
                    {multiplier.specialization.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expérience:</span>
                      <span className="font-medium">
                        {multiplier.yearsExperience} ans
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Certification:
                      </span>
                      <CertificationBadge
                        level={multiplier.certificationLevel}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parcelles:</span>
                      <span className="font-medium">
                        {multiplier.parcels?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Contrats actifs:
                      </span>
                      <span className="font-medium">
                        {multiplier.contracts?.filter(
                          (c) => c.status === "ACTIVE"
                        ).length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewMultiplierDetail(multiplier.id)}
                    >
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMultipliers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucun multiplicateur trouvé</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Multipliers;
