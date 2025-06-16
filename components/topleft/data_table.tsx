'use client';

import { useMemo } from 'react'
import React from 'react'
import { Save, RotateCcw, Undo, Redo } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Box, IconButton, Typography, Button } from '@mui/material'
import Link from 'next/link'
import { TopLeftBar } from "@/components/topleft/top_left_bar"


export function DataTable({ selectedOption, searchValue }) {
  const getTableConfig = (option) => {
  switch (option) {
    case 'truckTypes':
      return {
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'count', label: 'Count' },
          { key: 'vmax', label: 'Vmax' },
          { key: 'ownership', label: 'Ownership' },
          { key: 'rentalCost', label: 'Rental Cost per Hour' }
        ],
        data: [
          { id: 'T001', count: 5, vmax: '120', ownership: 'Company', rentalCost: '45' },
          { id: 'T002', count: 3, vmax: '110', ownership: 'Leased', rentalCost: '38' },
          { id: 'T003', count: 8, vmax: '100', ownership: 'Company', rentalCost: '42' },
          { id: 'T004', count: 2, vmax: '130', ownership: 'Rental', rentalCost: '52' },
          { id: 'T005', count: 6, vmax: '115', ownership: 'Company', rentalCost: '40' }
        ]
      };
    
    case 'orders':
      return {
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'customerId', label: 'Customer ID' },
          { key: 'requiredVolume', label: 'Required Volume' },
          { key: 'deliveryTime', label: 'Delivery Time' },
          { key: 'priorityLevel', label: 'Priority Level' },
          { key: 'status', label: 'Status' }
        ],
        data: [
          { id: 'O001', customerId: 'C101', requiredVolume: '500L', deliveryTime: '2024-06-15 10:00', priorityLevel: 1, status: 'Pending' },
          { id: 'O002', customerId: 'C102', requiredVolume: '750L', deliveryTime: '2024-06-16 14:30', priorityLevel: 3, status: 'In Progress' },
          { id: 'O003', customerId: 'C103', requiredVolume: '300L', deliveryTime: '2024-06-17 09:15', priorityLevel: 2, status: 'Completed' },
          { id: 'O004', customerId: 'C104', requiredVolume: '1000L', deliveryTime: '2024-06-18 16:00', priorityLevel: 1, status: 'Urgent' },
          { id: 'O005', customerId: 'C105', requiredVolume: '450L', deliveryTime: '2024-06-19 11:45', priorityLevel: 2, status: 'Pending' }
        ]
      };
    
    default:
      return {
        columns: [],
        data: [] // Always return empty array, not undefined
      };
  }
}
  // Get the table configuration based on selected option
  const tableConfig = useMemo(() => getTableConfig(selectedOption), [selectedOption]);
  
  const filteredData = useMemo(() => {
    if (!tableConfig.data || !Array.isArray(tableConfig.data)) {
      return [];
    }
    
    // If no search value, return all data
    if (!searchValue) {
      return tableConfig.data;
    }
    
    return tableConfig.data.filter((row) => {
      return Object.values(row).some((value) => 
        value.toString().toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  }, [tableConfig.data, searchValue]);
  
  // Render cell content with special formatting
  const renderCellContent = (value, columnKey) => {
    switch (columnKey) {
      // case 'status':
      //   return getStatusBadge(value);
      default:
        return value;
    }
  };
  
  if (!selectedOption) {
    return (
      <div className="flex flex-col h-full w-full bg-gray-100 items-center justify-center">
        <div className="text-gray-500 text-lg">Please select an option from the dropdown</div>
      </div>
    );
  }
  
  if (tableConfig.columns.length === 0) {
    return (
      <div className="flex flex-col h-full w-full bg-gray-100 items-center justify-center">
        <div className="text-gray-500 text-lg">No table configuration available for: {selectedOption}</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-auto bg-brand-F1EDEA rounded-lg shadow">
        <table className="min-w-full divide-y divide-brand-F1EDEA">
          <thead className="bg-brand-F1EDEA sticky top-0">
            <tr>
              {tableConfig.columns.map((column) => (
                <th
                  key={column.key}
                  className={`py-3 text-center text-sm font-bold text-black-500 uppercase ${column.width}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-brand-F1EDEA divide-y divide-brand-F1EDEA">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {tableConfig.columns.map((column) => (
                    <td key={column.key} className="py-4 text-center whitespace-normal text-sm text-black">
                      {renderCellContent(row[column.key], column.key)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableConfig.columns.length} className="py-8 text-center text-gray-500">
                  {searchValue ? 'No results found' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}