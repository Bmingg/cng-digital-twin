"use client"

import { type ReactNode, useState } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const ResponsiveGridLayout = WidthProvider(Responsive)

interface ResizableLayoutProps {
  children: ReactNode[]
}

export function ResizableLayout({ children }: ResizableLayoutProps) {
  // Default layout configuration
  const defaultLayouts = {
    lg: [
      { i: "data-management", x: 0, y: 0, w: 6, h: 6, minW: 3, minH: 3 }, // Top left
      { i: "map", x: 6, y: 0, w: 6, h: 6, minW: 3, minH: 3 }, // Top right
      { i: "schedule-list", x: 0, y: 6, w: 6, h: 6, minW: 3, minH: 3 }, // Bottom left
      { i: "schedule-detail", x: 6, y: 6, w: 6, h: 6, minW: 3, minH: 3 }, // Bottom right
    ],
  }

  const [layouts, setLayouts] = useState(defaultLayouts)

  const onLayoutChange = (currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts)
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
      rowHeight={30}
      onLayoutChange={onLayoutChange}
      isDraggable={true}
      isResizable={true}
      margin={[5, 5]}
    >
      <div key="data-management" className="bg-white rounded-md shadow-md overflow-hidden">
        {children[0]}
      </div>
      <div key="map" className="bg-white rounded-md shadow-md overflow-hidden">
        {children[1]}
      </div>
      <div key="schedule-list" className="bg-white rounded-md shadow-md overflow-hidden">
        {children[2]}
      </div>
      <div key="schedule-detail" className="bg-white rounded-md shadow-md overflow-hidden">
        {children[3]}
      </div>
    </ResponsiveGridLayout>
  )
}
