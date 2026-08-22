"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/components/language-provider";

interface MapComponentProps {
  position: {
    lat: number;
    lng: number;
  };
}

export default function MapComponent({ position }: MapComponentProps) {
  const { tr } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Cleanup old map if it exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current) return;

      const map = L.map(mapRef.current, { closePopupOnClick: false }).setView(
        [position.lat, position.lng],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.marker([position.lat, position.lng])
        .addTo(map)
        .bindPopup(
          `<div style="text-align:center;">
            <strong>Voice Market</strong><br/>
            ${tr("ვაჟა-ფშაველას III კვარტალი, კორპუსი 23", "23 Vazha-Pshavela III Quarter")}<br/>
            ${tr("თბილისი, საქართველო", "Tbilisi, Georgia")}
          </div>`
        )
        .openPopup();

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [position, tr]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
