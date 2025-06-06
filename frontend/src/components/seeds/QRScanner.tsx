// frontend/src/components/seeds/QRScanner.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Camera, X, QrCode } from "lucide-react";
import jsQR from "jsqr";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (lotId: string) => void;
}

const QRScanner = ({ isOpen, onClose, onScanSuccess }: QRScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Nettoyer la caméra à la fermeture
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsScanning(false);
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setIsScanning(true);
        scanQRCode();
      }
    } catch (err: any) {
      console.error("Erreur d'accès à la caméra:", err);
      if (err.name === "NotAllowedError") {
        setError(
          "Accès à la caméra refusé. Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur."
        );
      } else if (err.name === "NotFoundError") {
        setError(
          "Aucune caméra détectée. Assurez-vous que votre appareil dispose d'une caméra."
        );
      } else {
        setError("Erreur lors de l'accès à la caméra. Veuillez réessayer.");
      }
    }
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          handleQRCodeDetected(code.data);
          return;
        }
      }

      animationRef.current = requestAnimationFrame(scan);
    };

    scan();
  };

  const handleQRCodeDetected = (data: string) => {
    try {
      // Essayer de parser le QR code comme JSON
      const qrData = JSON.parse(data);

      if (qrData.lotId) {
        toast.success(`Lot ${qrData.lotId} scanné avec succès`);
        onScanSuccess(qrData.lotId);
        handleClose();
      } else {
        setError("QR code invalide: ID du lot non trouvé");
      }
    } catch (e) {
      // Si ce n'est pas du JSON, vérifier si c'est directement un ID de lot
      if (data.startsWith("SL-")) {
        toast.success(`Lot ${data} scanné avec succès`);
        onScanSuccess(data);
        handleClose();
      } else {
        setError("Format de QR code non reconnu");
      }
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Scanner un QR Code
          </DialogTitle>
          <DialogDescription>
            Positionnez le QR code du lot dans le cadre de la caméra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isScanning ? (
            <div className="text-center py-8">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <Camera className="w-32 h-32 text-gray-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-isra-green" />
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Cliquez sur le bouton ci-dessous pour activer la caméra et
                scanner un QR code
              </p>
              <Button
                onClick={startCamera}
                className="bg-isra-green hover:bg-isra-green-dark"
              >
                <Camera className="w-4 h-4 mr-2" />
                Activer la caméra
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Overlay de scan */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-black bg-opacity-50">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                      <div className="relative w-full h-full">
                        {/* Zone de scan claire */}
                        <div className="absolute inset-0 bg-transparent border-2 border-white"></div>

                        {/* Coins animés */}
                        <div className="absolute top-0 left-0 w-8 h-8">
                          <div className="absolute top-0 left-0 w-full h-1 bg-isra-green animate-pulse"></div>
                          <div className="absolute top-0 left-0 w-1 h-full bg-isra-green animate-pulse"></div>
                        </div>
                        <div className="absolute top-0 right-0 w-8 h-8">
                          <div className="absolute top-0 right-0 w-full h-1 bg-isra-green animate-pulse"></div>
                          <div className="absolute top-0 right-0 w-1 h-full bg-isra-green animate-pulse"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-8 h-8">
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-isra-green animate-pulse"></div>
                          <div className="absolute bottom-0 left-0 w-1 h-full bg-isra-green animate-pulse"></div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8">
                          <div className="absolute bottom-0 right-0 w-full h-1 bg-isra-green animate-pulse"></div>
                          <div className="absolute bottom-0 right-0 w-1 h-full bg-isra-green animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center mt-2">
                Alignez le QR code avec le cadre
              </p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {isScanning ? "Scan en cours..." : "Caméra inactive"}
            </p>
            <Button variant="outline" onClick={handleClose} className="gap-2">
              <X className="w-4 h-4" />
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
