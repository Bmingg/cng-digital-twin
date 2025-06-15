'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ResizablePanelsProps {
  children?: React.ReactNode;
}

export function ResizablePanels({ children }: ResizablePanelsProps) {
  // State for grid template columns and rows (in percentages)
  const [gridCols, setGridCols] = useState('50% 50%');
  const [gridRows, setGridRows] = useState('50% 50%');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragType = useRef<'vertical' | 'horizontal' | null>(null);

  const handleMouseDown = useCallback((type: 'vertical' | 'horizontal') => {
    isDragging.current = true;
    dragType.current = type;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = type === 'vertical' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    if (dragType.current === 'vertical') {
      // Vertical divider (affects columns)
      const percentage = ((e.clientX - rect.left) / rect.width) * 100;
      const clampedPercentage = Math.max(10, Math.min(90, percentage));
      setGridCols(`${clampedPercentage}% ${100 - clampedPercentage}%`);
    } else if (dragType.current === 'horizontal') {
      // Horizontal divider (affects rows)
      const percentage = ((e.clientY - rect.top) / rect.height) * 100;
      const clampedPercentage = Math.max(10, Math.min(90, percentage));
      setGridRows(`${clampedPercentage}% ${100 - clampedPercentage}%`);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    dragType.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        gridTemplateRows: gridRows,
        gap: '4px',
      }}
    >
      {/* Panel 1 - Top Left */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-2">Panel 1</h3>
        <p>This is the top-left panel. You can put any content here.</p>
        <div className="mt-4 space-y-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="p-2 bg-gray-100 rounded">Item {i + 1}</div>
          ))}
        </div>
      </div>

      {/* Panel 2 - Top Right */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-2">Panel 2</h3>
        <p>This is the top-right panel. Content can be scrollable if it overflows.</p>
        <div className="mt-4">
          <div className="h-64 bg-blue-100 rounded p-4">
            <p>Some content that might need scrolling...</p>
          </div>
        </div>
      </div>

      {/* Panel 3 - Bottom Left */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-2">Panel 3</h3>
        <p>This is the bottom-left panel.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="p-2 bg-green-100 rounded text-center">
              Box {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Panel 4 - Bottom Right */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-2">Panel 4</h3>
        <p>This is the bottom-right panel.</p>
        <div className="mt-4">
          <textarea 
            className="w-full h-32 p-2 border border-gray-300 rounded"
            placeholder="You can interact with content in panels..."
          />
        </div>
      </div>

      {/* Vertical Divider */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-gray-400 cursor-col-resize hover:bg-gray-600 transition-colors z-10"
        style={{
          left: `calc(${gridCols.split(' ')[0]} - 2px)`,
        }}
        onMouseDown={() => handleMouseDown('vertical')}
      />

      {/* Horizontal Divider */}
      <div
        className="absolute left-0 right-0 h-1 bg-gray-400 cursor-row-resize hover:bg-gray-600 transition-colors z-10"
        style={{
          top: `calc(${gridRows.split(' ')[0]} - 2px)`,
        }}
        onMouseDown={() => handleMouseDown('horizontal')}
      />

      {/* Center intersection point */}
      <div
        className="absolute w-3 h-3 bg-gray-500 cursor-move hover:bg-gray-700 transition-colors z-20 rounded-full"
        style={{
          left: `calc(${gridCols.split(' ')[0]} - 6px)`,
          top: `calc(${gridRows.split(' ')[0]} - 6px)`,
        }}
        onMouseDown={(e) => {
          // Allow dragging both directions from center point
          handleMouseDown('vertical');
        }}
      />
    </div>
  );
}