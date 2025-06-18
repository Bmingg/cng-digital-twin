"use client";

import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Map, Source, Layer, Marker, Popup, LayerProps } from 'react-map-gl/maplibre';
import { CLIENT_ENV } from '@/lib/env';
import 'maplibre-gl/dist/maplibre-gl.css';

const lineLayer = {
  id: 'route-line',
  type: 'line',
  source: 'route',
  paint: {
    'line-color': '#3887be',
    'line-width': 5,
    'line-opacity': 0.75,
  },
};

const completedRouteLayer: LayerProps = {
  id: 'completed-route',
  type: 'line',
  source: 'route',
  filter: ['==', 'type', 'completed'],
  paint: {
    'line-color': '#4CAF50',
    'line-width': 5,
    'line-opacity': 0.75,
  },
};

const currentRouteLayer: LayerProps = {
  id: 'current-route',
  type: 'line',
  source: 'route',
  filter: ['==', 'type', 'current'],
  paint: {
    'line-color': '#2196F3',
    'line-width': 7,
    'line-opacity': 0.9,
  },
};

const upcomingRouteLayer: LayerProps = {
  id: 'upcoming-route',
  type: 'line',
  source: 'route',
  filter: ['==', 'type', 'upcoming'],
  paint: {
    'line-color': '#FFA500',
    'line-width': 5,
    'line-opacity': 0.75,
  },
};

const routeOrderLayer = {
  id: 'route-order',
  type: 'symbol',
  source: 'route',
  layout: {
    'text-field': ['get', 'order'],
    'text-size': 12,
  },
  paint: {
    'text-color': '#ffffff',
    'text-halo-color': '#000000',
    'text-halo-width': 1,
  },
};

interface MapViewProps {
  coordinates: Array<{
    id: string;
    latitude: number;
    longitude: number;
    name?: string;
  }>;
  currentRouteIndex?: number;
}

export function MapView({ coordinates, currentRouteIndex = 3 }: MapViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [route, setRoute] = useState(null);
  const [truckPosition, setTruckPosition] = useState<[number, number] | null>(null);
  const [stationMarkers, setStationMarkers] = useState<any[]>([]);
  const [isTruckPopupVisible, setIsTruckPopupVisible] = useState(false);

  const sampleCoordinates = [
    { id: "1", name: "Thái Nguyên", latitude: 21.5928, longitude: 105.8442 },
    { id: "2", name: "Bắc Ninh",    latitude: 21.18, longitude: 106.07 },
    { id: "3", name: "Hải Dương",   latitude: 20.93, longitude: 106.32 },
    { id: "4", name: "Hưng Yên",    latitude: 20.65, longitude: 106.05 },
    { id: "5", name: "Hà Nam",      latitude: 20.54, longitude: 105.91 },
    { id: "6", name: "Hòa Bình",    latitude: 20.81, longitude: 105.34 },
  ];

  useEffect(() => {
    const routeCoords = [...sampleCoordinates, sampleCoordinates[0]];
    if (routeCoords.length > 1) {
      const fetchRoute = async () => {
        const coordsString = routeCoords
          .map(coord => `${coord.longitude},${coord.latitude}`)
          .join(';');
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&steps=true&access_token=${CLIENT_ENV.MAPBOX_ACCESS_TOKEN}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            
            if (data.waypoints) {
              const markers = data.waypoints.slice(0, 6).map((waypoint: any, index: number) => ({
                id: sampleCoordinates[index].id,
                name: sampleCoordinates[index].name,
                longitude: waypoint.location[0],
                latitude: waypoint.location[1],
              }));
              setStationMarkers(markers);
            }

            const routeLegs = data.routes[0].legs;
            const features = routeLegs.map((leg: any, index: number) => {
              let type = 'upcoming';
              if (index < currentRouteIndex - 1) {
                type = 'completed';
              } else if (index === currentRouteIndex - 1) {
                type = 'current';
              }
              
              const legCoordinates = leg.steps.flatMap((step: any) => step.geometry.coordinates);

              return {
                type: 'Feature',
                properties: { type },
                geometry: {
                  type: 'LineString',
                  coordinates: legCoordinates,
                },
              };
            });

            setRoute({
              type: 'FeatureCollection',
              features,
            } as any);

            const currentLegIndex = currentRouteIndex - 1;
            if (routeLegs[currentLegIndex] && routeLegs[currentLegIndex].steps.length > 0) {
                const startOfCurrentLeg = routeLegs[currentLegIndex].steps[0].geometry.coordinates[0];
                setTruckPosition(startOfCurrentLeg);
            }
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      };

      fetchRoute();
    }
  }, []);

  const routeGeoJson = route;

  // Calculate the center point of all coordinates
  const center = sampleCoordinates.length > 0
    ? {
        latitude: sampleCoordinates.reduce((sum, coord) => sum + coord.latitude, 0) / sampleCoordinates.length,
        longitude: sampleCoordinates.reduce((sum, coord) => sum + coord.longitude, 0) / sampleCoordinates.length,
      }
    : { latitude: 10.762622, longitude: 106.660172 }; // Default to Ho Chi Minh City

  return (
    <div className="w-full h-full">
      <Map
        mapLib={import('maplibre-gl')}
        initialViewState={{
          longitude: center.longitude,
          latitude: center.latitude,
          zoom: 8
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {routeGeoJson && (
          <Source id="route" type="geojson" data={routeGeoJson}>
            <Layer {...completedRouteLayer} />
            <Layer {...currentRouteLayer} />
            <Layer {...upcomingRouteLayer} />
          </Source>
        )}
        {truckPosition && (
          <div
             onMouseEnter={() => setIsTruckPopupVisible(true)}
             onMouseLeave={() => setIsTruckPopupVisible(false)}
          >
            <Marker
              longitude={truckPosition[0]}
              latitude={truckPosition[1]}
              anchor="center"
              offset={[0, 15]}
            >
              <div className="w-8 h-8">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                    fill="#FF0000"
                  />
                </svg>
              </div>
            </Marker>
            {isTruckPopupVisible && (
               <Popup
                longitude={truckPosition[0]}
                latitude={truckPosition[1]}
                anchor="bottom"
                closeButton={false}
                closeOnClick={false}
                offset={20}
                className="z-50"
              >
                <div className="p-2 font-bold">
                  On route to {sampleCoordinates[currentRouteIndex % sampleCoordinates.length].name}
                </div>
              </Popup>
            )}
          </div>
        )}
        {stationMarkers.map((marker, index) => (
          <React.Fragment key={marker.id}>
            <Marker
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="bottom"
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                setSelectedMarker(marker.id);
              }}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <div className="text-xs bg-white bg-opacity-75 rounded px-1 mb-1">
                  {marker.name}
                </div>
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
              </div>
            </Marker>
            {selectedMarker === marker.id && (
              <Popup
                longitude={marker.longitude}
                latitude={marker.latitude}
                anchor="bottom"
                onClose={() => setSelectedMarker(null)}
                closeButton={true}
                closeOnClick={false}
                className="z-50"
              >
                <div className="p-2">
                  <h3 className="font-bold text-sm mb-1">{marker.name}</h3>
                  <p className="text-xs text-gray-600">
                    Lat: {marker.latitude.toFixed(6)}<br />
                    Long: {marker.longitude.toFixed(6)}
                  </p>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
      </Map>
    </div>
  );
} 