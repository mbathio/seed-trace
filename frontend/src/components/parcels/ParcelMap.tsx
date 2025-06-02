import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Parcel } from "@/utils/seedTypes";

// Set up mapbox token
// Note: In production, you would store this token in environment variables
const MAPBOX_TOKEN = "REPLACE_WITH_ACTUAL_MAPBOX_TOKEN";

interface ParcelMapProps {
  parcels: Parcel[];
  selectedParcelId?: number;
  onParcelSelect?: (parcelId: number) => void;
  editMode?: boolean;
  onSaveLocation?: (location: { lat: number; lng: number }) => void;
}

const ParcelMap = ({
  parcels,
  selectedParcelId,
  onParcelSelect,
  editMode = false,
  onSaveLocation,
}: ParcelMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Record<number, mapboxgl.Marker>>({});
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_TOKEN);

  // State for edit mode
  const [tempMarker, setTempMarker] = useState<mapboxgl.Marker | null>(null);
  const [newLocation, setNewLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check if we need to ask user for a token
    if (mapboxToken === "REPLACE_WITH_ACTUAL_MAPBOX_TOKEN") {
      toast.warning("Entrez un token Mapbox pour activer la carte");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    try {
      // Create the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center:
          parcels.length > 0
            ? [parcels[0].location.lng, parcels[0].location.lat]
            : [-15.6786, 16.4625], // Default to Richard-Toll area
        zoom: 10,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Set up map for edit mode if needed
      if (editMode && map.current) {
        map.current.on("click", (e) => {
          const lngLat = e.lngLat;
          setNewLocation({ lat: lngLat.lat, lng: lngLat.lng });

          // Remove existing temp marker if any
          if (tempMarker) {
            tempMarker.remove();
          }

          // Create new marker
          const marker = new mapboxgl.Marker({
            color: "#34D399",
            draggable: true,
          })
            .setLngLat([lngLat.lng, lngLat.lat])
            .addTo(map.current!);

          marker.on("dragend", () => {
            const lngLat = marker.getLngLat();
            setNewLocation({ lat: lngLat.lat, lng: lngLat.lng });
          });

          setTempMarker(marker);
        });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Erreur d'initialisation de la carte");
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, parcels, editMode]);

  // Add markers for parcels
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markers.current).forEach((marker) => marker.remove());
    markers.current = {};

    // Add markers for each parcel
    parcels.forEach((parcel) => {
      const color =
        parcel.id === selectedParcelId
          ? "#3B82F6" // Blue for selected parcel
          : parcel.status === "AVAILABLE"
          ? "#10B981" // Green for available
          : parcel.status === "IN_USE"
          ? "#F59E0B" // Amber for in-use
          : "#6B7280"; // Gray for resting

      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${parcel.name || `Parcelle #${parcel.id}`}</h3>
          <p>${parcel.area} hectares</p>
          <p>${parcel.soilType || "Sol non spécifié"}</p>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      const marker = new mapboxgl.Marker({ color })
        .setLngLat([parcel.location.lng, parcel.location.lat])
        .setPopup(popup)
        .addTo(map.current!);

      if (onParcelSelect) {
        marker.getElement().addEventListener("click", () => {
          onParcelSelect(parcel.id);
        });
      }

      markers.current[parcel.id] = marker;
    });

    // Fit map to show all markers if there are any
    if (parcels.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      parcels.forEach((parcel) => {
        bounds.extend([parcel.location.lng, parcel.location.lat]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    // Center on selected parcel if any
    if (selectedParcelId) {
      const selectedParcel = parcels.find((p) => p.id === selectedParcelId);
      if (selectedParcel) {
        map.current.flyTo({
          center: [selectedParcel.location.lng, selectedParcel.location.lat],
          zoom: 14,
        });
      }
    }
  }, [parcels, selectedParcelId, onParcelSelect]);

  // Handle token input
  const handleTokenSubmit = () => {
    if (mapboxToken && mapboxToken !== "REPLACE_WITH_ACTUAL_MAPBOX_TOKEN") {
      // Reinitialize map with new token
      if (map.current) {
        map.current.remove();
        map.current = null;
      }

      localStorage.setItem("mapbox_token", mapboxToken);
      toast.success("Token Mapbox mis à jour");
    } else {
      toast.error("Token Mapbox invalide");
    }
  };

  // Handle save location in edit mode
  const handleSaveLocation = () => {
    if (newLocation && onSaveLocation) {
      onSaveLocation(newLocation);
      toast.success("Localisation enregistrée");
    } else {
      toast.error("Veuillez sélectionner un emplacement sur la carte");
    }
  };

  // Check for saved token on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("mapbox_token");
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  return (
    <Card className="overflow-hidden">
      {mapboxToken === "REPLACE_WITH_ACTUAL_MAPBOX_TOKEN" && (
        <div className="p-4 bg-amber-50 border-b border-amber-200">
          <Label htmlFor="mapbox-token">
            Entrez votre token Mapbox pour activer la carte:
          </Label>
          <div className="flex items-center gap-2 mt-2">
            <Input
              id="mapbox-token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1IjoieW91..."
              className="flex-1"
            />
            <Button onClick={handleTokenSubmit}>Appliquer</Button>
          </div>
          <p className="text-xs text-amber-600 mt-1">
            Obtenir un token sur{" "}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      )}
      <div ref={mapContainer} className="h-[400px]" />

      {editMode && (
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              {newLocation && (
                <p className="text-sm text-gray-600">
                  Position: {newLocation.lat.toFixed(6)},{" "}
                  {newLocation.lng.toFixed(6)}
                </p>
              )}
            </div>
            <Button
              onClick={handleSaveLocation}
              disabled={!newLocation}
              className="bg-isra-green hover:bg-isra-green-dark"
            >
              Enregistrer la position
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ParcelMap;
