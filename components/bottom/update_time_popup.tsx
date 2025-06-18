import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

// Configure dayjs to use UTC
dayjs.extend(utc);
dayjs.extend(timezone);

type DeliveryStep = {
  id: string;
  label: string;
  field: string;
  completed: boolean;
  currentTime?: string;
  estimatedTime?: string;
};

type Props = {
  onClose: () => void;
  onSubmit: (step: string, eventTime: string) => void;
  assignmentData: any;
  isLoading?: boolean;
};

export function UpdateTimePopup({ onClose, onSubmit, assignmentData, isLoading = false }: Props) {
  const [selectedStep, setSelectedStep] = React.useState<string>("");
  const [time, setTime] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const toast = useToast();

  // Determine the next step that needs to be updated
  const getNextStep = (assignment: any): string => {
    if (!assignment.actual_start_time) return 'start_time';
    if (!assignment.actual_tank_loading_finished) return 'tank_loading';
    if (!assignment.actual_gas_filling_finished) return 'gas_filling';
    if (!assignment.actual_delivery_finished) return 'delivery';
    if (!assignment.actual_tank_unloading_finished) return 'tank_unloading';
    if (!assignment.actual_end_time) return 'end_time';
    return 'delivery'; // Default to delivery if all are completed
  };

  // Initialize with current time and auto-select next step
  React.useEffect(() => {
    const now = new Date();
    setTime(now.toISOString().split('T')[1].slice(0, 5)); // HH:MM format
    
    if (assignmentData) {
      const nextStep = getNextStep(assignmentData);
      setSelectedStep(nextStep);
    }
  }, [assignmentData]);

  const deliverySteps: DeliveryStep[] = [
    {
      id: 'start_time',
      label: 'Start time at truck depot',
      field: 'actual_start_time',
      completed: !!assignmentData?.actual_start_time,
      currentTime: assignmentData?.actual_start_time,
      estimatedTime: assignmentData?.estimated_start_time
    },
    {
      id: 'tank_loading',
      label: 'Complete loading gas tank at tank depot',
      field: 'actual_tank_loading_finished',
      completed: !!assignmentData?.actual_tank_loading_finished,
      currentTime: assignmentData?.actual_tank_loading_finished,
      estimatedTime: assignmentData?.estimated_tank_loading_finished
    },
    {
      id: 'gas_filling',
      label: 'Complete filling gas tank at compressor station',
      field: 'actual_gas_filling_finished',
      completed: !!assignmentData?.actual_gas_filling_finished,
      currentTime: assignmentData?.actual_gas_filling_finished,
      estimatedTime: assignmentData?.estimated_gas_filling_finished
    },
    {
      id: 'delivery',
      label: 'Complete delivery to the customer',
      field: 'actual_delivery_finished',
      completed: !!assignmentData?.actual_delivery_finished,
      currentTime: assignmentData?.actual_delivery_finished,
      estimatedTime: assignmentData?.estimated_delivery_finished
    },
    {
      id: 'tank_unloading',
      label: 'Complete unloading gas tank',
      field: 'actual_tank_unloading_finished',
      completed: !!assignmentData?.actual_tank_unloading_finished,
      currentTime: assignmentData?.actual_tank_unloading_finished,
      estimatedTime: assignmentData?.estimated_tank_unloading_finished
    },
    {
      id: 'end_time',
      label: 'Returned to truck depot',
      field: 'actual_end_time',
      completed: !!assignmentData?.actual_end_time,
      currentTime: assignmentData?.actual_end_time,
      estimatedTime: assignmentData?.estimated_end_time
    }
  ];

  const handleSubmit = async () => {
    if (!selectedStep) {
      toast.warning("Please select a delivery step");
      return;
    }
    
    if (!time) {
      toast.error("Please enter the time");
      return;
    }

    try {
      setIsRefreshing(true);
      // Use today's date with the specified time
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const eventTime = new Date(`${today}T${time}:00.000Z`).toISOString();
      await onSubmit(selectedStep, eventTime);
      // Note: onSubmit should handle closing the popup and refreshing data
    } catch (error) {
      toast.error("Invalid time format");
      setIsRefreshing(false);
    }
  };

  const formatCurrentTime = (timeString: string | undefined) => {
    if (!timeString) return "—";
    try {
      return dayjs(timeString).utc().format('MMM DD, YYYY HH:mm');
    } catch {
      return "—";
    }
  };

  const formatTimeDisplay = (actualTime: string | undefined, estimatedTime: string | undefined) => {
    const actual = formatCurrentTime(actualTime);
    const estimated = formatCurrentTime(estimatedTime);
    
    if (actualTime && estimatedTime) {
      return `Actual: ${actual} | Estimated: ${estimated}`;
    } else if (actualTime) {
      return `Actual: ${actual}`;
    } else if (estimatedTime) {
      return `Estimated: ${estimated}`;
    } else {
      return 'Pending';
    }
  };

  const getStepDisplayName = (stepId: string) => {
    const step = deliverySteps.find(s => s.id === stepId);
    return step ? step.label : "Unknown step";
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-800">Update Actual Time</h2>
            {isRefreshing && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Updating estimates...</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            Order: <span className="font-medium">{assignmentData?.order_id?.slice(-4) || 'N/A'}</span> | 
            Truck: <span className="font-medium">{assignmentData?.truck_id || 'N/A'}</span> | 
            Tank: <span className="font-medium">{assignmentData?.tank_id || 'N/A'}</span>
          </p>
          {selectedStep && (
            <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
              <p className="text-emerald-800 font-medium">
                Next step: <span className="font-bold">{getStepDisplayName(selectedStep)}</span>
              </p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Delivery Steps Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Progress</h3>
            <div className="grid gap-2">
              {deliverySteps.map((step) => (
                                  <div
                    key={step.id}
                    className={`relative p-3 rounded-lg border transition-all duration-200 ${
                      selectedStep === step.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                        : step.completed 
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                    } ${!step.completed && selectedStep !== step.id ? 'opacity-60' : ''}`}
                  >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500' : selectedStep === step.id ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}>
                      {step.completed && <CheckCircle className="h-3 w-3 text-white" />}
                      {!step.completed && selectedStep === step.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        selectedStep === step.id ? 'text-emerald-800' : 
                        step.completed ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {step.label}
                        {selectedStep === step.id && <span className="ml-2 text-xs">(Next)</span>}
                      </p>
                                             <p className="text-xs text-gray-500">
                        {formatTimeDisplay(step.currentTime, step.estimatedTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Time Input */}
          <div className="space-y-4 p-4 bg-emerald-50 rounded-lg">
            <h4 className="font-semibold text-emerald-800">Set Actual Time</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time (24-hour format)</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg"
                />
              </div>
              <div className="text-sm text-emerald-700 bg-emerald-100 p-3 rounded-lg">
                <strong>Today at:</strong> {time ? 
                  new Date(`2000-01-01T${time}:00`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }) : 'Please select time'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedStep || !time || isLoading}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              'Update Time'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
