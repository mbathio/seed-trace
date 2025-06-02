import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  CloudRain,
  Droplets,
  Leaf,
  LineChart,
  Thermometer,
  Timer,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  Production,
  MOCK_PRODUCTIONS,
  MOCK_SEED_LOTS,
  MOCK_PARCELS,
  MOCK_USERS,
  UserRole,
  Parcel,
  SeedLot,
  ActivityType,
  IssueType,
  IssueSeverity,
} from "@/utils/seedTypes";

  const { id } = useParams<{ id: string }>();
  const productionId = parseInt(id || "1");
  const production = MOCK_PRODUCTIONS.find((p) => p.id === productionId);
  const lot = MOCK_SEED_LOTS.find((l) => l.id === production?.lotId);
  const parcel = production ? MOCK_PARCELS.find((p) => p.id === production.parcelId) : undefined;

  // Simulate user data
  const userRole: UserRole = "TECHNICIAN";
  const userName = MOCK_USERS.find((user) => user.role === userRole)?.name || "";

  // Vérification des conditions après tous les hooks
  if (!production || !lot || !parcel) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Production non trouvée</p>
      </div>
    );
  }

  // Simulate a logged in user with technician role
  

  const [activeTab, setActiveTab] = useState("overview");
  const [newActivity, setNewActivity] = useState({
    type: "SOIL_PREPARATION" as ActivityType,
    date: new Date().toISOString().split("T")[0],
    description: "",
    personnel: [] as string[],
    inputs: [{ name: "", quantity: "", unit: "" }],
    notes: "",
  });

  const [newIssue, setNewIssue] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "DISEASE" as IssueType,
    description: "",
    severity: "MEDIUM" as IssueSeverity,
    actions: "",
    resolved: false,
  });

  const [newWeatherData, setNewWeatherData] = useState({
    date: new Date().toISOString().split("T")[0],
    temperature: "",
    rainfall: "",
    humidity: "",
  });

  // Handle activity form changes
  const handleActivityChange = (field: string, value: any) => {
    setNewActivity((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string | undefined) => {
    return dateString
      ? new Date(dateString).toLocaleDateString()
      : "Non définie";
  };

  // Utilisation:
  <span className="text-xl font-bold">
    {formatDate(production.sowingDate)}
  </span>;

  // Handle input change for activity inputs
  const handleInputChange = (index: number, field: string, value: string) => {
    setNewActivity((prev) => {
      const updatedInputs = [...prev.inputs];
      updatedInputs[index] = { ...updatedInputs[index], [field]: value };
      return { ...prev, inputs: updatedInputs };
    });
  };

  // Add a new input field
  const addInput = () => {
    setNewActivity((prev) => ({
      ...prev,
      inputs: [...prev.inputs, { name: "", quantity: "", unit: "" }],
    }));
  };

  // Remove an input field
  const removeInput = (index: number) => {
    setNewActivity((prev) => {
      const updatedInputs = prev.inputs.filter((_, i) => i !== index);
      return { ...prev, inputs: updatedInputs };
    });
  };

  // Handle issue form changes
  const handleIssueChange = (field: string, value: any) => {
    setNewIssue((prev) => ({ ...prev, [field]: value }));
  };

  // Handle weather data form changes
  const handleWeatherChange = (field: string, value: any) => {
    setNewWeatherData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit handlers
  const handleActivitySubmit = () => {
    // Validate form
    if (!newActivity.date || !newActivity.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    toast.success("Activité enregistrée avec succès");
    // Reset form
    setNewActivity({
      type: "SOIL_PREPARATION" as ActivityType,
      date: new Date().toISOString().split("T")[0],
      description: "",
      personnel: [],
      inputs: [{ name: "", quantity: "", unit: "" }],
      notes: "",
    });
  };

  const handleIssueSubmit = () => {
    // Validate form
    if (!newIssue.date || !newIssue.description || !newIssue.actions) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    toast.success("Problème enregistré avec succès");
    // Reset form
    setNewIssue({
      date: new Date().toISOString().split("T")[0],
      type: "DISEASE" as IssueType,
      description: "",
      severity: "MEDIUM" as IssueSeverity,
      actions: "",
      resolved: false,
    });
  };

  const handleWeatherSubmit = () => {
    // Validate form
    if (
      !newWeatherData.date ||
      !newWeatherData.temperature ||
      !newWeatherData.rainfall ||
      !newWeatherData.humidity
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    toast.success("Données météo enregistrées avec succès");
    // Reset form
    setNewWeatherData({
      date: new Date().toISOString().split("T")[0],
      temperature: "",
      rainfall: "",
      humidity: "",
    });
  };

  // Format production status for display
  const getStatusBadge = (status: Production["status"]) => {
    switch (status) {
      case "PLANNED":
        return <Badge className="bg-blue-500">Planification</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-amber-500">En cours</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-500">Terminée</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  // Format activity type for display
  const getActivityTypeLabel = (type: ActivityType) => {
    switch (type) {
      case "SOIL_PREPARATION":
        return "Préparation du sol";
      case "SOWING":
        return "Semis";
      case "FERTILIZATION":
        return "Fertilisation";
      case "IRRIGATION":
        return "Irrigation";
      case "WEEDING":
        return "Désherbage";
      case "PEST_CONTROL":
        return "Contrôle des nuisibles";
      case "HARVEST":
        return "Récolte";
      default:
        return "Autre";
    }
  };

  // Format issue type for display
  const getIssueTypeLabel = (type: IssueType) => {
    switch (type) {
      case "DISEASE":
        return "Maladie";
      case "PEST":
        return "Nuisible";
      case "WEATHER":
        return "Conditions météo";
      case "MANAGEMENT":
        return "Gestion";
      default:
        return "Autre";
    }
  };

  // Format issue severity for display
  const getIssueSeverityBadge = (severity: IssueSeverity) => {
    switch (severity) {
      case "LOW":
        return <Badge className="bg-green-500">Faible</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-500">Moyenne</Badge>;
      case "HIGH":
        return <Badge className="bg-red-500">Élevée</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };

  if (!production || !lot || !parcel) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Production non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} userName={userName} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 ml-64">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                Production #{production.id}
              </h1>
              <p className="text-gray-600">
                Lot: {production.lotId} • Parcelle:{" "}
                {parcel.name || `#${parcel.id}`}
              </p>
            </div>
            <div>{getStatusBadge(production.status)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Date de semis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-isra-green" />
                  <span className="text-xl font-bold">
  {production.sowingDate 
    ? new Date(production.sowingDate).toLocaleDateString() 
    : "Non définie"}
</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {production.status === "COMPLETED"
                    ? "Date de récolte"
                    : "Récolte prévue"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Timer className="h-5 w-5 mr-2 text-isra-brown" />
                 <span className="text-xl font-bold">
  {production.sowingDate 
    ? new Date(production.sowingDate).toLocaleDateString() 
    : "Non définie"}
</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {production.status === "COMPLETED"
                    ? "Rendement obtenu"
                    : "Production planifiée"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-xl font-bold">
                    {production.status === "COMPLETED" && production.yield
                      ? `${production.yield} kg`
                      : `${production.plannedQuantity || 0} kg (prévu)`}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="activities">Activités</TabsTrigger>
              <TabsTrigger value="issues">Problèmes</TabsTrigger>
              <TabsTrigger value="weather">Données météo</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Détails de la production</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Identifiant</span>
                        <span className="font-medium">#{production.id}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Lot</span>
                        <span className="font-medium">{production.lotId}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Parcelle</span>
                        <span className="font-medium">
                          {parcel.name || `#${parcel.id}`}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Date de semis</span>
                        <span className="font-medium">
                          {production.sowingDate
                            ? new Date(
                                production.sowingDate
                              ).toLocaleDateString()
                            : "Non définie"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Date de récolte</span>
                        <span className="font-medium">
                          {production.sowingDate 
    ? new Date(production.sowingDate).toLocaleDateString() 
    : "Non définie"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">
                          Production planifiée
                        </span>
                        <span className="font-medium">
                          {production.plannedQuantity || 0} kg
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Rendement obtenu</span>
                        <span className="font-medium">
                          {production.yield
                            ? `${production.yield} kg`
                            : "Non disponible"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Statut</span>
                        {getStatusBadge(production.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Progression</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Avancement global</span>
                            <span className="font-medium">
                              {production.status === "PLANNED"
                                ? "10%"
                                : production.status === "IN_PROGRESS"
                                ? "60%"
                                : "100%"}
                            </span>
                          </div>
                          <Progress
                            value={
                              production.status === "PLANNED"
                                ? 10
                                : production.status === "IN_PROGRESS"
                                ? 60
                                : 100
                            }
                            className="h-2"
                          />
                        </div>

                        <div className="pt-4">
                          <h4 className="font-medium mb-2">Étapes clés</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                              <span>Planification</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                              <span>Préparation du terrain</span>
                            </div>
                            <div className="flex items-center">
                              {production.status === "PLANNED" ? (
                                <XCircle className="h-5 w-5 mr-2 text-gray-300" />
                              ) : (
                                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                              )}
                              <span
                                className={
                                  production.status === "PLANNED"
                                    ? "text-gray-500"
                                    : ""
                                }
                              >
                                Semis
                              </span>
                            </div>
                            <div className="flex items-center">
                              {production.status === "COMPLETED" ? (
                                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 mr-2 text-gray-300" />
                              )}
                              <span
                                className={
                                  production.status !== "COMPLETED"
                                    ? "text-gray-500"
                                    : ""
                                }
                              >
                                Récolte
                              </span>
                            </div>
                            <div className="flex items-center">
                              {production.status === "COMPLETED" ? (
                                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 mr-2 text-gray-300" />
                              )}
                              <span
                                className={
                                  production.status !== "COMPLETED"
                                    ? "text-gray-500"
                                    : ""
                                }
                              >
                                Certification
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Informations sur le lot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">
                            Identifiant du lot
                          </span>
                          <span className="font-medium">{lot.id}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Niveau</span>
                          <Badge
                            className={
                              lot.level === "GO"
                                ? "bg-isra-brown"
                                : lot.level === "G1"
                                ? "bg-blue-500"
                                : lot.level === "G2"
                                ? "bg-amber-500"
                                : lot.level === "G3"
                                ? "bg-green-500"
                                : lot.level === "G4"
                                ? "bg-teal-500"
                                : lot.level === "R1"
                                ? "bg-purple-500"
                                : "bg-pink-500"
                            }
                          >
                            {lot.level}
                          </Badge>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">
                            Quantité initiale
                          </span>
                          <span className="font-medium">{lot.quantity} kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activities">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activités enregistrées</CardTitle>
                      <CardDescription>
                        Calendrier des opérations effectuées sur cette
                        production
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {production.activities &&
                      production.activities.length > 0 ? (
                        <div className="relative">
                          <div className="absolute left-5 h-full w-0.5 bg-gray-200"></div>

                          <div className="space-y-8 relative ml-10">
                            {production.activities.map((activity, index) => (
                              <div key={index} className="relative">
                                <div
                                  className={`absolute -left-14 mt-1.5 h-4 w-4 rounded-full border border-white ${
                                    activity.type === "soil_preparation"
                                      ? "bg-isra-brown"
                                      : activity.type === "sowing"
                                      ? "bg-isra-green"
                                      : activity.type === "harvest"
                                      ? "bg-amber-500"
                                      : "bg-blue-500"
                                  }`}
                                ></div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                  <div className="flex justify-between">
                                    <h4 className="font-bold">
                                      {getActivityTypeLabel(activity.type)}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {new Date(
                                        activity.date
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <p className="text-gray-600 mt-2">
                                    {activity.description}
                                  </p>

                                  {activity.inputs &&
                                    activity.inputs.length > 0 && (
                                      <div className="mt-3">
                                        <h5 className="text-sm font-medium text-gray-600">
                                          Intrants utilisés:
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                          {activity.inputs.map((input, idx) => (
                                            <div
                                              key={idx}
                                              className="text-xs bg-gray-50 p-2 rounded"
                                            >
                                              <strong>{input.name}</strong>:{" "}
                                              {input.quantity} {input.unit}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                  {activity.notes && (
                                    <p className="text-sm text-gray-500 mt-2 italic">
                                      Notes: {activity.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-10">
                          Aucune activité enregistrée pour cette production
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Ajouter une activité</CardTitle>
                      <CardDescription>
                        Enregistrer une nouvelle opération
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="activity-type">Type d'activité</Label>
                          <Select
                            value={newActivity.type}
                            onValueChange={(value) =>
                              handleActivityChange("type", value)
                            }
                          >
                            <SelectTrigger id="activity-type">
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="soil_preparation">
                                Préparation du sol
                              </SelectItem>
                              <SelectItem value="sowing">Semis</SelectItem>
                              <SelectItem value="fertilization">
                                Fertilisation
                              </SelectItem>
                              <SelectItem value="irrigation">
                                Irrigation
                              </SelectItem>
                              <SelectItem value="weeding">
                                Désherbage
                              </SelectItem>
                              <SelectItem value="pest_control">
                                Contrôle des nuisibles
                              </SelectItem>
                              <SelectItem value="harvest">Récolte</SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="activity-date">Date</Label>
                          <Input
                            id="activity-date"
                            type="date"
                            value={newActivity.date}
                            onChange={(e) =>
                              handleActivityChange("date", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="activity-description">
                            Description
                          </Label>
                          <Textarea
                            id="activity-description"
                            placeholder="Description de l'activité"
                            value={newActivity.description}
                            onChange={(e) =>
                              handleActivityChange(
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Intrants utilisés</Label>
                          {newActivity.inputs.map((input, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-3 gap-2 items-center mt-2"
                            >
                              <Input
                                placeholder="Nom"
                                value={input.name}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="col-span-1"
                              />
                              <Input
                                placeholder="Quantité"
                                value={input.quantity}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                className="col-span-1"
                              />
                              <div className="flex items-center">
                                <Input
                                  placeholder="Unité"
                                  value={input.unit}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "unit",
                                      e.target.value
                                    )
                                  }
                                  className="flex-grow"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeInput(index)}
                                  className="ml-1 flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addInput}
                            className="mt-2"
                          >
                            Ajouter un intrant
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="activity-notes">
                            Notes additionnelles
                          </Label>
                          <Textarea
                            id="activity-notes"
                            placeholder="Notes ou observations"
                            value={newActivity.notes}
                            onChange={(e) =>
                              handleActivityChange("notes", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        onClick={handleActivitySubmit}
                        className="bg-isra-green hover:bg-isra-green-dark"
                      >
                        Enregistrer l'activité
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="issues">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Problèmes et incidents</CardTitle>
                      <CardDescription>
                        Suivi des problèmes survenus pendant la production
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {production.issues && production.issues.length > 0 ? (
                        <div className="grid gap-4">
                          {production.issues.map((issue, index) => (
                            <div
                              key={index}
                              className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <h4 className="font-bold">
                                      {getIssueTypeLabel(issue.type)}
                                    </h4>
                                    <span className="mx-2">•</span>
                                    {getIssueSeverityBadge(issue.severity)}
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {new Date(issue.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    issue.resolved
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }
                                >
                                  {issue.resolved ? "Résolu" : "Non résolu"}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mt-2">
                                {issue.description}
                              </p>
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <h5 className="text-sm font-medium text-gray-600">
                                  Actions prises:
                                </h5>
                                <p className="text-gray-600 mt-1">
                                  {issue.actions}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-10">
                          Aucun problème enregistré pour cette production
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Signaler un problème</CardTitle>
                      <CardDescription>
                        Enregistrer un incident ou problème
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="issue-date">Date</Label>
                          <Input
                            id="issue-date"
                            type="date"
                            value={newIssue.date}
                            onChange={(e) =>
                              handleIssueChange("date", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="issue-type">Type de problème</Label>
                          <Select
                            value={newIssue.type}
                            onValueChange={(value) =>
                              handleIssueChange("type", value)
                            }
                          >
                            <SelectTrigger id="issue-type">
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="disease">Maladie</SelectItem>
                              <SelectItem value="pest">Nuisible</SelectItem>
                              <SelectItem value="weather">
                                Conditions météo
                              </SelectItem>
                              <SelectItem value="management">
                                Gestion
                              </SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="issue-severity">Gravité</Label>
                          <Select
                            value={newIssue.severity}
                            onValueChange={(value) =>
                              handleIssueChange("severity", value)
                            }
                          >
                            <SelectTrigger id="issue-severity">
                              <SelectValue placeholder="Sélectionner la gravité" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Faible</SelectItem>
                              <SelectItem value="medium">Moyenne</SelectItem>
                              <SelectItem value="high">Élevée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="issue-description">Description</Label>
                          <Textarea
                            id="issue-description"
                            placeholder="Description du problème"
                            value={newIssue.description}
                            onChange={(e) =>
                              handleIssueChange("description", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="issue-actions">Actions prises</Label>
                          <Textarea
                            id="issue-actions"
                            placeholder="Actions prises ou à prendre"
                            value={newIssue.actions}
                            onChange={(e) =>
                              handleIssueChange("actions", e.target.value)
                            }
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="issue-resolved"
                            checked={newIssue.resolved}
                            onChange={(e) =>
                              handleIssueChange("resolved", e.target.checked)
                            }
                            className="rounded border-gray-300 text-isra-green focus:ring-isra-green"
                          />
                          <Label htmlFor="issue-resolved">
                            Problème résolu
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        onClick={handleIssueSubmit}
                        className="bg-isra-green hover:bg-isra-green-dark"
                      >
                        Enregistrer le problème
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weather">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Données météorologiques</CardTitle>
                      <CardDescription>
                        Suivi des conditions météo pendant la période de
                        production
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {production.weatherData &&
                      production.weatherData.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4">Date</th>
                                <th className="text-left py-3 px-4">
                                  Température (°C)
                                </th>
                                <th className="text-left py-3 px-4">
                                  Précipitations (mm)
                                </th>
                                <th className="text-left py-3 px-4">
                                  Humidité (%)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {production.weatherData.map((data, index) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0 ? "bg-gray-50" : ""
                                  }
                                >
                                  <td className="py-3 px-4">
                                    {new Date(data.date).toLocaleDateString()}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                                      {data.temperature}°C
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <CloudRain className="h-4 w-4 mr-2 text-blue-500" />
                                      {data.rainfall} mm
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <Droplets className="h-4 w-4 mr-2 text-blue-400" />
                                      {data.humidity}%
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-10">
                          Aucune donnée météorologique enregistrée
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Ajouter des données météo</CardTitle>
                      <CardDescription>
                        Enregistrer de nouvelles données météorologiques
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="weather-date">Date</Label>
                          <Input
                            id="weather-date"
                            type="date"
                            value={newWeatherData.date}
                            onChange={(e) =>
                              handleWeatherChange("date", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="weather-temperature">
                            Température (°C)
                          </Label>
                          <Input
                            id="weather-temperature"
                            type="number"
                            step="0.1"
                            placeholder="Ex: 28.5"
                            value={newWeatherData.temperature}
                            onChange={(e) =>
                              handleWeatherChange("temperature", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="weather-rainfall">
                            Précipitations (mm)
                          </Label>
                          <Input
                            id="weather-rainfall"
                            type="number"
                            step="0.1"
                            placeholder="Ex: 12.5"
                            value={newWeatherData.rainfall}
                            onChange={(e) =>
                              handleWeatherChange("rainfall", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="weather-humidity">Humidité (%)</Label>
                          <Input
                            id="weather-humidity"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Ex: 65"
                            value={newWeatherData.humidity}
                            onChange={(e) =>
                              handleWeatherChange("humidity", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        onClick={handleWeatherSubmit}
                        className="bg-isra-green hover:bg-isra-green-dark"
                      >
                        Enregistrer les données
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ProductionDetail;
