import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { UserRole, MOCK_USERS } from "@/utils/seedTypes";

// Mock data for multipliers
const MOCK_MULTIPLIERS = [
  {
    id: 1,
    name: "Moussa Diop",
    location: "Dagana",
    specialization: "Riz",
    yearsExperience: 8,
    status: "active" as MultiplierStatus,
    certificationLevel: "expert" as CertificationLevel
  },
  {
    id: 2,
    name: "Fatou Sow",
    location: "Richard-Toll",
    specialization: "Arachide",
    yearsExperience: 5,
    status: "active" as MultiplierStatus,
    certificationLevel: "intermediate" as CertificationLevel
  },
  {
    id: 3,
    name: "Amadou Ndiaye",
    location: "Podor",
    specialization: "Riz",
    yearsExperience: 12,
    status: "inactive" as MultiplierStatus,
    certificationLevel: "expert" as CertificationLevel
  },
  {
    id: 4,
    name: "Aissatou Ba",
    location: "Saint-Louis",
    specialization: "Maïs",
    yearsExperience: 3,
    status: "active" as MultiplierStatus,
    certificationLevel: "beginner" as CertificationLevel
  },
  {
    id: 5,
    name: "Ibrahima Fall",
    location: "Matam",
    specialization: "Sorgho",
    yearsExperience: 7,
    status: "active" as MultiplierStatus,
    certificationLevel: "intermediate" as CertificationLevel
  }
];

type MultiplierStatus = "active" | "inactive";
type CertificationLevel = "beginner" | "intermediate" | "expert";

interface Multiplier {
  id: number;
  name: string;
  location: string;
  specialization: string;
  yearsExperience: number;
  status: MultiplierStatus;
  certificationLevel: CertificationLevel;
}

const StatusBadge = ({ status }: { status: MultiplierStatus }) => {
  const statusConfig = {
    "active": { label: "Actif", className: "bg-green-500" },
    "inactive": { label: "Inactif", className: "bg-gray-500" },
  };

  return (
    <Badge className={statusConfig[status].className}>
      {statusConfig[status].label}
    </Badge>
  );
};

const CertificationBadge = ({ level }: { level: CertificationLevel }) => {
  const levelConfig = {
    "beginner": { label: "Débutant", className: "bg-blue-500" },
    "intermediate": { label: "Intermédiaire", className: "bg-yellow-500" },
    "expert": { label: "Expert", className: "bg-purple-500" },
  };

  return (
    <Badge className={levelConfig[level].className}>
      {levelConfig[level].label}
    </Badge>
  );
};

const Multipliers = () => {
  // Simuler un utilisateur connecté avec le rôle "manager"
  const userRole: UserRole = "manager";
  const userName = MOCK_USERS.find(user => user.role === userRole)?.name || "";
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtrer les multiplicateurs en fonction de l'onglet actif et de la recherche
  const filteredMultipliers = MOCK_MULTIPLIERS.filter(multiplier => {
    const matchesTab = activeTab === "all" || multiplier.status === activeTab;
    const matchesSearch = multiplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          multiplier.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          multiplier.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

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
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="active">Actifs</TabsTrigger>
                <TabsTrigger value="inactive">Inactifs</TabsTrigger>
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
                    {multiplier.location} • Spécialisation: {multiplier.specialization}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expérience:</span>
                      <span className="font-medium">{multiplier.yearsExperience} ans</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Certification:</span>
                      <CertificationBadge level={multiplier.certificationLevel} />
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
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
