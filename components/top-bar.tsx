"use client";

// import { RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Box, IconButton, Typography, Button } from "@mui/material";
import Link from "next/link";
import { GetLoginStatus$Result } from "@/lib/commands/GetLoginStatus/typing";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

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
  const router = useRouter();
  const handleLogout = () => {
    deleteCookie("token");
    router.push("/login");
  };
  const role = user?.is_superuser ? "Admin" : "Dispatcher";
  return (
    <div className="flex items-center justify-between h-12 px-6 py-2 bg-white shadow-md rounded-xl border border-gray-200 mb-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-gray-800 font-semibold text-base leading-tight">{role}</span>
          <span className="text-gray-500 text-sm leading-tight">{user?.email}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {user?.is_superuser && (
          <Button
            component={Link}
            href="/admin"
            className="rounded-full px-4 py-1 font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition shadow-sm"
            size="small"
            variant="contained"
            style={{ boxShadow: 'none' }}
          >
            User Management
          </Button>
        )}
        <Button
          onClick={handleLogout}
          className="rounded-full px-4 py-1 font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition shadow-sm"
          size="small"
          variant="contained"
          style={{ boxShadow: 'none' }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
