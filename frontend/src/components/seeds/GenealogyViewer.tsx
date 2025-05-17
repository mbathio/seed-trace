
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SeedLot, MOCK_SEED_LOTS, MOCK_VARIETIES } from '@/utils/seedTypes';

interface GenealogyViewerProps {
  lotId: string;
}

const GenealogyViewer = ({ lotId }: GenealogyViewerProps) => {
  const [expandedView, setExpandedView] = useState(false);

  // Find the current lot
  const currentLot = MOCK_SEED_LOTS.find(lot => lot.id === lotId);
  if (!currentLot) return <p>Lot non trouvé</p>;

  // Find the variety
  const variety = MOCK_VARIETIES.find(v => v.id === currentLot.varietyId);
  if (!variety) return <p>Variété non trouvée</p>;

  // Function to find parent lots recursively
  const findAncestors = (lot: SeedLot): SeedLot[] => {
    if (!lot.parentLotId) return [];
    
    const parent = MOCK_SEED_LOTS.find(l => l.id === lot.parentLotId);
    if (!parent) return [];
    
    return [parent, ...findAncestors(parent)];
  };

  // Function to find child lots recursively
  const findDescendants = (lot: SeedLot): SeedLot[] => {
    const children = MOCK_SEED_LOTS.filter(l => l.parentLotId === lot.id);
    if (children.length === 0) return [];
    
    return [...children, ...children.flatMap(child => findDescendants(child))];
  };

  const ancestors = findAncestors(currentLot);
  const descendants = findDescendants(currentLot);

  // Sort all lots by level for display
  const allRelatedLots = [...ancestors, currentLot, ...descendants].sort((a, b) => {
    const levelOrder = { 'GO': 0, 'G1': 1, 'G2': 2, 'G3': 3, 'R1': 4, 'R2': 5 };
    return levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder];
  });

  // Simplified view shows just direct parent and children
  const simplifiedView = [
    ...ancestors.slice(0, 1),
    currentLot,
    ...descendants.slice(0, 2)
  ];

  const lotsToDisplay = expandedView ? allRelatedLots : simplifiedView;

  const getLotCardClasses = (lot: SeedLot) => {
    const baseClasses = "p-4 rounded-lg shadow-sm";
    if (lot.id === currentLot.id) return `${baseClasses} border-2 border-isra-green bg-isra-green-light bg-opacity-20`;
    
    let bgColor = "";
    switch (lot.level) {
      case 'GO': bgColor = "bg-isra-brown bg-opacity-10"; break;
      case 'G1': bgColor = "bg-blue-100"; break;
      case 'G2': bgColor = "bg-amber-100"; break;
      case 'G3': bgColor = "bg-green-100"; break;
      case 'R1': bgColor = "bg-purple-100"; break;
      case 'R2': bgColor = "bg-pink-100"; break;
      default: bgColor = "bg-gray-100";
    }
    
    return `${baseClasses} ${bgColor}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Généalogie du lot: {currentLot.id}</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setExpandedView(!expandedView)}
        >
          {expandedView ? "Vue simplifiée" : "Vue complète"}
        </Button>
      </div>

      <Card>
        <CardContent className="py-6">
          {lotsToDisplay.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {lotsToDisplay.map((lot) => (
                <div key={lot.id} className={getLotCardClasses(lot)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-xs font-bold text-white bg-isra-green rounded-full">
                          {lot.level}
                        </span>
                        <h4 className="font-medium">{lot.id}</h4>
                      </div>
                      <p className="text-sm text-gray-500">
                        {variety.name} - {lot.quantity} kg
                      </p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="font-medium">
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
                  
                  {lot.id !== allRelatedLots[allRelatedLots.length - 1].id && (
                    <div className="flex justify-center my-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Aucune information généalogique disponible pour ce lot</p>
          )}
        </CardContent>
      </Card>
      
      {!expandedView && allRelatedLots.length > simplifiedView.length && (
        <p className="text-xs text-center text-gray-500">
          {allRelatedLots.length - simplifiedView.length} autre(s) lot(s) lié(s) non affiché(s). Cliquez sur "Vue complète" pour tout voir.
        </p>
      )}
    </div>
  );
};

export default GenealogyViewer;
