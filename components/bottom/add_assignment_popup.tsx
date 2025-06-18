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

  // Fetch dropdown data (match top-left logic)
  const swrOrders = useSWR(isOpen ? ["/api/orders", token] : null, async () =>
    await httpGet$GetResourcesAllOrders(`${CLIENT_ENV.BACKEND_URL}/api/orders`, token)
  );
  const swrTrucks = useSWR(isOpen ? ["/api/resources/trucks", token] : null, async () =>
    await httpGet$GetResourcesTrucks(
      `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks/`,
      { limit: 100, skip: 0 },
      token
    )
  );
  const swrTanks = useSWR(isOpen ? ["/api/resources/gas-tanks", token] : null, async () =>
    await httpGet$GetResourcesGasTanks(
      `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks/`,
      { limit: 100, skip: 0 },
      token
    )
  );
  const swrCompressors = useSWR(isOpen ? ["/api/resources/compressors", token] : null, async () =>
    await httpGet$GGetResourcesCompressors(
      `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors/`,
      { limit: 100, skip: 0 },
      token
    )
  );

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
    const newDate = dayjs(date).tz('UTC');
    const time: string = formData["estimated"].toString();
    if (time.length !== 5) {
      alert("invalid input time");
      return;
    }
    let [hours, minutes] = time.split(":").map(Number);
    newDate.hour(hours).minute(minutes).second(0);
    const params = {
      order_id: formData["orderid"].toString(),
      truck_id: typeof formData["truckid"] === "string" ? parseInt(formData["truckid"] as string) : formData["truckid"],
      tank_id: typeof formData["tankid"] === "string" ? parseInt(formData["tankid"] as string) : formData["tankid"],
      compressor_id: typeof formData["compressorid"] === "string" ? parseInt(formData["compressorid"] as string) : formData["compressorid"],
      estimated_start_time: newDate.toISOString(),
    };
    await onSave(params);
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
            <label className="text-base font-semibold text-gray-700 mb-1">Order ID</label>
            <select
              value={formData.orderid || ""}
              onChange={e => handleInputChange("orderid", e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
            >
              <option value="" disabled>Select Order</option>
              {swrOrders.data && swrOrders.data.map((order: any) => (
                <option key={order.id} value={order.id}>{order.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-700 mb-1">Truck ID</label>
            <select
              value={formData.truckid || ""}
              onChange={e => handleInputChange("truckid", e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
            >
              <option value="" disabled>Select Truck</option>
              {swrTrucks.data && swrTrucks.data.map((truck: any) => (
                <option key={truck.id} value={truck.id}>{truck.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-700 mb-1">Tank ID</label>
            <select
              value={formData.tankid || ""}
              onChange={e => handleInputChange("tankid", e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
            >
              <option value="" disabled>Select Tank</option>
              {swrTanks.data && swrTanks.data.map((tank: any) => (
                <option key={tank.id} value={tank.id}>{tank.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-700 mb-1">Compressor ID</label>
            <select
              value={formData.compressorid || ""}
              onChange={e => handleInputChange("compressorid", e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
            >
              <option value="" disabled>Select Compressor</option>
              {swrCompressors.data && swrCompressors.data.map((comp: any) => (
                <option key={comp.id} value={comp.id}>{comp.id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              value={formData.estimated || ""}
              onChange={e => handleInputChange("estimated", e.target.value)}
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
