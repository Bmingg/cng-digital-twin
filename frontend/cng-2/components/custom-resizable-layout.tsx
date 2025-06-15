"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"

interface CustomResizableLayoutProps {
  children: ReactNode[]
}

export function CustomResizableLayout({ children }: CustomResizableLayoutProps) {
  const [horizontalSplit, setHorizontalSplit] = useState(50) // Percentage
  const [verticalSplitTop, setVerticalSplitTop] = useState(50) // Percentage
  const [verticalSplitBottom, setVerticalSplitBottom] = useState(50) // Percentage

  const containerRef = useRef<HTMLDivElement>(null)
  const horizontalDragRef = useRef<HTMLDivElement>(null)
  const verticalDragTopRef = useRef<HTMLDivElement>(null)
  const verticalDragBottomRef = useRef<HTMLDivElement>(null)

  // Handle horizontal resizing
  useEffect(() => {
    const horizontalDrag = horizontalDragRef.current
    if (!horizontalDrag) return

    let isDragging = false

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      e.preventDefault()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newSplit = ((e.clientY - containerRect.top) / containerRect.height) * 100

      // Limit the split to reasonable bounds (10% - 90%)
      setHorizontalSplit(Math.min(Math.max(newSplit, 10), 90))
    }

    const onMouseUp = () => {
      isDragging = false
    }

    horizontalDrag.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      horizontalDrag.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  // Handle vertical resizing for top row
  useEffect(() => {
    const verticalDragTop = verticalDragTopRef.current
    if (!verticalDragTop) return

    let isDragging = false

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      e.preventDefault()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Limit the split to reasonable bounds (10% - 90%)
      setVerticalSplitTop(Math.min(Math.max(newSplit, 10), 90))
    }

    const onMouseUp = () => {
      isDragging = false
    }

    verticalDragTop.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      verticalDragTop.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  // Handle vertical resizing for bottom row
  useEffect(() => {
    const verticalDragBottom = verticalDragBottomRef.current
    if (!verticalDragBottom) return

    let isDragging = false

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      e.preventDefault()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Limit the split to reasonable bounds (10% - 90%)
      setVerticalSplitBottom(Math.min(Math.max(newSplit, 10), 90))
    }

    const onMouseUp = () => {
      isDragging = false
    }

    verticalDragBottom.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      verticalDragBottom.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  return (
    <div ref={containerRef} className="h-full w-full relative">
      {/* Top row */}
      <div className="absolute top-0 left-0 right-0" style={{ height: `${horizontalSplit}%` }}>
        <div className="flex h-full">
          {/* Top left panel */}
          <div
            className="bg-white rounded-md shadow-md overflow-hidden"
            style={{ width: `${verticalSplitTop}%`, height: "100%" }}
          >
            {children[0]}
          </div>

          {/* Vertical resizer for top row */}
          <div ref={verticalDragTopRef} className="w-1 bg-gray-200 hover:bg-gray-400 cursor-col-resize h-full" />

          {/* Top right panel */}
          <div
            className="bg-white rounded-md shadow-md overflow-hidden"
            style={{ width: `${100 - verticalSplitTop}%`, height: "100%" }}
          >
            {children[1]}
          </div>
        </div>
      </div>

      {/* Horizontal resizer */}
      <div
        ref={horizontalDragRef}
        className="absolute left-0 right-0 h-1 bg-gray-200 hover:bg-gray-400 cursor-row-resize"
        style={{ top: `${horizontalSplit}%` }}
      />

      {/* Bottom row */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ top: `calc(${horizontalSplit}% + 1px)`, height: `calc(${100 - horizontalSplit}% - 1px)` }}
      >
        <div className="flex h-full">
          {/* Bottom left panel */}
          <div
            className="bg-white rounded-md shadow-md overflow-hidden"
            style={{ width: `${verticalSplitBottom}%`, height: "100%" }}
          >
            {children[2]}
          </div>

          {/* Vertical resizer for bottom row */}
          <div ref={verticalDragBottomRef} className="w-1 bg-gray-200 hover:bg-gray-400 cursor-col-resize h-full" />

          {/* Bottom right panel */}
          <div
            className="bg-white rounded-md shadow-md overflow-hidden"
            style={{ width: `${100 - verticalSplitBottom}%`, height: "100%" }}
          >
            {children[3]}
          </div>
        </div>
      </div>
    </div>
  )
}
