
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockDashboard, mockSeedLots } from '@/data/mock-data';
import { Separator } from '@/components/ui/separator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const levelColor = {
  'GO': 'bg-red-500',
  'G1': 'bg-orange-500',
  'G2': 'bg-yellow-500',
  'G3': 'bg-green-500',
  'R1': 'bg-blue-500',
  'R2': 'bg-purple-500'
};

const LotProgressCard = () => {
  const data = mockDashboard.seedsByLevel.map(item => ({
    name: item.level,
    value: item.quantity
  }));

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Répartition des stocks par niveau</CardTitle>
        <CardDescription>Quantités actuelles en stock (kg)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Quantité (kg)" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductionTrendsCard = () => {
  // Données simulées pour le graphique
  const data = [
    { name: 'Jan', go: 5, g1: 20, g2: 60 },
    { name: 'Fév', go: 8, g1: 30, g2: 90 },
    { name: 'Mar', go: 12, g1: 45, g2: 125 },
    { name: 'Avr', go: 15, g1: 60, g2: 250 },
    { name: 'Mai', go: 12, g1: 75, g2: 320 },
    { name: 'Juin', go: 10, g1: 82, g2: 380 },
    { name: 'Juil', go: 12, g1: 90, g2: 450 },
    { name: 'Août', go: 15, g1: 95, g2: 420 },
  ];

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Tendances de production 2023</CardTitle>
        <CardDescription>Production mensuelle cumulée par niveau</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="go" name="GO" stackId="1" stroke="#ef4444" fill="#ef4444" />
              <Area type="monotone" dataKey="g1" name="G1" stackId="1" stroke="#f97316" fill="#f97316" />
              <Area type="monotone" dataKey="g2" name="G2" stackId="1" stroke="#eab308" fill="#eab308" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export function DashboardPage() {
  return (
    <div className="container py-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Statistiques en haut */}
        <Card className="col-span-6 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboard.totalSeedsInStock} kg</div>
            <p className="text-xs text-muted-foreground mt-1">Semences disponibles</p>
          </CardContent>
        </Card>

        <Card className="col-span-6 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lots Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboard.activeLots}</div>
            <p className="text-xs text-muted-foreground mt-1">En stock ou production</p>
          </CardContent>
        </Card>

        <Card className="col-span-6 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Multiplicateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboard.activeMultipliers}</div>
            <p className="text-xs text-muted-foreground mt-1">Partenaires actifs</p>
          </CardContent>
        </Card>

        <Card className="col-span-6 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inspections Planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboard.upcomingInspections}</div>
            <p className="text-xs text-muted-foreground mt-1">À réaliser ce mois</p>
          </CardContent>
        </Card>

        {/* Graphique de répartition */}
        <LotProgressCard />

        {/* Graphique de tendances */}
        <ProductionTrendsCard />

        {/* Alertes de stock */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Alertes de stock</CardTitle>
            <CardDescription>Semences à niveau critique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboard.stockAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{alert.varietyName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-100">{alert.level}</Badge>
                      <span>{alert.currentStock} kg disponible</span>
                    </div>
                  </div>
                  <Progress value={(alert.currentStock / alert.minimumRequired) * 100} className="w-16 h-2" />
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

        {/* Dernières distributions */}
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Dernières distributions</CardTitle>
            <CardDescription>Lots attribués aux multiplicateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Multiplicateur</th>
                    <th className="text-left py-3 px-2 font-medium">Lot</th>
                    <th className="text-left py-3 px-2 font-medium">Variété</th>
                    <th className="text-left py-3 px-2 font-medium">Quantité</th>
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-left py-3 px-2 font-medium">Statut</th>
                    <th className="text-left py-3 px-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockDashboard.lastDistributions.map((dist, index) => {
                    const lot = mockSeedLots.find(l => l.id === dist.lotId);
                    return (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">{dist.multiplier.name}</td>
                        <td className="py-3 px-2">{lot?.code}</td>
                        <td className="py-3 px-2">{lot?.variety.name}</td>
                        <td className="py-3 px-2">{dist.quantity} kg</td>
                        <td className="py-3 px-2">{new Date(dist.date).toLocaleDateString('fr-FR')}</td>
                        <td className="py-3 px-2">
                          <Badge 
                            variant={dist.status === 'en_culture' ? "default" : "outline"}
                            className={
                              dist.status === 'planifié' ? "bg-blue-100 text-blue-800" :
                              dist.status === 'distribué' ? "bg-yellow-100 text-yellow-800" :
                              dist.status === 'en_culture' ? "bg-green-100 text-green-800" :
                              dist.status === 'retourné' ? "bg-purple-100 text-purple-800" :
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {dist.status === 'planifié' ? 'Planifié' :
                             dist.status === 'distribué' ? 'Distribué' :
                             dist.status === 'en_culture' ? 'En culture' :
                             dist.status === 'retourné' ? 'Retourné' :
                             dist.status === 'annulé' ? 'Annulé' : dist.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Link to={`/distributions/${dist.id}`}>
                            <Button variant="ghost" size="sm">Détails</Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/distributions">
              <Button variant="outline" size="sm">
                Voir toutes les distributions
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Dernières actions */}
        <Card className="col-span-12 md:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Actions rapides</CardTitle>
            <CardDescription>Opérations fréquentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/seed-lots/add">
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Nouveau lot
                </Button>
              </Link>
              <Link to="/inspections/add">
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path><path d="M9 3v1"></path><path d="M9 7v1"></path><path d="M5 5h1"></path><path d="M7 9h1"></path><path d="M5 9h1"></path><path d="m17 15-6 6"></path><path d="m11 15 6 6"></path></svg>
                  Nouvelle inspection
                </Button>
              </Link>
              <Link to="/distributions/add">
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  Attribuer des semences
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Générer un rapport
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Calendrier de production</CardTitle>
            <CardDescription>Prochaines échéances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-md bg-blue-100 text-blue-700 flex flex-col items-center justify-center">
                  <div className="text-xs font-bold">JUN</div>
                  <div className="text-lg font-bold">15</div>
                </div>
                <div>
                  <div className="font-medium">Semis G1 Sahel 108</div>
                  <div className="text-sm text-muted-foreground">Parcelle A - Station ISRA</div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-md bg-green-100 text-green-700 flex flex-col items-center justify-center">
                  <div className="text-xs font-bold">JUN</div>
                  <div className="text-lg font-bold">22</div>
                </div>
                <div>
                  <div className="font-medium">Récolte G2 Nerica 4</div>
                  <div className="text-sm text-muted-foreground">Ferme semencière de Boundoum</div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-md bg-purple-100 text-purple-700 flex flex-col items-center justify-center">
                  <div className="text-xs font-bold">JUN</div>
                  <div className="text-lg font-bold">28</div>
                </div>
                <div>
                  <div className="font-medium">Inspection G3 Sahel 108</div>
                  <div className="text-sm text-muted-foreground">Coopérative Agrosem</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/calendar">
              <Button variant="outline" size="sm">
                Voir le calendrier complet
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
