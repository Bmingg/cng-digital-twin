'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { httpGet$GetResourcesTruckTypes } from "@/lib/commands/GetResourcesTruckTypes/fetcher";
import { httpGet$GetResourcesGasTankTypes } from "@/lib/commands/GetResourcesGasTankTypes/fetcher";
import { httpGet$GGetResourcesCompressors } from "@/lib/commands/GetResourcesCompressors/fetcher";
import { httpGet$GetResourcesCompressionStations } from "@/lib/commands/GetResourcesCompressionStations/fetcher";
import { httpGet$GetResourcesCustomers } from "@/lib/commands/GetResourcesCustomers/fetcher";
import { httpGet$GetResourcesOrders } from "@/lib/commands/GetResourcesOrders/fetcher";
import { httpGet$GetResourcesAllOrders } from "@/lib/commands/GetResourcesAllOrders/fetcher";
import { httpGet$GetResourcesGasTanks } from "@/lib/commands/GetResourcesGasTanks/fetcher";
import { httpGet$GetResourcesCompressorTypes } from "@/lib/commands/GetResourcesCompressorTypes/fetcher";
import { httpGet$GetResourcesTrucks } from "@/lib/commands/GetResourcesTrucks/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import useSWR from "swr";
import { httpGet$GetResourcesStations } from '@/lib/commands/GetResourcesStations/fetcher';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs to use GMT+7
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok'); // Bangkok is GMT+7

const EditDataPopup = ({ isOpen, onClose, onSave, selectedOption, token, selectedRow }: any) => {
  const [formData, setFormData] = useState({});
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const swr = {
    GetResourcesTruckTypes: useSWR(
      ["/api/resources/truck-types/"],
      async () =>
        await httpGet$GetResourcesTruckTypes(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types/`,
          {
            limit: 100,
            skip: 0,
          },
          token
        )
    ),
    GetResourcesGasTankTypes: useSWR(
      ["/api/resources/gas-tank-types/"],
      async () =>
        await httpGet$GetResourcesGasTankTypes(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tank-types/`,
          {
            limit: 100,
            skip: 0,
          },
          token
        )
    ),
    GetResourcesGasTanks: useSWR(
      ["/api/resources/gas-tanks/"],
      async () =>
        await httpGet$GetResourcesGasTanks(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks/`,
          {
            limit: 100,
            skip: 0,
          },
          token
        )
    ),
    GetResourcesTrucks: useSWR(
      ["/api/resources/trucks/"],
      async () =>
        await httpGet$GetResourcesTrucks(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks/`,
          {
            limit: 100,
            skip: 0,
          },
          token
        )
    ),
    GetResourcesCompressorTypes: useSWR(
      ["/api/resources/compressor-types/"],
      async () =>
        await httpGet$GetResourcesCompressorTypes(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-types/`,
          {
            limit: 100,
            skip: 0,
          },
          token
        )
    ),
    GetResourcesCompressors: useSWR(
      ["/api/resources/compressors/"],
      async () =>
        await httpGet$GGetResourcesCompressors( 
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors/`,
          {
            limit: 100,
            skip: 0,
          },
          token
        )
    ),
    GetResourcesCompressionStations: useSWR(
      ["/api/resources/compression-stations/"],
      async () =>
        await httpGet$GetResourcesCompressionStations(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compression-stations/`,
          {
            limit: 100,
            skip: 0,
          },
          token
        )
    ),
    GetResourcesCustomers: useSWR(
      ["/api/resources/customers/"],
      async () =>
        await httpGet$GetResourcesCustomers(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/customers/`,
          {
            limit: 10000,
            skip: 0,
          },
          token
        )
    ),
    GetResourcesAllOrders: useSWR(
      ["/api/orders/"],
      async () =>
        await httpGet$GetResourcesAllOrders(
          `${CLIENT_ENV.BACKEND_URL}/api/orders/`,
          token
        )
    ),
    GetResourcesStations: useSWR(
      ["/api/resources/stations/"],
      async () =>
        await httpGet$GetResourcesStations(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/stations/`,
          {
            limit: 100,
            skip: 0,
          },
          token
        )
    ),
  };

  const attributeSets = {
    truckTypes: [
      { key: "id", label: "ID" },
      { key: "count", label: "Count" },
      { key: "vmax", label: "Volume" },
      { key: "owned", label: "Ownership" },
      { key: "rental_cost_by_hour", label: "Rental Cost per Hour" },
    ],
    gasTankTypes: [
      { key: "id", label: "ID" },
      { key: "count", label: "Count" },
      { key: "vmax", label: "Volume" },
      { key: "owned", label: "Ownership" },
      { key: "rental_cost_by_hour", label: "Rental Cost per Hour" },
      { key: "loading_time", label: "Loading Time" },
    ],
    gasTanks: [
      { key: "id", label: "ID" },
      { key: "gas_tank_type_id", label: "Gas Tank Type ID" },
      { key: "status", label: "Status" },
      { key: "station_id", label: "Station ID" },
    ],
    trucks: [
      { key: "id", label: "ID" },
      { key: "truck_type_id", label: "Truck Type ID" },
      { key: "status", label: "Status" },
      { key: "station_id", label: "Station ID" },
    ],
    compressorTypes: [
      { key: "id", label: "ID" },
      { key: "capacity", label: "Capacity" },
      { key: "capacity_m3", label: "Capacity (m³)" },
      { key: "count", label: "Count" },
    ],
    compressors: [
      { key: "id", label: "ID" },
      { key: "compressor_type_id", label: "Compressor Type ID" },
      { key: "compressor_station_id", label: "Compressor Station ID" },
      { key: "status", label: "Status" },
    ],
    compressionStations: [
      { key: "id", label: "ID" },
      { key: "address", label: "Address" },
      { key: "number_of_compressors", label: "Number of Compressors" },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
    ],
    customers: [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "address", label: "Address" },
      { key: "contact_info", label: "Contact Info" },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
    ],
    orders: [
      { key: "id", label: "ID" },
      { key: "customer_id", label: "Customer ID" },
      { key: "required_volume", label: "Volume" },
      { key: "delivery_time", label: "Date" },
      { key: "priority_level", label: "Priority" },
      { key: "status", label: "Status" },
    ],
    stations: [
      { key: "id", label: "ID" },
      { key: "address", label: "Address" },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
    ]
  };

  // Get current attributes based on selectedOption - memoized to prevent infinite re-renders
  const currentAttributes = useMemo(() => {
    return (attributeSets as any)[selectedOption] || [];
  }, [selectedOption]);

  // Reset form data when selectedOption changes or popup opens
  useEffect(() => {
    if (selectedRow && isOpen && !isFormInitialized) {
      // Load initial data based on selectedRow and selectedOption
      let rowData: any = null;
      
      console.log('Edit popup - selectedRow:', selectedRow, 'selectedOption:', selectedOption);
      
      if (selectedOption === "orders") {
        const ordersData = swr.GetResourcesAllOrders?.data;
        console.log('Edit popup - orders data:', ordersData);
        if (ordersData && Array.isArray(ordersData)) {
          rowData = ordersData.find(item => item.id?.toString() === selectedRow?.toString());
          console.log('Edit popup - found order data:', rowData);
        }
      } else if (selectedOption === "customers") {
        rowData = swr.GetResourcesCustomers?.data?.find(item => item.id?.toString() === selectedRow?.toString()) || null;
      } else if (selectedOption === "gasTanks") {
        rowData = swr.GetResourcesGasTanks?.data?.find(item => item.id?.toString() === selectedRow?.toString()) || null;
      } else if (selectedOption === "trucks") {
        rowData = swr.GetResourcesTrucks?.data?.find(item => item.id?.toString() === selectedRow?.toString()) || null;
      } else if (selectedOption === "compressors") {
        rowData = swr.GetResourcesCompressors?.data?.find(item => item.id?.toString() === selectedRow?.toString()) || null;
      } else if (selectedOption === "compressionStations") {
        rowData = swr.GetResourcesCompressionStations?.data?.find(item => item.id?.toString() === selectedRow?.toString()) || null;
      } else if (selectedOption === "truckTypes") {
        rowData = swr.GetResourcesTruckTypes?.data?.find(item => item.id?.toString() === selectedRow?.toString()) || null;
      } else if (selectedOption === "gasTankTypes") {
        rowData = swr.GetResourcesGasTankTypes?.data?.find(item => item.id?.toString() === selectedRow?.toString()) || null;
      } else if (selectedOption === "compressorTypes") {
        rowData = swr.GetResourcesCompressorTypes?.data?.find(item => item.id?.toString() === selectedRow?.toString()) || null;
      } else if (selectedOption === "stations") {
        rowData = swr.GetResourcesStations?.data?.find(item => item.id?.toString() === selectedRow?.toString()) || null;
      }
      
      // If rowData is found, set the formData with the existing values
      if (rowData) {
        console.log('Edit popup - setting form data:', rowData);
        setFormData(rowData);
        setIsFormInitialized(true);
      } else {
        console.log('Edit popup - no row data found for selectedRow:', selectedRow);
      }
    }
  }, [selectedRow, selectedOption, swr, isFormInitialized, isOpen]);
  
  // Reset form initialization when popup closes or selectedRow changes
  useEffect(() => {
    if (!isOpen) {
      setIsFormInitialized(false);
      setFormData({});
    }
  }, [isOpen]);
  
  useEffect(() => {
    setIsFormInitialized(false);
  }, [selectedRow]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      // Use the key directly from the attribute object
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      // Convert delivery_time to proper format if it exists
      const formDataWithTimezone: any = { ...formData };
      if (formDataWithTimezone['delivery_time']) {
        // Convert to YYYY-MM-DD format using Bangkok timezone (same as add popup)
        formDataWithTimezone['delivery_time'] = dayjs(formDataWithTimezone['delivery_time'])
          .tz('Asia/Bangkok')
          .format('YYYY-MM-DD');
      }
      
      // For orders, only send the required fields (exclude customer_id)
      if (selectedOption === "orders") {
        const { customer_id, ...orderData } = formDataWithTimezone;
        console.log('Edit popup - sending order data:', orderData);
        onSave(orderData);
      } else {
        onSave(formDataWithTimezone);
      }
    }
    // Reset form
    setFormData({});
  };

  const handleCancel = () => {
    // Reset form
    setFormData({});
    console.log('Popup cancelled');
    setIsFormInitialized(false);
    if (onClose) {
      onClose();
      setIsFormInitialized(false);
    }
  };

  // Don't render if popup is not open or no option is selected
  if (!isOpen || !selectedOption || currentAttributes.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 flex flex-col gap-6 font-sans">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">Edit {selectedOption && selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}</h2>
        <form className="flex flex-col gap-4">
          {currentAttributes.map((attribute, index) => {
            const fieldKey = attribute.key;
            let inputType = "text";
            let placeholder = `Enter ${attribute.label.toLowerCase()}`;
            let isDropdown = false;
            let dropdownOptions: string[] = [];
            let isReadonly = false;
            if (fieldKey === "loading_time" || fieldKey === "count" || fieldKey === "capacity" || fieldKey === "capacity_m3") inputType = "number";
            if (fieldKey === "delivery_time") inputType = "date";
            if (fieldKey === "status" && selectedOption === "orders") { isDropdown = true; dropdownOptions = ["PENDING","IN_PROGRESS","ASSIGNED","COMPLETED","CANCELLED"]; placeholder = "Select status"; }
            if (fieldKey === "status" && selectedOption !== "orders") { isDropdown = true; dropdownOptions = ["AVAILABLE","IN_USE","MAINTENANCE","OUT_OF_SERVICE"]; placeholder = "Select status"; }
            if (fieldKey === "owned") { isDropdown = true; dropdownOptions = ["Owned","Rented"]; placeholder = "Select ownership"; }
            if (selectedOption === "orders" && fieldKey === "customer_id") { isDropdown = true; dropdownOptions = []; const customersData = swr.GetResourcesCustomers.data; customersData?.forEach((customer: any) => { dropdownOptions.push(customer.id); }); placeholder = "Select Customer"; }
            if (selectedOption === "gasTanks" && fieldKey === "gas_tank_type_id") { isDropdown = true; dropdownOptions = []; const gasTankTypesData = swr.GetResourcesGasTankTypes.data; gasTankTypesData?.forEach(type => { dropdownOptions.push(type.id); }); placeholder = "Select Gas Tank Type"; }
            if (selectedOption === "gasTanks" && fieldKey === "station_id") { isDropdown = true; dropdownOptions = []; const stationsData = swr.GetResourcesStations.data; stationsData?.forEach(station => { dropdownOptions.push(station.id); }); placeholder = "Select Station"; }
            if (selectedOption === "trucks" && fieldKey === "truck_type_id") { isDropdown = true; dropdownOptions = []; const truckTypesData = swr.GetResourcesTruckTypes.data; truckTypesData?.forEach(type => { dropdownOptions.push(type.id); }); placeholder = "Select Truck Type"; }
            if (selectedOption === "trucks" && fieldKey === "station_id") { isDropdown = true; dropdownOptions = []; const stationsData = swr.GetResourcesStations.data; stationsData?.forEach(station => { dropdownOptions.push(station.id); }); placeholder = "Select Station"; }
            if (selectedOption === "compressors" && fieldKey === "compressor_type_id") { isDropdown = true; dropdownOptions = []; const compressorTypesData = swr.GetResourcesCompressorTypes.data; compressorTypesData?.forEach(type => { dropdownOptions.push(type.id); }); placeholder = "Select Compressor Type"; }
            if (selectedOption === "compressors" && fieldKey === "compressor_station_id") { isDropdown = true; dropdownOptions = []; const compressorStationsData = swr.GetResourcesCompressionStations.data; compressorStationsData?.forEach(station => { dropdownOptions.push(station.id); }); placeholder = "Select Compressor Station"; }
            // Make IDs read-only for resources with auto-generated IDs
            if (fieldKey === "id" && (selectedOption === "orders" || selectedOption === "customers" || selectedOption === "trucks" || selectedOption === "gasTanks" || selectedOption === "compressors")) { isReadonly = true; }
            // Make customer_id read-only for orders since it's not included in update API
            if (selectedOption === "orders" && fieldKey === "customer_id") { isReadonly = true; }
            return (
              <div key={index} className="flex flex-col gap-1">
                <label className="text-base font-semibold text-gray-700 mb-1">{attribute.label}</label>
                {isDropdown ? (
                  <select
                    value={formData[fieldKey] || ""}
                    onChange={e => handleInputChange(fieldKey, e.target.value)}
                    disabled={isReadonly}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50"
                  >
                    <option value="" disabled>{placeholder}</option>
                    {dropdownOptions.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={inputType}
                    placeholder={placeholder}
                    readOnly={isReadonly}
                    value={formData[fieldKey] || ""}
                    onChange={e => handleInputChange(fieldKey, e.target.value)}
                    className={`rounded-lg border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 ${isReadonly ? 'bg-gray-100 font-bold cursor-not-allowed' : ''}`}
                  />
                )}
              </div>
            );
          })}
        </form>
        <div className="flex gap-4 mt-6 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-200 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition-colors duration-200 shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export { EditDataPopup };