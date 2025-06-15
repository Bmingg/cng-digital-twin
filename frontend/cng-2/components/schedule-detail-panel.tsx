"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Trash, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"

interface ScheduleAction {
  stepType: string
  start: string
  finish: string
  duration: string
  orderId: string
  customerId: string
  orderVolume: number
  truck: number
  tank: number
  startLocation: string
  finishLocation: string
}

interface ScheduleDetail {
  id: string
  actions: ScheduleAction[]
}

interface ScheduleDetailPanelProps {
  selectedScheduleIds: string[]
}

export function ScheduleDetailPanel({ selectedScheduleIds }: ScheduleDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [scheduleDetails, setScheduleDetails] = useState<Record<string, ScheduleDetail>>({})

  // Simulate fetching schedule details when a new schedule is selected
  useEffect(() => {
    const newScheduleIds = selectedScheduleIds.filter((id) => !scheduleDetails[id])

    if (newScheduleIds.length > 0) {
      // In a real app, this would be an API call
      const newDetails: Record<string, ScheduleDetail> = {}

      newScheduleIds.forEach((id) => {
        newDetails[id] = {
          id,
          actions: [
            {
              stepType: "to_filling",
              start: "07:15",
              finish: "07:36",
              duration: "00:21",
              orderId: "ORD0137",
              customerId: "CUS015",
              orderVolume: 33,
              truck: 49,
              tank: 49,
              startLocation: "Address 1, Hanoi",
              finishLocation: "Address 2, Hanoi",
            },
          ],
        }
      })

      setScheduleDetails((prev) => ({ ...prev, ...newDetails }))

      // Set the active tab to the most recently added schedule
      if (newScheduleIds.length > 0 && !activeTab) {
        setActiveTab(newScheduleIds[0])
      }
    }
  }, [selectedScheduleIds, scheduleDetails, activeTab])

  const closeTab = (id: string) => {
    // Remove the schedule from the details
    const newDetails = { ...scheduleDetails }
    delete newDetails[id]
    setScheduleDetails(newDetails)

    // Update the active tab if needed
    if (activeTab === id) {
      const remainingIds = Object.keys(newDetails)
      setActiveTab(remainingIds.length > 0 ? remainingIds[0] : null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {selectedScheduleIds.length > 0 ? (
        <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="border-b">
            <TabsList className="h-10">
              {selectedScheduleIds.map(
                (id) =>
                  scheduleDetails[id] && (
                    <div key={id} className="flex items-center">
                      <TabsTrigger value={id} className="relative px-4 py-1.5">
                        {id}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 absolute top-1 right-1 rounded-full p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            closeTab(id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TabsTrigger>
                    </div>
                  ),
              )}
            </TabsList>
          </div>

          {selectedScheduleIds.map(
            (id) =>
              scheduleDetails[id] && (
                <TabsContent key={id} value={id} className="flex-1 overflow-hidden flex flex-col mt-0">
                  <div className="p-2 border-b">
                    <div className="flex items-center justify-between">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input placeholder="Search..." className="pl-8 h-8 w-[200px]" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Filter className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-gray-50">
                        <TableRow>
                          <TableHead>Step type</TableHead>
                          <TableHead>Start</TableHead>
                          <TableHead>Finish</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Order volume</TableHead>
                          <TableHead>Truck</TableHead>
                          <TableHead>Tank</TableHead>
                          <TableHead>Start location</TableHead>
                          <TableHead>Finish location</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduleDetails[id].actions.map((action, index) => (
                          <TableRow key={index}>
                            <TableCell>{action.stepType}</TableCell>
                            <TableCell>{action.start}</TableCell>
                            <TableCell>{action.finish}</TableCell>
                            <TableCell>{action.duration}</TableCell>
                            <TableCell>{action.orderId}</TableCell>
                            <TableCell>{action.customerId}</TableCell>
                            <TableCell>{action.orderVolume}</TableCell>
                            <TableCell>{action.truck}</TableCell>
                            <TableCell>{action.tank}</TableCell>
                            <TableCell>{action.startLocation}</TableCell>
                            <TableCell>{action.finishLocation}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ),
          )}
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Double-click on a schedule to view details
        </div>
      )}
    </div>
  )
}
