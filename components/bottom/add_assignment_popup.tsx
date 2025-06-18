"use client";
import { AddAssignmentToPlan$Params } from "@/lib/commands/AddAssignmentToPlan/typing";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useSWR from "swr";
import { httpGet$GetResourcesAllOrders } from "@/lib/commands/GetResourcesAllOrders/fetcher";
import { httpGet$GetResourcesTrucks } from "@/lib/commands/GetResourcesTrucks/fetcher";
import { httpGet$GetResourcesGasTanks } from "@/lib/commands/GetResourcesGasTanks/fetcher";
import { httpGet$GGetResourcesCompressors } from "@/lib/commands/GetResourcesCompressors/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import { useToast } from "@/components/ui/toast";

// Configure dayjs to use GMT+0 (UTC)
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('UTC');

type Props = {
  date: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (params: AddAssignmentToPlan$Params) => Promise<void>;
  token: string;
};

const AddAssignmentPopup = ({ date, isOpen, onClose, onSave, token }: Props) => {
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const toast = useToast();

  // Fetch dropdown data (match top-left logic)
  const swrOrders = useSWR(
    isOpen ? [`/api/orders`, date || 'all', token] : null, 
    async () => {
      try {
        // Ensure date is in YYYY-MM-DD format
        let formattedDate = date;
        if (date && typeof date === 'string' && date.length >= 10) {
          formattedDate = date.slice(0, 10); // Take only YYYY-MM-DD part
        }
        
        const url = formattedDate 
          ? `${CLIENT_ENV.BACKEND_URL}/api/orders/?date=${formattedDate}`
          : `${CLIENT_ENV.BACKEND_URL}/api/orders`;
        console.log('Fetching orders from URL:', url, 'originalDate:', date, 'formattedDate:', formattedDate);
        const result = await httpGet$GetResourcesAllOrders(url, token);
        console.log('Orders API result:', result);
        return result;
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Return empty array if backend is not available
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.warn('Backend server appears to be unavailable. Returning empty orders list.');
          return [];
        }
        throw error;
      }
    }
  );
  const swrTrucks = useSWR(isOpen ? ["/api/resources/trucks", token] : null, async () => {
    try {
      return await httpGet$GetResourcesTrucks(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks/`,
        { limit: 100, skip: 0 },
        token
      );
    } catch (error) {
      console.error('Error fetching trucks:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Backend server appears to be unavailable. Returning empty trucks list.');
        return [];
      }
      throw error;
    }
  });
  const swrTanks = useSWR(isOpen ? ["/api/resources/gas-tanks", token] : null, async () => {
    try {
      return await httpGet$GetResourcesGasTanks(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks/`,
        { limit: 100, skip: 0 },
        token
      );
    } catch (error) {
      console.error('Error fetching tanks:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Backend server appears to be unavailable. Returning empty tanks list.');
        return [];
      }
      throw error;
    }
  });
  const swrCompressors = useSWR(isOpen ? ["/api/resources/compressors", token] : null, async () => {
    try {
      return await httpGet$GGetResourcesCompressors(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors/`,
        { limit: 100, skip: 0 },
        token
      );
    } catch (error) {
      console.error('Error fetching compressors:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Backend server appears to be unavailable. Returning empty compressors list.');
        return [];
      }
      throw error;
    }
  });

  // Fixed attribute set for assignment window
  const assignmentAttributes = [
    "Order ID",
    "Truck ID",
    "Tank ID",
    "Compressor ID",
    "Estimated",
  ];

  // Reset form data when popup opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ orderid: "", truckid: "", tankid: "", compressorid: "", estimated: "" });
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Check if data is loaded
    if ((!swrOrders.data && !swrOrders.error) || (!swrTrucks.data && !swrTrucks.error) || 
        (!swrTanks.data && !swrTanks.error) || (!swrCompressors.data && !swrCompressors.error)) {
      toast.warning("Please wait for data to load before submitting");
      return;
    }

    // Check for API errors
    if (swrOrders.error || swrTrucks.error || swrTanks.error || swrCompressors.error) {
      toast.error("Error loading required data. Please refresh and try again.");
      return;
    }

    // Validate all required fields are filled
    if (!formData["orderid"] || !formData["truckid"] || !formData["tankid"] || !formData["compressorid"] || !formData["estimated"]) {
      toast.warning("Please fill in all required fields");
      return;
    }

    const time: string = formData["estimated"].toString();
    if (time.length !== 5) {
      toast.error("Please enter a valid time in HH:MM format");
      return;
    }

    try {
      // Parse and validate time
      const [hours, minutes] = time.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        toast.error("Please enter a valid time");
        return;
      }

      // Create date with time in UTC to avoid timezone issues
      // Ensure date is in YYYY-MM-DD format
      const dateOnly = date.slice(0, 10); // Take only YYYY-MM-DD part
      const dateTime = new Date(dateOnly + 'T00:00:00.000Z');
      dateTime.setUTCHours(hours, minutes, 0, 0);

      // Validate and convert IDs
      const truckId = parseInt(formData["truckid"].toString());
      const tankId = parseInt(formData["tankid"].toString());
      const compressorId = parseInt(formData["compressorid"].toString());

      if (isNaN(truckId) || isNaN(tankId) || isNaN(compressorId)) {
        toast.error("Invalid ID values selected");
        return;
      }

      // Validate that the selected IDs exist in the fetched data
      const selectedOrder = swrOrders.data?.find((order: any) => order.id === formData["orderid"]);
      const selectedTruck = swrTrucks.data?.find((truck: any) => truck.id === truckId);
      const selectedTank = swrTanks.data?.find((tank: any) => tank.id === tankId);
      const selectedCompressor = swrCompressors.data?.find((comp: any) => comp.id === compressorId);

      if (!selectedOrder) {
        toast.error("Selected order not found. Please refresh and try again.");
        return;
      }
      if (!selectedTruck) {
        toast.error("Selected truck not found. Please refresh and try again.");
        return;
      }
      if (!selectedTank) {
        toast.error("Selected tank not found. Please refresh and try again.");
        return;
      }
      if (!selectedCompressor) {
        toast.error("Selected compressor not found. Please refresh and try again.");
        return;
      }

      const params: AddAssignmentToPlan$Params = {
        order_id: formData["orderid"].toString(),
        truck_id: truckId,
        tank_id: tankId,
        compressor_id: compressorId,
        estimated_start_time: dateTime.toISOString(),
      };

      console.log('Submitting assignment with params:', params);
      console.log('Date details:', {
        originalDate: date,
        dateOnly: dateOnly,
        hours: hours,
        minutes: minutes,
        finalDateTime: dateTime.toISOString(),
        formData: formData
      });
      
      await onSave(params);
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error("An error occurred while saving the assignment");
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({});
    console.log("Assignment popup cancelled");
    if (onClose) {
      onClose();
    }
  };

  // Don't render if popup is not open
  if (!isOpen) return null;

  // Debug data loading
        console.log('Add Assignment Popup - Data status:', {
        date,
        dateType: typeof date,
        isOpen,
        shouldFetchOrders: isOpen && date,
        backendUrl: CLIENT_ENV.BACKEND_URL,
        ordersUrl: date ? `${CLIENT_ENV.BACKEND_URL}/api/orders/?date=${date}` : `${CLIENT_ENV.BACKEND_URL}/api/orders`,
        orders: { 
          loading: !swrOrders.data && !swrOrders.error, 
          data: swrOrders.data?.length, 
          error: swrOrders.error,
          errorMessage: swrOrders.error ? JSON.stringify(swrOrders.error) : null
        },
        trucks: { loading: !swrTrucks.data && !swrTrucks.error, data: swrTrucks.data?.length, error: swrTrucks.error },
        tanks: { loading: !swrTanks.data && !swrTanks.error, data: swrTanks.data?.length, error: swrTanks.error },
        compressors: { loading: !swrCompressors.data && !swrCompressors.error, data: swrCompressors.data?.length, error: swrCompressors.error }
      });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 flex flex-col gap-6 font-sans">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">Add Assignment</h2>
        <form 
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-700 mb-1">Order ID *</label>
            <select
              value={formData.orderid || ""}
              onChange={e => handleInputChange("orderid", e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
            >
              <option value="" disabled>
                {!swrOrders.data && !swrOrders.error 
                  ? "Loading orders..." 
                  : date
                    ? `Select Order (${date.slice(0, 10)})`
                    : "Select Order (showing all orders)"}
              </option>
              {swrOrders.error && (
                <option value="" disabled>Error loading orders: {swrOrders.error.message || 'Unknown error'}</option>
              )}
              {swrOrders.data && swrOrders.data.map((order: any) => (
                <option key={order.id} value={order.id}>{order.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-700 mb-1">Truck ID *</label>
            <select
              value={formData.truckid || ""}
              onChange={e => handleInputChange("truckid", e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
            >
              <option value="" disabled>Select Truck</option>
              {swrTrucks.data && swrTrucks.data.map((truck: any) => (
                <option key={truck.id} value={truck.id}>{truck.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-700 mb-1">Tank ID *</label>
            <select
              value={formData.tankid || ""}
              onChange={e => handleInputChange("tankid", e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
            >
              <option value="" disabled>Select Tank</option>
              {swrTanks.data && swrTanks.data.map((tank: any) => (
                <option key={tank.id} value={tank.id}>{tank.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-700 mb-1">Compressor ID *</label>
            <select
              value={formData.compressorid || ""}
              onChange={e => handleInputChange("compressorid", e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
            >
              <option value="" disabled>Select Compressor</option>
              {swrCompressors.data && swrCompressors.data.map((comp: any) => (
                <option key={comp.id} value={comp.id}>{comp.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-700 mb-1">Start Time *</label>
            <input
              type="time"
              value={formData.estimated || ""}
              onChange={e => handleInputChange("estimated", e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
            />
          </div>
          <div className="flex gap-4 mt-6 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition-colors duration-200 shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { AddAssignmentPopup };
