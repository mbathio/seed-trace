// frontend/src/pages/GenealogyView.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import GenealogyViewer from "@/components/seeds/GenealogyViewer";
import QRScanner from "@/components/seeds/QRScanner";
import { User, MOCK_SEED_LOTS, MOCK_VARIETIES } from "@/utils/seedTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { QrCode } from "lucide-react";

const GenealogyView = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("isra_user");
    if (!storedUser) {
      toast.error("Veuillez vous connecter pour accéder à cette page");
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem("isra_user");
      toast.error("Session invalide, veuillez vous reconnecter");
      navigate("/login");
    }
  }, [navigate]);

  // Filter lots based on search term
  const filteredLots = MOCK_SEED_LOTS.filter((lot) => {
    if (!searchTerm) return true;
    return lot.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelectLot = (lotId: string) => {
    setSelectedLotId(lotId);
  };

  const handleScanSuccess = (lotId: string) => {
    // Vérifier si le lot existe dans les données
    const lot = MOCK_SEED_LOTS.find((l) => l.id === lotId);
    if (lot) {
      setSelectedLotId(lotId);
      setSearchTerm(lotId);
      toast.success(`Lot ${lotId} sélectionné`);
    } else {
      toast.error(`Lot ${lotId} non trouvé dans la base de données`);
    }
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-isra-green-dark">
              Généalogie des Lots
            </h1>
            <p className="text-gray-500">
              Visualiser la généalogie complète des lots de semences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Sélection d'un Lot</CardTitle>
                  <div className="flex gap-2 mt-4">
                    <Input
                      type="text"
                      placeholder="Rechercher un lot..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setIsScannerOpen(true)}
                      title="Scanner un QR code"
                      className="gap-2"
                    >
                      <QrCode className="h-5 w-5" />
                      <span className="hidden sm:inline">Scanner</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredLots.length > 0 ? (
                      filteredLots.map((lot) => {
                        const variety = MOCK_VARIETIES.find(
                          (v) => v.id === lot.varietyId
                        );
                        return (
                          <div
                            key={lot.id}
                            className={`p-3 border rounded-md cursor-pointer transition-colors ${
                              selectedLotId === lot.id
                                ? "border-isra-green bg-isra-green-light bg-opacity-10"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => handleSelectLot(lot.id)}
                          >
                            <div className="flex items-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-xs font-bold text-white bg-isra-green rounded-full">
                                {lot.level}
                              </span>
                              <div>
                                <h3 className="font-medium text-sm">
                                  {lot.id}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {variety?.name}
                                </p>
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

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Visualisation de la Généalogie</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedLotId ? (
                    <GenealogyViewer lotId={selectedLotId} />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p>Sélectionnez un lot pour visualiser sa généalogie</p>
                      <p className="text-sm mt-2">
                        Vous pouvez rechercher un lot ou scanner son QR code
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default GenealogyView;
