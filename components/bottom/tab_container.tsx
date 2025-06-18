import React, { useEffect, useState } from "react";
import { AddAssignmentPopup } from "./add_assignment_popup";
import { Plus, Trash, Pencil } from "lucide-react";
import { IconButton, Box, Tooltip } from "@mui/material";
import useSWR from "swr";
import { httpGet$GetPlanAssignments } from "@/lib/commands/GetPlanAssignments/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import { UpdateTimePopup } from "./update_time_popup";
import { AddAssignmentToPlan$Params } from "@/lib/commands/AddAssignmentToPlan/typing";
import { httpPost$AddAssignmentToPlan } from "@/lib/commands/AddAssignmentToPlan/fetcher";
import { httpPatch$UpdateAssignmentProgress } from "@/lib/commands/UpdateAssignmentProgress/fetcher";
import { httpDelete$DeleteAssignment } from "@/lib/commands/DeleteAssignment/fetcher";
import { useToast } from "@/components/ui/toast";

// Helper function to format time to HH:MM in UTC
const formatTimeOnly = (timeString: string | null | undefined): string => {
  if (!timeString) return "—";
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return "—";
    // Format in UTC timezone
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
  } catch (error) {
    return "—";
  }
};

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
  onPlanDataChange?: () => void;
  onAssignmentSelect?: (assignmentId: string | null) => void;
}

interface TabContentProps {
  data: TabData | undefined;
  onAddAssignment: (assignmentData: any) => void;
  token: string;
  hideActionButtons?: boolean;
  onDataRefresh?: () => void;
  onAssignmentAdded?: () => void;
  onEditTimeRequest?: (assignment: any) => void;
  onAssignmentSelect?: (assignmentId: string | null) => void;
  refreshKey?: number;
}

const styleHover = {
  "&:hover": {
    backgroundColor: "#bdc3c0",
  },
  textTransform: "none",
  backgroundColor: "#e6ebe9",
};

function TabContent({ data, onAddAssignment, token, hideActionButtons, onDataRefresh, onAssignmentAdded, onEditTimeRequest, onAssignmentSelect, refreshKey }: TabContentProps) {
  const [open, setOpen] = useState<boolean[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const toast = useToast();

  const swr = useSWR(
    data ? [`/api/dispatch/plans/${data.id}/assignments`, refreshKey] : null,
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
    // Reset selected assignment when data changes
    setSelectedAssignmentId(null);
  }, [swr.data]);

  const handleEditTimeClick = (assignment: any, step: string) => {
    if (onEditTimeRequest) {
      onEditTimeRequest({ ...assignment, step });
    }
  };



  // Function to determine the next incomplete step
  const getNextIncompleteStep = (order: any) => {
    const steps = [
      { key: 'start', actualField: 'actual_start_time' },
      { key: 'loading', actualField: 'actual_tank_loading_finished' },
      { key: 'filling', actualField: 'actual_gas_filling_finished' },
      { key: 'delivery', actualField: 'actual_delivery_finished' },
      { key: 'unloading', actualField: 'actual_tank_unloading_finished' },
      { key: 'return', actualField: 'actual_end_time' }
    ];

    for (const step of steps) {
      if (!order[step.actualField]) {
        return step.key;
      }
    }
    return null; // All steps completed
  };

  const renderStepRow = (
    order: any,
    stepName: string,
    estimatedField: string,
    actualField: string,
    stepKey: string,
    bgClass: string
  ) => {
    const hasActualTime = order[actualField];
    const nextIncompleteStep = getNextIncompleteStep(order);
    const showEditButton = !hasActualTime && stepKey === nextIncompleteStep;
    
    return (
      <tr className={bgClass}>
        <td colSpan={5} className="py-3 px-6">
          <div className="grid grid-cols-12 items-center gap-4">
            <span className="text-gray-700 font-medium text-base col-span-6">{stepName}</span>
            <div className="flex items-center gap-2 col-span-2">
              <span className="text-emerald-600 font-semibold text-sm bg-emerald-50 px-2 py-1 rounded w-10 text-center">EST</span>
              <span className="text-gray-800 font-mono text-base w-16">{formatTimeOnly(order[estimatedField])}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-2 py-1 rounded w-10 text-center">ACT</span>
              <span className={`font-mono text-base w-16 ${hasActualTime ? 'text-blue-800 font-semibold' : 'text-gray-400'}`}>
                {formatTimeOnly(order[actualField])}
              </span>
            </div>
            <div className="col-span-2 flex justify-end">
              {showEditButton && (
                <button
                  onClick={() => handleEditTimeClick(order, stepKey)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  };

  if (!data) return null;

  return (
    <div className="h-full overflow-auto bg-brand-F1EDEA">
      {/* Table */}
      <div className="table-modern overflow-auto mb-8" style={{ maxHeight: '60vh', width: '100%' }}>
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
          <tbody className="bg-white divide-y divide-gray-100" key={refreshKey}>
            {swr.data?.map((order, index) => (
              <React.Fragment key={order.order_id}>
                <tr
                  className={`bg-white hover:bg-emerald-50 transition-colors cursor-pointer ${open[index] ? "bg-emerald-100" : ""} ${selectedAssignmentId === order.id ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => {
                    setSelectedAssignmentId(order.id);
                    if (onAssignmentSelect) {
                      onAssignmentSelect(order.id);
                    }
                  }}
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
                    {renderStepRow(
                      order,
                      "Start time at truck depot",
                      "estimated_start_time",
                      "actual_start_time",
                      "start",
                      "bg-gray-50"
                    )}
                    {renderStepRow(
                      order,
                      "Complete loading gas tank at tank depot",
                      "estimated_tank_loading_finished",
                      "actual_tank_loading_finished",
                      "loading",
                      "bg-white"
                    )}
                    {renderStepRow(
                      order,
                      "Complete filling gas tank at compressor station",
                      "estimated_gas_filling_finished",
                      "actual_gas_filling_finished",
                      "filling",
                      "bg-gray-50"
                    )}
                    {renderStepRow(
                      order,
                      "Complete delivery to the customer",
                      "estimated_delivery_finished",
                      "actual_delivery_finished",
                      "delivery",
                      "bg-white"
                    )}
                    {renderStepRow(
                      order,
                      "Complete unloading gas tank",
                      "estimated_tank_unloading_finished",
                      "actual_tank_unloading_finished",
                      "unloading",
                      "bg-gray-50"
                    )}
                    {renderStepRow(
                      order,
                      "Returned to truck depot",
                      "estimated_end_time",
                      "actual_end_time",
                      "return",
                      "bg-white"
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabActionButtons({
  onAdd,
  onDelete
}: {
  onAdd: () => void;
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
        <IconButton 
          className="rounded-full hover:bg-emerald-100 transition" 
          onClick={(e) => {
            console.log('Add assignment button clicked!', e);
            onAdd();
          }}
        >
          <Plus className="h-5 w-5" color="#003b2a" />
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
  onPlanDataChange,
  onAssignmentSelect,
}: TabContainerProps) {
  const [showAddPopup, setShowAddPopup] = React.useState(false);
  const [showUpdateTimePopup, setShowUpdateTimePopup] = React.useState(false);
  const [selectedAssignment, setSelectedAssignment] = React.useState<any>(null);
  const [selectedAssignmentIdForDelete, setSelectedAssignmentIdForDelete] = React.useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = React.useState(0);
  const toast = useToast();

  const handleOpenUpdateTimePopup = () => {
    setShowUpdateTimePopup(true);
  };

  const handleEditTimeRequest = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowUpdateTimePopup(true);
  };

  const handleUpdateTime = async (step: string, eventTime: string) => {
    if (!selectedAssignment) {
      toast.error("No assignment selected");
      return;
    }

    try {
      await httpPatch$UpdateAssignmentProgress(
        `${CLIENT_ENV.BACKEND_URL}/api/dispatch/assignments/${selectedAssignment.id}/progress`,
        {
          event_time: eventTime,
        },
        token
      );
      toast.success("Assignment time updated successfully!");
      setShowUpdateTimePopup(false);
      setSelectedAssignment(null);
      setSelectedAssignmentIdForDelete(null);
      // Force immediate data refresh
      setRefreshCounter(prev => prev + 1);
      if (onPlanDataChange) {
        onPlanDataChange();
      }
    } catch (error) {
      console.error('Error updating assignment time:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update assignment time");
    }
  };

  const handleAddClick = () => {
    setShowAddPopup(true);
  };

  const handleAddPopupClose = () => {
    setShowAddPopup(false);
  };

  const handleAssignmentAdded = () => {
    toast.success("Assignment added successfully!");
    setShowAddPopup(false);
    setSelectedAssignmentIdForDelete(null);
    // Force immediate data refresh
    setRefreshCounter(prev => prev + 1);
    if (onPlanDataChange) {
      onPlanDataChange();
    }
  };

  const handleDeleteAssignment = async () => {
    if (!selectedAssignmentIdForDelete) {
      toast.warning("Please select an assignment to delete");
      return;
    }

    try {
      await httpDelete$DeleteAssignment(
        `${CLIENT_ENV.BACKEND_URL}/api/dispatch/assignments/${selectedAssignmentIdForDelete}`,
        token
      );
      toast.success("Assignment deleted successfully!");
      setSelectedAssignmentIdForDelete(null);
      
      // Force immediate data refresh
      setRefreshCounter(prev => prev + 1);
      if (onPlanDataChange) {
        onPlanDataChange();
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error(error instanceof Error ? error.message : "Failed to delete assignment");
    }
  };

  if (tabs.length === 0) {
    return (
      <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <div className="text-gray-600 text-xl font-semibold mb-2">
              No Plan Selected
            </div>
            <div className="text-gray-500 text-base">
              Double-click a plan from the table above to view assignments
            </div>
          </div>
        </div>
      </div>
    );
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
            onDelete={handleDeleteAssignment}
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTabData ? (
          <TabContent
            data={activeTabData.data}
            onAddAssignment={handleAddClick}
            token={token}
            hideActionButtons={true}
            onDataRefresh={() => {
              // This will trigger a re-render which will refresh the SWR data in TabContent
            }}
            onAssignmentAdded={handleAssignmentAdded}
            onEditTimeRequest={handleEditTimeRequest}
            onAssignmentSelect={(assignmentId) => {
              setSelectedAssignmentIdForDelete(assignmentId);
              if (onAssignmentSelect) {
                onAssignmentSelect(assignmentId);
              }
            }}
            refreshKey={refreshCounter}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="text-gray-400 text-5xl mb-4">👆</div>
              <div className="text-gray-600 text-lg font-semibold mb-2">
                Select a Tab
              </div>
              <div className="text-gray-500 text-base">
                Click on a tab above to view plan details
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Assignment Popup */}
      {showAddPopup && activeTabData && (
        <AddAssignmentPopup
          date={activeTabData.data.date}
          isOpen={showAddPopup}
          onClose={handleAddPopupClose}
          onSave={async (params) => {
            try {
              await httpPost$AddAssignmentToPlan(
                `${CLIENT_ENV.BACKEND_URL}/api/dispatch/plans/${activeTabData.data.id}/assignments`,
                params,
                token
              );
              handleAssignmentAdded();
            } catch (error) {
              console.error('Error adding assignment:', error);
              toast.error(error instanceof Error ? error.message : "Failed to add assignment");
            }
          }}
          token={token}
        />
      )}

      {/* Update Time Popup */}
      {showUpdateTimePopup && selectedAssignment && (
        <UpdateTimePopup
          assignmentData={selectedAssignment}
          onSubmit={handleUpdateTime}
          onClose={() => {
            setShowUpdateTimePopup(false);
            setSelectedAssignment(null);
          }}
        />
      )}
    </div>
  );
} 