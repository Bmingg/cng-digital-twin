"use client";

import { useMemo } from "react";
import React from "react";

type Props = {
  selectedOption: string;
};

export function DataTable({ selectedOption }: Props) {
  const getTableConfig = (option: string) => {
    switch (option) {
      case "Truck types":
        return {
          columns: [
            { key: "id", label: "ID", width: "w-5" },
            { key: "count", label: "Count", width: "w-5" },
            { key: "vmax", label: "Vmax", width: "w-5" },
            { key: "ownership", label: "Ownership", width: "w-5" },
            { key: "rentalCost", label: "Rental Cost per Hour", width: "w-5" },
          ],
          data: [
            {
              id: "T001",
              count: 5,
              vmax: "120",
              ownership: "Company",
              rentalCost: "45",
            },
            {
              id: "T002",
              count: 3,
              vmax: "110",
              ownership: "Leased",
              rentalCost: "38",
            },
            {
              id: "T003",
              count: 8,
              vmax: "100",
              ownership: "Company",
              rentalCost: "42",
            },
            {
              id: "T004",
              count: 2,
              vmax: "130",
              ownership: "Rental",
              rentalCost: "52",
            },
            {
              id: "T005",
              count: 6,
              vmax: "115",
              ownership: "Company",
              rentalCost: "40",
            },
          ],
        };

      case "Orders":
        return {
          columns: [
            { key: "id", label: "ID", width: "w-5" },
            { key: "customerId", label: "Customer ID", width: "w-5" },
            { key: "requiredVolume", label: "Required Volume", width: "w-5" },
            { key: "deliveryTime", label: "Delivery Time", width: "w-5" },
            { key: "priorityLevel", label: "Priority Level", width: "w-5" },
            { key: "status", label: "Status", width: "w-5" },
          ],
          data: [
            {
              id: "O001",
              customerId: "C101",
              requiredVolume: "500L",
              deliveryTime: "2024-06-15 10:00",
              priorityLevel: 1,
              status: "Pending",
            },
            {
              id: "O002",
              customerId: "C102",
              requiredVolume: "750L",
              deliveryTime: "2024-06-16 14:30",
              priorityLevel: 3,
              status: "In Progress",
            },
            {
              id: "O003",
              customerId: "C103",
              requiredVolume: "300L",
              deliveryTime: "2024-06-17 09:15",
              priorityLevel: 2,
              status: "Completed",
            },
            {
              id: "O004",
              customerId: "C104",
              requiredVolume: "1000L",
              deliveryTime: "2024-06-18 16:00",
              priorityLevel: 1,
              status: "Urgent",
            },
            {
              id: "O005",
              customerId: "C105",
              requiredVolume: "450L",
              deliveryTime: "2024-06-19 11:45",
              priorityLevel: 2,
              status: "Pending",
            },
          ],
        };

      default:
        return {
          columns: [],
          data: [],
        };
    }
  };
  // Get the table configuration based on selected option
  const tableConfig = useMemo(
    () => getTableConfig(selectedOption),
    [selectedOption]
  );

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
      Urgent: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          (statusColors as any)[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  // Priority level styling
  const getPriorityBadge = (priority: 1 | 2 | 3) => {
    const priorityColors = {
      1: "bg-red-100 text-red-800",
      2: "bg-yellow-100 text-yellow-800",
      3: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          priorityColors[priority] || "bg-gray-100 text-gray-800"
        }`}
      >
        {priority}
      </span>
    );
  };

  // Render cell content with special formatting
  const renderCellContent = (value: any, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return getStatusBadge(value);
      case "priorityLevel":
        return getPriorityBadge(value);
      default:
        return value;
    }
  };

  if (!selectedOption) {
    return (
      <div className="flex flex-col h-full w-full bg-gray-100 items-center justify-center">
        <div className="text-gray-500 text-lg">
          Please select an option from the dropdown
        </div>
      </div>
    );
  }

  if (tableConfig.columns.length === 0) {
    return (
      <div className="flex flex-col h-full w-full bg-gray-100 items-center justify-center">
        <div className="text-gray-500 text-lg">
          No table configuration available for: {selectedOption}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      <div className="flex-1 overflow-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {tableConfig.columns.map((column) => (
                <th
                  style={{ paddingLeft: "1.5em" }}
                  key={column.key}
                  className={`py-3 text-center text-sm font-bold text-black-500 uppercase ${column.width}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableConfig.data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {tableConfig.columns.map((column) => (
                  <td
                    key={column.key}
                    style={{ paddingLeft: "1.5em" }}
                    className="py-4 text-center whitespace-normal text-sm text-black"
                  >
                    {renderCellContent((row as any)[column.key], column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}