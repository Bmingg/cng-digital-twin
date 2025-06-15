"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
// import { ResizablePanels } from "@/components/test_windows"
import { ResizablePanels } from "@/components/resizable-panels"

export default function Dashboard() {

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <TopBar />
      {/* <div className="flex-1 overflow-hidden">
        <CustomResizableLayout>
          <DataManagementPanel />
          <MapPanel />
          <ScheduleListPanel onScheduleSelect={handleScheduleSelect} />
          <ScheduleDetailPanel selectedScheduleIds={selectedScheduleIds} />
        </CustomResizableLayout>
      </div> */}
      <div className="flex-1 p-2 bg-gray-50">
        <ResizablePanels />
      </div>
    </div>
  )
}
