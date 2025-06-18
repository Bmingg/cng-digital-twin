"use client";
import { Select, MenuItem, Box, IconButton, FormControl, Tooltip } from "@mui/material";

import { useState } from "react";
import { Search, Filter, Plus, Trash, Pencil, RotateCcw } from "lucide-react";

const styleHover = {
  "&:hover": {
    backgroundColor: "#bdc3c0",
  },
  textTransform: "none",
  backgroundColor: "#e6ebe9",
};

type Props = {
  onDropdownChange: (value: string) => void;
  onAdd: () => void;
  onDelete: () => Promise<void>;
  onEdit: () => void;
  onRefresh: () => void;
  selectedOption: string;
  orderDay: string;
  setOrderDay: (v: string) => void;
};

export function TopLeftBar({
  onDropdownChange,
  onAdd,
  onDelete,
  onEdit,
  onRefresh,
  selectedOption,
  orderDay,
  setOrderDay,
}: Props) {
  const [selected, setSelected] = useState("");

  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelected(value);
    onDropdownChange(value);
  };
  return (
    <div className="flex items-center justify-between h-16 px-4 py-2 bg-white shadow-md rounded-xl border border-gray-200">
      <div className="flex items-center gap-4">
        <FormControl variant="standard" sx={{ width: "180px" }}>
          <Select
            variant="standard"
            disableUnderline
            value={selected}
            onChange={handleChange}
            displayEmpty
            className="rounded-lg bg-gray-50 border border-gray-200 focus:ring-emerald-500"
            sx={{
              borderRadius: "12px",
              background: "#f9fafb",
              fontFamily: 'Inter, Geist, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '12px',
              },
            }}
          >
            <MenuItem value="">Select option</MenuItem>
            <MenuItem value="orders">Orders</MenuItem>
            <MenuItem value="customers">Customers</MenuItem>
            <MenuItem value="stations">Stations</MenuItem>
            <MenuItem value="truckTypes">Truck types</MenuItem>
            <MenuItem value="trucks">Trucks</MenuItem>
            <MenuItem value="gasTankTypes">Gas tank types</MenuItem>
            <MenuItem value="gasTanks">Gas tanks</MenuItem>
            <MenuItem value="compressorTypes">Compressor types</MenuItem>
            <MenuItem value="compressors">Compressors</MenuItem>
            <MenuItem value="compressionStations">Compression stations</MenuItem>
          </Select>
        </FormControl>
        {selectedOption === 'orders' && (
          <div className="flex items-center gap-2">
            <input
              id="order-day"
              type="date"
              value={orderDay}
              onChange={e => setOrderDay(e.target.value)}
              className="border rounded-lg px-2 py-1 text-base font-medium bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all duration-200"
              style={{ minWidth: 140 }}
            />
            {orderDay && (
              <button onClick={() => setOrderDay("")} className="text-xs text-red-500 px-2 py-1 rounded hover:bg-red-50 transition">Clear</button>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 shadow-sm">
          <Tooltip title="Add">
            <IconButton className="rounded-full hover:bg-emerald-100 transition" onClick={onAdd}>
              <Plus className="h-5 w-5" color="#003b2a" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton className="rounded-full hover:bg-rose-100 transition" onClick={onDelete}>
              <Trash className="h-5 w-5" color="#e11d48" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton className="rounded-full hover:bg-blue-100 transition" onClick={onEdit}>
              <Pencil className="h-5 w-5" color="#2563eb" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton className="rounded-full hover:bg-gray-200 transition" onClick={onRefresh}>
              <RotateCcw className="h-5 w-5" color="#003b2a" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center gap-2"></div>
    </div>
  );
}
