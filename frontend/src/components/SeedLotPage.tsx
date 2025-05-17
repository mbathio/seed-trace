
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockSeedLots, getSeedLotById, getDistributionsByLotId, getSeedLotGenealogy } from '@/data/mock-data';
import { SeedLot } from '@/types';
import { Separator } from '@/components/ui/separator';

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

const SeedLotInfoCard = ({ lot }: { lot: SeedLot }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={levelColor[lot.level]}>{lot.level}</Badge>
              <Badge variant="outline" className={statusColor[lot.status]}>
                {lot.status === 'en_stock' ? 'En stock' :
                 lot.status === 'attribué' ? 'Attribué' :
                 lot.status === 'en_production' ? 'En production' :
                 lot.status === 'certifié' ? 'Certifié' :
                 lot.status === 'épuisé' ? 'Épuisé' : lot.status}
              </Badge>
            </div>
            <CardTitle>{lot.code}</CardTitle>
            <CardDescription>Variété: {lot.variety.name}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Quantité disponible</div>
            <div className="text-2xl font-bold">{lot.quantity} kg</div>
            <div className="text-xs text-muted-foreground">sur {lot.initialQuantity} kg produits</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Informations générales</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date de production:</span>
                <span>{new Date(lot.productionDate).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date de péremption:</span>
                <span>{new Date(lot.expiryDate).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Emplacement:</span>
                <span>{lot.location.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Producteur:</span>
                <span>{lot.producer === 'ISRA' ? 'ISRA' : 'Multiplicateur externe'}</span>
              </div>
              {lot.certificationNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">N° de certification:</span>
                  <span>{lot.certificationNumber}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Qualité</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pureté:</span>
                <span>{lot.purity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Germination:</span>
                <span>{lot.germination}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Humidité:</span>
                <span>{lot.moisture}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inspections:</span>
                <span>{lot.inspections.length}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Modifier</Button>
        <div className="flex gap-2">
          <Link to={`/qr-code?lotId=${lot.id}`}>
            <Button variant="outline">
              Imprimer QR Code
            </Button>
          </Link>
          <Button>Gérer Stock</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const GenealogyTab = ({ lotId }: { lotId: string }) => {
  const [genealogy, setGenealogy] = useState<SeedLot[]>([]);

  useEffect(() => {
    const result = getSeedLotGenealogy(lotId);
    setGenealogy(result);
  }, [lotId]);

  // Grouper par niveau
  const groupedByLevel: Record<string, SeedLot[]> = {};
  genealogy.forEach(lot => {
    if (!groupedByLevel[lot.level]) {
      groupedByLevel[lot.level] = [];
    }
    groupedByLevel[lot.level].push(lot);
  });

  // Trier par niveaux de semences
  const orderedLevels = ['GO', 'G1', 'G2', 'G3', 'R1', 'R2'] as const;
  const sortedLevels = orderedLevels.filter(level => groupedByLevel[level]);

  return (
    <div className="genealogy-tree">
      {sortedLevels.map((level, levelIndex) => (
        <div key={level} className="mb-8">
          <h3 className="font-medium text-lg mb-4">Niveau {level}</h3>
          <div className="genealogy-level">
            {groupedByLevel[level].map((lot, lotIndex) => (
              <Link 
                to={`/seed-lots/${lot.id}`} 
                key={lot.id}
                className={`genealogy-node w-64 ${lot.id === lotId ? 'border-primary border-2' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={levelColor[lot.level]}>{lot.level}</Badge>
                  <span className="text-sm font-medium">{lot.code}</span>
                </div>
                <div className="text-sm">
                  <div><span className="text-muted-foreground">Variété:</span> {lot.variety.name}</div>
                  <div><span className="text-muted-foreground">Quantité:</span> {lot.quantity} kg</div>
                  <div><span className="text-muted-foreground">Production:</span> {new Date(lot.productionDate).toLocaleDateString('fr-FR')}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const VarietyInfoTab = ({ lot }: { lot: SeedLot }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-medium text-lg mb-4">Caractéristiques</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Nom scientifique</div>
                <div>{lot.variety.scientificName}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium">Durée du cycle</div>
                <div>{lot.variety.cycle} jours</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium">Description</div>
                <div className="text-sm">{lot.variety.description}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h3 className="font-medium text-lg mb-4">Spécificités</h3>
        <Card>
          <CardContent className="pt-6">
            <div>
              <div className="text-sm font-medium mb-2">Caractéristiques clés</div>
              <div className="flex flex-wrap gap-2">
                {lot.variety.characteristics.map((char, i) => (
                  <Badge key={i} variant="outline" className="bg-muted">{char}</Badge>
                ))}
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <div className="text-sm font-medium mb-2">Image de référence</div>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                {lot.variety.imageUrl ? (
                  <img 
                    src={lot.variety.imageUrl} 
                    alt={lot.variety.name} 
                    className="max-h-full max-w-full object-contain rounded-md" 
                  />
                ) : (
                  <span className="text-muted-foreground">Aucune image disponible</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InspectionsTab = ({ lot }: { lot: SeedLot }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Inspections et contrôles</h3>
        <Button size="sm">Planifier une inspection</Button>
      </div>
      
      {lot.inspections.length === 0 ? (
        <Card>
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">Aucune inspection enregistrée</h3>
            <p className="text-muted-foreground max-w-md">
              Aucune inspection ou contrôle qualité n'a encore été réalisé pour ce lot de semences.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lot.inspections.map((inspection, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={
                        inspection.type === 'au_champ' ? "bg-green-100 text-green-800" :
                        inspection.type === 'laboratoire' ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }>
                        {inspection.type === 'au_champ' ? 'Inspection au champ' : 
                         inspection.type === 'laboratoire' ? 'Analyse laboratoire' : 
                         'Contrôle stockage'}
                      </Badge>
                      <Badge variant="outline" className={
                        inspection.status === 'conforme' ? "bg-green-100 text-green-800" :
                        inspection.status === 'non_conforme' ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }>
                        {inspection.status === 'conforme' ? 'Conforme' :
                         inspection.status === 'non_conforme' ? 'Non conforme' :
                         'En attente'}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{new Date(inspection.date).toLocaleDateString('fr-FR')}</CardTitle>
                    <CardDescription>Inspecteur: {inspection.inspector}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Observations</div>
                    <div className="text-sm">{inspection.observations}</div>
                  </div>
                  
                  {inspection.results && Object.keys(inspection.results).length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Résultats</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(inspection.results).map(([key, value], i) => (
                          <div key={i} className="flex justify-between">
                            <span className="text-muted-foreground">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">Voir détails</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const DistributionsTab = ({ lotId }: { lotId: string }) => {
  const distributions = getDistributionsByLotId(lotId);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Attributions aux multiplicateurs</h3>
        <Button size="sm">Nouvelle attribution</Button>
      </div>
      
      {distributions.length === 0 ? (
        <Card>
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium mb-2">Aucune attribution</h3>
            <p className="text-muted-foreground max-w-md">
              Ce lot n'a pas encore été attribué à des multiplicateurs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium">Multiplicateur</th>
                <th className="text-left py-3 px-2 font-medium">Quantité</th>
                <th className="text-left py-3 px-2 font-medium">Date</th>
                <th className="text-left py-3 px-2 font-medium">N° Contrat</th>
                <th className="text-left py-3 px-2 font-medium">Statut</th>
                <th className="text-left py-3 px-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((dist, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2">{dist.multiplier.name}</td>
                  <td className="py-3 px-2">{dist.quantity} kg</td>
                  <td className="py-3 px-2">{new Date(dist.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-2">{dist.contractNumber}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export function SeedLotPage() {
  const { id } = useParams<{ id: string }>();
  const [seedLot, setSeedLot] = useState<SeedLot | null>(null);

  useEffect(() => {
    if (id) {
      const lot = getSeedLotById(id);
      if (lot) {
        setSeedLot(lot);
      }
    }
  }, [id]);

  if (!seedLot) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Lot non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le lot de semences demandé n'existe pas.</p>
          <Link to="/seed-lots">
            <Button>Retour à la liste des lots</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <div className="breadcrumb-item">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Accueil
          </Link>
        </div>
        <div className="breadcrumb-item">
          <Link to="/seed-lots" className="text-muted-foreground hover:text-foreground">
            Lots de semences
          </Link>
        </div>
        <div className="breadcrumb-item font-medium">
          {seedLot.code}
        </div>
      </div>

      <SeedLotInfoCard lot={seedLot} />

      <div className="mt-6">
        <Tabs defaultValue="genealogy">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="genealogy">Généalogie</TabsTrigger>
            <TabsTrigger value="variety">Variété</TabsTrigger>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
            <TabsTrigger value="distributions">Attributions</TabsTrigger>
          </TabsList>
          <TabsContent value="genealogy" className="pt-6">
            <GenealogyTab lotId={seedLot.id} />
          </TabsContent>
          <TabsContent value="variety" className="pt-6">
            <VarietyInfoTab lot={seedLot} />
          </TabsContent>
          <TabsContent value="inspections" className="pt-6">
            <InspectionsTab lot={seedLot} />
          </TabsContent>
          <TabsContent value="distributions" className="pt-6">
            <DistributionsTab lotId={seedLot.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SeedLotPage;
