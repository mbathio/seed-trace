
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
  lotId: string;
  varietyName: string;
  level: string;
}

const QRCodeGenerator = ({ lotId, varietyName, level }: QRCodeGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // We're using a free QR code API for demonstration
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    JSON.stringify({
      lotId,
      varietyName,
      level,
      timestamp: new Date().toISOString()
    })
  )}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${lotId}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              .container { max-width: 400px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; }
              img { max-width: 100%; height: auto; }
              .details { margin-top: 20px; text-align: left; }
              .details p { margin: 5px 0; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Semence ISRA Saint-Louis</h2>
              <img src="${qrCodeUrl}" alt="QR Code pour ${lotId}" />
              <div class="details">
                <p><strong>ID du lot:</strong> ${lotId}</p>
                <p><strong>Variété:</strong> ${varietyName}</p>
                <p><strong>Niveau:</strong> ${level}</p>
                <p><strong>Date de génération:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <button onclick="window.print()">Imprimer</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = () => {
    setIsLoading(true);
    
    // Create an anchor element and set properties for download
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${lotId}.png`;
    
    // Append to the document, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("QR Code téléchargé avec succès");
    setIsLoading(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="border p-4 rounded-lg bg-white mb-4">
          <img src={qrCodeUrl} alt={`QR Code pour le lot ${lotId}`} className="max-w-full h-auto" />
        </div>
        <div className="text-center mb-4">
          <p className="font-medium text-lg">{lotId}</p>
          <p className="text-gray-500">{varietyName} - Niveau {level}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handlePrint}
          >
            Imprimer
          </Button>
          <Button 
            className="flex-1 bg-isra-green hover:bg-isra-green-dark" 
            onClick={handleDownload}
            disabled={isLoading}
          >
            {isLoading ? "Téléchargement..." : "Télécharger"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
