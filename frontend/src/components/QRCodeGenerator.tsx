
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QRCodeSVG } from 'qrcode.react';
import { mockSeedLots } from '@/data/mock-data';
import { toast } from 'sonner';
import { Download, Printer } from 'lucide-react';

export function QRCodeGenerator() {
  const [selectedLot, setSelectedLot] = useState('');
  const [printSize, setPrintSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [qrGenerated, setQrGenerated] = useState(false);

  const selectedLotData = mockSeedLots.find(lot => lot.id === selectedLot);

  // Create a URL for the seed lot that includes all relevant information
  const qrCodeData = selectedLotData 
    ? `https://seedtracker.example.com/seed-lots/${selectedLotData.id}` 
    : '';

  const handleGenerateClick = () => {
    if (!selectedLotData) {
      toast.error("Veuillez sélectionner un lot de semences");
      return;
    }
    
    setQrGenerated(true);
    toast.success("QR Code généré avec succès");
  };

  const handlePrint = () => {
    if (!qrGenerated) {
      toast.error("Veuillez d'abord générer un QR Code");
      return;
    }
    
    toast.success(`Impression de ${quantity} étiquettes en cours...`);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownload = () => {
    if (!qrGenerated || !selectedLotData) {
      toast.error("Veuillez d'abord générer un QR Code");
      return;
    }

    // Get the SVG element
    const svgElement = document.getElementById('seed-lot-qrcode');
    if (!svgElement) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const size = printSize === 'small' ? 200 : printSize === 'medium' ? 300 : 400;
    canvas.width = size;
    canvas.height = size;
    
    // Draw the SVG to the canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      
      // Convert canvas to PNG and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `QRCode_${selectedLotData.code}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        toast.success("QR Code téléchargé");
      });
    };
    
    img.src = url;
  };

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
              <Select value={selectedLot} onValueChange={(value) => {
                setSelectedLot(value);
                setQrGenerated(false);
              }}>
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
              <Input 
                id="quantity" 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                min="1" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full" onClick={handleGenerateClick} disabled={!selectedLot}>
              Générer QR Code
            </Button>
            <div className="flex gap-2 w-full">
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={handlePrint}
                disabled={!qrGenerated}
              >
                <Printer className="mr-2 h-4 w-4" /> Imprimer
              </Button>
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={handleDownload}
                disabled={!qrGenerated}
              >
                <Download className="mr-2 h-4 w-4" /> Télécharger
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="print-qr-content">
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {selectedLotData && qrGenerated ? (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <QRCodeSVG 
                    id="seed-lot-qrcode"
                    value={qrCodeData}
                    size={printSize === 'small' ? 128 : printSize === 'medium' ? 192 : 256}
                    level="H" // High error correction
                    includeMargin={true}
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
                  Sélectionnez un lot et cliquez sur "Générer QR Code"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Print-only section with multiple copies */}
      <div className="hidden print:block mt-8">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: quantity }).map((_, index) => (
            <div key={index} className="flex flex-col items-center p-4 border border-dashed">
              {selectedLotData && (
                <>
                  <QRCodeSVG 
                    value={qrCodeData}
                    size={printSize === 'small' ? 128 : printSize === 'medium' ? 192 : 256}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="text-center mt-2">
                    <p className="font-bold">{selectedLotData.code}</p>
                    <p className="text-sm">{selectedLotData.variety.name}</p>
                    <p className="text-sm">
                      {selectedLotData.level} | Pureté: {selectedLotData.purity}% | Germ.: {selectedLotData.germination}%
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add print styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-qr-content * {
            visibility: hidden;
          }
          .print:block, .print:block * {
            visibility: visible;
          }
          .print:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default QRCodeGenerator;
