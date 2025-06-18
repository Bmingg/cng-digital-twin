"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { httpGet$GetLoginStatus } from "@/lib/commands/GetLoginStatus/fetcher";
import { CLIENT_ENV } from "@/lib/env";

export default function UserManagementPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) {
          router.replace("/login");
          return;
        }
        const user = await httpGet$GetLoginStatus(
          `${CLIENT_ENV.BACKEND_URL}/api/users/me`,
          { token }
        );
        if (!user.is_superuser) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
        setChecked(true);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };
    checkRole();
  }, [router]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!checked) return null;
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <p className="text-lg">(Admin-only area) - User management features go here.</p>
    </div>
  );
} 