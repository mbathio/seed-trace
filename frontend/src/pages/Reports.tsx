import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import AdvancedAnalytics from "@/components/reports/AdvancedAnalytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, MOCK_USERS } from "@/utils/seedTypes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for reports
const MOCK_PRODUCTION_DATA = [
  { name: "Jan", riz: 120, mais: 80, arachide: 60 },
  { name: "Fev", riz: 150, mais: 70, arachide: 65 },
  { name: "Mar", riz: 180, mais: 90, arachide: 80 },
  { name: "Avr", riz: 200, mais: 110, arachide: 90 },
  { name: "Mai", riz: 250, mais: 130, arachide: 100 },
  { name: "Jun", riz: 270, mais: 150, arachide: 110 },
];

const MOCK_QUALITY_DATA = [
  { name: "Excellente", value: 65 },
  { name: "Bonne", value: 25 },
  { name: "Moyenne", value: 8 },
  { name: "Insuffisante", value: 2 },
];

const MOCK_REGION_DATA = [
  { region: "Saint-Louis", production: 450, surface: 120 },
  { region: "Dagana", production: 380, surface: 100 },
  { region: "Podor", production: 320, surface: 85 },
  { region: "Richard-Toll", production: 290, surface: 75 },
  { region: "Matam", production: 250, surface: 65 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Reports = () => {
  // Simuler un utilisateur connecté avec le rôle "manager"
  const userRole: UserRole = "MANAGER"; // Peut être "ADMIN", "MANAGER", "AGENT", etc.
  const userName =
    MOCK_USERS.find((user) => user.role === userRole)?.name || "";
  const [period, setPeriod] = useState<string>("6months");
  const [crop, setCrop] = useState<string>("all");
  const [reportMode, setReportMode] = useState<"dashboard" | "advanced">(
    "dashboard"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} userName={userName} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 ml-64">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Rapports et Statistiques</h1>
              <p className="text-gray-600">
                Analyse et visualisation des données de production de semences
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-md ${
                  reportMode === "dashboard"
                    ? "bg-isra-green text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setReportMode("dashboard")}
              >
                Tableau de bord
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  reportMode === "advanced"
                    ? "bg-isra-green text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setReportMode("advanced")}
              >
                Analyses avancées
              </button>
            </div>
          </div>

          {reportMode === "dashboard" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Production Totale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-isra-green">
                      1,450 tonnes
                    </div>
                    <p className="text-sm text-green-600">
                      ↑ 12% par rapport à la période précédente
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Surface Cultivée</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-isra-green">
                      385 hectares
                    </div>
                    <p className="text-sm text-green-600">
                      ↑ 8% par rapport à la période précédente
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Multiplicateurs Actifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-isra-green">48</div>
                    <p className="text-sm text-orange-600">
                      → Stable par rapport à la période précédente
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Taux de Certification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-isra-green">
                      92%
                    </div>
                    <p className="text-sm text-green-600">
                      ↑ 5% par rapport à la période précédente
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Production par Culture</CardTitle>
                      <div className="flex space-x-2">
                        <Select value={period} onValueChange={setPeriod}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Période" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3months">3 mois</SelectItem>
                            <SelectItem value="6months">6 mois</SelectItem>
                            <SelectItem value="1year">1 an</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={crop} onValueChange={setCrop}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Culture" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            <SelectItem value="rice">Riz</SelectItem>
                            <SelectItem value="corn">Maïs</SelectItem>
                            <SelectItem value="peanut">Arachide</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={MOCK_PRODUCTION_DATA}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="riz" name="Riz" fill="#8884d8" />
                          <Bar dataKey="mais" name="Maïs" fill="#82ca9d" />
                          <Bar
                            dataKey="arachide"
                            name="Arachide"
                            fill="#ffc658"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Qualité des Semences</CardTitle>
                    <CardDescription>
                      Répartition par niveau de qualité
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={MOCK_QUALITY_DATA}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {MOCK_QUALITY_DATA.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Production par Région</CardTitle>
                  <CardDescription>
                    Données des principales régions de production
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Région</th>
                          <th className="text-right py-3 px-4">
                            Production (tonnes)
                          </th>
                          <th className="text-right py-3 px-4">
                            Surface (hectares)
                          </th>
                          <th className="text-right py-3 px-4">
                            Rendement (t/ha)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_REGION_DATA.map((item, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="py-2 px-4">{item.region}</td>
                            <td className="text-right py-2 px-4">
                              {item.production}
                            </td>
                            <td className="text-right py-2 px-4">
                              {item.surface}
                            </td>
                            <td className="text-right py-2 px-4">
                              {(item.production / item.surface).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t font-medium">
                          <td className="py-2 px-4">Total</td>
                          <td className="text-right py-2 px-4">
                            {MOCK_REGION_DATA.reduce(
                              (acc, item) => acc + item.production,
                              0
                            )}
                          </td>
                          <td className="text-right py-2 px-4">
                            {MOCK_REGION_DATA.reduce(
                              (acc, item) => acc + item.surface,
                              0
                            )}
                          </td>
                          <td className="text-right py-2 px-4">
                            {(
                              MOCK_REGION_DATA.reduce(
                                (acc, item) => acc + item.production,
                                0
                              ) /
                              MOCK_REGION_DATA.reduce(
                                (acc, item) => acc + item.surface,
                                0
                              )
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <AdvancedAnalytics />
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;
