"use client";

import { useMemo } from "react";
import React from "react";

// Since there's no real data yet, by default we presume the data are always stored yesterday
const getYesterdayDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  // Format as DD-MM-YYYY
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

type Column = "id" | "status" | "date" | "cngVolumeDelivered" | "totalCost";

export type TableConfig = {
  columns: { key: string; label: string }[];
  data: {
    id: string;
    status: string;
    date: string;
    cngVolumeDelivered: number;
    totalCost: number;
  }[];
};

type Props = {
  selectedDate: string;
  onRowDoubleClick: (row: TableConfig["data"][0]) => void;
};

export function ScheduleTable({ selectedDate, onRowDoubleClick }: Props) {
  const yesterdayDate = useMemo(() => getYesterdayDate(), []);

  const handleRowDoubleClick = (row: TableConfig["data"][0]) => {
    onRowDoubleClick(row);
  };

  const getTableConfig = (option: string) => {
    switch (option) {
      case yesterdayDate:
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "status", label: "Status" },
            { key: "date", label: "Date" },
            { key: "cngVolumeDelivered", label: "CNG volume delivered" },
            { key: "totalCost", label: "Total cost" },
          ],
          data: [
            {
              id: "S0001",
              status: "Draft",
              date: yesterdayDate,
              cngVolumeDelivered: 642,
              totalCost: 2000000,
            },
            {
              id: "S0002",
              status: "Optimized",
              date: yesterdayDate,
              cngVolumeDelivered: 601,
              totalCost: 1400000,
            },
            {
              id: "S0003",
              status: "Optimized",
              date: yesterdayDate,
              cngVolumeDelivered: 620,
              totalCost: 1500000,
            },
            {
              id: "S0004",
              status: "Ready",
              date: yesterdayDate,
              cngVolumeDelivered: 642,
              totalCost: 1850000,
            },
          ],
        };

      default:
        return {
          columns: [],
          data: [], // Always return empty array, not undefined
        };
    }
  };
  // Get the table configuration based on selected option
  const tableConfig: TableConfig = useMemo(
    () => getTableConfig(selectedDate),
    [selectedDate]
  );

  // Render cell content with special formatting
  const renderCellContent = (value: string, columnKey: string) => {
    switch (columnKey) {
      // case 'status':
      //   return getStatusBadge(value);
      case "totalCost":
        return value.toLocaleString();

      default:
        return value;
    }
  };

  if (!selectedDate) {
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
          No table configuration available for: {selectedDate}
        </div>
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
                  className={`py-1 text-center text-sm font-bold text-black-500 uppercase`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-brand-F1EDEA divide-y divide-brand-F1EDEA">
            {tableConfig.data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onDoubleClick={() => handleRowDoubleClick(row)}
              >
                {tableConfig.columns.map((column) => (
                  <td
                    key={column.key}
                    className="py-1 text-center whitespace-normal text-sm text-black"
                  >
                    {renderCellContent(
                      row[column.key as Column].toString(),
                      column.key
                    )}
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
