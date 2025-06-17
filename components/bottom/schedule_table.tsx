"use client";

import { useMemo } from "react";
import React from "react";
import { AddSchedulePopup } from "./add_schedule_popup";
import { BottomLeftBar } from "./bottom_left_bar";
import { httpDelete$DeleteResources } from "@/lib/commands/DeleteResources/fetcher";
import { httpGet$GetDispatchPlans } from "@/lib/commands/GetDispatchPlans/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import useSWR from "swr";

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

  const handleDeleteSchedule = async () => {
    if (!selectedRow) return;
    await httpDelete$DeleteResources(
      `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans`,
      { id: selectedRow },
      token
    );
    swr.GetDispatchPlans.mutate(); // Revalidate the SWR cache
  };

  const handleCloseSchedule = () => {
    setIsAddSchedulePopupOpen(false);
  };
  const handleSaveSchedule = (ScheduleData: any) => {
    // Save the ScheduleData from the popup add in bottom-left schedule table
    // Don't know how to do this yet, just logging for now
    console.log("Saved data:", ScheduleData);
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

  const tableConfig = {
    columns: [
      { key: "id", label: "ID" },
      { key: "status", label: "Status" },
      { key: "cngVolumeDelivered", label: "CNG volume delivered" },
      { key: "totalCost", label: "Total cost" },
    ],
    data:
      swr.GetDispatchPlans.data?.map((plan) => ({
        id: plan.id,
        status: plan.status,
        cngVolumeDelivered: plan.total_volume_delivered,
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
            <tbody
              className="bg-brand-F1EDEA divide-y divide-brand-F1EDEA"
              key={selectedDate.toDateString()}
            >
              {tableConfig.data.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors cursor-pointe ${
                    row.id === selectedRow ? "bg-gray-50" : ""
                  }`}
                  onDoubleClick={() => handleRowDoubleClick(row)}
                  onClick={() => setSelectedRow(row.id)}
                >
                  {tableConfig.columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-1 text-center whitespace-normal text-sm text-black"
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
