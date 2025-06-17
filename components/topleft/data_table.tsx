"use client";

import { z } from "zod";
import { httpGet$GetResourcesTruckTypes } from "@/lib/commands/GetResourcesTruckTypes/fetcher";
import { httpGet$GetResourcesGasTankTypes } from "@/lib/commands/GetResourcesGasTankTypes/fetcher";
import { httpGet$GGetResourcesCompressors } from "@/lib/commands/GetResourcesCompressors/fetcher";
import { httpGet$GetResourcesCompressionStations } from "@/lib/commands/GetResourcesCompressionStations/fetcher";
import { httpGet$GetResourcesCustomers } from "@/lib/commands/GetResourcesCustomers/fetcher";
import { httpGet$GetResourcesAllOrders } from "@/lib/commands/GetResourcesAllOrders/fetcher";
import { httpGet$GetResourcesGasTanks } from "@/lib/commands/GetResourcesGasTanks/fetcher";
import { httpGet$GetResourcesCompressorTypes } from "@/lib/commands/GetResourcesCompressorTypes/fetcher";
import { httpGet$GetResourcesTrucks } from "@/lib/commands/GetResourcesTrucks/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import { useMemo } from "react";
import React from "react";
import useSWR from "swr";
import { TopLeftBar } from "./top_left_bar";
import { httpDelete$DeleteResources } from "@/lib/commands/DeleteResources/fetcher";
import { AddDataPopup } from './add_popup';
import { EditDataPopup } from './edit_popup';
import { httpPost$CreateTruckTypes } from "@/lib/commands/CreateTruckTypes/fetcher";
import { httpPost$CreateOrders } from "@/lib/commands/CreateOrders/fetcher";
import { httpPost$CreateGasTankTypes } from "@/lib/commands/CreateGasTankTypes/fetcher";
import { httpPost$CreateGasTanks } from "@/lib/commands/CreateGasTanks/fetcher";
import { httpPost$CreateTrucks } from "@/lib/commands/CreateTrucks/fetcher";
import { httpPost$CreateCompressorTypes } from "@/lib/commands/CreateCompressorTypes/fetcher";
import { httpPost$CreateCompressors } from "@/lib/commands/CreateCompressors/fetcher";
import { httpPost$CreateCompressionStations } from "@/lib/commands/CreateCompressionStations/fetcher";
import { httpPost$CreateCustomers } from "@/lib/commands/CreateCustomers/fetcher";
import { httpPost$CreateStations } from "@/lib/commands/CreateStations/fetcher";
import { httpGet$GetResourcesStations } from "@/lib/commands/GetResourcesStations/fetcher";
import { httpPut$UpdateTruckTypes } from "@/lib/commands/UpdateTruckTypes/fetcher";
import { httpPut$UpdateOrders } from "@/lib/commands/UpdateOrders/fetcher";
import { httpPut$UpdateGasTankTypes } from "@/lib/commands/UpdateGasTankTypes/fetcher";
import { httpPut$UpdateGasTanks } from "@/lib/commands/UpdateGasTanks/fetcher";
import { httpPut$UpdateTrucks } from "@/lib/commands/UpdateTrucks/fetcher";
import { httpPut$UpdateCompressorTypes } from "@/lib/commands/UpdateCompressorTypes/fetcher";
import { httpPut$UpdateCompressors } from "@/lib/commands/UpdateCompressors/fetcher";
import { httpPut$UpdateCompressionStations } from "@/lib/commands/UpdateCompressionStations/fetcher";
import { httpPut$UpdateCustomers } from "@/lib/commands/UpdateCustomers/fetcher";
import { httpPut$UpdateStations } from "@/lib/commands/UpdateStations/fetcher";

type Props = {
  token: string;
};

export function DataTable({ token }: Props) {
  const [selectedOption, setSelectedOption] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState<string | undefined>();
  const [isAddPopupOpen, setIsAddPopupOpen] = React.useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = React.useState(false);
  
  const handleSaveEdit = (data: any) => {

    if (!selectedRow) return;
    console.log('Edited data:', data);
    if (selectedOption === "truckTypes") {
      httpPut$UpdateTruckTypes(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types`,
        data,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesTruckTypes.mutate(); // Refresh the truck types data
      };
    if (selectedOption === "orders") {
      // Handle saving orders
      httpPut$UpdateOrders(
        `${CLIENT_ENV.BACKEND_URL}/api/orders`,
        data,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesAllOrders.mutate(); // Refresh the orders data
    }
    if (selectedOption === "gasTankTypes") {
      // Handle saving gas tank types
      httpPut$UpdateGasTankTypes(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tank-types`,
        data,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesGasTankTypes.mutate(); // Refresh the gas tank types data
    }
    if (selectedOption === "gasTanks") {
      // Handle saving gas tanks
      httpPut$UpdateGasTanks(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks`,
        data,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesGasTanks.mutate(); // Refresh the gas tanks data
    }
    if (selectedOption === "trucks") {
      // Handle saving trucks
      httpPut$UpdateTrucks(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks`,
        data,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesTrucks.mutate(); // Refresh the trucks data
    }
    if (selectedOption === "compressorTypes") {
      httpPut$UpdateCompressorTypes(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-types`,
        data,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesCompressorTypes.mutate(); // Refresh the compressor types data
    }
    if (selectedOption === "compressors") {
      // Handle saving compressors
      httpPut$UpdateCompressors(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors`,
        data,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesCompressors.mutate(); // Refresh the compressors data
    }
    if (selectedOption === "compressionStations") {
      // Handle saving compressor stations
      const transformDataFormat = (data: any) => {
        const { latitude, longitude, ...rest } = data;
        return {
          ...rest,
          gps_coordinates: {
            latitude,
            longitude
          }
        };
      };
      const transformedData = transformDataFormat(data);

      httpPut$UpdateCompressionStations(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compression-stations`,
        transformedData,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesCompressionStations.mutate(); // Refresh the compression stations data
    }
    if (selectedOption === "customers") {
      // Handle saving customers
      const transformDataFormat = (data: any) => {
        const { latitude, longitude, ...rest } = data;
        return {
          ...rest,
          gps_coordinates: {
            latitude,
            longitude
          }
        };
      };
      const transformedData = transformDataFormat(data);
      httpPut$UpdateCustomers(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/customers`,
        transformedData,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesCustomers.mutate(); // Refresh the customers data
    }
    if (selectedOption === "stations") {
      // Handle saving stations
      const transformDataFormat = (data: any) => {
        const { latitude, longitude, ...rest } = data;
        return {
          ...rest,
          gps_coordinates: {
            latitude,
            longitude
          }
        };
      };
      const transformedData = transformDataFormat(data);

      httpPut$UpdateStations(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/stations`,
        transformedData,
        token
      )
      setIsEditPopupOpen(false);
      swr.GetResourcesStations.mutate(); // Refresh the stations data
    }
  }

  const handleEdit = () => {
    if (!selectedRow) return;
    setIsEditPopupOpen(true);
  }

  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
  };

  const handleAdd = () => {
    if (!selectedOption) return;
    setIsAddPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsAddPopupOpen(false);
  };

  const handleSaveData = async (data: any) => {
    if (!selectedOption) return;

    console.log("Saved data:", data);
    if (selectedOption === "truckTypes") {
      await httpPost$CreateTruckTypes(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types/`,
        data,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesTruckTypes.mutate(); // Refresh the truck types data
    }
    if (selectedOption === "orders") {
      // Handle saving orders
      await httpPost$CreateOrders(
        `${CLIENT_ENV.BACKEND_URL}/api/orders/`,
        data,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesAllOrders.mutate(); // Refresh the orders data
    }
    if (selectedOption === "gasTankTypes") {
      // Handle saving gas tank types
      await httpPost$CreateGasTankTypes(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tank-types/`,
        data,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesGasTankTypes.mutate(); // Refresh the gas tank types data
    }
    if (selectedOption === "gasTanks") {
      // Handle saving gas tanks
      await httpPost$CreateGasTanks(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks/`,
        data,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesGasTanks.mutate(); // Refresh the gas tanks data
    }
    if (selectedOption === "trucks") {
      // Handle saving trucks
      await httpPost$CreateTrucks(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks/`,
        data,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesTrucks.mutate(); // Refresh the trucks data
    }
    if (selectedOption === "compressorTypes") {
      await httpPost$CreateCompressorTypes(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-types/`,
        data,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesCompressorTypes.mutate(); // Refresh the compressor types data
    }
    if (selectedOption === "compressors") {
      // Handle saving compressors

      await httpPost$CreateCompressors(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors/`,
        data,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesCompressors.mutate(); // Refresh the compressors data
    }
    if (selectedOption === "compressionStations") {
      // Handle saving compressor stations
      const transformDataFormat = (data: any) => {
        const { latitude, longitude, ...rest } = data;
        return {
          ...rest,
          gps_coordinates: {
            latitude,
            longitude,
          },
        };
      };
      const transformedData = transformDataFormat(data);

      await httpPost$CreateCompressionStations(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compression-stations/`,
        transformedData,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesCompressionStations.mutate(); // Refresh the compression stations data
    }
    if (selectedOption === "customers") {
      // Handle saving customers
      await httpPost$CreateCustomers(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/customers/`,
        data,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesCustomers.mutate(); // Refresh the customers data
    }
    if (selectedOption === "stations") {
      // Handle saving stations
      const transformDataFormat = (data: any) => {
        const { latitude, longitude, ...rest } = data;
        return {
          ...rest,
          gps_coordinates: {
            latitude,
            longitude
          }
        };
      };
      const transformedData = transformDataFormat(data);

      await httpPost$CreateStations(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compression-stations/`,
        transformedData,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesStations.mutate(); // Refresh the compression stations data
    }
  };
  
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

  const handleDropdownChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    if (selectedOption === "truckTypes") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types`,
        { id: selectedRow },
        token
      );
      alert("Truck type deleted successfully");
      swr.GetResourcesTruckTypes.mutate(); // Refresh the truck types data
    }
    if (selectedOption === "orders") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/orders`,
        { id: selectedRow },
        token
      );
      swr.GetResourcesAllOrders.mutate(); // Refresh the orders data
    }
    if (selectedOption === "gasTankTypes") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tank-types`,
        { id: selectedRow },
        token
      );
      swr.GetResourcesGasTankTypes.mutate(); // Refresh the gas tank types data
    }
    if (selectedOption === "gasTank") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks`,
        { id: selectedRow },
        token
      );
      swr.GetResourcesGasTanks.mutate(); // Refresh the gas tanks data
    }
    if (selectedOption === "trucks") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks`,
        { id: selectedRow },
        token
      );
      swr.GetResourcesTrucks.mutate(); // Refresh the trucks data
    }
    if (selectedOption === "compressorTypes") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-types`,
        { id: selectedRow },
        token
      );
      swr.GetResourcesCompressorTypes.mutate(); // Refresh the compressor types data
    }
    if (selectedOption === "compressors") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors`,
        { id: selectedRow },
        token
      );
      swr.GetResourcesCompressors.mutate(); // Refresh the compressors data
    }
    if (selectedOption === "compressionStations") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-stations`,
        { id: selectedRow },
        token
      );
      swr.GetResourcesCompressionStations.mutate(); // Refresh the compression stations data
    }
    if (selectedOption === "customers") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/customers`,
        { id: selectedRow },
        token
      );
      swr.GetResourcesCustomers.mutate(); // Refresh the customers data
    }
    if (selectedOption === "stations") {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/stations`,
        { id: selectedRow },
        token,
      );
      swr.GetResourcesStations.mutate(); // Refresh the stations data
    }
  };

  const handleFilter = () => {
    console.log("Filter button clicked from parent");
    // Implement filter logic here
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleRefresh = () => {
    switch (selectedOption) {
      case "truckTypes":
        swr.GetResourcesTruckTypes.mutate();
        break;
      case "orders":
        swr.GetResourcesAllOrders.mutate();
        break;
      case "gasTankTypes":
        swr.GetResourcesGasTankTypes.mutate();
        break;
      case "gasTanks":
        swr.GetResourcesGasTanks.mutate();
        break;
      case "trucks":
        swr.GetResourcesTrucks.mutate();
        break;
      case "compressorTypes":
        swr.GetResourcesCompressorTypes.mutate();
        break;
      case "compressors":
        swr.GetResourcesCompressors.mutate();
        break;
      case "compressionStations":
        swr.GetResourcesCompressionStations.mutate();
        break;
      case "customers":
        swr.GetResourcesCustomers.mutate();
        break;
      default:
        break;
    }
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
          data: swr.GetResourcesTruckTypes.data ?? [],
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
        const gasTanksData = swr.GetResourcesGasTanks.data;
        const modifiedGasTankData = gasTanksData
          ? gasTanksData.map(({ gas_tank_type, station, ...rest }) => ({
              ...rest,
              vmax: gas_tank_type.vmax,
            }))
          : [];
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "gas_tank_type_id", label: "Gas Tank Type ID" },
            { key: "status", label: "Status" },
            { key: "vmax", label: "Vmax" },
            { key: "station_id", label: "Station ID" },
          ],
          data: modifiedGasTankData ?? [],
          // data: swr.GetResourcesGasTanks.data ?? [],
        };
      case "trucks":
        const trucksData = swr.GetResourcesTrucks.data;
        const modifiedTruckData = trucksData
          ? trucksData.map(({ truck_type, station, ...rest }) => rest)
          : [];
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
        const compressorsData = swr.GetResourcesCompressors.data;
        const modifiedCompressorsData = compressorsData
          ? compressorsData.map(
              ({ compressor_type, compressor_station, ...rest }) => rest
            )
          : [];
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "compressor_type_id", label: "Compressor Type ID" },
            { key: "status", label: "Status" },
            { key: "compressor_station_id", label: "Compressor Station ID" },
          ],
          data: modifiedCompressorsData ?? [],
          // data: swr.GetResourcesCompressors.data ?? [],
        };
      case "compressionStations":
        const compressionStationsData =
          swr.GetResourcesCompressionStations.data;
        const modifiedCompressionStationsData = compressionStationsData
          ? compressionStationsData.map(({ gps_coordinates, ...rest }) => rest)
          : [];
        // const modifiedCompressionStationsData = swr.GetResourcesCompressionStations.data.map(({ gps_coordinates, ...rest }) => rest);
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
        const customersData = swr.GetResourcesCustomers.data;
        const modifiedCustomersData = customersData
          ? customersData.map(({ gps_coordinates, ...rest }) => rest)
          : [];
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "address", label: "Address" },
            { key: "contact_info", label: "Contact Info" },
            { key: "longitude", label: "Longitude" },
            { key: "latitude", label: "Latitude" },
          ],
          // data: swr.GetResourcesCustomers.data ?? [],
          data: modifiedCustomersData ?? [],
        };
      case "orders":
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "customer_id", label: "Customer ID" },
            { key: "required_volume", label: "Required Volume" },
            { key: "delivery_time", label: "Delivery Time" },
            { key: "priority_level", label: "Priority Level" },
            { key: "status", label: "Status" },
          ],
          data: swr.GetResourcesAllOrders.data ?? [],
        };
      case "stations":
        const stationsData = swr.GetResourcesStations.data;
        const modifiedStationsData = stationsData
          ? stationsData.map(({ gps_coordinates, ...rest }) => rest)
          : [];
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "address", label: "Address" },
            { key: "latitude", label: "Latitude" },
            { key: "longitude", label: "Longitude" }, 
          ],
          data: modifiedStationsData ?? [],
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
      case "rental_cost_by_hour":
        return value.toLocaleString()
      case "required_volume":
        return parseFloat(value).toFixed(2);
      // Round longitude and latitude to 6 decimal places
      case "longitude":
        return parseFloat(value).toFixed(5);
      case "latitude":
        return parseFloat(value).toFixed(5);
      default:
        return value;
    }
  };

  if (!selectedOption) {
    return (
      <div className="flex flex-col h-full">
        <TopLeftBar
          onDropdownChange={handleDropdownChange}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onFilter={handleFilter}
        />
        <div className="flex-1 min-h-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500 text-lg">
            Please select an option from the dropdown
          </div>
        </div>
      </div>
    );
  }

  if (tableConfig.columns.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <TopLeftBar
          onDropdownChange={handleDropdownChange}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onFilter={handleFilter}
        />
        <div className="flex-1 min-h-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500 text-lg">
            No table configuration available for: {selectedOption}
          </div>
        </div>
        <AddDataPopup
            isOpen={isAddPopupOpen}
            onClose={handleClosePopup}
            onSave={handleSaveData}
            selectedOption={selectedOption}
            token={token}
        />
        <EditDataPopup
            isOpen={isEditPopupOpen}
            onClose={handleCloseEditPopup}
            onSave={handleSaveEdit}
            selectedOption={selectedOption}
            token={token}
            selectedRow={selectedRow}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TopLeftBar
        onDropdownChange={handleDropdownChange}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onFilter={handleFilter}
      />
      <AddDataPopup
            isOpen={isAddPopupOpen}
            onClose={handleClosePopup}
            onSave={handleSaveData}
            selectedOption={selectedOption}
            token={token}
      />
      <EditDataPopup
            isOpen={isEditPopupOpen}
            onClose={handleCloseEditPopup}
            onSave={handleSaveEdit}
            selectedOption={selectedOption}
            token={token}
            selectedRow={selectedRow}
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
                    onClick={() => setSelectedRow(row.id.toString())}
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
  );
}
