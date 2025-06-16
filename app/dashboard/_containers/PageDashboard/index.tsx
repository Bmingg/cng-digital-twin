"use client";

import { TopBar } from "@/components/top-bar";
// import { ResizablePanels } from "@/components/test_windows"
import { ResizablePanels } from "@/components/resizable-panels";
import { GetLoginStatus$Result } from "@/lib/commands/GetLoginStatus/typing";

type Props = {
  user: GetLoginStatus$Result;
  token: string;
};

export default function PageDashboard({ user, token }: Props) {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <TopBar user={user} />
      <div className="flex-1 p-2 bg-gray-50">
        <ResizablePanels token={token} />
      </div>
    </div>
  );
}
