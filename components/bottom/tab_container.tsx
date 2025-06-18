import React, { useEffect, useState } from "react";
import { AddAssignmentPopup } from "./add_assignment_popup"; // Import the popup component
import { Plus, Trash, Pencil } from "lucide-react";
import { IconButton, Box, Tooltip } from "@mui/material";
import useSWR from "swr";
import { httpGet$GetPlanAssignments } from "@/lib/commands/GetPlanAssignments/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import { UpdateTimePopup } from "./update_time_popup";
import { AddAssignmentToPlan$Params } from "@/lib/commands/AddAssignmentToPlan/typing";
import { httpPost$AddAssignmentToPlan } from "@/lib/commands/AddAssignmentToPlan/fetcher";

// Define the types for your tab data
interface TabData {
  id: string;
  status: string;
  date: string;
  cngVolumeDelivered: number | null | undefined;
  totalCost: number | null | undefined;
  // Add other properties as needed
}

interface Tab {
  id: string;
  name: string;
  data: TabData;
}

interface TabContainerProps {
  tabs: Tab[];
  activeTab: string | undefined;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  token: string;
}

interface TabContentProps {
  data: TabData | undefined;
  onAddAssignment: (assignmentData: any) => void;
  token: string;
  hideActionButtons?: boolean;
}

const styleHover = {
  "&:hover": {
    backgroundColor: "#bdc3c0",
  },
  textTransform: "none",
  backgroundColor: "#e6ebe9",
};

function TabContent({ data, onAddAssignment, token, hideActionButtons }: TabContentProps) {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [showUpdateTimePopup, setShowUpdateTimePopup] = useState(false);
  const [open, setOpen] = useState<boolean[]>([]);

  const swr = useSWR(
    data ? [`/api/dispatch/plans/${data.id}/assignments`] : null,
    async () =>
      await httpGet$GetPlanAssignments(
        `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans/${data?.id}/assignments`,
        token
      )
  );

  useEffect(() => {
    if (swr.data) {
      setOpen(
        Array.from({ length: swr.data.length }, () => false)
      );
    } else {
      setOpen([]);
    }
  }, [swr.data]);

  const handleAddClick = () => {
    setIsAddPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsAddPopupOpen(false);
  };

  const handlePopupSave = async (params: AddAssignmentToPlan$Params) => {
    try {
      const response = await httpPost$AddAssignmentToPlan(
        `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans/${data?.id}/assignments`,
        params,
        token
      );
      console.log('Add assignment API response:', response);
      alert("Add assignment successfully!");
      swr.mutate();
      setIsAddPopupOpen(false);
    } catch (error) {
      console.error(error);
      if ("message" in (error as any)) {
        alert((error as any).message);
      }
    }
  };

  const handleUpdateTime = async (time: string) => {
    setShowUpdateTimePopup(false);
    const indexOpen = open.indexOf(true);
    if (indexOpen === -1) {
      alert("No assignment selected!");
    } else {
      const id = swr.data?.[indexOpen].id;
      if (!id) alert("Id not found");
      const date = new Date();
      if (time.length !== 5) alert("invalid input time");
      let [hours, minutes] = time.split(":").map(Number);
      date.setUTCHours(hours, minutes, 0);
      // await httpPatch$UpdateAssignmentProgress(
      //   `${CLIENT_ENV.BACKEND_URL}/api/dispatch/assignments/${id}/progress`,
      //   {
      //     event_time: date.toISOString(),
      //   },
      //   token
      // );
      // alert("Update time successfully!");
      // swr.GetPlanAssignments.mutate();
    }
  };

  if (!data) return null;

  return (
    <div className="h-full overflow-auto bg-brand-F1EDEA">
      {/* Table */}
      {showUpdateTimePopup ? (
        <UpdateTimePopup
          onSubmit={handleUpdateTime}
          onClose={() => setShowUpdateTimePopup(false)}
        />
      ) : undefined}
      <div className="table-modern overflow-auto mb-8" style={{ maxHeight: '40vh', width: '100%' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-center text-base font-bold text-gray-700 uppercase tracking-wide">Order</th>
              <th className="py-3 px-4 text-center text-base font-bold text-gray-700 uppercase tracking-wide">Truck</th>
              <th className="py-3 px-4 text-center text-base font-bold text-gray-700 uppercase tracking-wide">Tank</th>
              <th className="py-3 px-4 text-center text-base font-bold text-gray-700 uppercase tracking-wide">Compressor</th>
              <th className="py-3 px-4 text-center text-base font-bold text-gray-700 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {swr.data?.map((order, index) => (
              <React.Fragment key={order.order_id}>
                <tr
                  className={`bg-white hover:bg-emerald-50 transition-colors cursor-pointer ${open[index] ? "bg-emerald-100" : ""}`}
                  onDoubleClick={() => {
                    setOpen((open) =>
                      open.map((_, indexOpen) =>
                        indexOpen === index ? !open[indexOpen] : false
                      )
                    );
                  }}
                  style={{ height: '56px' }}
                >
                  <td className="py-2 px-4 text-center whitespace-normal text-base text-gray-800">{order.order_id.slice(-4)}</td>
                  <td className="py-2 px-4 text-center whitespace-normal text-base text-gray-800">{order.truck_id}</td>
                  <td className="py-2 px-4 text-center whitespace-normal text-base text-gray-800">{order.tank_id}</td>
                  <td className="py-2 px-4 text-center whitespace-normal text-base text-gray-800">{order.compressor_id}</td>
                  <td className="py-2 px-4 text-center whitespace-normal text-base text-gray-800">
                    <span className={`px-1 py-1 rounded text-sm font-sm ${order.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{order.status}</span>
                  </td>
                </tr>
                {open[index] && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="py-2 px-4 text-right text-gray-600 font-medium">
                        Start time at truck depot:
                        <span className="font-semibold text-emerald-700 ml-2">Estimate:</span> <span className="text-gray-800">{order.estimated_start_time || "—"}</span>
                        <span className="font-semibold text-blue-700 ml-4">Actual:</span> <span className="text-gray-800">{order.actual_start_time || "—"}</span>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td colSpan={5} className="py-2 px-4 text-right text-gray-600 font-medium">
                        Complete loading gas tank at tank depot:
                        <span className="font-semibold text-emerald-700 ml-2">Estimate:</span> <span className="text-gray-800">{order.estimated_tank_loading_finished || "—"}</span>
                        <span className="font-semibold text-blue-700 ml-4">Actual:</span> <span className="text-gray-800">{order.actual_tank_loading_finished || "—"}</span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="py-2 px-4 text-right text-gray-600 font-medium">
                        Complete filling gas tank at compressor station:
                        <span className="font-semibold text-emerald-700 ml-2">Estimate:</span> <span className="text-gray-800">{order.estimated_gas_filling_finished || "—"}</span>
                        <span className="font-semibold text-blue-700 ml-4">Actual:</span> <span className="text-gray-800">{order.actual_gas_filling_finished || "—"}</span>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td colSpan={5} className="py-2 px-4 text-right text-gray-600 font-medium">
                        Complete delivery to the customer:
                        <span className="font-semibold text-emerald-700 ml-2">Estimate:</span> <span className="text-gray-800">{order.estimated_delivery_finished || "—"}</span>
                        <span className="font-semibold text-blue-700 ml-4">Actual:</span> <span className="text-gray-800">{order.actual_delivery_finished || "—"}</span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="py-2 px-4 text-right text-gray-600 font-medium">
                        Complete unloading gas tank:
                        <span className="font-semibold text-emerald-700 ml-2">Estimate:</span> <span className="text-gray-800">{order.estimated_tank_unloading_finished || "—"}</span>
                        <span className="font-semibold text-blue-700 ml-4">Actual:</span> <span className="text-gray-800">{order.actual_tank_unloading_finished || "—"}</span>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td colSpan={5} className="py-2 px-4 text-right text-gray-600 font-medium">
                        Returned to truck depot:
                        <span className="font-semibold text-emerald-700 ml-2">Estimate:</span> <span className="text-gray-800">{order.estimated_end_time || "—"}</span>
                        <span className="font-semibold text-blue-700 ml-4">Actual:</span> <span className="text-gray-800">{order.actual_end_time || "—"}</span>
                      </td>
                    </tr>
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Assignment Popup */}
      {isAddPopupOpen && (
        <AddAssignmentPopup
          date={data.date}
          isOpen={isAddPopupOpen}
          onClose={handlePopupClose}
          onSave={handlePopupSave}
          token={token}
        />
      )}
    </div>
  );
}

function TabActionButtons({
  onAdd,
  onEditTime,
  onDelete
}: {
  onAdd: () => void;
  onEditTime: () => void;
  onDelete: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
        backgroundColor: "#f3f4f6",
        padding: "0 12px",
        gap: 2,
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
      }}
      className="bg-white shadow-md rounded-full border border-gray-200"
    >
      <Tooltip title="Add assignment">
        <IconButton className="rounded-full hover:bg-emerald-100 transition" onClick={onAdd}>
          <Plus className="h-5 w-5" color="#003b2a" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit time">
        <IconButton className="rounded-full hover:bg-blue-100 transition" onClick={onEditTime}>
          <Pencil className="h-5 w-5" color="#2563eb" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete assignment">
        <IconButton className="rounded-full hover:bg-rose-100 transition" onClick={onDelete}>
          <Trash className="h-5 w-5" color="#e11d48" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export function TabContainer({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  token,
}: TabContainerProps) {
  const [showAddPopup, setShowAddPopup] = React.useState(false);
  const [showUpdateTimePopup, setShowUpdateTimePopup] = React.useState(false);

  const handleAddClick = () => {
    setShowAddPopup(true);
  };

  if (tabs.length === 0) {
    return null;
  }

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="flex flex-col h-full bg-brand-BDC3C0 rounded-lg shadow-sm border border-gray-200">
      {/* Tab Bar + Action Buttons */}
      <div className="flex bg-white shadow-md rounded-t-xl border-b border-gray-200 px-2 py-2 gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-full cursor-pointer min-w-0 transition-all duration-200
                ${activeTab === tab.id
                  ? "bg-emerald-100 text-emerald-800 font-bold shadow-sm border border-emerald-200"
                  : "hover:bg-gray-100 text-gray-600 opacity-80"}
              `}
              onClick={() => onTabChange(tab.id)}
              style={{ marginRight: 8 }}
            >
              <span className="truncate text-base items-center flex-center">
                {tab.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className={`ml-2 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors w-6 h-6
                  ${activeTab === tab.id
                    ? "hover:bg-emerald-200 text-emerald-700"
                    : "hover:bg-gray-200 text-gray-500"}
                `}
                title="Close tab"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <TabActionButtons
            onAdd={handleAddClick}
            onEditTime={() => setShowUpdateTimePopup(true)}
            onDelete={() => {/* TODO: Implement delete */}}
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTabData && (
          <TabContent
            data={activeTabData.data}
            onAddAssignment={handleAddClick}
            token={token}
            hideActionButtons={true}
          />
        )}
      </div>
    </div>
  );
}
