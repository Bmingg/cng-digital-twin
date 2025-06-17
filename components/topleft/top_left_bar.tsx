"use client";
import { Select, MenuItem, Box, IconButton, FormControl } from "@mui/material";
import { useState } from "react";
import { Search, Filter, Plus, Trash, Pencil } from "lucide-react";

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
  onFilter: () => void;
};

export function TopLeftBar({
  onDropdownChange,
  onAdd,
  onDelete,
  onEdit,
  onFilter,
}: Props) {
  const [selected, setSelected] = useState("");

  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelected(value);
    onDropdownChange(value);
  };
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
              onChange={handleChange}
              displayEmpty
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "12px",
                },
              }}
            >
              <MenuItem value="">Select option</MenuItem>
              <MenuItem value="truckTypes">Truck types</MenuItem>
              <MenuItem value="gasTankTypes">Gas tank types</MenuItem>
              <MenuItem value="gasTanks">Gas tanks</MenuItem>
              <MenuItem value="trucks">Trucks</MenuItem>
              <MenuItem value="compressorTypes">Compressor types</MenuItem>
              <MenuItem value="compressors">Compressors</MenuItem>
              <MenuItem value="compressionStations">
                Compression stations
              </MenuItem>
              <MenuItem value="customers">Customers</MenuItem>
              <MenuItem value="orders">Orders</MenuItem>
              {/* Add more options as needed */}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: "10px",
            backgroundColor: "#e6ebe9",
            padding: "0 8px",
          }}
        >
          <Search
            className="h-4 w-4"
            color="#08dba5"
            style={{ marginRight: "5px" }}
          />
        </Box>

        <IconButton
          onClick={onFilter}
          className="flex items-center gap-1"
          sx={styleHover}
        >
          <Filter className="h-4 w-4" color="#003b2a" />
        </IconButton>
        <IconButton
          onClick={onAdd}
          className="flex items-center gap-1"
          sx={styleHover}
        >
          <Plus className="h-4 w-4" color="#003b2a" />
        </IconButton>
        <IconButton
          onClick={onDelete}
          className="flex items-center gap-1"
          sx={styleHover}
        >
          <Trash className="h-4 w-4" color="#003b2a" />
        </IconButton>
        <IconButton
          onClick={onEdit}
          className="flex items-center gap-1"
          sx={styleHover}
        >
          <Pencil className="h-4 w-4" color="#003b2a" />
        </IconButton>
      </div>
      <div className="flex items-center gap-2"></div>
    </div>
  );
}
