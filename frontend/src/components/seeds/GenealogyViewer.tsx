import React, { useState, useEffect } from "react";
import { MOCK_SEED_LOTS, MOCK_VARIETIES, SeedLot } from "@/utils/seedTypes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  Package,
  Calendar,
  MapPin,
} from "lucide-react";

interface GenealogyNode {
  lot: SeedLot;
  children: GenealogyNode[];
}

interface GenealogyViewerProps {
  lotId: string;
}

const GenealogyViewer: React.FC<GenealogyViewerProps> = ({ lotId }) => {
  const [genealogyTree, setGenealogyTree] = useState<GenealogyNode | null>(
    null
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Build the genealogy tree
    const buildTree = (currentLotId: string): GenealogyNode | null => {
      const lot = MOCK_SEED_LOTS.find((l) => l.id === currentLotId);
      if (!lot) return null;

      // Find children (lots that have this lot as parent)
      const childLots = MOCK_SEED_LOTS.filter(
        (l) => l.parentLotId === currentLotId
      );

      return {
        lot,
        children: childLots
          .map((childLot) => buildTree(childLot.id))
          .filter(Boolean) as GenealogyNode[],
      };
    };

    const tree = buildTree(lotId);
    setGenealogyTree(tree);

    // Expand all nodes by default
    if (tree) {
      const allNodeIds = new Set<string>();
      const collectNodeIds = (node: GenealogyNode) => {
        allNodeIds.add(node.lot.id);
        node.children.forEach(collectNodeIds);
      };
      collectNodeIds(tree);
      setExpandedNodes(allNodeIds);
    }
  }, [lotId]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNode = (node: GenealogyNode, level: number = 0): JSX.Element => {
    const variety = MOCK_VARIETIES.find((v) => v.id === node.lot.varietyId);
    const isExpanded = expandedNodes.has(node.lot.id);
    const hasChildren = node.children.length > 0;

    const levelColors = {
      GO: "bg-isra-brown text-white",
      G1: "bg-blue-500 text-white",
      G2: "bg-amber-500 text-white",
      G3: "bg-green-500 text-white",
      G4: "bg-teal-500 text-white",
      R1: "bg-purple-500 text-white",
      R2: "bg-pink-500 text-white",
    };

    return (
      <div key={node.lot.id} className={`${level > 0 ? "ml-8" : ""}`}>
        <Card className="mb-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                {hasChildren && (
                  <button
                    onClick={() => toggleNode(node.lot.id)}
                    className="mr-2 mt-1 p-0.5 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                {!hasChildren && <div className="w-7" />}

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{node.lot.id}</h3>
                    <Badge
                      className={
                        levelColors[node.lot.level as keyof typeof levelColors]
                      }
                    >
                      {node.lot.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {variety?.name || node.lot.variety}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{node.lot.quantity} kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(node.lot.productionDate).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                    {node.lot.parcelId && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Parcelle #{node.lot.parcelId}</span>
                      </div>
                    )}
                  </div>

                  {node.lot.parentLotId && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Parent: </span>
                      <span className="text-isra-green font-medium">
                        {node.lot.parentLotId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <Badge
                  variant="outline"
                  className={
                    node.lot.status === "certified"
                      ? "border-green-500 text-green-700"
                      : node.lot.status === "in-stock"
                      ? "border-blue-500 text-blue-700"
                      : node.lot.status === "pending"
                      ? "border-amber-500 text-amber-700"
                      : node.lot.status === "rejected"
                      ? "border-red-500 text-red-700"
                      : "border-gray-500 text-gray-700"
                  }
                >
                  {node.lot.status === "certified"
                    ? "Certifié"
                    : node.lot.status === "in-stock"
                    ? "En stock"
                    : node.lot.status === "pending"
                    ? "En attente"
                    : node.lot.status === "rejected"
                    ? "Rejeté"
                    : node.lot.status === "sold"
                    ? "Vendu"
                    : node.lot.status === "active"
                    ? "Actif"
                    : node.lot.status === "distributed"
                    ? "Distribué"
                    : node.lot.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasChildren && isExpanded && (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="pl-4">
              {node.children.map((child) => renderNode(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!genealogyTree) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Lot non trouvé ou pas de données de généalogie disponibles</p>
      </div>
    );
  }

  // Find ancestors
  const findAncestors = (lotId: string): SeedLot[] => {
    const ancestors: SeedLot[] = [];
    let currentLot = MOCK_SEED_LOTS.find((l) => l.id === lotId);

    while (currentLot && currentLot.parentLotId) {
      const parent = MOCK_SEED_LOTS.find(
        (l) => l.id === currentLot!.parentLotId
      );
      if (parent) {
        ancestors.unshift(parent);
        currentLot = parent;
      } else {
        break;
      }
    }

    return ancestors;
  };

  const ancestors = findAncestors(lotId);

  return (
    <div className="space-y-6">
      {/* Ancestors */}
      {ancestors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Lignée ascendante
          </h3>
          <div className="relative">
            {ancestors.map((ancestor, index) => {
              const variety = MOCK_VARIETIES.find(
                (v) => v.id === ancestor.varietyId
              );
              return (
                <div key={ancestor.id} className="mb-2">
                  <Card className="bg-gray-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {ancestor.level}
                          </Badge>
                          <span className="font-medium">{ancestor.id}</span>
                          <span className="text-sm text-gray-500">
                            {variety?.name || ancestor.variety}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(ancestor.productionDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  {index < ancestors.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
            {ancestors.length > 0 && (
              <div className="flex justify-center my-1">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current lot and descendants */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Lot sélectionné et descendance
        </h3>
        {renderNode(genealogyTree)}
      </div>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Résumé de la généalogie
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Générations ascendantes:</span>
              <span className="ml-2 font-medium text-blue-900">
                {ancestors.length}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Lots descendants directs:</span>
              <span className="ml-2 font-medium text-blue-900">
                {genealogyTree.children.length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenealogyViewer;
