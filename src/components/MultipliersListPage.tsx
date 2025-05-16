
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockMultipliers } from '@/data/mock-data';
import { Multiplier } from '@/types';

const statusColor = {
  'actif': 'bg-green-100 text-green-800',
  'inactif': 'bg-gray-100 text-gray-800',
  'suspendu': 'bg-red-100 text-red-800'
};

const MultiplierCard = ({ multiplier }: { multiplier: Multiplier }) => {
  return (
    <Card className="seed-card h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{multiplier.name}</CardTitle>
          <Badge variant="outline" className={statusColor[multiplier.status]}>
            {multiplier.status === 'actif' ? 'Actif' :
             multiplier.status === 'inactif' ? 'Inactif' :
             multiplier.status === 'suspendu' ? 'Suspendu' : multiplier.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">N° {multiplier.registrationNumber}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Région:</span>
            <span className="text-sm">{multiplier.region}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Téléphone:</span>
            <span className="text-sm">{multiplier.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Certification:</span>
            <span className="text-sm">{new Date(multiplier.certificationDate).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/multipliers/${multiplier.id}`} className="w-full">
          <Button variant="outline" className="w-full">Voir détails</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export function MultipliersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  
  const filteredMultipliers = mockMultipliers.filter(mult => {
    const matchesSearch = mult.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mult.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" ? true : mult.status === selectedStatus;
    const matchesRegion = selectedRegion === "all" ? true : mult.region === selectedRegion;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const regions = [...new Set(mockMultipliers.map(mult => mult.region))];

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Multiplicateurs</h1>
          <p className="text-muted-foreground">Gestion des partenaires multiplicateurs</p>
        </div>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nouveau multiplicateur
        </Button>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="actif">Actif</SelectItem>
            <SelectItem value="inactif">Inactif</SelectItem>
            <SelectItem value="suspendu">Suspendu</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            {regions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredMultipliers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">Aucun multiplicateur trouvé</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Aucun multiplicateur ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedStatus("all");
              setSelectedRegion("all");
            }}>Réinitialiser les filtres</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMultipliers.map(multiplier => (
            <MultiplierCard key={multiplier.id} multiplier={multiplier} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MultipliersListPage;
