"use client";

import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { Map, Source, Layer, Marker, Popup, LayerProps, useMap } from 'react-map-gl/maplibre';
import { CLIENT_ENV } from '@/lib/env';
import 'maplibre-gl/dist/maplibre-gl.css';
import useSWR from 'swr';
import { httpGet$GetResourcesCustomers } from "@/lib/commands/GetResourcesCustomers/fetcher";
import { httpGet$GetResourcesStations } from "@/lib/commands/GetResourcesStations/fetcher";
import { httpGet$GetResourcesCompressionStations } from "@/lib/commands/GetResourcesCompressionStations/fetcher";

interface MapViewProps {
  token: string;
}

function MapController({ markers }: { markers: any[] }) {
  const { current: map } = useMap();

  useEffect(() => {
    if (map && markers.length > 0) {
      // Calculate bounds
      const bounds = markers.reduce(
        (bounds, marker) => {
          return [
            [Math.min(bounds[0][0], marker.longitude), Math.min(bounds[0][1], marker.latitude)],
            [Math.max(bounds[1][0], marker.longitude), Math.max(bounds[1][1], marker.latitude)]
          ];
        },
        [[markers[0].longitude, markers[0].latitude], [markers[0].longitude, markers[0].latitude]]
      );

      // Add padding to bounds
      const padding = 0.1; // 10% padding
      const latDiff = bounds[1][1] - bounds[0][1];
      const lngDiff = bounds[1][0] - bounds[0][0];
      
      const paddedBounds: [[number, number], [number, number]] = [
        [bounds[0][0] - lngDiff * padding, bounds[0][1] - latDiff * padding],
        [bounds[1][0] + lngDiff * padding, bounds[1][1] + latDiff * padding]
      ];

      map.fitBounds(paddedBounds, { padding: 50, duration: 1000 });
    }
  }, [map, markers]);

  return null;
}

export function MapView({ token }: MapViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Fetch data for all location types
  const swr = {
    customers: useSWR(
      ["/api/resources/customers/"],
      async () => {
        return await httpGet$GetResourcesCustomers(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/customers/`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    stations: useSWR(
      ["/api/resources/stations/"],
      async () => {
        return await httpGet$GetResourcesStations(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/stations/`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    compressionStations: useSWR(
      ["/api/resources/compression-stations/"],
      async () => {
        return await httpGet$GetResourcesCompressionStations(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compression-stations/`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
  };

  // Transform data for map markers
  const customers = swr.customers.data?.map((customer: any) => ({
    id: `customer-${customer.id}`,
    name: customer.name,
    address: customer.address,
    latitude: customer.gps_coordinates?.latitude || customer.latitude,
    longitude: customer.gps_coordinates?.longitude || customer.longitude,
    type: 'customer',
    contact_info: customer.contact_info,
    number_of_compressors: undefined,
  })) || [];

  const stations = swr.stations.data?.map((station: any) => ({
    id: `station-${station.id}`,
    name: `Station ${station.id}`,
    address: station.address,
    latitude: station.gps_coordinates?.latitude || station.latitude,
    longitude: station.gps_coordinates?.longitude || station.longitude,
    type: 'station',
    contact_info: undefined,
    number_of_compressors: undefined,
  })) || [];

  const compressionStations = swr.compressionStations.data?.map((station: any) => ({
    id: `compression-${station.id}`,
    name: `Compression Station ${station.id}`,
    address: station.address,
    latitude: station.gps_coordinates?.latitude || station.latitude,
    longitude: station.gps_coordinates?.longitude || station.longitude,
    type: 'compression_station',
    contact_info: undefined,
    number_of_compressors: station.number_of_compressors,
  })) || [];

  const allMarkers = [...customers, ...stations, ...compressionStations];

  // Calculate the center point of all coordinates
  const center = allMarkers.length > 0
    ? {
        latitude: allMarkers.reduce((sum, marker) => sum + marker.latitude, 0) / allMarkers.length,
        longitude: allMarkers.reduce((sum, marker) => sum + marker.longitude, 0) / allMarkers.length,
      }
    : { latitude: 10.762622, longitude: 106.660172 }; // Default to Ho Chi Minh City

  const getLocationIcon = (type: string) => {
    switch (type) {
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

  const getLocationColor = (type: string) => {
    switch (type) {
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

  const getLocationBorderColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'border-blue-600';
      case 'station':
        return 'border-green-600';
      case 'compression_station':
        return 'border-purple-600';
      default:
        return 'border-gray-600';
    }
  };

  if (swr.customers.isLoading || swr.stations.isLoading || swr.compressionStations.isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading map data...</div>
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
        <MapController markers={allMarkers} />
        
        {/* Location Markers */}
        {allMarkers.map((marker) => (
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
                <div className="text-xs bg-white bg-opacity-90 rounded px-2 py-1 mb-1 shadow-sm max-w-32 truncate">
                  {marker.name}
                </div>
                <svg width="24" height="32" viewBox="0 0 24 32" className="drop-shadow-lg">
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20c0-6.627-5.373-12-12-12z"
                    fill={marker.type === 'customer' ? '#3B82F6' : marker.type === 'station' ? '#10B981' : '#8B5CF6'}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="12" r="4" fill="white" />
                </svg>
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
                <div className="p-3 max-w-xs">
                  <h3 className="font-bold text-sm mb-2">{marker.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{marker.address}</p>
                  <div className="text-xs">
                    <p><strong>Type:</strong> {marker.type.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Coordinates:</strong></p>
                    <p className="text-gray-500">Lat: {marker.latitude.toFixed(6)}</p>
                    <p className="text-gray-500">Long: {marker.longitude.toFixed(6)}</p>
                    {marker.contact_info && (
                      <p><strong>Contact:</strong> {marker.contact_info}</p>
                    )}
                    {marker.number_of_compressors && (
                      <p><strong>Compressors:</strong> {marker.number_of_compressors}</p>
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