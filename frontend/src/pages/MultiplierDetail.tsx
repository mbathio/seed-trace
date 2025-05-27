import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserRole,
  MOCK_USERS,
  MOCK_MULTIPLIERS,
  MOCK_PARCELS,
  MOCK_SEED_LOTS,
  MOCK_VARIETIES,
} from "@/utils/seedTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  Award,
  Calendar,
  FileText,
  Crop,
} from "lucide-react";

const MultiplierDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = id ? parseInt(id) : 0;

  // Find multiplier by ID
  const multiplier = MOCK_MULTIPLIERS.find((m) => m.id === numericId);

  // Simulate a user with manager role
  const userRole: UserRole = "MANAGER";
  const userName =
    MOCK_USERS.find((user) => user.role === userRole)?.name || "";

  const [activeTab, setActiveTab] = useState("overview");
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [newContract, setNewContract] = useState({
    startDate: "",
    endDate: "",
    seedLevel: "G3" as const,
    varietyId: "1",
    quantity: "0",
  });

  // Handle contract form input change
  const handleContractChange = (field: string, value: string) => {
    setNewContract((prev) => ({ ...prev, [field]: value }));
  };

  // Handle contract form submission
  const handleContractSubmit = () => {
    toast.success(`Nouveau contrat créé avec ${multiplier?.name}`);
    setIsContractDialogOpen(false);
  };

  // If multiplier doesn't exist, show error
  if (!multiplier) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar userRole={userRole} userName={userName} />
        <div className="flex">
          <Sidebar userRole={userRole} />
          <main className="flex-1 p-6 ml-64">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => navigate("/multipliers")}
              >
                Retour
              </Button>
              <h1 className="text-2xl font-bold">Multiplicateur non trouvé</h1>
            </div>
            <p>Le multiplicateur demandé n'existe pas.</p>
          </main>
        </div>
      </div>
    );
  }

  // Find parcels associated with this multiplier
  const multiplierParcels = multiplier.parcels
    ? MOCK_PARCELS.filter((p) => {
        if (!multiplier.parcels) return false;
        return multiplier.parcels.some((parcelRef) =>
          typeof parcelRef === "number"
            ? parcelRef === p.id
            : parcelRef.id === p.id
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} userName={userName} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 ml-64">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => navigate("/multipliers")}>
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{multiplier.name}</h1>
              <p className="text-gray-600">
                ID: {multiplier.id} • {multiplier.latitude.toFixed(4)},{" "}
                {multiplier.longitude.toFixed(4)}
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <Dialog
                open={isContractDialogOpen}
                onOpenChange={setIsContractDialogOpen}
              >
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      Nouveau Contrat avec {multiplier.name}
                    </DialogTitle>
                    <DialogDescription>
                      Créez un nouveau contrat de multiplication de semences
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newContract.startDate}
                          onChange={(e) =>
                            handleContractChange("startDate", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newContract.endDate}
                          onChange={(e) =>
                            handleContractChange("endDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="varietyId">Variété</Label>
                      <Select
                        value={newContract.varietyId}
                        onValueChange={(value) =>
                          handleContractChange("varietyId", value)
                        }
                      >
                        <SelectTrigger id="varietyId">
                          <SelectValue placeholder="Sélectionner une variété" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_VARIETIES.map((variety) => (
                            <SelectItem
                              key={variety.id}
                              value={variety.id.toString()}
                            >
                              {variety.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="seedLevel">Niveau de semence</Label>
                        <Select
                          value={newContract.seedLevel}
                          onValueChange={(value: string) =>
                            handleContractChange("seedLevel", value)
                          }
                        >
                          <SelectTrigger id="seedLevel">
                            <SelectValue placeholder="Sélectionner un niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="G3">G3</SelectItem>
                            <SelectItem value="G4">G4</SelectItem>
                            <SelectItem value="R1">R1</SelectItem>
                            <SelectItem value="R2">R2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantité (kg)</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newContract.quantity}
                          onChange={(e) =>
                            handleContractChange("quantity", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      className="bg-isra-green hover:bg-isra-green-dark"
                      onClick={handleContractSubmit}
                    >
                      Créer le contrat
                    </Button>
                  </DialogFooter>
                </DialogContent>
                <Button
                  className="bg-isra-green hover:bg-isra-green-dark"
                  onClick={() => setIsContractDialogOpen(true)}
                >
                  Nouveau Contrat
                </Button>
              </Dialog>
              <Button variant="outline">Modifier</Button>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="contracts">Contrats</TabsTrigger>
              <TabsTrigger value="parcels">Parcelles</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={
                          multiplier.status === "ACTIVE"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }
                      >
                        {multiplier.status === "ACTIVE" ? "ACTIVE" : "Inactif"}
                      </Badge>
                      <Badge className="bg-blue-500">
                        {multiplier.specialization.join(", ")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{multiplier.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{multiplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{multiplier.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span>
                          Certification:{" "}
                          {
                            {
                              beginner: "Débutant",
                              intermediate: "Intermédiaire",
                              expert: "Expert",
                            }[multiplier.certificationLevel]
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {multiplier.yearsExperience} ans d'expérience
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Résumé de performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {multiplier.history && (
                        <>
                          <div>
                            <h3 className="font-medium mb-2">
                              Production récente
                            </h3>
                            <div className="space-y-2">
                              {multiplier.history.map((record, index) => {
                                const variety = MOCK_VARIETIES.find(
                                  (v) => v.id === record.varietyId
                                );
                                return (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center"
                                  >
                                    <div>
                                      <span className="font-medium">
                                        {record.season} {record.year}
                                      </span>
                                      <span className="text-sm text-gray-500 ml-2">
                                        {variety?.name} ({record.level})
                                      </span>
                                    </div>
                                    <div>
                                      <Badge
                                        className={
                                          record.qualityScore >= 90
                                            ? "bg-green-500"
                                            : record.qualityScore >= 80
                                            ? "bg-amber-500"
                                            : "bg-red-500"
                                        }
                                      >
                                        Qualité: {record.qualityScore}%
                                      </Badge>
                                      <span className="ml-2">
                                        {record.quantity} kg
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {multiplier.contracts && multiplier.contracts.length > 0 && (
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>Contrats actifs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {multiplier.contracts
                          .filter((c) => c.status === "ACTIVE")
                          .map((contract) => {
                            const variety = MOCK_VARIETIES.find(
                              (v) => v.id === contract.varietyId
                            );
                            return (
                              <div
                                key={contract.id}
                                className="flex justify-between items-center border-b border-gray-100 pb-3"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">
                                      Contrat #{contract.id}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {variety?.name} • Niveau{" "}
                                    {contract.seedLevel} • {contract.quantity}{" "}
                                    kg
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">
                                    Du{" "}
                                    {new Date(
                                      contract.startDate
                                    ).toLocaleDateString()}{" "}
                                    au{" "}
                                    {new Date(
                                      contract.endDate
                                    ).toLocaleDateString()}
                                  </div>
                                  <Badge className="bg-green-500">Actif</Badge>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {multiplierParcels.length > 0 && (
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>Parcelles associées</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {multiplierParcels.map((parcel) => (
                          <div
                            key={parcel.id}
                            className="flex justify-between items-center border-b border-gray-100 pb-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <Crop className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">
                                  {parcel.name || `Parcelle #${parcel.id}`}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {parcel.area} hectares • {parcel.soilType}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={
                                  parcel.status === "AVAILABLE"
                                    ? "bg-green-500"
                                    : parcel.status === "IN_USE"
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                                }
                              >
                                {parcel.status === "AVAILABLE"
                                  ? "Disponible"
                                  : parcel.status === "IN_USE"
                                  ? "En utilisation"
                                  : "En jachère"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4 mt-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Contrats de multiplication
                </h2>
                <Button
                  className="bg-isra-green hover:bg-isra-green-dark"
                  onClick={() => setIsContractDialogOpen(true)}
                >
                  Nouveau Contrat
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  {multiplier.contracts && multiplier.contracts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">ID</th>
                            <th className="text-left py-3 px-4">Variété</th>
                            <th className="text-left py-3 px-4">Niveau</th>
                            <th className="text-left py-3 px-4">Quantité</th>
                            <th className="text-left py-3 px-4">Dates</th>
                            <th className="text-left py-3 px-4">Statut</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {multiplier.contracts.map((contract) => {
                            const variety = MOCK_VARIETIES.find(
                              (v) => v.id === contract.varietyId
                            );
                            return (
                              <tr key={contract.id} className="border-b">
                                <td className="py-3 px-4">{contract.id}</td>
                                <td className="py-3 px-4">{variety?.name}</td>
                                <td className="py-3 px-4">
                                  {contract.seedLevel}
                                </td>
                                <td className="py-3 px-4">
                                  {contract.quantity} kg
                                </td>
                                <td className="py-3 px-4">
                                  {new Date(
                                    contract.startDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    contract.endDate
                                  ).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                  <Badge
                                    className={
                                      contract.status === "DRAFT"
                                        ? "bg-gray-500"
                                        : contract.status === "ACTIVE"
                                        ? "bg-green-500"
                                        : contract.status === "COMPLETED"
                                        ? "bg-blue-500"
                                        : "bg-red-500"
                                    }
                                  >
                                    {contract.status === "DRAFT"
                                      ? "Brouillon"
                                      : contract.status === "ACTIVE"
                                      ? "Actif"
                                      : contract.status === "COMPLETED"
                                      ? "Terminé"
                                      : "Résilié"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                      Détails
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Modifier
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        Aucun contrat pour ce multiplicateur
                      </p>
                      <Button
                        className="bg-isra-green hover:bg-isra-green-dark mt-4"
                        onClick={() => setIsContractDialogOpen(true)}
                      >
                        Ajouter un contrat
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parcels" className="space-y-4 mt-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Parcelles du multiplicateur
                </h2>
                <Button className="bg-isra-green hover:bg-isra-green-dark">
                  Ajouter une parcelle
                </Button>
              </div>

              {multiplierParcels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {multiplierParcels.map((parcel) => (
                    <Card key={parcel.id}>
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle>
                            {parcel.name || `Parcelle #${parcel.id}`}
                          </CardTitle>
                          <Badge
                            className={
                              parcel.status === "AVAILABLE"
                                ? "bg-green-500"
                                : parcel.status === "IN_USE"
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }
                          >
                            {parcel.status === "AVAILABLE"
                              ? "Disponible"
                              : parcel.status === "IN_USE"
                              ? "En utilisation"
                              : "En jachère"}
                          </Badge>
                        </div>
                        <CardDescription>
                          {parcel.location.lat.toFixed(4)},{" "}
                          {parcel.location.lng.toFixed(4)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
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
                        {parcel.previousCrops &&
                          parcel.previousCrops.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">
                                Cultures précédentes:
                              </h4>
                              <ul className="text-sm space-y-1">
                                {parcel.previousCrops.map((crop, index) => (
                                  <li key={index}>
                                    {crop.crop} - {crop.season} {crop.year}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Voir détails
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    Aucune parcelle associée à ce multiplicateur
                  </p>
                  <Button className="bg-isra-green hover:bg-isra-green-dark mt-4">
                    Ajouter une parcelle
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique de production</CardTitle>
                  <CardDescription>
                    Résultats des saisons précédentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {multiplier.history && multiplier.history.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Saison</th>
                            <th className="text-left py-3 px-4">Variété</th>
                            <th className="text-left py-3 px-4">Niveau</th>
                            <th className="text-left py-3 px-4">Quantité</th>
                            <th className="text-left py-3 px-4">
                              Score qualité
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {multiplier.history.map((record, index) => {
                            const variety = MOCK_VARIETIES.find(
                              (v) => v.id === record.varietyId
                            );
                            return (
                              <tr key={index} className="border-b">
                                <td className="py-3 px-4">
                                  {record.season} {record.year}
                                </td>
                                <td className="py-3 px-4">{variety?.name}</td>
                                <td className="py-3 px-4">{record.level}</td>
                                <td className="py-3 px-4">
                                  {record.quantity} kg
                                </td>
                                <td className="py-3 px-4">
                                  <Badge
                                    className={
                                      record.qualityScore >= 90
                                        ? "bg-green-500"
                                        : record.qualityScore >= 80
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                    }
                                  >
                                    {record.qualityScore}%
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">
                        Aucun historique de production disponible
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MultiplierDetail;
