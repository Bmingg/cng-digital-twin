"use client";

import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Map, Source, Layer, Marker, Popup, LayerProps, useMap } from 'react-map-gl/maplibre';
import { CLIENT_ENV } from '@/lib/env';
import 'maplibre-gl/dist/maplibre-gl.css';

interface RouteLocation {
  step: number;
  location_type: string;
  location_id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  activity: string;
  estimated_time: string;
  actual_time: string;
}

interface RouteData {
  assignment_id: string;
  route_locations: RouteLocation[];
  total_steps: number;
  assignment_status: string;
}

interface RouteMapProps {
  routeData: RouteData | null;
  token: string;
}

function RouteMapController({ routeData }: { routeData: RouteData | null }) {
  const { current: map } = useMap();

  useEffect(() => {
    if (map && routeData && routeData.route_locations.length > 0) {
      const locations = routeData.route_locations;
      
      // Calculate bounds
      const bounds = locations.reduce(
        (bounds, location) => {
          return [
            [Math.min(bounds[0][0], location.longitude), Math.min(bounds[0][1], location.latitude)],
            [Math.max(bounds[1][0], location.longitude), Math.max(bounds[1][1], location.latitude)]
          ];
        },
        [[locations[0].longitude, locations[0].latitude], [locations[0].longitude, locations[0].latitude]]
      );

      // Add padding to bounds
      const padding = 0.15; // 15% padding for routes
      const latDiff = bounds[1][1] - bounds[0][1];
      const lngDiff = bounds[1][0] - bounds[0][0];
      
      const paddedBounds: [[number, number], [number, number]] = [
        [bounds[0][0] - lngDiff * padding, bounds[0][1] - latDiff * padding],
        [bounds[1][0] + lngDiff * padding, bounds[1][1] + latDiff * padding]
      ];

      map.fitBounds(paddedBounds, { padding: 50, duration: 1000 });
    }
  }, [map, routeData]);

  return null;
}

const routeLineLayer: LayerProps = {
  id: 'route-line',
  type: 'line',
  source: 'route',
  paint: {
    'line-color': '#2196F3',
    'line-width': 6,
    'line-opacity': 0.8,
  },
};

const completedRouteLayer: LayerProps = {
  id: 'completed-route',
  type: 'line',
  source: 'route',
  filter: ['==', ['get', 'status'], 'completed'],
  paint: {
    'line-color': '#4CAF50',
    'line-width': 6,
    'line-opacity': 0.8,
  },
};

const currentRouteLayer: LayerProps = {
  id: 'current-route',
  type: 'line',
  source: 'route',
  filter: ['==', ['get', 'status'], 'current'],
  paint: {
    'line-color': '#FF9800',
    'line-width': 8,
    'line-opacity': 0.9,
  },
};

const upcomingRouteLayer: LayerProps = {
  id: 'upcoming-route',
  type: 'line',
  source: 'route',
  filter: ['==', ['get', 'status'], 'upcoming'],
  paint: {
    'line-color': '#9E9E9E',
    'line-width': 4,
    'line-opacity': 0.6,
  },
};

export function RouteMap({ routeData, token }: RouteMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [truckPosition, setTruckPosition] = useState<[number, number] | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (!routeData || routeData.route_locations.length === 0) {
      setRouteGeoJson(null);
      setTruckPosition(null);
      return;
    }

    const fetchRoute = async () => {
      const locations = routeData.route_locations;
      const coordsString = locations
        .map(loc => `${loc.longitude},${loc.latitude}`)
        .join(';');
      
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&steps=true&access_token=${CLIENT_ENV.MAPBOX_ACCESS_TOKEN}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const routeLegs = data.routes[0].legs;
          const features: any[] = [];
          
          // Create separate line segments for each status
          let completedCoords: number[][] = [];
          let currentCoords: number[][] = [];
          let upcomingCoords: number[][] = [];
          
          routeLegs.forEach((leg: any, index: number) => {
            const location = locations[index];
            const status = getRouteStatus(location, currentStep);
            const legCoordinates = leg.steps.flatMap((step: any) => step.geometry.coordinates);
            
            // Add coordinates to the appropriate status array
            if (status === 'completed') {
              completedCoords.push(...legCoordinates);
            } else if (status === 'current') {
              currentCoords.push(...legCoordinates);
            } else {
              upcomingCoords.push(...legCoordinates);
            }
          });
          
          // Create features for each status
          if (completedCoords.length > 0) {
            features.push({
              type: 'Feature',
              properties: { status: 'completed' },
              geometry: {
                type: 'LineString',
                coordinates: completedCoords,
              },
            });
          }
          
          if (currentCoords.length > 0) {
            features.push({
              type: 'Feature',
              properties: { status: 'current' },
              geometry: {
                type: 'LineString',
                coordinates: currentCoords,
              },
            });
          }
          
          if (upcomingCoords.length > 0) {
            features.push({
              type: 'Feature',
              properties: { status: 'upcoming' },
              geometry: {
                type: 'LineString',
                coordinates: upcomingCoords,
              },
            });
          }

          setRouteGeoJson({
            type: 'FeatureCollection',
            features,
          });

          // Set truck position to current step
          if (locations[currentStep]) {
            setTruckPosition([locations[currentStep].longitude, locations[currentStep].latitude]);
          }
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        // Fallback: create simple line between points
        const coordinates = locations.map(loc => [loc.longitude, loc.latitude]);
        setRouteGeoJson({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: { status: 'upcoming' },
            geometry: {
              type: 'LineString',
              coordinates,
            },
          }],
        });
        if (locations[currentStep]) {
          setTruckPosition([locations[currentStep].longitude, locations[currentStep].latitude]);
        }
      }
    };

    fetchRoute();
  }, [routeData, currentStep]);

  // Calculate center point
  const center = routeData && routeData.route_locations.length > 0
    ? {
        latitude: routeData.route_locations.reduce((sum, loc) => sum + loc.latitude, 0) / routeData.route_locations.length,
        longitude: routeData.route_locations.reduce((sum, loc) => sum + loc.longitude, 0) / routeData.route_locations.length,
      }
    : { latitude: 10.762622, longitude: 106.660172 }; // Default to Ho Chi Minh City

  const getLocationIcon = (locationType: string) => {
    switch (locationType.toLowerCase()) {
      case 'customer':
        return '🏢';
      case 'station':
        return '🏪';
      case 'compression_station':
        return '🏭';
      default:
        return '📍';
    }
  };

  const getLocationColor = (locationType: string) => {
    switch (locationType.toLowerCase()) {
      case 'customer':
        return 'bg-blue-500';
      case 'station':
        return 'bg-green-500';
      case 'compression_station':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRouteStatus = (location: RouteLocation, currentStep: number) => {
    if (location.actual_time) {
      return 'completed';
    } else if (location.step === currentStep) {
      return 'current';
    } else {
      return 'upcoming';

    }
  };

  const getRouteStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50'; // Green for completed
      case 'current':
        return '#FF9800'; // Orange for current
      case 'upcoming':
        return '#9E9E9E'; // Gray for upcoming
      default:
        return '#9E9E9E';
    }
  };

  if (!routeData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-8">
          <div className="text-gray-400 text-6xl mb-4">🗺️</div>
          <div className="text-gray-600 text-xl font-semibold mb-2">
            Route Map
          </div>
          <div className="text-gray-500 text-base">
            Select an assignment to view its route
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Map
        mapLib={import('maplibre-gl')}
        initialViewState={{
          longitude: center.longitude,
          latitude: center.latitude,
          zoom: 10
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <RouteMapController routeData={routeData} />
        
        {/* Route Lines */}
        {routeGeoJson && (
          <Source id="route" type="geojson" data={routeGeoJson}>
            <Layer {...completedRouteLayer} />
            <Layer {...currentRouteLayer} />
            <Layer {...upcomingRouteLayer} />
          </Source>
        )}

        {/* Truck Marker */}
        {truckPosition && (
          <Marker
            longitude={truckPosition[0]}
            latitude={truckPosition[1]}
            anchor="center"
            offset={[0, 15]}
          >
            <div className="w-10 h-10">
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
        )}

        {/* Location Markers */}
        {routeData.route_locations.map((location, index) => (
          <React.Fragment key={location.step}>
            <Marker
              longitude={location.longitude}
              latitude={location.latitude}
              anchor="bottom"
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                setSelectedMarker(location.step.toString());
              }}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <div className="text-xs bg-white bg-opacity-90 rounded px-2 py-1 mb-1 shadow-sm">
                  {location.name}
                </div>
                <svg width="24" height="32" viewBox="0 0 24 32" className="drop-shadow-lg">
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20c0-6.627-5.373-12-12-12z"
                    fill={getRouteStatusColor(getRouteStatus(location, currentStep))}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="12" r="4" fill="white" />
                </svg>
              </div>
            </Marker>
            {selectedMarker === location.step.toString() && (
              <Popup
                longitude={location.longitude}
                latitude={location.latitude}
                anchor="bottom"
                onClose={() => setSelectedMarker(null)}
                closeButton={true}
                closeOnClick={false}
                className="z-50"
              >
                <div className="p-3 max-w-xs">
                  <h3 className="font-bold text-sm mb-2">{location.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{location.address}</p>
                  <div className="text-xs">
                    <p><strong>Activity:</strong> {location.activity}</p>
                    <p><strong>Type:</strong> {location.location_type}</p>
                    <p><strong>Step:</strong> {location.step}</p>
                    {location.actual_time && (
                      <p className="text-green-600"><strong>Completed:</strong> {new Date(location.actual_time).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
      </Map>
    </div>
  );
} 
