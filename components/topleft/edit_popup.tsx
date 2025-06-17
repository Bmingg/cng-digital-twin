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
      { key: "vmax", label: "Vmax" },
      { key: "owned", label: "Ownership" },
      { key: "rental_cost_by_hour", label: "Rental Cost per Hour" },
    ],
    trucks: [
      { key: "id", label: "ID" },
      { key: "status", label: "Status" },
      { key: "station_id", label: "Station ID" },
    ],
    gasTankTypes: [
      { key: "id", label: "ID" },
      { key: "count", label: "Count" },
      { key: "vmax", label: "Vmax" },
      { key: "owned", label: "Ownership" },
      { key: "rental_cost_by_hour", label: "Rental Cost per Hour" },
      { key: "loading_time", label: "Loading Time" },
    ],
    gasTanks: [
      { key: "id", label: "ID" },
      { key: "status", label: "Status" }, 
      { key: "station_id", label: "Station ID" },
    ],
    compressorTypes: [
      { key: "id", label: "ID" },
      { key: "capacity", label: "Capacity" },
      { key: "capacity_m3", label: "Capacity (m3)" },
      { key: "count", label: "Count" },
    ],
    compressors: [
      { key: "id", label: "ID" },
      { key: "status", label: "Status" },
      { key: "compressor_station_id", label: "Compressor Station ID" },
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
      { key: "longtitude", label: "Longitude" },
      { key: "latitude", label: "Latitude" },
    ],
    orders: [
      { key: "id", label: "ID" },
      { key: "required_volume", label: "Required Volume" },
      { key: "delivery_time", label: "Delivery Time" },
      { key: "priority_level", label: "Priority Level" },
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
    return attributeSets[selectedOption] || [];
  }, [selectedOption]);

  // Reset form data when selectedOption changes or popup opens
  useEffect(() => {
  //   if (isOpen) {
  //     const initialFormData = {};
  //     currentAttributes.forEach(attribute => {
  //       // Use the key directly from the attribute object
  //       initialFormData[attribute.key] = '';
  //     });
  //     setFormData(initialFormData);
  //   }
  // }, [isOpen, selectedOption, currentAttributes]);
    if (selectedRow && swr && isOpen && !isFormInitialized) {
      // Find the complete row data based on the selectedRow ID
      let rowData = null;
      
      if (selectedOption === "orders") {
        rowData = swr.GetResourcesAllOrders?.data?.find(item => item.id === selectedRow);
      } else if (selectedOption === "customers") {
        rowData = swr.GetResourcesCustomers?.data?.find(item => item.id === selectedRow);
      } else if (selectedOption === "gasTanks") {
        rowData = swr.GetResourcesGasTanks?.data?.find(item => item.id === selectedRow);
      } else if (selectedOption === "trucks") {
        rowData = swr.GetResourcesTrucks?.data?.find(item => item.id === selectedRow);
      } else if (selectedOption === "compressors") {
        rowData = swr.GetResourcesCompressors?.data?.find(item => item.id === selectedRow);
      } else if (selectedOption === "compressionStations") {
        rowData = swr.GetResourcesCompressionStations?.data?.find(item => item.id === selectedRow);
      } else if (selectedOption === "gasTankTypes") {
        rowData = swr.GetResourcesGasTankTypes?.data?.find(item => item.id === selectedRow);
      } else if (selectedOption === "truckTypes") {
        rowData = swr.GetResourcesTruckTypes?.data?.find(item => item.id === selectedRow);
      } else if (selectedOption === "compressorTypes") {
        rowData = swr.GetResourcesCompressorTypes?.data?.find(item => item.id === selectedRow);
      } else if (selectedOption === "stations") {
        rowData = swr.GetResourcesStations?.data?.find(item => item.id === selectedRow);
      }
      // If rowData is found, set the formData with the existing values
      // This assumes that the rowData has the same keys as the attributes
      // Add other resource types as needed
      
      if (rowData) {
        setFormData(rowData);
        setIsFormInitialized(true);
      }
    }
  }, [selectedRow, selectedOption, swr, isFormInitialized, isOpen]);
  
  useEffect(() => {
    setIsFormInitialized(false);
  }, [selectedRow]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      // Use the key directly from the attribute object
      ["id"]: selectedRow,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
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
      <div className="bg-brand-BADFCD rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        
        {/* Main Content */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2">
            {/* Left Column - Attributes */}
            <div>
              {currentAttributes.map((attribute, index) => {
                const isFirst = index === 0;
                const isLast = index === currentAttributes.length - 1;
                
                return (
                  <div
                    key={index}
                    className={`h-12 p-4 bg-brand-F1EDEA border-black border-solid border flex items-center justify-center
                      ${isFirst ? 'border-t border-l border-r rounded-tl-lg' : 'border-l border-r'}
                      ${isLast ? 'border-b rounded-bl-lg border-t-0': ''}
                      ${!isFirst && !isLast ? 'border-t-0' : ''}
                    `}
                  >
                    {/* Use the label property to display the human-readable text */}
                    <span className="font-bold text-lg text-gray-800">{attribute.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Right Column - Input Fields */}
            <div>
              {currentAttributes.map((attribute: { key: any; label: string; }, index: React.Key | null | undefined) => {
                const isFirst = index === 0;
                const isLast = index === currentAttributes.length - 1;
                // Use the key directly from the attribute object
                const fieldKey = attribute.key;
                
                let inputType = 'text';
                let placeholder = `Enter ${attribute.label.toLowerCase()}`;
                let isDropdown = false;
                let dropdownOptions: any[] = [];
                let isReadonly = false;

                if (fieldKey === "id") {
                  placeholder = selectedRow;
                  isReadonly = true;
                }

                if (fieldKey === "loading_time") {
                  // Special case for loading_time, render a number input 
                  inputType = 'number';
                };
                if (fieldKey === "status" && selectedOption === 'orders') {
                  // Special case for status, render a select input
                  isDropdown = true;
                  dropdownOptions = ['PENDING', 'IN_PROGRESS', 'ASSIGNED', 'COMPLETED', 'CANCELLED'];
                  placeholder = 'Select status';
                };
                if (fieldKey === "status" && selectedOption !== 'orders') {
                  // Special case for status, render a select input
                  isDropdown = true;
                  dropdownOptions = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE'];
                  placeholder = 'Select status';
                };
                if (fieldKey === "owned" ) {
                  // Special case for status, render a select input
                  isDropdown = true;
                  dropdownOptions = ['Owned', 'Rented'];
                  placeholder = 'Select status';
                };
                if (fieldKey === "number_of_compressors" || fieldKey === "count" || fieldKey === "capacity" || fieldKey === "capacity_m3") {
                  // Special case for count and capacity, render a number input
                  inputType = 'number';
                };

                if (selectedOption === "orders" && fieldKey === "customer_id") {
                  // Special case for customer_id, render a select input
                  isDropdown = true;
                  dropdownOptions = [];
                  // Extract unique customer IDs from the SWR data
                  const customersData = swr.GetResourcesCustomers.data;
                  customersData?.forEach(customer => { 
                    dropdownOptions.push(customer.id);
                  });
                  placeholder = 'Select Customer';
                };

                if (selectedOption === "gasTanks" && fieldKey === "gas_tank_type_id") {
                  isDropdown = true;
                  dropdownOptions = [];
                  // Extract unique gas tank type IDs from the SWR data
                  const gasTankTypesData = swr.GetResourcesGasTankTypes.data;
                  gasTankTypesData?.forEach(type => {
                    dropdownOptions.push(type.id);
                  });
                  placeholder = 'Select Gas Tank Type';
                };

                if (selectedOption === "gasTanks" && fieldKey === "station_id") {
                  isDropdown = true;
                  dropdownOptions = [];
                  // Extract unique gas tank type IDs from the SWR data
                  const gasTankTypesData = swr.GetResourcesStations.data;
                  gasTankTypesData?.forEach(type => {
                    dropdownOptions.push(type.id);
                  });
                  placeholder = 'Select Gas Tank Type';
                };
                
                if (selectedOption === "trucks" && fieldKey === "truck_type_id") {
                  isDropdown = true;
                  dropdownOptions = [];
                  // Extract unique truck type IDs from the SWR data
                  const truckTypesData = swr.GetResourcesTruckTypes.data;
                  truckTypesData?.forEach(type => {
                    dropdownOptions.push(type.id);
                  });
                  placeholder = 'Select Truck Type';
                };
                if (selectedOption === "trucks" && fieldKey === "station_id") {
                  isDropdown = true;
                  dropdownOptions = [];
                  // Extract unique station IDs from the SWR data
                  const stationsData = swr.GetResourcesStations.data;
                  stationsData?.forEach(station => {
                    dropdownOptions.push(station.id);
                  });
                  placeholder = 'Select Station';
                };
                if (selectedOption === "compressors" && fieldKey === "compressor_type_id") {
                  isDropdown = true;
                  dropdownOptions = [];
                  // Extract unique compressor type IDs from the SWR data
                  const compressorTypesData = swr.GetResourcesCompressorTypes.data;
                  compressorTypesData?.forEach(type => {
                    dropdownOptions.push(type.id);
                  });
                  placeholder = 'Select Compressor Type';
                };
                if (selectedOption === "compressors" && fieldKey === "compressor_station_id") {
                  isDropdown = true;
                  dropdownOptions = [];
                  // Extract unique compressor station IDs from the SWR data
                  const compressorStationsData = swr.GetResourcesCompressionStations.data;
                  compressorStationsData?.forEach(station => {
                    dropdownOptions.push(station.id);
                  });
                  placeholder = 'Select Compressor Station';
                };

                return (
                  <div key={index} className="h-12">
                    {isDropdown ? (
                      <select
                        value={formData[fieldKey] || ''}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                        disabled={isReadonly}
                        className={`w-full h-full text-base px-4 border border-black border-l-0 border-solid focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 border-solid
                          ${isFirst ? 'border-t border-l border-r rounded-tr-lg' : 'border-r'}
                          ${isLast ? 'border-b rounded-br-lg border-t-0' : ''}
                          ${!isFirst && !isLast ? 'border-t-0' : ''}
                        `}
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
                      value={formData[fieldKey] || ''}
                      onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                      className={`w-full h-full text-base px-4 border border-black border-l-0 border-solid focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 border-solid
                        ${isFirst ? 'border-t border-l border-r rounded-tr-lg' : 'border-r'}
                        ${isLast ? 'border-b rounded-br-lg border-t-0' : ''}
                        ${!isFirst && !isLast ? 'border-t-0' : ''}
                        ${isReadonly ? 'bg-gray-50 font-bold cursor-not-allowed' : ''}
                      `}
                    />
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 gap-24 bg-brand-BADFCD rounded-b-2xl flex justify-center">
          <button
            onClick={handleCancel}
            className="px-8 bg-brand-BDC3C0 text-white rounded-full font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export { EditDataPopup };