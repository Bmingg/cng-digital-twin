import React, { useEffect, useState } from "react";
import { AddAssignmentPopup } from "./add_assignment_popup"; // Import the popup component
import { Plus, Trash, Pencil } from "lucide-react";
import { IconButton } from "@mui/material";
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
}

const styleHover = {
  "&:hover": {
    backgroundColor: "#bdc3c0",
  },
  textTransform: "none",
  backgroundColor: "#e6ebe9",
};

function TabContent({ data, onAddAssignment, token }: TabContentProps) {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [showUpdateTimePopup, setShowUpdateTimePopup] = useState(false);

  if (!data) return null;

  const swr = {
    GetPlanAssignments: useSWR(
      [`/api/dispatch/plans/${data.id}/assignments`],
      async () =>
        await httpGet$GetPlanAssignments(
          `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans/${data.id}/assignments`,
          token
        )
    ),
  };

  const [open, setOpen] = useState<boolean[]>([]);

  useEffect(() => {
    if (swr.GetPlanAssignments.data) {
      setOpen(
        Array.from({ length: swr.GetPlanAssignments.data.length }, () => false)
      );
    } else {
      setOpen([]);
    }
  }, [swr.GetPlanAssignments.data?.length, data]);

  const handleAddClick = () => {
    setIsAddPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsAddPopupOpen(false);
  };

  const handlePopupSave = async (params: AddAssignmentToPlan$Params) => {
    try {
      await httpPost$AddAssignmentToPlan(
        `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans/${data.id}/assignments`,
        params
      );
      alert("Add assignment successfully!");
      swr.GetPlanAssignments.mutate();
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
      const id = swr.GetPlanAssignments.data?.[indexOpen].id;
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

  return (
    <div className="h-full overflow-auto bg-brand-F1EDEA">
      {/* Action buttons */}
      <div className="flex px-1 gap-3 border-b border-gray-200 bg-brand-BADFCD">
        <IconButton
          className="flex items-center gap-1 size-sm"
          sx={styleHover}
          onClick={handleAddClick}
        >
          <Plus className="h-4 w-4" color="#003b2a" />
        </IconButton>
        <IconButton
          className="flex items-center gap-1 size-sm"
          sx={styleHover}
          onClick={() => setShowUpdateTimePopup(true)}
        >
          <Pencil className="h-4 w-4" color="#003b2a" />
        </IconButton>
        <IconButton className="flex items-center gap-1 size-sm" sx={styleHover}>
          <Trash className="h-4 w-4" color="#003b2a" />
        </IconButton>
      </div>
      {/* Table */}
      {showUpdateTimePopup ? (
        <UpdateTimePopup
          onSubmit={handleUpdateTime}
          onClose={() => setShowUpdateTimePopup(false)}
        />
      ) : undefined}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brand-F1EDEA fontweight-bold">
              <th className="border border-gray-300 px-1 py-1 text-center">
                Order
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center">
                Truck
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center">
                Tank
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center">
                Compressor
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center">
                Status
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center">
                Estimated
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center">
                Actual
              </th>
            </tr>
          </thead>
          <tbody>
            {swr.GetPlanAssignments.data?.map((order, index) => (
              <React.Fragment key={order.order_id}>
                {/* Order header row */}
                <tr
                  className="bg-brand-F1EDEA hover:bg-gray-50"
                  onDoubleClick={() => {
                    setOpen((open) =>
                      open.map((_, indexOpen) =>
                        indexOpen === index ? true : false
                      )
                    );
                  }}
                >
                  <td className="border border-gray-300 px-1 py-1 text-center font-sm">
                    {order.order_id.slice(-4)}
                  </td>
                  <td className="border border-gray-300 px-1 py-1 text-center">
                    {order.truck_id}
                  </td>
                  <td className="border border-gray-300 px-1 py-1 text-center">
                    {order.tank_id}
                  </td>
                  <td className="border border-gray-300 px-1 py-1 text-center">
                    {order.compressor_id}
                  </td>
                  <td className="border border-gray-300 px-1 py-1 text-center">
                    <span
                      className={`px-1 py-1 rounded text-sm font-sm ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-1 py-1"></td>
                  <td className="border border-gray-300 px-1 py-1"></td>
                </tr>

                {open[index] ? (
                  <>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1 font-italic text-gray-700">
                        Start time at truck depot
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.estimated_start_time || "—"}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.actual_end_time || "—"}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1 font-italic text-gray-700">
                        Complete loading gas tank at tank depot
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.estimated_tank_loading_finished || "—"}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.actual_tank_loading_finished || "—"}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1 font-italic text-gray-700">
                        Complete filling gas tank at compressor station
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.estimated_gas_filling_finished || "—"}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.actual_gas_filling_finished || "—"}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1 font-italic text-gray-700">
                        Complete delivery to the customer
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.estimated_delivery_finished || "—"}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.actual_delivery_finished || "—"}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1 font-italic text-gray-700">
                        Complete unloading gas tank
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.estimated_tank_unloading_finished || "—"}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.actual_tank_unloading_finished || "—"}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1"></td>
                      <td className="border border-gray-300 px-1 py-1 font-italic text-gray-700">
                        Returned to truck depot
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.estimated_end_time || "—"}
                      </td>
                      <td className="border border-gray-300 px-1 py-1 text-center">
                        {order.actual_end_time || "—"}
                      </td>
                    </tr>
                  </>
                ) : undefined}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Assignment Popup */}
      <AddAssignmentPopup
        date={data.date}
        isOpen={isAddPopupOpen}
        onClose={handlePopupClose}
        onSave={handlePopupSave}
      />
    </div>
  );
}

export function TabContainer({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  token,
}: TabContainerProps) {
  const handleAddAssignment = (assignmentData: any) => {
    // Handle the new assignment data here
    // This could involve updating your state, making API calls, etc.
    console.log("Assignment added to schedule:", assignmentData);
    // You might want to pass this up to the parent component
    // or handle it directly here based on your data flow
  };

  if (tabs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-brand-BDC3C0 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>

          <p className="text-gray-500 text-lg font-medium">
            No schedules opened
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Double-click a row in the table to open a schedule tab
          </p>
        </div>
      </div>
    );
  }

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="flex flex-col h-full bg-brand-BDC3C0 rounded-lg shadow-sm border border-gray-200">
      {/* Tab Bar */}
      <div className="flex border-b border-gray-200 bg-brand-BDC3C0 rounded-t-lg overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex rounded-lg items-center px-1 py-1 border-r border-blank-200 cursor-pointer whitespace-nowrap min-w-0 ${
              activeTab === tab.id
                ? "bg-white border-b-2 fontweight-bold font-medium text-black"
                : "hover:bg-gray-100 text-gray-600 opacity-80"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="truncate px-2 text-sm items-center flex-center">
              {tab.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className={`ml-1 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? "hover:bg-gray-200 text-gray-500 hover:text-black"
                  : "hover:bg-gray-200 text-gray-500"
              }`}
              title="Close tab"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab && activeTabData && (
          <TabContent
            token={token}
            data={activeTabData.data}
            onAddAssignment={handleAddAssignment}
          />
        )}
      </div>
    </div>
  );
}
