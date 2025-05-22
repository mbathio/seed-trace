
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_SEED_LOTS, MOCK_VARIETIES } from "@/utils/seedTypes";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard = ({ title, value, description, icon, colorClass }: StatCardProps) => (
  <Card>
    <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${colorClass}`}>
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="bg-white p-2 rounded-full">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // Calculate stats from mock data
  const totalGO = MOCK_SEED_LOTS.filter(lot => lot.level === 'GO').reduce((acc, lot) => acc + lot.quantity, 0);
  const totalG1 = MOCK_SEED_LOTS.filter(lot => lot.level === 'G1').reduce((acc, lot) => acc + lot.quantity, 0);
  const totalG2 = MOCK_SEED_LOTS.filter(lot => lot.level === 'G2').reduce((acc, lot) => acc + lot.quantity, 0);
  
  const activeLots = MOCK_SEED_LOTS.filter(lot => lot.status === "active").length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-isra-green-dark">Tableau de Bord</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Lots Actifs"
          value={activeLots}
          description="Nombre total de lots en suivi"
          colorClass="bg-isra-green text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-isra-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          }
        />
        
        <StatCard
          title="Stock GO"
          value={`${totalGO} kg`}
          description="Quantité disponible de semences GO"
          colorClass="bg-isra-brown text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-isra-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          }
        />
        
        <StatCard
          title="Stock G1"
          value={`${totalG1} kg`}
          description="Quantité disponible de semences G1"
          colorClass="bg-blue-500 text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          }
        />
        
        <StatCard
          title="Stock G2"
          value={`${totalG2} kg`}
          description="Quantité disponible de semences G2"
          colorClass="bg-amber-500 text-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Variétés en Production</CardTitle>
            <CardDescription>Liste des variétés actuellement en production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_VARIETIES.map(variety => (
                <div key={variety.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-semibold">{variety.name}</h4>
                    <p className="text-sm text-gray-500">{variety.description?.substring(0, 50)}...</p>
                  </div>
                  <Button variant="ghost" className="text-isra-green hover:text-isra-green-dark hover:bg-isra-beige">
                    Voir détails
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
            <CardDescription>Dernières activités liées aux lots de semences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-isra-green pl-4 py-2">
                <p className="font-medium">Création du lot SL-G2-2023-001</p>
                <p className="text-sm text-gray-500">10 Nov 2023 par Amadou Diop</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium">Test qualité effectué sur SL-G1-2023-001</p>
                <p className="text-sm text-gray-500">20 Juin 2023 par Fatou Sy</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <p className="font-medium">Attribution du lot SL-G2-2023-001 au multiplicateur</p>
                <p className="text-sm text-gray-500">15 Nov 2023 par Moussa Kane</p>
              </div>
              <div className="border-l-4 border-isra-brown pl-4 py-2">
                <p className="font-medium">Enregistrement du lot GO Sahel 108</p>
                <p className="text-sm text-gray-500">15 Jan 2023 par Amadou Diop</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
