"use client";

// import { RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Box, IconButton, Typography, Button } from "@mui/material";
import Link from "next/link";
import { GetLoginStatus$Result } from "@/lib/commands/GetLoginStatus/typing";

const styleHover = {
  "&:hover": {
    backgroundColor: "#bdc3c0",
  },
  textTransform: "none",
};

type Props = {
  user: GetLoginStatus$Result;
};

export function TopBar({ user }: Props) {
  return (
    <div className="flex items-center justify-between h-12 px-4 py-2 bg-brand-773775 border-b">
      <div className="flex items-center space-x-2">
        {/* <Button
          onClick={() => {}}
          className="flex items-center gap-1"
          sx={styleHover}
        >
          <RotateCcw className="h-4 w-4" color="#08dba5" />
          <span className="text-brand-E6EBE9 text-sm">Refresh</span>
        </Button> */}
      </div>
      <div className="flex items-center gap-2">
        <Typography className="text-brand-E6EBE9 text-sm">
          {user?.email}
        </Typography>
      </div>
    </div>
  );
}
