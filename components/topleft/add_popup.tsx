'use client';
import React, { useState, useEffect, useMemo } from 'react';

const AddDataPopup = ({ isOpen, onClose, onSave, selectedOption }: any) => {
  const [formData, setFormData] = useState({});

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
      { key: "truck_type_id", label: "Truck Type ID" },
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
      { key: "gas_tank_type_id", label: "Gas Tank Type ID" },
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
      { key: "compressor_type_id", label: "Compressor Type ID" },
      { key: "status", label: "Status" },
      { key: "station_id", label: "Station ID" },
    ],
    compressionStations: [
      { key: "id", label: "ID" },
      { key: "address", label: "Address" },
      { key: "number_of_compressors", label: "Number of Compressors" },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
    ],
    customers: [
      { key: "name", label: "Name" },
      { key: "address", label: "Address" },
      { key: "contact_info", label: "Contact Info" },
      { key: "id", label: "ID" },
      { key: "longtitude", label: "Longitude" },
      { key: "latitude", label: "Latitude" },
    ],
    orders: [
      { key: "id", label: "ID" },
      { key: "customer_id", label: "Customer ID" },
      { key: "delivery_time", label: "Delivery Time" },
      { key: "priority_level", label: "Priority Level" },
      { key: "status", label: "Status" },
    ],
  };

  // Get current attributes based on selectedOption - memoized to prevent infinite re-renders
  const currentAttributes = useMemo(() => {
    return attributeSets[selectedOption] || [];
  }, [selectedOption]);

  // Reset form data when selectedOption changes or popup opens
  useEffect(() => {
    if (isOpen) {
      const initialFormData = {};
      currentAttributes.forEach(attribute => {
        // Use the key directly from the attribute object
        initialFormData[attribute.key] = '';
      });
      setFormData(initialFormData);
    }
  }, [isOpen, selectedOption, currentAttributes]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
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
    if (onClose) {
      onClose();
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
              {currentAttributes.map((attribute, index) => {
                const isFirst = index === 0;
                const isLast = index === currentAttributes.length - 1;
                // Use the key directly from the attribute object
                const fieldKey = attribute.key;
                
                let inputType = 'text';
                let placeholder = `Enter ${attribute.label.toLowerCase()}`;
                let isDropdown = false;
                let dropdownOptions = [];

                if (fieldKey === "id" && selectedOption === 'customers') {
                  // Special case for ID, render a text input
                  inputType = 'number';
                };
                if (fieldKey === "id" && selectedOption === 'compressors' || selectedOption === 'trucks' || selectedOption === 'gasTanks' ) {
                  // Special case for ID, render a text input
                  inputType = 'number';
                };
                if (fieldKey === "number_of_compressors" ) {
                  // Special case for number_of_compressors, render a number input
                  inputType = 'number';
                };

                

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
                  dropdownOptions = ['Owned', 'Leased'];
                  placeholder = 'Select status';
                };

                if (fieldKey === "count" || fieldKey === "capacity" || fieldKey === "capacity_m3") {
                  // Special case for count and capacity, render a number input
                  inputType = 'number';
                };


                return (
                  <div key={index} className="h-12">
                    {isDropdown ? (
                      <select
                        value={formData[fieldKey] || ''}
                        onChange={(e) => handleInputChange(fieldKey, e.target.value)}
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
                      value={formData[fieldKey] || ''}
                      onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                      className={`w-full h-full text-base px-4 border border-black border-l-0 border-solid focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 border-solid
                        ${isFirst ? 'border-t border-l border-r rounded-tr-lg' : 'border-r'}
                        ${isLast ? 'border-b rounded-br-lg border-t-0' : ''}
                        ${!isFirst && !isLast ? 'border-t-0' : ''}
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

export { AddDataPopup };