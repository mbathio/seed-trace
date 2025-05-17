import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  LineChart,
  QrCode,
  Search,
  Leaf,
  Users,
  FileText,
  ClipboardCheck,
  Plus,
} from "lucide-react";
import { mockDashboard, mockSeedLots } from "@/data/mock-data";

// Statuts et couleurs
const statusColors = {
  en_stock: "bg-green-100 text-green-800",
  attribué: "bg-blue-100 text-blue-800",
  en_production: "bg-yellow-100 text-yellow-800",
  en_culture: "bg-green-100 text-green-800",
  retourné: "bg-purple-100 text-purple-800",
  certifié: "bg-purple-100 text-purple-800",
  épuisé: "bg-gray-100 text-gray-800",
  planifié: "bg-blue-100 text-blue-800",
};

// Couleurs pour le diagramme de stocks par niveau
const levelColors = {
  GO: "#ef4444",
  G1: "#f97316",
  G2: "#eab308",
  G3: "#22c55e",
  R1: "#3b82f6",
  R2: "#a855f7",
};

const SeedTrackingDashboard = () => {
  const [isClient, setIsClient] = useState(false);

  // Pour s'assurer que les composants recharts sont rendus côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Données pour le graphique de répartition par niveau
  const seedsByLevelData = mockDashboard.seedsByLevel.map((item) => ({
    name: item.level,
    value: item.quantity,
    fill: levelColors[item.level] || "#cccccc",
  }));

  // Données fictives pour les tendances de production
  const productionTrendsData = [
    { month: "Jan", go: 2, g1: 10, g2: 30 },
    { month: "Fév", go: 5, g1: 25, g2: 80 },
    { month: "Mar", go: 8, g1: 40, g2: 120 },
    { month: "Avr", go: 10, g1: 60, g2: 210 },
    { month: "Mai", go: 12, g1: 75, g2: 320 },
    { month: "Juin", go: 15, g1: 90, g2: 380 },
  ];

  // Données fictives pour la distribution par variété
  const varietyDistribution = [
    { name: "Sahel 108", value: 35, color: "#3b82f6" },
    { name: "Sahel 177", value: 25, color: "#22c55e" },
    { name: "Sahel 328", value: 15, color: "#eab308" },
    { name: "Nerica 4", value: 15, color: "#ef4444" },
    { name: "Souna 3", value: 10, color: "#a855f7" },
  ];

  // Données pour le calendrier des événements
  const upcomingEvents = [
    {
      date: "2023-06-15",
      month: "JUN",
      day: "15",
      title: "Semis G1 Sahel 108",
      location: "Parcelle A - Station ISRA",
    },
    {
      date: "2023-06-22",
      month: "JUN",
      day: "22",
      title: "Récolte G2 Nerica 4",
      location: "Ferme semencière de Boundoum",
    },
    {
      date: "2023-06-28",
      month: "JUN",
      day: "28",
      title: "Inspection G3 Sahel 108",
      location: "Coopérative Agrosem",
    },
  ];

  return (
    <div className="container py-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Résumé des statistiques */}
        <Card className="col-span-6 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" />
              Stock Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDashboard.totalSeedsInStock} kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Semences disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-6 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LineChart className="h-4 w-4 text-primary" />
              Lots Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboard.activeLots}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En stock ou production
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-6 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Multiplicateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDashboard.activeMultipliers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Partenaires actifs
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-6 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Inspections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDashboard.upcomingInspections}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              À réaliser ce mois
            </p>
          </CardContent>
        </Card>

        {/* Graphique de répartition par niveau */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Répartition des stocks par niveau
            </CardTitle>
            <CardDescription>Quantités actuelles en stock (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={seedsByLevelData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    barCategoryGap={16}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} kg`, "Quantité"]}
                    />
                    <Bar dataKey="value" name="Quantité (kg)">
                      {seedsByLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Graphique de tendances de production */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Tendances de production 2023
            </CardTitle>
            <CardDescription>
              Production mensuelle cumulée par niveau (kg)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={productionTrendsData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kg`, ""]} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="go"
                      name="GO"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="g1"
                      name="G1"
                      stackId="1"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="g2"
                      name="G2"
                      stackId="1"
                      stroke="#eab308"
                      fill="#eab308"
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertes de stock */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Alertes de stock
            </CardTitle>
            <CardDescription>Semences à niveau critique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboard.stockAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{alert.varietyName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-100">
                        {alert.level}
                      </Badge>
                      <span>{alert.currentStock} kg disponible</span>
                    </div>
                  </div>
                  <Progress
                    value={(alert.currentStock / alert.minimumRequired) * 100}
                    className="w-16 h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Voir toutes les alertes
            </Button>
          </CardFooter>
        </Card>

        {/* Distribution par variété */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Distribution par variété
            </CardTitle>
            <CardDescription>Répartition des stocks actuels</CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={varietyDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {varietyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Actions rapides
            </CardTitle>
            <CardDescription>Opérations fréquentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => (window.location.href = "/seed-lots/add")}
              >
                <Leaf className="mr-2 h-4 w-4" />
                Nouveau lot
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => (window.location.href = "/inspections/add")}
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Nouvelle inspection
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => (window.location.href = "/distributions/add")}
              >
                <Users className="mr-2 h-4 w-4" />
                Attribuer des semences
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => (window.location.href = "/qr-code")}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Générer QR Code
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => (window.location.href = "/reports")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Générer un rapport
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => (window.location.href = "/seed-lots")}
              >
                <Search className="mr-2 h-4 w-4" />
                Rechercher un lot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dernières distributions */}
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Dernières distributions
            </CardTitle>
            <CardDescription>
              Lots attribués aux multiplicateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">
                      Multiplicateur
                    </th>
                    <th className="text-left py-3 px-2 font-medium">Lot</th>
                    <th className="text-left py-3 px-2 font-medium">Variété</th>
                    <th className="text-left py-3 px-2 font-medium">
                      Quantité
                    </th>
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-left py-3 px-2 font-medium">Statut</th>
                    <th className="text-left py-3 px-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockDashboard.lastDistributions.map((dist, index) => {
                    const lot = mockSeedLots.find((l) => l.id === dist.lotId);
                    return (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{dist.multiplier.name}</td>
                        <td className="py-3 px-2">{lot?.code}</td>
                        <td className="py-3 px-2">{lot?.variety.name}</td>
                        <td className="py-3 px-2">{dist.quantity} kg</td>
                        <td className="py-3 px-2">
                          {new Date(dist.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-3 px-2">
                          <Badge
                            variant={
                              dist.status === "en_culture"
                                ? "default"
                                : "outline"
                            }
                            className={
                              statusColors[dist.status] ||
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {dist.status === "planifié"
                              ? "Planifié"
                              : dist.status === "distribué"
                              ? "Distribué"
                              : dist.status === "en_culture"
                              ? "En culture"
                              : dist.status === "retourné"
                              ? "Retourné"
                              : dist.status === "annulé"
                              ? "Annulé"
                              : dist.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              (window.location.href = `/distributions/${dist.id}`)
                            }
                          >
                            Détails
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/distributions")}
            >
              Voir toutes les distributions
            </Button>
          </CardFooter>
        </Card>

        {/* Calendrier de production */}
        <Card className="col-span-12 md:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Calendrier de production
            </CardTitle>
            <CardDescription>Prochaines échéances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md bg-blue-100 text-blue-700 flex flex-col items-center justify-center">
                      <div className="text-xs font-bold">{event.month}</div>
                      <div className="text-lg font-bold">{event.day}</div>
                    </div>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.location}
                      </div>
                    </div>
                  </div>
                  {index < upcomingEvents.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => (window.location.href = "/calendar")}
            >
              Voir le calendrier complet
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Tâches en attente */}
        <Card className="col-span-12 md:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Tâches en attente
            </CardTitle>
            <CardDescription>
              Actions nécessitant une intervention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-yellow-800">
                    Inspection planifiée
                  </div>
                  <div className="text-sm text-yellow-700">
                    Lot G1-SL108-23-001 - Contrôle qualité requis
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => (window.location.href = "/inspections")}
                >
                  Voir
                </Button>
              </div>

              <div className="p-3 rounded-md bg-blue-50 border border-blue-200 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-blue-800">
                    Attribution à confirmer
                  </div>
                  <div className="text-sm text-blue-700">
                    150kg de G2-SL177-23-001 pour GIE Natangué
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => (window.location.href = "/distributions")}
                >
                  Confirmer
                </Button>
              </div>

              <div className="p-3 rounded-md bg-green-50 border border-green-200 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-green-800">
                    Récolte imminente
                  </div>
                  <div className="text-sm text-green-700">
                    Planifier la collecte du lot G2 Nerica 4
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => (window.location.href = "/seed-lots")}
                >
                  Planifier
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => (window.location.href = "/tasks")}
            >
              Voir toutes les tâches
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SeedTrackingDashboard;
