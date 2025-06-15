"use client"

import { useState } from "react"
import { Search, Filter, Plus, Trash, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Schedule {
  id: string
  type: string
  date: string
}

interface ScheduleListPanelProps {
  onScheduleSelect: (scheduleId: string) => void
}

export function ScheduleListPanel({ onScheduleSelect }: ScheduleListPanelProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: "S0001", type: "Manual", date: "13/04/2025" },
    { id: "S0002", type: "Auto-generated", date: "13/04/2025" },
    { id: "S0003", type: "Auto-generated", date: "15/04/2025" },
    { id: "S0004", type: "Manual", date: "16/04/2025" },
  ])

  const [activeFilters, setActiveFilters] = useState<string[]>(["S0001-13/04", "S0002-13/04", "S0003-15/04"])

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-1">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="outline" className="text-xs">
                {filter}
              </Badge>
            ))}
          </div>
          <div className="flex items-center space-x-1">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search..." className="pl-8 h-8 w-[150px]" />
            </div>
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
              <TableHead className="w-[80px]">Id</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow
                key={schedule.id}
                className="cursor-pointer hover:bg-gray-100"
                onDoubleClick={() => onScheduleSelect(schedule.id)}
              >
                <TableCell>{schedule.id}</TableCell>
                <TableCell>{schedule.type}</TableCell>
                <TableCell>{schedule.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
