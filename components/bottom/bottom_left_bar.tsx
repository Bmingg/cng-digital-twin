"use client";
import Image from "next/image";
import { Box, IconButton, Button, FormControl } from "@mui/material";
import { useMemo } from "react";
import { Plus, Trash } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const generateLastFiveDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Format as YYYY-MM-DD for value
    const value = date.toISOString().split("T")[0];
    // Format as "DD/MM/YYYY" for display
    const displayText = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    dates.push({ value, displayText });
  }
  return dates;
};

type Props = {
  selectedDate: Date | null;
  onDropdownDateChange: (date: Date | null) => void;
  onAddSchedule: () => void;
  onDeleteSchedule: () => void;
};

export function BottomLeftBar({
  selectedDate,
  onDropdownDateChange,
  onAddSchedule,
  onDeleteSchedule,
}: Props) {
  const dateOptions = useMemo(() => generateLastFiveDates(), []);

  return (
    <div className="flex items-center justify-between h-12 px-2 py-2 bg-brand-BDC3C0 border-b z-1">
      <div className="flex items-center space-x-2 ml-6">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: "10px",
            backgroundColor: "#e6ebe9",
          }}
        >
          <FormControl
            variant="standard"
            sx={{ width: "150px", marginLeft: 1 }}
          >
            <DatePicker
              selected={selectedDate}
              onChange={(date) => onDropdownDateChange(date)}
            />
          </FormControl>
        </Box>
        <IconButton
          onClick={onAddSchedule}
          className="flex items-center gap-1"
          sx={styleHover}
        >
          <Plus className="h-4 w-4" color="#003b2a" />
        </IconButton>
        <IconButton
          onClick={onDeleteSchedule}
          className="flex items-center gap-1"
          sx={styleHover}
        >
          <Trash className="h-4 w-4" color="#003b2a" />
        </IconButton>
      </div>
      <div className="flex items-center gap-2"></div>
    </div>
  );
}
