import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ParcelMap from "@/components/parcels/ParcelMap";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Parcel, UserRole, MOCK_USERS, MOCK_PARCELS } from "@/utils/seedTypes";
import { MapPin, Ruler, Crop } from "lucide-react";

const ParcelStatusBadge = ({ status }: { status: Parcel["status"] }) => {
  const statusConfig = {
    available: { label: "Disponible", className: "bg-green-500" },
    "in-use": { label: "En utilisation", className: "bg-blue-500" },
    resting: { label: "En jachère", className: "bg-amber-500" },
  };

  return (
    <Badge className={statusConfig[status].className}>
      {statusConfig[status].label}
    </Badge>
  );
};

const Parcels = () => {
  // Simuler un utilisateur connecté avec le rôle "manager"
  const userRole: UserRole = "MANAGER"; //
  const userName =
    MOCK_USERS.find((user) => user.role === userRole)?.name || "";
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSoilType, setFilterSoilType] = useState("all");
  const [selectedParcelId, setSelectedParcelId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");

  // Filtrer les parcelles en fonction de l'onglet actif et de la recherche
  const filteredParcels = MOCK_PARCELS.filter((parcel) => {
    const matchesStatus = activeTab === "all" || parcel.status === activeTab;
    const matchesSearch =
      !searchTerm ||
      (parcel.name &&
        parcel.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      parcel.id.toString().includes(searchTerm);
    const matchesSoilType =
      filterSoilType === "all" || parcel.soilType === filterSoilType;

    return matchesStatus && matchesSearch && matchesSoilType;
  });

  // Get unique soil types for filter
  const soilTypes = [
    "all",
    ...new Set(
      MOCK_PARCELS.filter((p) => p.soilType).map((p) => p.soilType as string)
    ),
  ];

  // Handle parcel selection in map
  const handleParcelSelect = (parcelId: number) => {
    setSelectedParcelId(parcelId);
  };

  // Navigate to parcel detail
  const handleViewParcelDetail = (parcelId: number) => {
    navigate(`/parcels/${parcelId}`);
  };

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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="available">Disponibles</TabsTrigger>
                <TabsTrigger value="in-use">En utilisation</TabsTrigger>
                <TabsTrigger value="resting">En jachère</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                onClick={() => setViewMode("cards")}
                className={
                  viewMode === "cards"
                    ? "bg-isra-green hover:bg-isra-green-dark"
                    : ""
                }
              >
                Cartes
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                onClick={() => setViewMode("map")}
                className={
                  viewMode === "map"
                    ? "bg-isra-green hover:bg-isra-green-dark"
                    : ""
                }
              >
                Carte
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une parcelle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={filterSoilType} onValueChange={setFilterSoilType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de sol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types de sol</SelectItem>
                  {soilTypes
                    .filter((s) => s !== "all")
                    .map((soilType) => (
                      <SelectItem key={soilType} value={soilType}>
                        {soilType}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-isra-green hover:bg-isra-green-dark">
              Ajouter une parcelle
            </Button>
          </div>

          {viewMode === "map" ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <ParcelMap
                    parcels={filteredParcels}
                    selectedParcelId={selectedParcelId}
                    onParcelSelect={handleParcelSelect}
                  />
                </CardContent>
              </Card>

              {selectedParcelId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Parcelle sélectionnée</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const parcel = MOCK_PARCELS.find(
                        (p) => p.id === selectedParcelId
                      );

                      if (!parcel)
                        return <p>Sélectionnez une parcelle sur la carte</p>;

                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">
                                {parcel.name || `Parcelle #${parcel.id}`}
                              </h3>
                              <div className="text-sm text-gray-500 mt-1">
                                {parcel.location.lat.toFixed(6)},{" "}
                                {parcel.location.lng.toFixed(6)}
                              </div>
                            </div>
                            <ParcelStatusBadge status={parcel.status} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Superficie:
                              </span>
                              <span className="font-medium">
                                {parcel.area} hectares
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Type de sol:
                              </span>
                              <span className="font-medium">
                                {parcel.soilType}
                              </span>
                            </div>
                            {parcel.irrigationSystem && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Irrigation:
                                </span>
                                <span className="font-medium">
                                  {parcel.irrigationSystem}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleViewParcelDetail(parcel.id)}
                            >
                              Voir détails
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParcels.map((parcel) => (
                <Card key={parcel.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>
                        {parcel.name || `Parcelle #${parcel.id}`}
                      </CardTitle>
                      <ParcelStatusBadge status={parcel.status} />
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {parcel.location.lat.toFixed(4)},{" "}
                      {parcel.location.lng.toFixed(4)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Ruler className="h-3 w-3 text-gray-500" />
                          <span className="text-muted-foreground">
                            Superficie:
                          </span>
                        </div>
                        <span className="font-medium">
                          {parcel.area} hectares
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Crop className="h-3 w-3 text-gray-500" />
                          <span className="text-muted-foreground">
                            Type de sol:
                          </span>
                        </div>
                        <span className="font-medium">{parcel.soilType}</span>
                      </div>
                      {parcel.irrigationSystem && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Irrigation:
                          </span>
                          <span className="font-medium">
                            {parcel.irrigationSystem}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewParcelDetail(parcel.id)}
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

              {filteredParcels.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">
                    Aucune parcelle ne correspond à vos critères
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Parcels;
