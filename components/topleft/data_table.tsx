"use client";

import { httpGet$GetResourcesTruckTypes } from "@/lib/commands/GetResourcesTruckTypes/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import { useMemo } from "react";
import React from "react";
import useSWR from "swr";
import { TopLeftBar } from "./top_left_bar";
import { httpDelete$DeleteResources } from "@/lib/commands/DeleteResources/fetcher";
import { AddDataPopup } from './add_popup';

type Props = {
  token: string;
};

export function DataTable({ token }: Props) {
  const [selectedOption, setSelectedOption] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState<string | undefined>();

  const [isAddPopupOpen, setIsAddPopupOpen] = React.useState(false);
  
  const handleAdd = () => {
    console.log('Add button clicked from parent');
    // Implement add logic here
    console.log('isAddPopupOpen before:', isAddPopupOpen);
    setIsAddPopupOpen(true);
    console.log('isAddPopupOpen after:', true);
  };

  const handleClosePopup = () => {
    setIsAddPopupOpen(false);
  };

  const handleSaveData = (data) => {
    // Save the data from the popup add in top-left data table
    // Don't know how to do this yet, just logging for now
    console.log('Saved data:', data);
    setIsAddPopupOpen(false);
  }

  const swr = {
    GetResourcesTructTypes: useSWR(
      ["/api/resources/truck-types/"],
      async () =>
        await httpGet$GetResourcesTruckTypes(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types/`,
          {
            limit: 100000,
            skip: 0,
          },
          token
        )
    ),
  };

  const handleDropdownChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (selectedOption === "truckTypes") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV}/api/resources/truck-types`,
        { id: selectedRow }
      );
    }
  };

  const handleFilter = () => {
    console.log("Filter button clicked from parent");
    // Implement filter logic here
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const getTableConfig = (option: string) => {
    switch (option) {
      case "truckTypes":
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "count", label: "Count" },
            { key: "vmax", label: "Vmax" },
            { key: "owned", label: "Ownership" },
            { key: "rental_cost_by_hour", label: "Rental Cost per Hour" },
          ],
          data: swr.GetResourcesTructTypes.data ?? [],
        };

      case "orders":
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "customerId", label: "Customer ID" },
            { key: "requiredVolume", label: "Required Volume" },
            { key: "deliveryTime", label: "Delivery Time" },
            { key: "priorityLevel", label: "Priority Level" },
            { key: "status", label: "Status" },
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
          data: [], // Always return empty array, not undefined
        };
    }
  };
  // Get the table configuration based on selected option
  const tableConfig = useMemo(
    () => getTableConfig(selectedOption),
    [selectedOption]
  );

  const filteredData = useMemo(() => {
    if (!tableConfig.data || !Array.isArray(tableConfig.data)) {
      return [];
    }

    // If no search value, return all data
    if (!searchValue) {
      return tableConfig.data;
    }
    return []; // TODO: fix later
  }, [tableConfig.data, searchValue]);

  // Render cell content with special formatting
  const renderCellContent = (value: string, columnKey: string) => {
    switch (columnKey) {
      // case 'status':
      //   return getStatusBadge(value);
      default:
        return value;
    }
  };

  if (!selectedOption) {
    return (
      <>
        <TopLeftBar
          onDropdownChange={handleDropdownChange}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onFilter={handleFilter}
          onSearch={handleSearch}
          searchValue={searchValue}
        />
        <div className="flex flex-col h-full w-full bg-gray-100 items-center justify-center">
          <div className="text-gray-500 text-lg">
            Please select an option from the dropdown
          </div>
        </div>
      </>
    );
  }

  if (tableConfig.columns.length === 0) {
    return (
      <>
        <TopLeftBar
          onDropdownChange={handleDropdownChange}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onFilter={handleFilter}
          onSearch={handleSearch}
          searchValue={searchValue}
        />
        <div className="flex flex-col h-full w-full bg-gray-100 items-center justify-center">
          <div className="text-gray-500 text-lg">
            No table configuration available for: {selectedOption}
          </div>
        </div>
        <AddDataPopup
            isOpen={isAddPopupOpen}
            onClose={handleClosePopup}
            onSave={handleSaveData}
            selectedOption={selectedOption}
        />
      </>
    );
  }

  return (
    <>
      <TopLeftBar
        onDropdownChange={handleDropdownChange}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onFilter={handleFilter}
        onSearch={handleSearch}
        searchValue={searchValue}
      />
      <AddDataPopup
            isOpen={isAddPopupOpen}
            onClose={handleClosePopup}
            onSave={handleSaveData}
            selectedOption={selectedOption}
        />
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 overflow-auto bg-brand-F1EDEA rounded-lg shadow">
          <table className="min-w-full divide-y divide-brand-F1EDEA">
            <thead className="bg-brand-F1EDEA sticky top-0">
              <tr>
                {tableConfig.columns.map((column) => (
                  <th
                    key={column.key}
                    className={`py-3 text-center text-sm font-bold text-black-500 uppercase`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-brand-F1EDEA divide-y divide-brand-F1EDEA">
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition-colors ${
                      row.id === selectedRow ? "bg-gray-50" : ""
                    }`}
                    onDoubleClick={() => setSelectedRow(row.id)}
                  >
                    {tableConfig.columns.map((column) => (
                      <td
                        key={column.key}
                        className="py-4 text-center whitespace-normal text-sm text-black"
                      >
                        {renderCellContent(
                          (row as any)[column.key],
                          column.key
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableConfig.columns.length}
                    className="py-8 text-center text-gray-500"
                  >
                    {searchValue ? "No results found" : "No data available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}