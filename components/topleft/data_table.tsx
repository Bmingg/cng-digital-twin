"use client";

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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs to use GMT+7
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok'); // Bangkok is GMT+7

type Props = {
  token: string;
};

export function DataTable({ token }: Props) {
  const [selectedOption, setSelectedOption] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState<string | number | undefined>();
  const [isAddPopupOpen, setIsAddPopupOpen] = React.useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const [filterRows, setFilterRows] = React.useState<any[]>([]);
  const [orderDay, setOrderDay] = React.useState<string>("");
  
  // Helper: get available operators for a field
  const getOperators = (col: any) => {
    if (["count", "number_of_compressors", "id"].includes(col.key)) {
      return ["eq", "gt", "gte", "lt", "lte", "in"];
    }
    if (["vmax", "rental_cost_by_hour", "loading_time", "capacity_m3"].includes(col.key)) {
      return ["eq", "gt", "gte", "lt", "lte", "in"];
    }
    if (["name", "address", "contact_info", "owned"].includes(col.key)) {
      return ["eq", "contains", "icontains", "in"];
    }
    if (["status"].includes(col.key)) {
      return ["eq", "in"];
    }
    if (["delivery_time"].includes(col.key)) {
      return ["eq", "gte", "lte"];
    }
    return ["eq"];
  };

  // Helper: operator label
  const operatorLabel = (op: string) => {
    switch (op) {
      case "eq": return "=";
      case "gt": return ">";
      case "gte": return ">=";
      case "lt": return "<";
      case "lte": return "<=";
      case "in": return "in";
      case "contains": return "contains";
      case "icontains": return "icontains";
      default: return op;
    }
  };

  // Build query from filterRows
  const buildQuery = () => {
    if (selectedOption === "orders" && orderDay) {
      return `?date=${orderDay}`;
    }
    return "";
  };

  const handleSaveEdit = async (data: any) => {
    if (!selectedRow) return;
    if (selectedOption === "truckTypes") {
      await httpPut$UpdateTruckTypes(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types`,
        data,
        token
      );
      await new Promise(res => setTimeout(res, 500));
      await swr.GetResourcesTruckTypes.mutate(undefined, { revalidate: true });
    }
    if (selectedOption === "orders") {
      await httpPut$UpdateOrders(
        `${CLIENT_ENV.BACKEND_URL}/api/orders`,
        data,
        token
      );
      await new Promise(res => setTimeout(res, 500));
      await swr.GetResourcesAllOrders.mutate(undefined, { revalidate: true });
    }
    if (selectedOption === "gasTankTypes") {
      await httpPut$UpdateGasTankTypes(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tank-types`,
        data,
        token
      );
      await new Promise(res => setTimeout(res, 500));
      await swr.GetResourcesGasTankTypes.mutate(undefined, { revalidate: true });
    }
    if (selectedOption === "gasTanks") {
      await httpPut$UpdateGasTanks(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks`,
        data,
        token
      );
      await new Promise(res => setTimeout(res, 500));
      await swr.GetResourcesGasTanks.mutate(undefined, { revalidate: true });
    }
    if (selectedOption === "trucks") {
      await httpPut$UpdateTrucks(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks`,
        data,
        token
      );
      await new Promise(res => setTimeout(res, 500));
      await swr.GetResourcesTrucks.mutate(undefined, { revalidate: true });
    }
    if (selectedOption === "compressorTypes") {
      await httpPut$UpdateCompressorTypes(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-types`,
        data,
        token
      );
      await new Promise(res => setTimeout(res, 500));
      await swr.GetResourcesCompressorTypes.mutate(undefined, { revalidate: true });
    }
    if (selectedOption === "compressors") {
      await httpPut$UpdateCompressors(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors`,
        data,
        token
      );
      await new Promise(res => setTimeout(res, 500));
      await swr.GetResourcesCompressors.mutate(undefined, { revalidate: true });
    }
    if (selectedOption === "compressionStations") {
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
      await httpPut$UpdateCompressionStations(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compression-stations`,
        transformedData,
        token
      );
      await new Promise(res => setTimeout(res, 500));
      await swr.GetResourcesCompressionStations.mutate(undefined, { revalidate: true });
    }
    if (selectedOption === "customers") {
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
      await httpPut$UpdateCustomers(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/customers`,
        transformedData,
        token
      );
      await new Promise(res => setTimeout(res, 500));
      await swr.GetResourcesCustomers.mutate(undefined, { revalidate: true });
    }
    if (selectedOption === "stations") {
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

      await httpPut$UpdateStations(
        `${CLIENT_ENV.BACKEND_URL}/api/resources/compression-stations/`,
        transformedData,
        token
      );
      setIsAddPopupOpen(false);
      swr.GetResourcesStations.mutate(); // Refresh the compression stations data
    }
    setIsEditPopupOpen(false);
  };

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
      ["/api/resources/truck-types/", buildQuery()],
      async () => {
        return await httpGet$GetResourcesTruckTypes(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types/${buildQuery()}`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    GetResourcesGasTankTypes: useSWR(
      ["/api/resources/gas-tank-types/", buildQuery()],
      async () => {
        return await httpGet$GetResourcesGasTankTypes(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tank-types/${buildQuery()}`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    GetResourcesGasTanks: useSWR(
      ["/api/resources/gas-tanks/", buildQuery()],
      async () => {
        return await httpGet$GetResourcesGasTanks(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks/${buildQuery()}`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    GetResourcesTrucks: useSWR(
      ["/api/resources/trucks/", buildQuery()],
      async () => {
        return await httpGet$GetResourcesTrucks(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks/${buildQuery()}`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    GetResourcesCompressorTypes: useSWR(
      ["/api/resources/compressor-types/", buildQuery()],
      async () => {
        return await httpGet$GetResourcesCompressorTypes(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-types/${buildQuery()}`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    GetResourcesCompressors: useSWR(
      ["/api/resources/compressors/", buildQuery()],
      async () => {
        return await httpGet$GGetResourcesCompressors(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors/${buildQuery()}`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    GetResourcesCompressionStations: useSWR(
      ["/api/resources/compression-stations/", buildQuery()],
      async () => {
        return await httpGet$GetResourcesCompressionStations(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compression-stations/${buildQuery()}`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    GetResourcesCustomers: useSWR(
      ["/api/resources/customers/", buildQuery()],
      async () => {
        return await httpGet$GetResourcesCustomers(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/customers/${buildQuery()}`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
    GetResourcesAllOrders: useSWR(
      ["/api/orders/", buildQuery()],
      async () => {
        return await httpGet$GetResourcesAllOrders(
          `${CLIENT_ENV.BACKEND_URL}/api/orders/${buildQuery()}`,
          token
        );
      }
    ),
    GetResourcesStations: useSWR(
      ["/api/resources/stations/", buildQuery()],
      async () => {
        return await httpGet$GetResourcesStations(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/stations/${buildQuery()}`,
          { limit: 100, skip: 0 },
          token
        );
      }
    ),
  };

  const handleDropdownChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    try {
      if (selectedOption === "truckTypes") {
        // Check if any trucks are using this type
        const trucksUsingType = swr.GetResourcesTrucks.data?.some(
          (truck: any) => truck.truck_type_id === selectedRow
        );
        if (trucksUsingType) {
          alert("Cannot delete this truck type because there are still trucks using it.");
          return;
        }
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types`,
          { id: String(selectedRow) },
          token
        );
        swr.GetResourcesTruckTypes.mutate();
      }
      if (selectedOption === "gasTankTypes") {
        // Check if any gas tanks are using this type
        const tanksUsingType = swr.GetResourcesGasTanks.data?.some(
          (tank: any) => tank.gas_tank_type_id === selectedRow
        );
        if (tanksUsingType) {
          alert("Cannot delete this gas tank type because there are still gas tanks using it.");
          return;
        }
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tank-types`,
          { id: String(selectedRow) },
          token
        );
        swr.GetResourcesGasTankTypes.mutate();
      }
      if (selectedOption === "compressorTypes") {
        // Check if any compressors are using this type
        const compressorsUsingType = swr.GetResourcesCompressors.data?.some(
          (compressor: any) => compressor.compressor_type_id === selectedRow
        );
        if (compressorsUsingType) {
          alert("Cannot delete this compressor type because there are still compressors using it.");
          return;
        }
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-types`,
          { id: String(selectedRow) },
          token
        );
        swr.GetResourcesCompressorTypes.mutate();
      }
      if (selectedOption === "orders") {
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/orders`,
          { id: String(selectedRow) },
          token
        );
        swr.GetResourcesAllOrders.mutate(); // Refresh the orders data
      }
      if (selectedOption === "gasTanks") {
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/gas-tanks`,
          { id: String(selectedRow) },
          token
        );
        swr.GetResourcesGasTanks.mutate(); // Refresh the gas tanks data
      }
      if (selectedOption === "trucks") {
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/trucks`,
          { id: String(selectedRow) },
          token
        );
        swr.GetResourcesTrucks.mutate(); // Refresh the trucks data
      }
      if (selectedOption === "compressors") {
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compressors`,
          { id: String(selectedRow) },
          token
        );
        swr.GetResourcesCompressors.mutate(); // Refresh the compressors data
      }
      if (selectedOption === "compressionStations") {
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/compressor-stations`,
          { id: String(selectedRow) },
          token
        );
        swr.GetResourcesCompressionStations.mutate(); // Refresh the compression stations data
      }
      if (selectedOption === "customers") {
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/customers`,
          { id: String(selectedRow) },
          token
        );
        swr.GetResourcesCustomers.mutate(); // Refresh the customers data
      }
      if (selectedOption === "stations") {
        await httpDelete$DeleteResources(
          `${CLIENT_ENV.BACKEND_URL}/api/resources/stations`,
          { id: String(selectedRow) },
          token,
        );
        swr.GetResourcesStations.mutate(); // Refresh the stations data
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource. Please try again.");
    }
  };

  const handleSearch = () => {
    // If you want to clear search, you can do setSearchValue("") here, or leave empty
  };

  const handleRefresh = async () => {
    if (!selectedOption) return;
    setRefreshing(true);
    try {
      switch (selectedOption) {
        case "truckTypes":
          await swr.GetResourcesTruckTypes.mutate(undefined, { revalidate: true });
          break;
        case "orders":
          await swr.GetResourcesAllOrders.mutate(undefined, { revalidate: true });
          break;
        case "gasTankTypes":
          await swr.GetResourcesGasTankTypes.mutate(undefined, { revalidate: true });
          break;
        case "gasTanks":
          await swr.GetResourcesGasTanks.mutate(undefined, { revalidate: true });
          break;
        case "trucks":
          await swr.GetResourcesTrucks.mutate(undefined, { revalidate: true });
          break;
        case "compressorTypes":
          await swr.GetResourcesCompressorTypes.mutate(undefined, { revalidate: true });
          break;
        case "compressors":
          await swr.GetResourcesCompressors.mutate(undefined, { revalidate: true });
          break;
        case "compressionStations":
          await swr.GetResourcesCompressionStations.mutate(undefined, { revalidate: true });
          break;
        case "customers":
          await swr.GetResourcesCustomers.mutate(undefined, { revalidate: true });
          break;
        case "stations":
          await swr.GetResourcesStations.mutate(undefined, { revalidate: true });
          break;
        default:
          break;
      }
    } finally {
      setTimeout(() => setRefreshing(false), 500); // show spinner for at least 0.5s
    }
  };

  const getTableConfig = (option: string) => {
    switch (option) {
      case "truckTypes":
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "vmax", label: "Volume" },
            { key: "count", label: "Count" },
            { key: "owned", label: "Ownership" },
            { key: "rental_cost_by_hour", label: "Rental Cost per Hour" },
          ],
          data: swr.GetResourcesTruckTypes.data ?? [],
        };
      case "gasTankTypes":
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "vmax", label: "Volume" },
            { key: "count", label: "Count" },
            { key: "owned", label: "Ownership" },
            { key: "rental_cost_by_hour", label: "Rental Cost per Hour" },
          ],
          data: swr.GetResourcesGasTankTypes.data ?? [],
        };
      case "gasTanks":
        const gasTanksData = swr.GetResourcesGasTanks.data;
        const modifiedGasTankData = gasTanksData
          ? gasTanksData.map(({ gas_tank_type, station, ...rest }: any) => ({
              ...rest,
              vmax: gas_tank_type.vmax,
            }))
          : [];
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "vmax", label: "Volume" },
            { key: "gas_tank_type_id", label: "Gas Tank Type ID" },
            { key: "status", label: "Status" },
            { key: "station_id", label: "Station ID" },
          ],
          data: modifiedGasTankData ?? [],
        };
      case "trucks":
        const trucksData = swr.GetResourcesTrucks.data;
        const modifiedTruckData = trucksData
          ? trucksData.map(({ truck_type, station, ...rest }: any) => ({
              ...rest,
              vmax: truck_type.vmax,
            }))
          : [];
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "vmax", label: "Volume" },
            { key: "truck_type_id", label: "Truck Type ID" },
            { key: "status", label: "Status" },
            { key: "station_id", label: "Station ID" },
          ],
          data: modifiedTruckData ?? [],
        };
      case "compressorTypes":
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "count", label: "Count" },
            { key: "owned", label: "Ownership" },
            { key: "rental_cost_by_hour", label: "Rental Cost per Hour" },
          ],
          data: swr.GetResourcesCompressorTypes.data ?? [],
        };
      case "compressors":
        const compressorsData = swr.GetResourcesCompressors.data;
        const modifiedCompressorsData = compressorsData
          ? compressorsData.map(({ compressor_type, compressor_station, ...rest }: any) => rest)
          : [];
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "compressor_type_id", label: "Compressor Type ID" },
            { key: "compressor_station_id", label: "Compressor Station ID" },
            { key: "status", label: "Status" },
          ],
          data: modifiedCompressorsData ?? [],
        };
      case "compressionStations":
        const compressionStationsData = swr.GetResourcesCompressionStations.data;
        const modifiedCompressionStationsData = compressionStationsData
          ? compressionStationsData.map(({ gps_coordinates, ...rest }: any) => rest)
          : [];
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "address", label: "Address" },
            { key: "number_of_compressors", label: "Number of Compressors" },
            { key: "latitude", label: "Latitude" },
            { key: "longitude", label: "Longitude" },
          ],
          data: modifiedCompressionStationsData ?? [],
        };
      case "customers":
        const customersData = swr.GetResourcesCustomers.data;
        const modifiedCustomersData = customersData
          ? customersData.map(({ gps_coordinates, ...rest }: any) => rest)
          : [];
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "address", label: "Address" },
            { key: "contact_info", label: "Contact Info" },
            { key: "latitude", label: "Latitude" },
            { key: "longitude", label: "Longitude" },
          ],
          data: modifiedCustomersData ?? [],
        };
      case "orders":
        return {
          columns: [
            { key: "id", label: "ID" },
            { key: "customer_id", label: "Customer ID" },
            { key: "required_volume", label: "Volume" },
            { key: "delivery_time", label: "Date" },
            { key: "priority_level", label: "Priority" },
            { key: "status", label: "Status" },
          ],
          data: swr.GetResourcesAllOrders.data ?? [],
        };
      case "stations":
        const stationsData = swr.GetResourcesStations.data;
        const modifiedStationsData = stationsData
          ? stationsData.map(({ gps_coordinates, ...rest }: any) => rest)
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
    [
      selectedOption,
      swr.GetResourcesTruckTypes.data,
      swr.GetResourcesGasTankTypes.data,
      swr.GetResourcesGasTanks.data,
      swr.GetResourcesTrucks.data,
      swr.GetResourcesCompressorTypes.data,
      swr.GetResourcesCompressors.data,
      swr.GetResourcesCompressionStations.data,
      swr.GetResourcesCustomers.data,
      swr.GetResourcesAllOrders.data,
      swr.GetResourcesStations.data,
    ]
  );

  const filteredData = useMemo(() => {
    if (!tableConfig.data || !Array.isArray(tableConfig.data)) {
      return [];
    }
    let data = tableConfig.data;
    // If orders table, sort by delivery_time descending
    if (selectedOption === "orders") {
      data = [...data].sort((a, b) => {
        const aTime = a.delivery_time ? new Date(a.delivery_time).getTime() : 0;
        const bTime = b.delivery_time ? new Date(b.delivery_time).getTime() : 0;
        return bTime - aTime;
      });
    }
    // If no search value, return all data
    if (!searchValue) {
      return data;
    }
    return []; // TODO: fix later
  }, [tableConfig, searchValue, selectedOption]);

  // Render cell content with special formatting
  const renderCellContent = (value: string, columnKey: string) => {
    switch (columnKey) {
      case "rental_cost_by_hour":
        return value.toLocaleString();
      case "required_volume":
        return parseFloat(value).toFixed(2);
      case "delivery_time":
        // Convert to GMT+7 and show date part (YYYY-MM-DD)
        if (typeof value === "string" && value.length >= 10) {
          return dayjs(value).tz('Asia/Bangkok').format('YYYY-MM-DD');
        }
        return value;
      // Round longitude and latitude to 6 decimal places
      case "longitude":
        return parseFloat(value).toFixed(5);
      case "latitude":
        return parseFloat(value).toFixed(5);
      default:
        return value;
    }
  };

  // Add styleHover if not present
  const styleHover = {
    '&:hover': {
      backgroundColor: '#bdc3c0',
    },
    textTransform: 'none',
    backgroundColor: '#e6ebe9',
  };

  if (!selectedOption) {
    return (
      <div className="flex flex-col h-full">
        <TopLeftBar
          onDropdownChange={handleDropdownChange}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onRefresh={handleRefresh}
          selectedOption={selectedOption}
          orderDay={orderDay}
          setOrderDay={setOrderDay}
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
          onRefresh={handleRefresh}
          selectedOption={selectedOption}
          orderDay={orderDay}
          setOrderDay={setOrderDay}
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
            selectedOption={selectedOption as any}
            token={token}
        />
        <EditDataPopup
            isOpen={isEditPopupOpen}
            onClose={handleCloseEditPopup}
            onSave={handleSaveEdit}
            selectedOption={selectedOption as any}
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
        onRefresh={handleRefresh}
        selectedOption={selectedOption}
        orderDay={orderDay}
        setOrderDay={setOrderDay}
      />
      <AddDataPopup
        isOpen={isAddPopupOpen}
        onClose={handleClosePopup}
        onSave={handleSaveData}
        selectedOption={selectedOption as any}
        token={token}
      />
      <EditDataPopup
        isOpen={isEditPopupOpen}
        onClose={handleCloseEditPopup}
        onSave={handleSaveEdit}
        selectedOption={selectedOption as any}
        token={token}
        selectedRow={selectedRow}
      />
      <div className="flex flex-col h-full w-full">
        <div className="table-modern overflow-auto mb-8" style={{ maxHeight: '48vh', width: '100%' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {tableConfig.columns.map((column) => (
                  <th
                    key={column.key}
                    className="py-3 px-4 text-center text-base font-bold text-gray-700 uppercase tracking-wide"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100" key={selectedOption + (orderDay || '')}>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-emerald-50 transition-colors cursor-pointer ${row.id === selectedRow ? "bg-emerald-100" : ""}`}
                    onClick={() => setSelectedRow(row.id)}
                    style={{ height: '56px' }}
                  >
                    {tableConfig.columns.map((column) => (
                      <td
                        key={column.key}
                        className="py-2 px-4 text-center whitespace-normal text-base text-gray-800"
                      >
                        {renderCellContent((row as any)[column.key], column.key)}
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
      {refreshing && (
        <div className="absolute top-2 right-2 text-xs text-emerald-600 bg-white px-2 py-1 rounded shadow">Refreshing...</div>
      )}
    </div>
  );
}
