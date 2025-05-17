
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

// Données fictives pour les distributions
const mockDistributions = [
  {
    id: "DIST001",
    date: "2025-04-14",
    seedLotCode: "SL-G2-RIZ-001",
    receiver: "Coopérative Dagana",
    quantity: 250,
    status: "livrée"
  },
  {
    id: "DIST002",
    date: "2025-04-16",
    seedLotCode: "SL-G2-RIZ-003",
    receiver: "GIE Podor",
    quantity: 300,
    status: "en_cours"
  },
  {
    id: "DIST003",
    date: "2025-04-19",
    seedLotCode: "SL-G2-RIZ-007",
    receiver: "Ferme Matam",
    quantity: 150,
    status: "planifiée"
  },
  {
    id: "DIST004",
    date: "2025-04-22",
    seedLotCode: "SL-G2-RIZ-009",
    receiver: "Projet PAPSEN",
    quantity: 500,
    status: "annulée"
  },
  {
    id: "DIST005",
    date: "2025-04-26",
    seedLotCode: "SL-G2-RIZ-012",
    receiver: "Union des Producteurs",
    quantity: 400,
    status: "planifiée"
  }
];

export default function Distributions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredDistributions = mockDistributions.filter(distribution => {
    const matchesSearch = 
      distribution.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distribution.seedLotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distribution.receiver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" ? true : distribution.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "livrée": return "bg-green-500";
      case "en_cours": return "bg-blue-500";
      case "planifiée": return "bg-yellow-500";
      case "annulée": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Fonction pour obtenir le libellé en français du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "livrée": return "Livrée";
      case "en_cours": return "En cours";
      case "planifiée": return "Planifiée";
      case "annulée": return "Annulée";
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-isra-green">Distributions</h1>
            <Link to="/distributions/add">
              <Button className="bg-isra-green hover:bg-isra-green/90">
                Nouvelle distribution
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par ID, lot ou destinataire..."
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
                <SelectItem value="livrée">Livrée</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="planifiée">Planifiée</SelectItem>
                <SelectItem value="annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredDistributions.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Lot</TableHead>
                      <TableHead>Destinataire</TableHead>
                      <TableHead>Quantité (kg)</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistributions.map((distribution) => (
                      <TableRow key={distribution.id}>
                        <TableCell className="font-medium">{distribution.id}</TableCell>
                        <TableCell>{new Date(distribution.date).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>{distribution.seedLotCode}</TableCell>
                        <TableCell>{distribution.receiver}</TableCell>
                        <TableCell>{distribution.quantity}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(distribution.status)}>
                            {getStatusLabel(distribution.status)}
                          </Badge>
                        </TableCell>
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
                  Aucune distribution ne correspond à vos critères de recherche.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}>Réinitialiser les filtres</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
