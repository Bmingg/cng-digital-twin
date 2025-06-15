import React from 'react';
import { Plus, Trash } from "lucide-react";
import { IconButton } from '@mui/material';

// Define the types for your tab data
interface TabData {
  id: string;
  status: string;
  date: string;
  cngVolumeDelivered: number;
  totalCost: number;
  // Add other properties as needed
}

interface Tab {
  id: string;
  name: string;
  data: TabData;
}

interface TabContainerProps {
  tabs: Tab[];
  activeTab: string | null;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

interface TabContentProps {
  data: TabData | undefined;
}

// Sample data structure for the table - replace with your actual data structure
interface OrderData {
  orderId: number;
  truckId: number;
  tankId: number;
  compressorId: number;
  status: 'completed' | 'in progress';
  tasks: {
    name: string;
    estimated: string;
    actual: string | null;
  }[];
}

const styleHover = {
  "&:hover": {
    backgroundColor: "#bdc3c0"
  },
  textTransform: "none",
  backgroundColor: "#e6ebe9",
};

// Mock data - replace with actual data fetching logic based on schedule ID
const getOrdersForSchedule = (scheduleId: string): OrderData[] => {
  return [
    {
      orderId: 15,
      truckId: 3,
      tankId: 5,
      compressorId: 2,
      status: 'completed',
      tasks: [
        { name: 'Start time at truck depot', estimated: '10:30', actual: '11:00' },
        { name: 'Complete loading gas tank at tank depot', estimated: '10:45', actual: '11:15' },
        { name: 'Complete filling gas tank at compressor station', estimated: '11:30', actual: '12:30' },
        { name: 'Complete delivery to the customer', estimated: '13:00', actual: '13:50' },
        { name: 'Complete unloading gas tank at compressor station', estimated: '15:00', actual: '15:15' },
        { name: 'Returned to truck depot', estimated: '15:15', actual: '15:30' }
      ]
    },
    {
      orderId: 16,
      truckId: 5,
      tankId: 2,
      compressorId: 1,
      status: 'in progress',
      tasks: [
        { name: 'Start time at truck depot', estimated: '16:00', actual: '15:45' },
        { name: 'Complete loading gas tank at tank depot', estimated: '16:15', actual: null },
        { name: 'Complete filling gas tank at compressor station', estimated: '16:45', actual: null },
        { name: 'Complete delivery to the customer', estimated: '17:30', actual: null },
        { name: 'Complete unloading gas tank at compressor station', estimated: '18:30', actual: null },
        { name: 'Returned to truck depot', estimated: '19:00', actual: null }
      ]
    }
  ];
};

function TabContent({ data }: TabContentProps) {
  if (!data) return null;
  
  // Get orders for this schedule
  const orders = getOrdersForSchedule(data.id);
  
  return (
    <div className="h-full overflow-auto bg-brand-F1EDEA">
      {/* Action buttons */}
      <div className="flex px-1 gap-3 border-b border-gray-200 bg-brand-BADFCD">
        <IconButton className="flex items-center gap-1 size-sm" sx={styleHover}>
          <Plus className="h-4 w-4" color="#003b2a"/>
          </IconButton>
          <IconButton className="flex items-center gap-1 size-sm" sx={styleHover}>
          <Trash className="h-4 w-4" color="#003b2a"/>
          </IconButton>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brand-F1EDEA fontweight-bold">
              <th className="border border-gray-300 px-1 py-1 text-center">Order ID</th>
              <th className="border border-gray-300 px-1 py-1 text-center">Truck ID</th>
              <th className="border border-gray-300 px-1 py-1 text-center">Tank ID</th>
              <th className="border border-gray-300 px-1 py-1 text-center">Compressor ID</th>
              <th className="border border-gray-300 px-1 py-1 text-center">Status</th>
              <th className="border border-gray-300 px-1 py-1 text-center">Estimated</th>
              <th className="border border-gray-300 px-1 py-1 text-center">Actual</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, orderIndex) => (
              <React.Fragment key={order.orderId}>
                {/* Order header row */}
                <tr className="bg-brand-F1EDEA hover:bg-gray-50" >
                  <td className="border border-gray-300 px-1 py-1 text-center font-sm">
                    {order.orderId}
                  </td>
                  <td className="border border-gray-300 px-1 py-1 text-center">
                    {order.truckId}
                  </td>
                  <td className="border border-gray-300 px-1 py-1 text-center">
                    {order.tankId}
                  </td>
                  <td className="border border-gray-300 px-1 py-1 text-center">
                    {order.compressorId}
                  </td>
                  <td className="border border-gray-300 px-1 py-1 text-center">
                    <span className={`px-1 py-1 rounded text-sm font-sm ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-1 py-1"></td>
                  <td className="border border-gray-300 px-1 py-1"></td>
                </tr>
                
                {/* Task rows */}
                {order.tasks.map((task, taskIndex) => (
                  <tr key={`${order.orderId}-${taskIndex}`} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-1 py-1"></td>
                    <td className="border border-gray-300 px-1 py-1"></td>
                    <td className="border border-gray-300 px-1 py-1"></td>
                    <td className="border border-gray-300 px-1 py-1"></td>
                    <td className="border border-gray-300 px-1 py-1 text-right font-italic text-gray-700">
                      {task.name}
                    </td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                      {task.estimated}
                    </td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                      {task.actual || '—'}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TabContainer({ tabs, activeTab, onTabChange, onTabClose }: TabContainerProps) {
  if (tabs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-brand-BDC3C0 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <p className="text-gray-500 text-lg font-medium">No schedules opened</p>
          <p className="text-gray-400 text-sm mt-2">
            Double-click a row in the table to open a schedule tab
          </p>
        </div>
      </div>
    );
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="flex flex-col h-full bg-brand-BDC3C0 rounded-lg shadow-sm border border-gray-200">
      {/* Tab Bar */}
      <div className="flex border-b border-gray-200 bg-brand-BDC3C0 rounded-t-lg overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex rounded-lg items-center px-1 py-1 border-r border-blank-200 cursor-pointer whitespace-nowrap min-w-0 ${
              activeTab === tab.id 
                ? 'bg-white border-b-2 fontweight-bold font-medium text-black' 
                : 'hover:bg-gray-100 text-gray-600 opacity-80'
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
                  ? 'hover:bg-gray-200 text-gray-500 hover:text-black' 
                  : 'hover:bg-gray-200 text-gray-500'
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
          <TabContent data={activeTabData.data} />
        )}
      </div>
    </div>
  );
}