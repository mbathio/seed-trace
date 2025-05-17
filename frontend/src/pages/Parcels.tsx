
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Parcel, UserRole, MOCK_USERS } from "@/utils/seedTypes";

// Mock data for parcels
const MOCK_PARCELS: Parcel[] = [
  {
    id: 1,
    location: { lat: 16.4818, lng: -15.6587 },
    area: 5.2,
    soilType: "Limoneux",
    status: "available"
  },
  {
    id: 2,
    location: { lat: 16.4932, lng: -15.6721 },
    area: 3.8,
    soilType: "Argileux",
    status: "in-use"
  },
  {
    id: 3,
    location: { lat: 16.5023, lng: -15.6498 },
    area: 4.5,
    soilType: "Sableux",
    status: "resting"
  },
  {
    id: 4,
    location: { lat: 16.4753, lng: -15.6692 },
    area: 6.1,
    soilType: "Limoneux-argileux",
    status: "available"
  },
  {
    id: 5,
    location: { lat: 16.4891, lng: -15.6832 },
    area: 2.9,
    soilType: "Sableux-limoneux",
    status: "in-use"
  }
];

const ParcelStatusBadge = ({ status }: { status: Parcel["status"] }) => {
  const statusConfig = {
    "available": { label: "Disponible", className: "bg-green-500" },
    "in-use": { label: "En utilisation", className: "bg-blue-500" },
    "resting": { label: "En jachère", className: "bg-amber-500" }
  };

  return (
    <Badge className={statusConfig[status].className}>
      {statusConfig[status].label}
    </Badge>
  );
};

const Parcels = () => {
  // Simuler un utilisateur connecté avec le rôle "manager"
  const userRole: UserRole = "manager";
  const userName = MOCK_USERS.find(user => user.role === userRole)?.name || "";
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filtrer les parcelles en fonction de l'onglet actif
  const filteredParcels = activeTab === "all" 
    ? MOCK_PARCELS 
    : MOCK_PARCELS.filter(parcel => parcel.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} userName={userName} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 ml-64">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Gestion des Parcelles</h1>
            <p className="text-gray-600">
              Suivi et gestion des parcelles pour la production de semences
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="available">Disponibles</TabsTrigger>
                <TabsTrigger value="in-use">En utilisation</TabsTrigger>
                <TabsTrigger value="resting">En jachère</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="ml-4 bg-isra-green hover:bg-isra-green-dark">
              Ajouter une parcelle
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParcels.map((parcel) => (
              <Card key={parcel.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Parcelle #{parcel.id}</CardTitle>
                    <ParcelStatusBadge status={parcel.status} />
                  </div>
                  <CardDescription>
                    Coordonnées: {parcel.location.lat.toFixed(4)}, {parcel.location.lng.toFixed(4)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Superficie:</span>
                      <span className="font-medium">{parcel.area} hectares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type de sol:</span>
                      <span className="font-medium">{parcel.soilType}</span>
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
        </main>
      </div>
    </div>
  );
};

export default Parcels;
