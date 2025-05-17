
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import QRCodeGenerator from "@/components/seeds/QRCodeGenerator";
import { User, MOCK_SEED_LOTS, MOCK_VARIETIES } from '@/utils/seedTypes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

const LotManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all'); // Changed initial value to 'all'

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('isra_user');
    if (!storedUser) {
      toast.error('Veuillez vous connecter pour accéder à cette page');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem('isra_user');
      toast.error('Session invalide, veuillez vous reconnecter');
      navigate('/login');
    }
  }, [navigate]);

  // Filter lots based on search term and level filter
  const filteredLots = MOCK_SEED_LOTS.filter(lot => {
    const matchesSearch = !searchTerm || 
      lot.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = filterLevel === 'all' || lot.level === filterLevel; // Modified condition
    
    return matchesSearch && matchesLevel;
  });

  const handleSelectLot = (lotId: string) => {
    setSelectedLotId(lotId);
  };

  const handleCreateLot = () => {
    navigate('/lots/register');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={user.role} userName={user.name} />
      <div className="flex pt-16">
        <Sidebar userRole={user.role} />
        <main className="flex-1 ml-0 md:ml-64 p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-isra-green-dark">Gestion des Lots</h1>
              <p className="text-gray-500">Gérer et visualiser les lots de semences</p>
            </div>
            <Button 
              className="bg-isra-green hover:bg-isra-green-dark"
              onClick={handleCreateLot}
            >
              Nouveau Lot
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Liste des Lots</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Rechercher un lot..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <Select
                        value={filterLevel}
                        onValueChange={setFilterLevel}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les niveaux</SelectItem> {/* Changed value from "" to "all" */}
                          <SelectItem value="GO">GO</SelectItem>
                          <SelectItem value="G1">G1</SelectItem>
                          <SelectItem value="G2">G2</SelectItem>
                          <SelectItem value="G3">G3</SelectItem>
                          <SelectItem value="R1">R1</SelectItem>
                          <SelectItem value="R2">R2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredLots.length > 0 ? (
                      filteredLots.map(lot => {
                        const variety = MOCK_VARIETIES.find(v => v.id === lot.varietyId);
                        return (
                          <div 
                            key={lot.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedLotId === lot.id 
                                ? 'border-isra-green bg-isra-green-light bg-opacity-10' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleSelectLot(lot.id)}
                          >
                            <div className="flex justify-between">
                              <div>
                                <div className="flex items-center">
                                  <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-xs font-bold text-white bg-isra-green rounded-full">
                                    {lot.level}
                                  </span>
                                  <h3 className="font-medium">{lot.id}</h3>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {variety?.name} - {lot.quantity} kg
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">
                                  {new Date(lot.productionDate).toLocaleDateString()}
                                </p>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  lot.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  lot.status === 'distributed' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {lot.status === 'active' ? 'Actif' : 
                                   lot.status === 'distributed' ? 'Distribué' : 'Éliminé'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Aucun lot ne correspond à votre recherche
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>QR Code</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedLotId ? (
                    (() => {
                      const lot = MOCK_SEED_LOTS.find(lot => lot.id === selectedLotId);
                      const variety = lot ? MOCK_VARIETIES.find(v => v.id === lot.varietyId) : null;
                      
                      if (lot && variety) {
                        return (
                          <QRCodeGenerator 
                            lotId={lot.id}
                            varietyName={variety.name}
                            level={lot.level}
                          />
                        );
                      }
                      
                      return null;
                    })()
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>Sélectionnez un lot pour générer son QR code</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LotManagement;
