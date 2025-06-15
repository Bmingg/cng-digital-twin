"use client"

import { useState } from "react"
import { Search, Filter, Plus, Trash, RotateCcw, MoveHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TruckType {
  id: string
  count: number
  vmax: number
  ownership: string
  rentalCostPerHour: number
}

export function DataManagementPanel() {
  const [truckTypes, setTruckTypes] = useState<TruckType[]>([
    { id: "CNG01T", count: 1, vmax: 13.5, ownership: "Owned", rentalCostPerHour: 27 },
    { id: "CNG02T", count: 4, vmax: 17.1, ownership: "Owned", rentalCostPerHour: 34.2 },
    { id: "CNG03T", count: 14, vmax: 17.92, ownership: "Owned", rentalCostPerHour: 35.84 },
    { id: "RENT01T", count: 16, vmax: 17.92, ownership: "Leased", rentalCostPerHour: 44.8 },
  ])

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <Select defaultValue="truck-types">
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="truck-types">Truck types</SelectItem>
              <SelectItem value="drivers">Drivers</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-1">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search..." className="pl-8 h-8 w-[200px]" />
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
            <Button variant="outline" size="icon" className="h-8 w-8">
              <MoveHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-50">
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Vmax</TableHead>
              <TableHead>Ownership</TableHead>
              <TableHead>Rental cost per hour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {truckTypes.map((truck) => (
              <TableRow key={truck.id}>
                <TableCell>{truck.id}</TableCell>
                <TableCell>{truck.count}</TableCell>
                <TableCell>{truck.vmax}</TableCell>
                <TableCell>{truck.ownership}</TableCell>
                <TableCell>{truck.rentalCostPerHour}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
