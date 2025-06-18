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

const routeLayer: LayerProps = {
  id: 'route',
  type: 'line',
  source: 'route',
  paint: {
    'line-color': [
      'case',
      ['==', ['get', 'status'], 'completed'], '#4CAF50',
      ['==', ['get', 'status'], 'current'], '#FF9800',
      ['==', ['get', 'status'], 'upcoming'], '#9E9E9E',
      '#2196F3' // default color
    ],
    'line-width': [
      'case',
      ['==', ['get', 'status'], 'current'], 8,
      6
    ],
    'line-opacity': 0.8,
  },
};

export function RouteMap({ routeData, token }: RouteMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [truckPosition, setTruckPosition] = useState<[number, number] | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Update current step based on assignment status
  useEffect(() => {
    if (!routeData) {
      setCurrentStep(0);
      return;
    }

    // Map assignment status to step number
    const statusToStep: { [key: string]: number } = {
      'PLANNED': 0,
      'LOADING_TANK': 1,
      'FILLING_GAS': 2,
      'DELIVERING_GAS': 3,
      'UNLOADING_TANK': 4,
      'COMPLETED': routeData.total_steps,
      'CANCELLED': 0
    };

    const step = statusToStep[routeData.assignment_status] || 0;
    setCurrentStep(step);
  }, [routeData?.assignment_status, routeData?.total_steps]);

  useEffect(() => {
    if (!routeData || routeData.route_locations.length === 0) {
      setRouteGeoJson(null);
      setTruckPosition(null);
      return;
    }

    const fetchRoute = async () => {
      const locations = routeData.route_locations;
      
      console.log('RouteMap Debug:', {
        routeData,
        currentStep,
        locations: locations.map(loc => ({
          step: loc.step,
          name: loc.name,
          type: loc.location_type,
          status: getRouteStatus(loc, currentStep)
        }))
      });

      const coordsString = locations
        .map(loc => `${loc.longitude},${loc.latitude}`)
        .join(';');
      
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&steps=true&access_token=${CLIENT_ENV.MAPBOX_ACCESS_TOKEN}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Mapbox API URL:', url);
        console.log('Mapbox API Response:', data);
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          console.log('Route geometry:', route.geometry);
          console.log('Route legs:', route.legs);
          
          const features: any[] = [];
          
          // Create colored segments using the detailed leg geometries
          for (let i = 0; i < locations.length - 1; i++) {
            const toLocation = locations[i + 1];
            const status = getRouteStatus(toLocation, currentStep);
            
            // Get the leg for this segment
            const leg = route.legs[i];
            
            if (leg && leg.geometry && leg.geometry.coordinates) {
              // Use the detailed curved geometry from the leg
              features.push({
                type: 'Feature',
                properties: { status },
                geometry: {
                  type: 'LineString',
                  coordinates: leg.geometry.coordinates,
                },
              });
            } else {
              console.warn(`No detailed geometry for leg ${i}, using straight line`);
              // Fallback to straight line for this segment
              const fromLocation = locations[i];
              features.push({
                type: 'Feature',
                properties: { status },
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [fromLocation.longitude, fromLocation.latitude],
                    [toLocation.longitude, toLocation.latitude]
                  ],
                },
              });
            }
          }

          console.log('Route features with colors created:', features);

          setRouteGeoJson({
            type: 'FeatureCollection',
            features,
          });

          // Set truck position to current step
          if (locations[currentStep]) {
            setTruckPosition([locations[currentStep].longitude, locations[currentStep].latitude]);
          }
        } else {
          console.error('No routes found in API response');
        }
      } catch (error) {
        console.error("Error fetching route from Mapbox:", error);
        console.log("Using fallback straight line route");
        
        // Fallback: create simple line between points
        const features: any[] = [];
        
        for (let i = 0; i < locations.length - 1; i++) {
          const fromLocation = locations[i];
          const toLocation = locations[i + 1];
          const status = getRouteStatus(toLocation, currentStep);
          
          features.push({
            type: 'Feature',
            properties: { status },
            geometry: {
              type: 'LineString',
              coordinates: [
                [fromLocation.longitude, fromLocation.latitude],
                [toLocation.longitude, toLocation.latitude]
              ],
            },
          });
        }
        
        console.log("Fallback features created:", features);
        
        setRouteGeoJson({
          type: 'FeatureCollection',
          features,
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
    const type = locationType.toLowerCase();
    switch (type) {
      case 'customer':
        return '🏢';
      case 'station':
      case 'gas_station':
        return '🏪';
      case 'compression_station':
      case 'compressor_station':
      case 'tank_station':
      case 'truck_station':
        return '🏭';
      default:
        console.log('Unknown location type:', locationType);
        return '📍';
    }
  };

  const getLocationColor = (locationType: string) => {
    const type = locationType.toLowerCase();
    switch (type) {
      case 'customer':
        return '#3B82F6'; // Blue for customers (matching map view)
      case 'station':
      case 'gas_station':
        return '#10B981'; // Green for stations (matching map view)
      case 'compression_station':
      case 'compressor_station':
      case 'tank_station':
      case 'truck_station':
        return '#8B5CF6'; // Purple for compression/tank/truck stations (matching map view)
      default:
        console.log('Unknown location type for color:', locationType);
        return '#9E9E9E'; // Gray for unknown
    }
  };

  const getRouteStatus = (location: RouteLocation, currentStep: number) => {
    if (location.step < currentStep || location.actual_time) {
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
            <Layer {...routeLayer} />
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
          <React.Fragment key={`${location.step}-${location.location_id}-${index}`}>
            <Marker
              longitude={location.longitude}
              latitude={location.latitude}
              anchor="bottom"
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                setSelectedMarker(`${location.step}-${location.location_id}-${index}`);
              }}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <div className="text-xs bg-white bg-opacity-90 rounded px-2 py-1 mb-1 shadow-sm">
                  {location.name}
                </div>
                <div className="relative">
                  <svg width="24" height="32" viewBox="0 0 24 32" className="drop-shadow-lg">
                    <path
                      d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20c0-6.627-5.373-12-12-12z"
                      fill={getLocationColor(location.location_type)}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="12" r="6" fill="white" />
                  </svg>
                  <div 
                    className="absolute top-1 left-1/2 transform -translate-x-1/2 text-base"
                    style={{ lineHeight: '1' }}
                  >
                    {getLocationIcon(location.location_type)}
                  </div>
                </div>
              </div>
            </Marker>
            {selectedMarker === `${location.step}-${location.location_id}-${index}` && (
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
