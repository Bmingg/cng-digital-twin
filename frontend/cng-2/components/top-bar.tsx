'use client'

import { Save, RotateCcw, Undo, Redo } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Box, IconButton, Typography, Button } from '@mui/material';
import Link from 'next/link';

const styleHover = {
  "&:hover": {
    backgroundColor: "#bdc3c0"
  },
  textTransform: "none"
};

export function TopBar() {
  return (
    <div className="flex items-center justify-between h-12 px-4 py-2 bg-brand-773775 border-b">
      <div className="flex items-center space-x-2">
        <Button onClick={() => {}} className="flex items-center gap-1" sx={styleHover}>
          <Save className="h-4 w-4" color="#08dba5" />
          <span className="text-brand-E6EBE9 text-sm">Save</span>
        </Button>
        <Button onClick={() => {}} className="flex items-center gap-1" sx={styleHover}>
          <Undo className="h-4 w-4" color="#08dba5"/>
          <span className="text-brand-E6EBE9 text-sm">Undo</span>
        </Button>
        <Button onClick={() => {}} className="flex items-center gap-1" sx={styleHover}>
          <Redo className="h-4 w-4" color="#08dba5"/>
          <span className="text-brand-E6EBE9 text-sm">Redo</span>
        </Button>
        <Button onClick={() => {}} className="flex items-center gap-1" sx={styleHover}>
          <RotateCcw className="h-4 w-4" color="#08dba5"/>
          <span className="text-brand-E6EBE9 text-sm">Refresh</span>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-brand-E6EBE9 text-sm">Username</span>
        <IconButton 
          component={Link} 
          href="/user" 
        >
          <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-teal-500 text-white">U</AvatarFallback>
        </Avatar>
        </IconButton>
      </div>
    </div>
  )
}
