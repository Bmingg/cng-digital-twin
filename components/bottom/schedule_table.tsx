"use client";

import { useMemo } from "react";
import React from "react";
import { AddSchedulePopup } from "./add_schedule_popup";
import { BottomLeftBar } from "./bottom_left_bar";
import { httpDelete$DeleteResources } from "@/lib/commands/DeleteResources/fetcher";
import { httpGet$GetDispatchPlans } from "@/lib/commands/GetDispatchPlans/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import useSWR from "swr";
import { CreateDispatchPlan$Params } from "@/lib/commands/CreateDispatchPlan/typing";
import { httpPost$CreateDispatchPlan } from "@/lib/commands/CreateDispatchPlan/fetcher";

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

type Column = "id" | "status" | "cngVolumeDelivered" | "totalCost";

export type TableConfig = {
  columns: { key: string; label: string }[];
  data: {
    id: string;
    status: string;
    date: string;
    cngVolumeDelivered: number | null | undefined;
    totalCost: number | null | undefined;
  }[];
};

type Props = {
  onRowDoubleClick: (row: TableConfig["data"][0]) => void;
  token: string;
};

export function ScheduleTable({ onRowDoubleClick, token }: Props) {
  const yesterdayDate = useMemo(() => getYesterdayDate(), []);
  const [selectedRow, setSelectedRow] = React.useState<string | undefined>();

  const handleRowDoubleClick = (row: TableConfig["data"][0]) => {
    onRowDoubleClick(row);
  };

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );
  const [isAddSchedulePopupOpen, setIsAddSchedulePopupOpen] =
    React.useState(false);

  const handleDropdownDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const handleAddSchedule = () => {
    setIsAddSchedulePopupOpen(true);
  };

  const handleCloseSchedule = () => {
    setIsAddSchedulePopupOpen(false);
  };

  const swr = {
    GetDispatchPlans: useSWR(
      [`/api/dispatch/plans/`, selectedDate],
      async () => {
        if (!selectedDate) return undefined;
        return await httpGet$GetDispatchPlans(
          `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans/`,
          {
            start_date: selectedDate,
          },
          token
        );
      }
    ),
  };

  const handleDeleteSchedule = async () => {
    if (!selectedRow) return;
    await httpDelete$DeleteResources(
      `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans`,
      { id: selectedRow },
      token
    );
    alert("Dispatch plan deleted successfully!");
    swr.GetDispatchPlans.mutate();
  };

  const handleSaveSchedule = async (params: CreateDispatchPlan$Params) => {
    // Save the ScheduleData from the popup add in bottom-left schedule table
    // Don't know how to do this yet, just logging for now
    await httpPost$CreateDispatchPlan(
      `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans`,
      params
    );
    alert("Dispatch plan created successfully!");
    swr.GetDispatchPlans.mutate();
    setIsAddSchedulePopupOpen(false);
  };

  const tableConfig = {
    columns: [
      { key: "id", label: "ID" },
      { key: "status", label: "Status" },
      { key: "cngVolumeDelivered", label: "CNG volume delivered" },
      { key: "totalDistance", label: "Total Distance" },
      { key: "totalOrderCompleted", label: "Total Order Completed" },
      { key: "totalCost", label: "Total cost" },
    ],
    data:
      swr.GetDispatchPlans.data?.map((plan) => ({
        id: plan.id,
        status: plan.status,
        cngVolumeDelivered: plan.total_volume_delivered,
        totalDistance: plan.total_distance,
        totalOrderCompleted: plan.total_order_completed,
        totalCost: plan.total_cost,
        date: plan.date,
      })) ?? [],
  };

  // Render cell content with special formatting
  const renderCellContent = (value: string | number, columnKey: string) => {
    switch (columnKey) {
      // case 'status':
      //   return getStatusBadge(value);
      case "totalCost":
        return value.toLocaleString();

      case "id":
        return value.toString().slice(-4);

      default:
        return value;
    }
  };

  if (!selectedDate) {
    return (
      <>
        <BottomLeftBar
          selectedDate={selectedDate}
          onDropdownDateChange={handleDropdownDateChange}
          onAddSchedule={handleAddSchedule}
          onDeleteSchedule={handleDeleteSchedule}
        />
        <AddSchedulePopup
          isOpen={isAddSchedulePopupOpen}
          onClose={handleCloseSchedule}
          onSave={handleSaveSchedule}
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
        <BottomLeftBar
          selectedDate={selectedDate}
          onDropdownDateChange={handleDropdownDateChange}
          onAddSchedule={handleAddSchedule}
          onDeleteSchedule={handleDeleteSchedule}
        />
        <AddSchedulePopup
          isOpen={isAddSchedulePopupOpen}
          onClose={handleCloseSchedule}
          onSave={handleSaveSchedule}
        />
        <div className="flex flex-col h-full w-full bg-brand-F1EDEA items-center justify-center">
          <div className="text-gray-500 text-lg">
            No table configuration available for:{" "}
            {selectedDate.toLocaleTimeString()}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BottomLeftBar
        selectedDate={selectedDate}
        onDropdownDateChange={handleDropdownDateChange}
        onAddSchedule={handleAddSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />
      <AddSchedulePopup
        isOpen={isAddSchedulePopupOpen}
        onClose={handleCloseSchedule}
        onSave={handleSaveSchedule}
      />
      <div className="flex flex-col h-full w-full">
        <div className="table-modern overflow-auto mb-8" style={{ maxHeight: '32vh', width: '100%' }}>
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
            <tbody className="bg-white divide-y divide-gray-100" key={selectedDate?.toDateString()}>
              {tableConfig.data.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-emerald-50 transition-colors cursor-pointer ${row.id === selectedRow ? "bg-emerald-100" : ""}`}
                  onDoubleClick={() => handleRowDoubleClick(row)}
                  onClick={() => setSelectedRow(row.id)}
                  style={{ height: '56px' }}
                >
                  {tableConfig.columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-2 px-4 text-center whitespace-normal text-base text-gray-800"
                    >
                      {renderCellContent(
                        row[column.key as Column] ?? 0,
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
    </>
  );
}
