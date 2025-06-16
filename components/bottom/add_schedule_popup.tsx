'use client';
import React, { useState, useEffect } from 'react';

const AddSchedulePopup = ({ isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({});

  // Fixed attribute set for schedule window
  const scheduleAttributes = ['ID', 'Status', 'Date', 'CNG Volume Delivered', 'Total cost'];

  // Reset form data when popup opens
  useEffect(() => {
    if (isOpen) {
      const initialFormData = {};
      scheduleAttributes.forEach(attribute => {
        const fieldKey = attribute.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '');
        initialFormData[fieldKey] = '';
      });
      setFormData(initialFormData);
    }
  }, [isOpen]);

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
    console.log('Schedule popup cancelled');
    if (onClose) {
      onClose();
    }
  };

  // Don't render if popup is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-brand-BADFCD rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        
        {/* Main Content */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2">
            {/* Left Column - Attributes */}
            <div>
              {scheduleAttributes.map((attribute, index) => {
                const isFirst = index === 0;
                const isLast = index === scheduleAttributes.length - 1;
                
                return (
                  <div
                    key={index}
                    className={`h-12 p-4 bg-brand-F1EDEA border-black border-solid border flex items-center justify-center
                      ${isFirst ? 'border-t border-l border-r rounded-tl-lg' : 'border-l border-r'}
                      ${isLast ? 'border-b rounded-bl-lg border-t-0': ''}
                      ${!isFirst && !isLast ? 'border-t-0' : ''}
                    `}
                  >
                    <span className="font-bold text-lg text-gray-800">{attribute}</span>
                  </div>
                );
              })}
            </div>

            {/* Right Column - Input Fields */}
            <div>
              {scheduleAttributes.map((attribute, index) => {
                const isFirst = index === 0;
                const isLast = index === scheduleAttributes.length - 1;
                const fieldKey = attribute.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '');
                
                // Determine input type based on attribute
                let inputType = 'text';
                let placeholder = `Enter ${attribute.toLowerCase()}`;
                
                if (attribute === 'Date') {
                  inputType = 'date';
                  placeholder = '';
                } else if (attribute === 'CNG Volume Delivered' || attribute === 'Total cost') {
                  inputType = 'number';
                  placeholder = `Enter ${attribute.toLowerCase()}`;
                }
                
                return (
                  <div key={index} className="h-12">
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

export { AddSchedulePopup };