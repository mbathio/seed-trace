import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_PARCELS, MOCK_SEED_LOTS, MOCK_USERS, Parcel, UserRole } from "@/utils/seedTypes";
import ParcelMap from "@/components/parcels/ParcelMap";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, Droplets, Leaf, MapPin } from "lucide-react";

const ParcelDetail = () => {
  const { id } = useParams();
  const parcelId = parseInt(id || "1");
  const parcel = MOCK_PARCELS.find(p => p.id === parcelId);
  
  // Simulate a logged in user with manager role
  const userRole: UserRole = "manager";
  const userName = MOCK_USERS.find(user => user.role === userRole)?.name || "";
  
  const [activeTab, setActiveTab] = useState("overview");
  
  // State for soil analysis form
  const [soilAnalysisForm, setSoilAnalysisForm] = useState({
    pH: parcel?.soilAnalysis?.pH || "",
    organicMatter: parcel?.soilAnalysis?.organicMatter || "",
    nitrogen: parcel?.soilAnalysis?.nitrogen || "",
    phosphorus: parcel?.soilAnalysis?.phosphorus || "",
    potassium: parcel?.soilAnalysis?.potassium || "",
    notes: ""
  });
  
  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setSoilAnalysisForm(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle soil analysis submission
  const handleSoilAnalysisSubmit = () => {
    toast.success("Analyse du sol enregistrée avec succès");
    // In a real app, we would update the parcel in the database
  };
  
  if (!parcel) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Parcelle non trouvée</p>
      </div>
    );
  }

  // Correction : Filtrer les lots liés et utiliser des dates formatées pour l'affichage
  const relatedLots = MOCK_SEED_LOTS.filter(lot => {
    // In a real app, we would check if the lot was produced on this parcel
    return lot.id.includes("2023");
  }).slice(0, 3); // Just showing a few for demo

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} userName={userName} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 ml-64">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{parcel.name || `Parcelle #${parcel.id}`}</h1>
              <p className="text-gray-600">{parcel.address || `Zone de production - ID: ${parcel.id}`}</p>
            </div>
            <div>
              <Badge className={
                parcel.status === 'available' ? 'bg-green-500' : 
                parcel.status === 'in-use' ? 'bg-blue-500' : 'bg-amber-500'
              }>
                {parcel.status === 'available' ? 'Disponible' : 
                 parcel.status === 'in-use' ? 'En utilisation' : 'En repos'}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Superficie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{parcel.area} hectares</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Type de sol</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-isra-brown" />
                  <span className="text-xl font-bold">{parcel.soilType || "Non spécifié"}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Irrigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-xl font-bold">{parcel.irrigationSystem || "Non spécifié"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="soil">Analyse du sol</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="map">Carte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Détails de la parcelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Identifiant</span>
                        <span className="font-medium">{parcel.id}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Localisation</span>
                        <span className="font-medium">
                          {parcel.location.lat.toFixed(4)}, {parcel.location.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Superficie</span>
                        <span className="font-medium">{parcel.area} hectares</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Type de sol</span>
                        <span className="font-medium">{parcel.soilType || "Non spécifié"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Système d'irrigation</span>
                        <span className="font-medium">{parcel.irrigationSystem || "Non spécifié"}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Adresse</span>
                        <span className="font-medium">{parcel.address || "Non spécifiée"}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Statut</span>
                        <Badge className={
                          parcel.status === 'available' ? 'bg-green-500' : 
                          parcel.status === 'in-use' ? 'bg-blue-500' : 'bg-amber-500'
                        }>
                          {parcel.status === 'available' ? 'Disponible' : 
                           parcel.status === 'in-use' ? 'En utilisation' : 'En repos'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Productions récentes</CardTitle>
                    <CardDescription>Lots produits sur cette parcelle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {relatedLots.length > 0 ? (
                      <div className="space-y-4">
                        {relatedLots.map(lot => (
                          <div key={lot.id} className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <h4 className="font-semibold">{lot.id}</h4>
                              <p className="text-sm text-gray-500">
                                {lot.productionDate} - {lot.quantity} kg
                              </p>
                            </div>
                            <Badge className={
                              lot.level === 'GO' ? 'bg-isra-brown' : 
                              lot.level === 'G1' ? 'bg-blue-500' : 
                              lot.level === 'G2' ? 'bg-amber-500' : 
                              'bg-green-500'
                            }>
                              {lot.level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-6">
                        Aucune production récente enregistrée pour cette parcelle
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Conditions environnementales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Pluviométrie moyenne annuelle</span>
                          <span className="font-medium">600-800 mm</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Ensoleillement</span>
                          <span className="font-medium">Élevé</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Risque d'inondation</span>
                          <span className="font-medium">Faible</span>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Risque d'érosion</span>
                          <span className="font-medium">Modéré</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cultures précédentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {parcel.previousCrops && parcel.previousCrops.length > 0 ? (
                      <div className="space-y-3">
                        {parcel.previousCrops.map((crop, index) => (
                          <div key={index} className="flex items-start p-3 border rounded-md">
                            <Calendar className="h-5 w-5 mr-3 text-isra-green mt-1" />
                            <div>
                              <h4 className="font-medium">{crop.crop}</h4>
                              <p className="text-sm text-gray-500">
                                {crop.season} {crop.year}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-6">
                        Pas d'historique de cultures précédentes
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="soil">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyse du sol</CardTitle>
                    <CardDescription>
                      {parcel.soilAnalysis?.date ? 
                        `Dernière analyse: ${parcel.soilAnalysis.date.toLocaleDateString()}` : 
                        "Aucune analyse enregistrée"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {parcel.soilAnalysis ? (
                      <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">pH</span>
                          <span className="font-medium">{parcel.soilAnalysis.pH}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Matière organique (%)</span>
                          <span className="font-medium">{parcel.soilAnalysis.organicMatter}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Azote (%)</span>
                          <span className="font-medium">{parcel.soilAnalysis.nitrogen}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Phosphore (ppm)</span>
                          <span className="font-medium">{parcel.soilAnalysis.phosphorus}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Potassium (ppm)</span>
                          <span className="font-medium">{parcel.soilAnalysis.potassium}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-6">
                        Aucune donnée d'analyse du sol disponible
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Nouvelle analyse du sol</CardTitle>
                    <CardDescription>Enregistrer une nouvelle analyse</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ph">pH</Label>
                          <Input 
                            id="ph" 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="14" 
                            placeholder="Ex: 6.8"
                            value={soilAnalysisForm.pH}
                            onChange={(e) => handleInputChange('pH', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organicMatter">Matière organique (%)</Label>
                          <Input 
                            id="organicMatter" 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            placeholder="Ex: 3.2"
                            value={soilAnalysisForm.organicMatter}
                            onChange={(e) => handleInputChange('organicMatter', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nitrogen">Azote (%)</Label>
                          <Input 
                            id="nitrogen" 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="Ex: 0.15"
                            value={soilAnalysisForm.nitrogen}
                            onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phosphorus">Phosphore (ppm)</Label>
                          <Input 
                            id="phosphorus" 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            placeholder="Ex: 25"
                            value={soilAnalysisForm.phosphorus}
                            onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="potassium">Potassium (ppm)</Label>
                          <Input 
                            id="potassium" 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            placeholder="Ex: 180"
                            value={soilAnalysisForm.potassium}
                            onChange={(e) => handleInputChange('potassium', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea 
                          id="notes" 
                          placeholder="Observations complémentaires..."
                          value={soilAnalysisForm.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={handleSoilAnalysisSubmit}
                      className="bg-isra-green hover:bg-isra-green-dark"
                    >
                      Enregistrer l'analyse
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des cultures</CardTitle>
                  <CardDescription>Évolution de l'utilisation de la parcelle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-5 h-full w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-8 relative ml-10">
                      {parcel.previousCrops && parcel.previousCrops.length > 0 ? (
                        parcel.previousCrops.map((crop, index) => (
                          <div key={index} className="relative">
                            <div className="absolute -left-14 mt-1.5 h-4 w-4 rounded-full border border-white bg-isra-green"></div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex justify-between">
                                <h4 className="font-bold">{crop.crop}</h4>
                                <p className="text-sm text-gray-500">{crop.season} {crop.year}</p>
                              </div>
                              <p className="text-gray-600 mt-2">
                                {crop.crop === 'Riz' ? 
                                  "Variété cultivée: Sahel 108. Rendement: 5.8 tonnes/ha." :
                                  crop.crop === 'Maïs' ? 
                                  "Variété cultivée: ZM309. Rendement: 3.2 tonnes/ha." :
                                  crop.crop === 'Niébé' ? 
                                  "Variété cultivée: Mélakh. Rendement: 1.8 tonnes/ha." :
                                  "Aucune information supplémentaire disponible."}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-6">
                          Pas d'historique de cultures enregistré
                        </p>
                      )}
                      
                      <div className="relative">
                        <div className="absolute -left-14 mt-1.5 h-4 w-4 rounded-full border border-white bg-gray-400"></div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-dashed border-gray-300">
                          <div className="flex justify-between">
                            <h4 className="font-bold text-gray-500">Création de la parcelle</h4>
                            <p className="text-sm text-gray-500">2022</p>
                          </div>
                          <p className="text-gray-500 mt-2">
                            Parcelle ajoutée au système de traçabilité de l'ISRA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-isra-green" />
                    Localisation de la parcelle
                  </CardTitle>
                  <CardDescription>
                    Coordonnées: {parcel.location.lat.toFixed(4)}, {parcel.location.lng.toFixed(4)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] p-0">
                  <ParcelMap 
                    parcels={[parcel]}
                    selectedParcelId={parcel.id}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ParcelDetail;
