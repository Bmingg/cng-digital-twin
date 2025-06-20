"use client";
import Image from "next/image";
import { Box, IconButton, Button, FormControl, Tooltip } from "@mui/material";
import { useMemo } from "react";
import { Plus, Trash, Play } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Configure dayjs to use GMT+0 (UTC) for consistency
dayjs.extend(utc);
dayjs.extend(timezone);

const styleHover = {
  "&:hover": {
    backgroundColor: "#bdc3c0",
  },
  textTransform: "none",
  backgroundColor: "#e6ebe9",
};

const styleHover2 = {
  "&:hover": {
    backgroundColor: "#bdc3c0",
  },
  textTransform: "none",
  backgroundColor: "#e6ebe9",
  borderRadius: "10px",
};

const generateLastFiveDates = (): { value: string; displayText: string }[] => {
  const dates: { value: string; displayText: string }[] = [];
  const today = dayjs().utc();

  for (let i = 0; i < 5; i++) {
    const date = today.subtract(i, 'day');
    // Format as YYYY-MM-DD for value
    const value = date.format('YYYY-MM-DD');
    // Format as "DD/MM/YYYY" for display
    const displayText = date.format('DD/MM/YYYY');
    dates.push({ value, displayText });
  }
  return dates;
};

type Props = {
  selectedDate: string | null;
  onDropdownDateChange: (date: string | null) => void;
  onAddPlan: () => void;
  onDeletePlan: () => void;
  onExecutePlan: () => void;
};

export function BottomLeftBar({
  selectedDate,
  onDropdownDateChange,
  onAddPlan,
  onDeletePlan,
  onExecutePlan,
}: Props) {
  const dateOptions = useMemo(() => generateLastFiveDates(), []);

  return (
    <div className="flex items-center justify-between h-16 px-4 py-2 bg-white shadow-md rounded-xl border border-gray-200">
      <div className="flex items-center gap-4 ml-0">
        <FormControl
          variant="standard"
          sx={{ width: "180px", marginLeft: 0 }}
        >
          <input
            type="date"
            value={selectedDate || ''}
            onChange={e => {
              const value = e.target.value;
              onDropdownDateChange(value || null);
            }}
            className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-200 bg-gray-50 text-base font-medium"
          />
        </FormControl>
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 shadow-sm">
          <Tooltip title="Add plan">
            <IconButton className="rounded-full hover:bg-emerald-100 transition" onClick={onAddPlan}>
              <Plus className="h-5 w-5" color="#003b2a" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Execute plan">
            <IconButton className="rounded-full hover:bg-blue-100 transition" onClick={onExecutePlan}>
              <Play className="h-5 w-5" color="#2563eb" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete plan">
            <IconButton className="rounded-full hover:bg-rose-100 transition" onClick={onDeletePlan}>
              <Trash className="h-5 w-5" color="#e11d48" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center gap-2"></div>
    </div>
  );
}
