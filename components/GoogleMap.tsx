// components/GoogleMap.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadGoogleMaps,
  MELLY_MAP_OPTIONS,
  createMellyPin,
  fitBoundsTo,
} from "@/lib/google-maps";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  rank?: number;
  title?: string;
  onClick?: () => void;
};

export default function GoogleMap({
  markers,
  highlightedId = null,
  center,
  zoom,
  className = "w-full h-full",
  onMarkerClick,
}: {
  markers: MapMarker[];
  highlightedId?: string | null;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onMarkerClick?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRefs = useRef<
    Map<string, google.maps.marker.AdvancedMarkerElement>
  >(new Map());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !containerRef.current) return;
        const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
        const map = new google.maps.Map(containerRef.current, {
          ...MELLY_MAP_OPTIONS,
          center: center ?? markers[0] ?? { lat: 0, lng: 0 },
          zoom: zoom ?? 13,
          mapId,
        });
        mapRef.current = map;
        renderMarkers(map);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[GoogleMap] failed to load:", err);
        setError("Map unavailable");
      });

    return () => {
      cancelled = true;
      markerRefs.current.forEach((m) => (m.map = null));
      markerRefs.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    renderMarkers(mapRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  useEffect(() => {
    markerRefs.current.forEach((m, id) => {
      const marker = markers.find((x) => x.id === id);
      if (!marker) return;
      m.content = createMellyPin({
        rank: marker.rank,
        highlighted: id === highlightedId,
      });
      if (id === highlightedId && mapRef.current) {
        mapRef.current.panTo({ lat: marker.lat, lng: marker.lng });
      }
    });
  }, [highlightedId, markers]);

  function renderMarkers(map: google.maps.Map) {
    markerRefs.current.forEach((m) => (m.map = null));
    markerRefs.current.clear();

    for (const m of markers) {
      const pin = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: m.lat, lng: m.lng },
        content: createMellyPin({
          rank: m.rank,
          highlighted: m.id === highlightedId,
        }),
        title: m.title,
      });
      pin.addListener("click", () => {
        if (m.onClick) m.onClick();
        if (onMarkerClick) onMarkerClick(m.id);
      });
      markerRefs.current.set(m.id, pin);
    }

    if (markers.length > 1) {
      fitBoundsTo(
        map,
        markers.map((m) => ({ lat: m.lat, lng: m.lng })),
      );
    }
  }

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-stone-100 text-gray-400 text-sm rounded-2xl`}
      >
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className={`${className} rounded-2xl`} />;
}
