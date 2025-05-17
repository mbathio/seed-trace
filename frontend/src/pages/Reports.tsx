
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Filter } from "lucide-react";

// Données fictives pour les graphiques
const seedProductionData = [
  { name: "Janvier", production: 500 },
  { name: "Février", production: 320 },
  { name: "Mars", production: 720 },
  { name: "Avril", production: 420 },
  { name: "Mai", production: 650 },
  { name: "Juin", production: 780 },
];

const varietyDistributionData = [
  { name: "Sahel 108", value: 35 },
  { name: "Sahel 134", value: 25 },
  { name: "Sahel 177", value: 15 },
  { name: "NERICA L-19", value: 15 },
  { name: "ISRIZ 4", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28AD5"];

const recentReports = [
  {
    id: "RPT001",
    title: "Rapport de production semestriel",
    date: "2025-04-10",
    type: "production"
  },
  {
    id: "RPT002",
    title: "Rapport de distribution Q1 2025",
    date: "2025-04-02",
    type: "distribution"
  },
  {
    id: "RPT003",
    title: "Bilan des inspections 2024",
    date: "2025-03-15",
    type: "inspection"
  },
  {
    id: "RPT004",
    title: "Rapport qualité des semences",
    date: "2025-03-05",
    type: "qualité"
  }
];

export default function Reports() {
  const [period, setPeriod] = useState("month");
  const [reportType, setReportType] = useState("all");

  // Filtrer les rapports en fonction du type sélectionné
  const filteredReports = reportType === "all" 
    ? recentReports 
    : recentReports.filter(report => report.type === reportType);

  // Fonction pour obtenir la couleur du badge de type de rapport
  const getReportBadgeColor = (type: string) => {
    switch (type) {
      case "production": return "bg-blue-500";
      case "distribution": return "bg-green-500";
      case "inspection": return "bg-yellow-500";
      case "qualité": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  // Fonction pour obtenir le libellé en français du type de rapport
  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "production": return "Production";
      case "distribution": return "Distribution";
      case "inspection": return "Inspection";
      case "qualité": return "Qualité";
      default: return type;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-isra-green">Rapports</h1>
            <Button className="bg-isra-green hover:bg-isra-green/90">
              Générer un rapport
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Production de semences</CardTitle>
                  <Select
                    value={period}
                    onValueChange={setPeriod}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Mensuel</SelectItem>
                      <SelectItem value="quarter">Trimestriel</SelectItem>
                      <SelectItem value="year">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>Production en kilogrammes (kg)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={seedProductionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="production" fill="#10B981" name="Production (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution par variété</CardTitle>
                <CardDescription>Pourcentage de chaque variété distribuée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={varietyDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {varietyDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <div className="flex items-center justify-between">
                <CardTitle>Rapports récents</CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={reportType}
                    onValueChange={setReportType}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="distribution">Distribution</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="qualité">Qualité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>Téléchargez ou consultez les rapports récents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(report.date).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getReportBadgeColor(report.type)}>
                          {getReportTypeLabel(report.type)}
                        </Badge>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Aucun rapport trouvé pour ce type.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
