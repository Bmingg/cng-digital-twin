'use client'
import { Save, RotateCcw, Undo, Redo } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, MenuItem, Box, IconButton, Typography, Button, TextField, FormControl, InputLabel, Input, InputAdornment } from '@mui/material';
import Link from 'next/link';
import { useState } from "react"
import { Search, Filter, Plus, Trash, MoveHorizontal } from "lucide-react"

const styleHover = {
  "&:hover": {
    backgroundColor: "#bdc3c0"
  },
  textTransform: "none",
  backgroundColor: "#e6ebe9",

};

export function TopLeftBar({ onDropdownChange, onAdd, onDelete, onFilter, onSearch, searchValue }) {
  const [selected, setSelected] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    onDropdownChange(value);
  };

  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
  <div className="flex items-center justify-between h-12 px-2 py-2 bg-brand-BDC3C0 border-b z-1">    
    <div className="flex items-center space-x-2">
      <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: "10px", backgroundColor: "#e6ebe9" }}>
          <FormControl variant="standard" sx={{ width: "150px", marginLeft:1 }}>
            <Select
              variant="standard"
              disableUnderline
              value={selected}
              onChange={handleChange}
              displayEmpty
              sx={{ 
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: '12px'
                }
              }}
            >
              <MenuItem value="">Select option</MenuItem>
              <MenuItem value="Truck types">Truck types</MenuItem>
              <MenuItem value="Gas tank types">Gas tank types</MenuItem>
              <MenuItem value="Gas tank">Gas tank</MenuItem>
              <MenuItem value="Trucks">Trucks</MenuItem>
              <MenuItem value="Compressor types">Compressor types</MenuItem>
              <MenuItem value="Compressors">Compressors</MenuItem>
              <MenuItem value="Compressor stations">Compressor stations</MenuItem>
              <MenuItem value="Customers">Customers</MenuItem>
              <MenuItem value="Orders">Orders</MenuItem>
              {/* Add more options as needed */}
            </Select>
          </FormControl>
        </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: "10px", backgroundColor: "#e6ebe9", padding: "0 8px" }}>
        <Search className="h-4 w-4" color="#08dba5" style={{ marginRight: "5px" }}/>
        <TextField 
          sx={{
            borderRadius: "10px"
          }}
          id="search-input"
          type="search"
          variant="standard"
          placeholder="Search..."
          onChange={handleSearchChange}
          value={searchValue}
          InputProps={{ disableUnderline: true }}
        />
      </Box>

      <IconButton onClick={onFilter} className="flex items-center gap-1" sx={styleHover}>
        <Filter className="h-4 w-4" color="#003b2a"/>
      </IconButton>
      <IconButton onClick={onAdd} className="flex items-center gap-1" sx={styleHover}>
        <Plus className="h-4 w-4" color="#003b2a"/>
      </IconButton>
      <IconButton onClick={onDelete} className="flex items-center gap-1" sx={styleHover}>
        <Trash className="h-4 w-4" color="#003b2a"/>
      </IconButton>
  
    </div>
    <div className="flex items-center gap-2">
      
    </div>
  </div>
  )
}