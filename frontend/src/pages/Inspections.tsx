import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Données fictives pour les inspections
const mockInspections = [
  {
    id: "INS001",
    date: "2025-04-12",
    seedLotCode: "SL-G2-RIZ-001",
    multiplier: "Abdou Diop",
    location: "Dagana",
    status: "planifiée",
    inspector: "Moussa Sow"
  },
  {
    id: "INS002",
    date: "2025-04-15",
    seedLotCode: "SL-G2-RIZ-003",
    multiplier: "Fatou Ndiaye",
    location: "Richard Toll",
    status: "complétée",
    inspector: "Aissatou Fall"
  },
  {
    id: "INS003",
    date: "2025-04-18",
    seedLotCode: "SL-G2-RIZ-007",
    multiplier: "Modou Gueye",
    location: "Ross Béthio",
    status: "en_attente",
    inspector: "Ibrahima Diallo"
  },
  {
    id: "INS004",
    date: "2025-04-22",
    seedLotCode: "SL-G2-RIZ-009",
    multiplier: "Aminata Diagne",
    location: "Podor",
    status: "annulée",
    inspector: "Moussa Sow"
  },
  {
    id: "INS005",
    date: "2025-04-25",
    seedLotCode: "SL-G2-RIZ-012",
    multiplier: "Ousmane Fall",
    location: "Matam",
    status: "planifiée",
    inspector: "Aissatou Fall"
  }
];

export default function Inspections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedInspector, setSelectedInspector] = useState<string>("all");
  const [inspections, setInspections] = useState(mockInspections);

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inspection.seedLotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inspection.multiplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inspection.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" ? true : inspection.status === selectedStatus;
    const matchesInspector = selectedInspector === "all" ? true : inspection.inspector === selectedInspector;
    
    return matchesSearch && matchesStatus && matchesInspector;
  });

  // Extractez la liste unique des inspecteurs
  const inspectors = Array.from(new Set(inspections.map(insp => insp.inspector)));

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "planifiée": return "bg-blue-500";
      case "complétée": return "bg-green-500";
      case "en_attente": return "bg-yellow-500";
      case "annulée": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Fonction pour obtenir le libellé en français du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "planifiée": return "Planifiée";
      case "complétée": return "Complétée";
      case "en_attente": return "En attente";
      case "annulée": return "Annulée";
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-isra-green">Inspections</h1>
            <Link to="/inspections/add">
              <Button className="bg-isra-green hover:bg-isra-green/90">
                Nouvelle inspection
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par ID, lot, multiplicateur ou lieu..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="planifiée">Planifiée</SelectItem>
                <SelectItem value="complétée">Complétée</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedInspector}
              onValueChange={setSelectedInspector}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Inspecteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les inspecteurs</SelectItem>
                {inspectors.map(inspector => (
                  <SelectItem key={inspector} value={inspector}>{inspector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredInspections.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Lot</TableHead>
                      <TableHead>Multiplicateur</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Inspecteur</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">{inspection.id}</TableCell>
                        <TableCell>{new Date(inspection.date).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>{inspection.seedLotCode}</TableCell>
                        <TableCell>{inspection.multiplier}</TableCell>
                        <TableCell>{inspection.location}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(inspection.status)}>
                            {getStatusLabel(inspection.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{inspection.inspector}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground mb-4">
                  Aucune inspection ne correspond à vos critères de recherche.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                  setSelectedInspector("all");
                }}>Réinitialiser les filtres</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
