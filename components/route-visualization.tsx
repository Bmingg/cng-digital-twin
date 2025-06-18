"use client";

import React, { useState, useEffect } from 'react';
import { CLIENT_ENV } from "@/lib/env";
import { RouteMap } from './route-map';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs to use GMT+7
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

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

interface RouteVisualizationProps {
  assignmentId?: string;
  token: string;
}

export function RouteVisualization({ assignmentId, token }: RouteVisualizationProps) {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRouteData = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${CLIENT_ENV.BACKEND_URL}/api/dispatch/assignments/${id}/route`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRouteData(data);
    } catch (err) {
      console.error('Error fetching route data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch route data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchRouteData(assignmentId);
    } else {
      setRouteData(null);
    }
  }, [assignmentId, token]);

  if (!assignmentId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-8">
          <div className="text-gray-400 text-6xl mb-4">🗺️</div>
          <div className="text-gray-600 text-xl font-semibold mb-2">
            Route Visualization
          </div>
          <div className="text-gray-500 text-base">
            Select an assignment below to view its route
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading route data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-red-600 text-xl font-semibold mb-2">
            Error Loading Route
          </div>
          <div className="text-red-500 text-base mb-4">
            {error}
          </div>
          <button
            onClick={() => fetchRouteData(assignmentId)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!routeData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-8">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <div className="text-gray-600 text-xl font-semibold mb-2">
            No Route Data
          </div>
          <div className="text-gray-500 text-base">
            No route information available for this assignment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Route Map</h3>
            <p className="text-sm text-gray-600">Assignment: {routeData.assignment_id.slice(-8)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              routeData.assignment_status === 'PLANNED' ? 'bg-blue-100 text-blue-800' :
              routeData.assignment_status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
              routeData.assignment_status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              routeData.assignment_status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {routeData.assignment_status}
            </span>
            <span className="text-sm text-gray-600">
              {routeData.total_steps} steps
            </span>
          </div>
        </div>
      </div>

      {/* Route Map */}
      <div className="flex-1 overflow-hidden">
        <RouteMap routeData={routeData} token={token} />
      </div>
    </div>
  );
} 