
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSeedLots } from '@/data/mock-data';

export function QRCodeGenerator() {
  const [selectedLot, setSelectedLot] = useState('');
  const [printSize, setPrintSize] = useState('medium');

  const selectedLotData = mockSeedLots.find(lot => lot.id === selectedLot);

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Générateur de QR Code</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lot-select">Sélectionner un lot</Label>
              <Select value={selectedLot} onValueChange={setSelectedLot}>
                <SelectTrigger id="lot-select">
                  <SelectValue placeholder="Choisir un lot" />
                </SelectTrigger>
                <SelectContent>
                  {mockSeedLots.map(lot => (
                    <SelectItem key={lot.id} value={lot.id}>
                      {lot.code} - {lot.variety.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="print-size">Taille d'impression</Label>
              <Select value={printSize} onValueChange={setPrintSize}>
                <SelectTrigger id="print-size">
                  <SelectValue placeholder="Taille d'impression" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petit (50x50mm)</SelectItem>
                  <SelectItem value="medium">Moyen (80x80mm)</SelectItem>
                  <SelectItem value="large">Grand (120x120mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Nombre d'étiquettes</Label>
              <Input id="quantity" type="number" defaultValue="1" min="1" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Générer et Imprimer</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {selectedLotData ? (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <img 
                    src={selectedLotData.qrCode} 
                    alt={`QR Code pour ${selectedLotData.code}`}
                    className={`
                      ${printSize === 'small' ? 'w-32 h-32' : 
                        printSize === 'medium' ? 'w-48 h-48' : 
                        'w-64 h-64'}
                      border border-border p-2
                    `}
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">{selectedLotData.code}</p>
                  <p className="text-sm">{selectedLotData.variety.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Niveau: {selectedLotData.level} | Pureté: {selectedLotData.purity}% | Germ.: {selectedLotData.germination}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Prod: {new Date(selectedLotData.productionDate).toLocaleDateString('fr-FR')} | 
                    Exp: {new Date(selectedLotData.expiryDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-medium mb-2">QR Code non généré</h3>
                <p className="text-muted-foreground">
                  Sélectionnez un lot pour générer son QR Code
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default QRCodeGenerator;
