import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MOCK_SEED_LOTS,
  MOCK_USERS,
  QualityControl,
  UserRole,
} from "@/utils/seedTypes";
import { toast } from "sonner";
import { FlaskConical, TestTube } from "lucide-react";

// Mock data for quality controls
const MOCK_QUALITY_CONTROLS: QualityControl[] = [
  {
    id: 1,
    lotId: "SL-GO-2023-001",
    controlDate: new Date("2023-02-10"), // Utiliser Date au lieu de string
    germinationRate: 95,
    varietyPurity: 98,
    result: "PASS", // Type explicite
    observations: "Excellente qualité, conforme aux normes",
    inspectorId: 4,
    moistureContent: 11.5,
    seedHealth: 97,
  },
  {
    id: 2,
    lotId: "SL-G1-2023-001",
    controlDate: new Date("2023-07-15"),
    germinationRate: 92,
    varietyPurity: 97,
    result: "PASS",
    observations: "Qualité satisfaisante pour G1",
    inspectorId: 4,
    moistureContent: 12.0,
    seedHealth: 95,
  },
  {
    id: 3,
    lotId: "SL-G2-2023-001",
    controlDate: new Date("2023-12-05"),
    germinationRate: 88,
    varietyPurity: 95,
    result: "PASS",
    observations: "Qualité acceptable mais à surveiller",
    inspectorId: 4,
    moistureContent: 12.5,
    seedHealth: 92,
  },
  {
    id: 4,
    lotId: "SL-G1-2023-001",
    controlDate: new Date("2023-08-20"),
    germinationRate: 85,
    varietyPurity: 93,
    result: "FAIL",
    observations: "Taux de germination en dessous du seuil minimal requis",
    inspectorId: 4,
    moistureContent: 13.2,
    seedHealth: 88,
  },
];

interface SampleFormData {
  lotId: string;
  quantity: string;
  location: string;
  notes: string;
}

interface TestFormData {
  lotId: string;
  germinationRate: string;
  varietyPurity: string;
  observations: string;
}

const Quality = () => {
  // Simuler un utilisateur connecté avec le rôle d'inspecteur
  const userRole: UserRole = "INSPECTOR";
  const userName =
    MOCK_USERS.find((user) => user.role === userRole)?.name || "Inspecteur";
  const [activeTab, setActiveTab] = useState("tests");

  // State for forms
  const [sampleFormData, setSampleFormData] = useState<SampleFormData>({
    lotId: "",
    quantity: "",
    location: "",
    notes: "",
  });

  const [testFormData, setTestFormData] = useState<TestFormData>({
    lotId: "",
    germinationRate: "",
    varietyPurity: "",
    observations: "",
  });

  // Handlers for sample form
  const handleSampleChange = (field: keyof SampleFormData, value: string) => {
    setSampleFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSampleSubmit = () => {
    toast.success("Échantillon prélevé avec succès");
    setSampleFormData({
      lotId: "",
      quantity: "",
      location: "",
      notes: "",
    });
  };

  // Handlers for test form
  const handleTestChange = (field: keyof TestFormData, value: string) => {
    setTestFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestSubmit = () => {
    toast.success("Test de qualité enregistré avec succès");
    setTestFormData({
      lotId: "",
      germinationRate: "",
      varietyPurity: "",
      observations: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} userName={userName} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 ml-64">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Contrôle Qualité</h1>
            <p className="text-gray-600">
              Gestion des tests de qualité et contrôle des semences
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="tests">Tests de qualité</TabsTrigger>
              <TabsTrigger value="samples">
                Gestion des échantillons
              </TabsTrigger>
              <TabsTrigger value="standards">Normes et standards</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="mt-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Résultats des tests récents
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-isra-green hover:bg-isra-green-dark flex gap-2">
                      <TestTube size={18} />
                      Nouveau test
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Enregistrer un nouveau test</DialogTitle>
                      <DialogDescription>
                        Saisissez les informations du test de qualité effectué
                        sur un lot de semences.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="lot">Lot de semences</Label>
                        <Select
                          value={testFormData.lotId}
                          onValueChange={(value) =>
                            handleTestChange("lotId", value)
                          }
                        >
                          <SelectTrigger id="lot">
                            <SelectValue placeholder="Sélectionner un lot" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_SEED_LOTS.map((lot) => (
                              <SelectItem key={lot.id} value={lot.id}>
                                {lot.id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="germination">
                          Taux de germination (%)
                        </Label>
                        <Input
                          id="germination"
                          type="number"
                          min="0"
                          max="100"
                          value={testFormData.germinationRate}
                          onChange={(e) =>
                            handleTestChange("germinationRate", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="purity">Pureté variétale (%)</Label>
                        <Input
                          id="purity"
                          type="number"
                          min="0"
                          max="100"
                          value={testFormData.varietyPurity}
                          onChange={(e) =>
                            handleTestChange("varietyPurity", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="observations">Observations</Label>
                        <Input
                          id="observations"
                          value={testFormData.observations}
                          onChange={(e) =>
                            handleTestChange("observations", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleTestSubmit}
                        className="bg-isra-green hover:bg-isra-green-dark"
                      >
                        Enregistrer le test
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {MOCK_QUALITY_CONTROLS.map((control) => {
                  const lot = MOCK_SEED_LOTS.find(
                    (lot) => lot.id === control.lotId
                  );
                  return (
                    <Card key={control.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>Test #{control.id}</CardTitle>
                          <Badge
                            className={
                              control.result === "PASS"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {control.result === "PASS" ? "Réussi" : "Échoué"}
                          </Badge>
                        </div>
                        <CardDescription>
                          Lot: {control.lotId} | Date:{" "}
                          {control.controlDate.toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Taux de germination:
                            </span>
                            <span className="font-medium">
                              {control.germinationRate}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Pureté variétale:
                            </span>
                            <span className="font-medium">
                              {control.varietyPurity}%
                            </span>
                          </div>
                          <div className="mt-2 text-sm">
                            <p className="text-muted-foreground">
                              {control.observations}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end pt-0">
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="samples" className="mt-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Gestion des échantillons
                </h2>
                <p className="text-gray-600 mb-4">
                  Module de gestion des échantillons pour les tests de qualité.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <FlaskConical size={18} />
                      Prélever un nouvel échantillon
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Prélever un nouvel échantillon</DialogTitle>
                      <DialogDescription>
                        Enregistrez les informations concernant le nouvel
                        échantillon prélevé.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="sample-lot">Lot de semences</Label>
                        <Select
                          value={sampleFormData.lotId}
                          onValueChange={(value) =>
                            handleSampleChange("lotId", value)
                          }
                        >
                          <SelectTrigger id="sample-lot">
                            <SelectValue placeholder="Sélectionner un lot" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_SEED_LOTS.map((lot) => (
                              <SelectItem key={lot.id} value={lot.id}>
                                {lot.id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantité prélevée (g)</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="0"
                          value={sampleFormData.quantity}
                          onChange={(e) =>
                            handleSampleChange("quantity", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Lieu de prélèvement</Label>
                        <Input
                          id="location"
                          value={sampleFormData.location}
                          onChange={(e) =>
                            handleSampleChange("location", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notes additionnelles</Label>
                        <Input
                          id="notes"
                          value={sampleFormData.notes}
                          onChange={(e) =>
                            handleSampleChange("notes", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleSampleSubmit}
                        className="bg-isra-green hover:bg-isra-green-dark"
                      >
                        Enregistrer l'échantillon
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>

            <TabsContent value="standards" className="mt-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Normes et standards
                </h2>
                <p className="text-gray-600 mb-4">
                  Consultez les normes et standards de qualité applicables à
                  chaque niveau de semence.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Niveau</th>
                        <th className="px-4 py-2 text-left">
                          Taux min. germination
                        </th>
                        <th className="px-4 py-2 text-left">
                          Pureté variétale min.
                        </th>
                        <th className="px-4 py-2 text-left">Humidité max.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">GO</td>
                        <td className="px-4 py-2">98%</td>
                        <td className="px-4 py-2">99.9%</td>
                        <td className="px-4 py-2">12%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">G1</td>
                        <td className="px-4 py-2">95%</td>
                        <td className="px-4 py-2">99.5%</td>
                        <td className="px-4 py-2">12%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">G2</td>
                        <td className="px-4 py-2">90%</td>
                        <td className="px-4 py-2">99%</td>
                        <td className="px-4 py-2">13%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">G3</td>
                        <td className="px-4 py-2">85%</td>
                        <td className="px-4 py-2">98%</td>
                        <td className="px-4 py-2">13%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">R1</td>
                        <td className="px-4 py-2">80%</td>
                        <td className="px-4 py-2">97%</td>
                        <td className="px-4 py-2">14%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">R2</td>
                        <td className="px-4 py-2">80%</td>
                        <td className="px-4 py-2">95%</td>
                        <td className="px-4 py-2">14%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Quality;
