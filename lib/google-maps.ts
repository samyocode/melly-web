// lib/google-maps.ts
//
// Singleton Google Maps loader using the v2 API (setOptions + importLibrary).
// The old Loader class was removed in @googlemaps/js-api-loader v2.0.

import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadGoogleMaps called server-side"));
  }
  if (initPromise) return initPromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set"),
    );
  }

  initPromise = (async () => {
    setOptions({
      key: apiKey,
      v: "weekly",
    });

    // Load the libraries we need. Once these resolve, the global
    // `google.maps` namespace is also populated, so callers can
    // continue using `new google.maps.Map(...)` etc.
    await Promise.all([importLibrary("maps"), importLibrary("marker")]);

    return google;
  })();

  return initPromise;
}

export const MELLY_MAP_OPTIONS: google.maps.MapOptions = {
  styles: [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
  ],
  disableDefaultUI: false,
  clickableIcons: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  gestureHandling: "greedy",
};

export function createMellyPin(opts: {
  rank?: number;
  highlighted?: boolean;
}): HTMLElement {
  const { rank, highlighted = false } = opts;
  const wrapper = document.createElement("div");
  wrapper.className = "melly-pin";
  const inner = document.createElement("div");
  inner.style.cssText = [
    "width: " + (highlighted ? "36px" : "28px") + ";",
    "height: " + (highlighted ? "36px" : "28px") + ";",
    "background: " + (highlighted ? "#db2777" : "#ec4899") + ";",
    "border: 2.5px solid white;",
    "border-radius: 50%;",
    "display: flex;",
    "align-items: center;",
    "justify-content: center;",
    "color: white;",
    "font-weight: 800;",
    "font-size: " + (highlighted ? "13px" : "11px") + ";",
    "font-family: -apple-system, BlinkMacSystemFont, sans-serif;",
    "box-shadow: 0 2px 8px rgba(219, 39, 119, 0.4);",
    "cursor: pointer;",
    "transition: transform 0.15s ease;",
    "transform: " + (highlighted ? "scale(1.1)" : "scale(1)") + ";",
  ].join(" ");
  if (rank != null) inner.textContent = String(rank);
  wrapper.appendChild(inner);
  return wrapper;
}

export function fitBoundsTo(
  map: google.maps.Map,
  points: Array<{ lat: number; lng: number }>,
  padding = 60,
) {
  if (points.length === 0) return;
  if (points.length === 1) {
    map.setCenter(points[0]);
    map.setZoom(15);
    return;
  }
  const bounds = new google.maps.LatLngBounds();
  for (const p of points) bounds.extend(p);
  map.fitBounds(bounds, padding);
}

export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round((meters / 1000) * (60 / 4.5)));
}
