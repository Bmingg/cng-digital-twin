"use client";

import React, { useState } from 'react';
import { MapView } from './map/map_view';
import { RouteVisualization } from './route-visualization';

interface TopRightPanelProps {
  token: string;
  selectedAssignmentId?: string;
}

export function TopRightPanel({ token, selectedAssignmentId }: TopRightPanelProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'route'>('map');

  // Sample coordinates for demonstration
  const sampleCoordinates = [
    { id: "station1", latitude: 10.762622, longitude: 106.660172, name: "S1" },
    { id: "station2", latitude: 10.775658, longitude: 106.700417, name: "S2" },
    { id: "station3", latitude: 10.783333, longitude: 106.666667, name: "S3" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'map'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            🗺️ Map View
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'route'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            🛣️ Route Details
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'map' && (
          <div className="h-full">
            <MapView token={token} />
          </div>
        )}
        {activeTab === 'route' && (
          <div className="h-full">
            <RouteVisualization 
              assignmentId={selectedAssignmentId} 
              token={token} 
            />
          </div>
        )}
      </div>
    </div>
  );
} 