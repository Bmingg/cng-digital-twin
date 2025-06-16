"use client";
import Image from "next/image";
import {
  Select,
  MenuItem,
  Box,
  IconButton,
  Button,
  FormControl,
} from "@mui/material";
import { useState, useMemo } from "react";
import { Plus, Trash } from "lucide-react";

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
  onDropdownDateChange: (value: string) => void;
  onAddSchedule: () => void;
};

export function BottomLeftBar({ onDropdownDateChange, onAddSchedule }: Props) {
  const [selected, setSelected] = useState("");

  const dateOptions = useMemo(() => generateLastFiveDates(), []);

  return (
    <div className="flex items-center justify-between h-12 px-2 py-2 bg-brand-BDC3C0 border-b z-1">
      <div className="flex items-center space-x-2">
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
            <Select
              variant="standard"
              disableUnderline
              value={selected}
              onChange={(event) => {
                const value = event.target.value;
                setSelected(value);
                onDropdownDateChange(value);
              }}
              displayEmpty
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "12px",
                },
              }}
            >
              <MenuItem value="">Select date...</MenuItem>
              {dateOptions.map((dateOption) => (
                <MenuItem key={dateOption.value} value={dateOption.displayText}>
                  {dateOption.displayText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: "10px",
            backgroundColor: "#e6ebe9",
          }}
        >
          <Button
            onClick={() => {}}
            className="flex items-center gap-1"
            sx={styleHover2}
          >
            {/* Insert an svg of an icon here */}
            <Image
              src="/images/compare.svg"
              alt="Compare icon"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }} // optional
            />
            <span className="text-black text-sm">Compare</span>
          </Button>
        </Box>
        <IconButton
          onClick={onAddSchedule}
          className="flex items-center gap-1"
          sx={styleHover}
        >
          <Plus className="h-4 w-4" color="#003b2a" />
        </IconButton>
        <IconButton className="flex items-center gap-1" sx={styleHover}>
          <Trash className="h-4 w-4" color="#003b2a" />
        </IconButton>
      </div>
      <div className="flex items-center gap-2"></div>
    </div>
  );
}
