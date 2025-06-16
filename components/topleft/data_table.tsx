"use client";

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
import { use, useMemo } from "react";
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

  const handleSaveData = (data: any) => {
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
            limit: 100,
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
  };

  const handleDropdownChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (selectedOption === "truckTypes") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types`,
        { id: selectedRow }
      );
    }
    if (selectedOption === "orders") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/orders`,
        { id: selectedRow }
      );
    }
    if (selectedOption === "gasTankTypes") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tank-types`,
        { id: selectedRow }
      );
    }
    if (selectedOption === "gasTank") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks`,
        { id: selectedRow }
      );
    }
    if (selectedOption === "trucks") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks`,
        { id: selectedRow }
      );
    }
    if (selectedOption === "compressorTypes") { 
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-types`,
        { id: selectedRow }
      );
    }
    if (selectedOption === "compressors") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors`,
        { id: selectedRow }
      );
    }
    if (selectedOption === "compressorStations") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-stations`,
        { id: selectedRow }
      );
    }
    if (selectedOption === "customers") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/customers`,
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
      case "gasTankTypes":
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "count", label: "Count" },
            { key: "vmax", label: "Vmax" },
            { key: "owned", label: "Ownership" },
            { key: "rental_cost_by_hour", label: "Rental Cost per Hour" },
            { key: "loading_time", label: "Loading Time" },
          ],
          data: swr.GetResourcesGasTankTypes.data ?? [],
        };
      
      case "gasTanks":
        const modifiedGasTankData = swr.GetResourcesGasTanks.data.map(({ gas_tank_type, station, ...rest }) => rest);
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "gas_tank_type_id", label: "Gas Tank Type ID" },
            { key: "status", label: "Status" },
            { key: "station_id", label: "Station ID" },
          ],
          data: modifiedGasTankData ?? [],
          // data: swr.GetResourcesGasTanks.data ?? [],
        };
      case "trucks":
        const modifiedTruckData = swr.GetResourcesTrucks.data.map(({ truck_type, station, ...rest }) => rest);
        // const modifiedTruckData = swr.GetResourcesTrucks.data;
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "truck_type_id", label: "Truck Type ID" },
            { key: "status", label: "Status" },
            { key: "station_id", label: "Station ID" },
          ],
          data: modifiedTruckData ?? [],
          // data: swr.GetResourcesTrucks.data ?? [],
        };
      case "compressorTypes":
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "capacity", label: "Capacity" },
            { key: "capacity_m3", label: "Capacity (m3)" },
            { key: "count", label: "Count" },
          ],
          data: swr.GetResourcesCompressorTypes.data ?? [],
        };
      case "compressors":
        const modifiedCompressorsData = swr.GetResourcesCompressors.data.map(({ compressor_type, compressor_station, ...rest }) => rest);
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "compressor_type_id", label: "Compressor Type ID" },
            { key: "status", label: "Status" },
            { key: "station_id", label: "Station ID" },
          ],
          data: modifiedCompressorsData ?? [],
          // data: swr.GetResourcesCompressors.data ?? [],
        };
      case "compressionStations":
        const modifiedCompressionStationsData = swr.GetResourcesCompressionStations.data.map(({ gps_coordinates, ...rest }) => rest);
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "address", label: "Address" },
            { key: "number_of_compressors", label: "Number of Compressors" },
            { key: "latitude", label: "Latitude" },
            { key: "longitude", label: "Longitude" }, 
          ],
          data: modifiedCompressionStationsData ?? [],
          // data: swr.GetResourcesCompressionStations.data ?? [],
        };
      case "customers":
        const modifiedCustomersData = swr.GetResourcesCustomers.data.map(({ gps_coordinates, ...rest }) => rest);
        return {
          columns: [
            { key: "name", label: "Name" },
            { key: "address", label: "Address" },
            { key: "contact_info", label: "Contact Info" },
            { key: "id", label: "ID" },
            { key: "longtitude", label: "Longitude" },
            { key: "latitude", label: "Latitude" },
          ],
          data: modifiedCustomersData ?? [],
          // data: swr.GetResourcesCustomers.data ?? [],
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
          data:  swr.GetResourcesAllOrders.data ?? [],
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
                    className={`py-3 text-center text-sm font-bold text-black-500`}
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
                    onClick={() => setSelectedRow(row.id)}
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