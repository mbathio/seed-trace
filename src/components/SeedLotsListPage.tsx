
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { mockSeedLots, mockVarieties } from '@/data/mock-data';
import { SeedLot, SeedLevel } from '@/types';

const levelColor = {
  'GO': 'bg-red-500 text-white',
  'G1': 'bg-orange-500 text-white',
  'G2': 'bg-yellow-500 text-black',
  'G3': 'bg-green-500 text-white',
  'R1': 'bg-blue-500 text-white',
  'R2': 'bg-purple-500 text-white'
};

const statusColor = {
  'en_stock': 'bg-green-100 text-green-800',
  'attribué': 'bg-blue-100 text-blue-800',
  'en_production': 'bg-yellow-100 text-yellow-800',
  'certifié': 'bg-purple-100 text-purple-800',
  'épuisé': 'bg-gray-100 text-gray-800'
};

const SeedLotCard = ({ lot }: { lot: SeedLot }) => {
  return (
    <Link to={`/seed-lots/${lot.id}`} className="seed-card block">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Badge className={levelColor[lot.level]}>{lot.level}</Badge>
              <Badge variant="outline" className={statusColor[lot.status]}>
                {lot.status === 'en_stock' ? 'En stock' :
                 lot.status === 'attribué' ? 'Attribué' :
                 lot.status === 'en_production' ? 'En production' :
                 lot.status === 'certifié' ? 'Certifié' :
                 lot.status === 'épuisé' ? 'Épuisé' : lot.status}
              </Badge>
            </div>
          </div>
          <CardTitle className="mt-2 text-lg">{lot.code}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Variété:</span>
              <span className="text-sm font-medium">{lot.variety.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Quantité:</span>
              <span className="text-sm font-medium">{lot.quantity} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Production:</span>
              <span className="text-sm">{new Date(lot.productionDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Germination:</span>
              <span className="text-sm">{lot.germination}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export function SeedLotsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedVariety, setSelectedVariety] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const filteredLots = mockSeedLots.filter(lot => {
    const matchesSearch = lot.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lot.variety.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "all" ? true : lot.level === selectedLevel;
    const matchesVariety = selectedVariety === "all" ? true : lot.variety.id === selectedVariety;
    const matchesStatus = selectedStatus === "all" ? true : lot.status === selectedStatus;
    
    return matchesSearch && matchesLevel && matchesVariety && matchesStatus;
  });

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lots de semences</h1>
          <p className="text-muted-foreground">Gestion et suivi des lots de semences</p>
        </div>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nouveau lot
        </Button>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="GO">GO</SelectItem>
            <SelectItem value="G1">G1</SelectItem>
            <SelectItem value="G2">G2</SelectItem>
            <SelectItem value="G3">G3</SelectItem>
            <SelectItem value="R1">R1</SelectItem>
            <SelectItem value="R2">R2</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedVariety} onValueChange={setSelectedVariety}>
          <SelectTrigger>
            <SelectValue placeholder="Variété" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les variétés</SelectItem>
            {mockVarieties.map(variety => (
              <SelectItem key={variety.id} value={variety.id}>{variety.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="en_stock">En stock</SelectItem>
            <SelectItem value="attribué">Attribué</SelectItem>
            <SelectItem value="en_production">En production</SelectItem>
            <SelectItem value="certifié">Certifié</SelectItem>
            <SelectItem value="épuisé">Épuisé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredLots.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">Aucun lot trouvé</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Aucun lot ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedLevel("all");
              setSelectedVariety("all");
              setSelectedStatus("all");
            }}>Réinitialiser les filtres</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLots.map(lot => (
            <SeedLotCard key={lot.id} lot={lot} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SeedLotsListPage;
