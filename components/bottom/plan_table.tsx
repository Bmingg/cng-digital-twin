"use client";

import { useMemo } from "react";
import React from "react";
import { AddPlanPopup } from "./add_plan_popup";
import { BottomLeftBar } from "./bottom_left_bar";
import { httpDelete$DeleteResources } from "@/lib/commands/DeleteResources/fetcher";
import { httpGet$GetDispatchPlans } from "@/lib/commands/GetDispatchPlans/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import useSWR from "swr";
import { CreateDispatchPlan$Params } from "@/lib/commands/CreateDispatchPlan/typing";
import { httpPost$CreateDispatchPlan } from "@/lib/commands/CreateDispatchPlan/fetcher";
import { httpPost$ExecutePlan } from "@/lib/commands/ExecutePlan/fetcher";
import dayjs from "dayjs";
import { useToast } from "@/components/ui/toast";
import { Play } from "lucide-react";

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
  refreshCounter?: number;
};

export function PlanTable({ onRowDoubleClick, token, refreshCounter }: Props) {
  const yesterdayDate = useMemo(() => getYesterdayDate(), []);
  const [selectedRow, setSelectedRow] = React.useState<string | undefined>();
  const toast = useToast();

  const handleRowDoubleClick = (row: TableConfig["data"][0]) => {
    onRowDoubleClick(row);
  };

  const [selectedDate, setSelectedDate] = React.useState<string | null>(
    dayjs().format('YYYY-MM-DD')
  );
  const [isAddPlanPopupOpen, setIsAddPlanPopupOpen] =
    React.useState(false);

  const handleDropdownDateChange = (date: string | null) => {
    setSelectedDate(date);
  };
  const handleAddPlan = () => {
    setIsAddPlanPopupOpen(true);
  };

  const handleClosePlan = () => {
    setIsAddPlanPopupOpen(false);
  };

  const swr = {
    GetDispatchPlans: useSWR(
      [`/api/dispatch/plans/`, selectedDate, refreshCounter],
      async () => {
        if (!selectedDate) return undefined;
        return await httpGet$GetDispatchPlans(
          `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans/`,
          {
            start_date: new Date(selectedDate + 'T00:00:00.000Z'),
          },
          token
        );
      }
    ),
  };

  const handleDeletePlan = async () => {
    if (!selectedRow) return;
    try {
      await httpDelete$DeleteResources(
        `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans`,
        { id: selectedRow },
        token
      );
      toast.success("Dispatch plan deleted successfully!");
      swr.GetDispatchPlans.mutate();
    } catch (error) {
      toast.error("Failed to delete dispatch plan");
    }
  };

  const handleSavePlan = async (params: CreateDispatchPlan$Params) => {
    try {
      // Save the PlanData from the popup add in bottom-left plan table
      await httpPost$CreateDispatchPlan(
        `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans`,
        params
      );
      toast.success("Dispatch plan created successfully!");
      swr.GetDispatchPlans.mutate();
      setIsAddPlanPopupOpen(false);
    } catch (error) {
      toast.error("Failed to create dispatch plan");
    }
  };

  const handleExecutePlan = async () => {
    if (!selectedRow) {
      toast.warning("Please select a plan to execute");
      return;
    }
    
    try {
      await httpPost$ExecutePlan(
        `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans/${selectedRow}/execute`,
        {},
        token
      );
      toast.success("Plan marked for execution successfully!");
      swr.GetDispatchPlans.mutate();
    } catch (error) {
      console.error('Error executing plan:', error);
      toast.error(error instanceof Error ? error.message : "Failed to execute plan");
    }
  };

  const tableConfig = {
    columns: [
      { key: "id", label: "ID" },
      { key: "status", label: "Status" },
      { key: "cngVolumeDelivered", label: "Total Volume" },
      { key: "totalDistance", label: "Total Distance" },
      { key: "totalOrderCompleted", label: "Total Order" },
      { key: "totalCost", label: "Total Cost" },
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
      case 'status':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === "executed" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : value === "in_progress"
              ? "bg-blue-100 text-blue-800 border border-blue-200"
              : value === "completed"
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-gray-100 text-gray-800 border border-gray-200"
          }`}>
            {value}
          </span>
        );
      case "totalCost":
        return value?.toLocaleString() || "0";

      case "id":
        return value.toString().slice(-4);



      default:
        return value || "0";
    }
  };

  if (!selectedDate) {
    return (
      <>
        <BottomLeftBar
          selectedDate={selectedDate}
          onDropdownDateChange={handleDropdownDateChange}
          onAddPlan={handleAddPlan}
          onDeletePlan={handleDeletePlan}
          onExecutePlan={handleExecutePlan}
        />
        <AddPlanPopup
          isOpen={isAddPlanPopupOpen}
          onClose={handleClosePlan}
          onSave={handleSavePlan}
          token={token}
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
          onAddPlan={handleAddPlan}
          onDeletePlan={handleDeletePlan}
          onExecutePlan={handleExecutePlan}
        />
        <AddPlanPopup
          isOpen={isAddPlanPopupOpen}
          onClose={handleClosePlan}
          onSave={handleSavePlan}
          token={token}
        />
        <div className="flex flex-col h-full w-full bg-brand-F1EDEA items-center justify-center">
          <div className="text-gray-500 text-lg">
            No table configuration available for:{" "}
            {selectedDate}
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
        onAddPlan={handleAddPlan}
        onDeletePlan={handleDeletePlan}
        onExecutePlan={handleExecutePlan}
      />
      <AddPlanPopup
        isOpen={isAddPlanPopupOpen}
        onClose={handleClosePlan}
        onSave={handleSavePlan}
        token={token}
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
            <tbody className="bg-white divide-y divide-gray-100" key={selectedDate}>
              {tableConfig.data.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-emerald-50 transition-colors cursor-pointer ${
                    row.id === selectedRow ? "bg-emerald-100" : 
                    row.status === "executed" ? "bg-green-50 border-l-4 border-green-400" : ""
                  }`}
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
