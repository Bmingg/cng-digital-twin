"use client"
import { Search, ZoomIn, ZoomOut, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function MapPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-[200px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search..." className="pl-8 h-8" />
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 relative bg-gray-100">
        {/* Map placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full overflow-hidden">
            <img
              src="/placeholder.svg?height=600&width=800"
              alt="Map placeholder"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full">
              {/* Map markers */}
              <div className="absolute top-1/4 left-1/3 bg-teal-500 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-1/3 right-1/4 bg-teal-500 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/3 bg-teal-500 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>

              {/* Client labels */}
              <div className="absolute top-1/5 right-1/4 bg-white px-2 py-1 text-xs rounded shadow">Client 1</div>
              <div className="absolute bottom-1/3 right-1/6 bg-white px-2 py-1 text-xs rounded shadow">Client 2</div>
              <div className="absolute bottom-1/4 left-1/3 bg-white px-2 py-1 text-xs rounded shadow">Client 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
