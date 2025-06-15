'use client';

import React, { useState, useRef, useCallback } from 'react';
import { TopLeftBar } from './topleft/top_left_bar';
import { DataTable } from './topleft/data_table';
import { BottomLeftBar } from './bottom/bottom_left_bar';
import { ScheduleTable } from './bottom/schedule_table';
import { TabContainer } from './bottom/tab_container';

interface HorizontalPanelsProps {
  topContent: React.ReactNode;
  bottomContent: React.ReactNode;
}

function HorizontalPanels({ topContent, bottomContent }: HorizontalPanelsProps) {
  const [splitPosition, setSplitPosition] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const percentage = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedPercentage = Math.max(23, Math.min(90, percentage));
    setSplitPosition(clampedPercentage);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative flex flex-col"
    >
      {/* Top Panel */}
      <div 
        className="bg-white border border-gray-300 rounded-lg overflow-auto"
        style={{ height: `${splitPosition}%` }}
      >
        {topContent}
      </div>

      {/* Horizontal Divider */}
      <div
        className="h-1 bg-gray-400 cursor-row-resize hover:bg-gray-600 transition-colors flex-shrink-0 my-1"
        onMouseDown={handleMouseDown}
      />

      {/* Bottom Panel */}
      <div 
        className="bg-white border border-gray-300 rounded-lg overflow-auto flex-1"
        style={{ height: `${100 - splitPosition}%` }}
      >
        {bottomContent}
      </div>
    </div>
  );
}

interface VerticalPanelsProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

function VerticalPanels({ leftContent, rightContent }: VerticalPanelsProps) {
  const [splitPosition, setSplitPosition] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedPercentage = Math.max(10, Math.min(90, percentage));
    setSplitPosition(clampedPercentage);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative flex"
    >
      {/* Left Panel */}
      <div 
        className="h-full"
        style={{ width: `${splitPosition}%` }}
      >
        {leftContent}
      </div>

      {/* Vertical Divider */}
      <div
        className="w-1 bg-gray-400 cursor-col-resize hover:bg-gray-600 transition-colors flex-shrink-0 mx-1"
        onMouseDown={handleMouseDown}
      />

      {/* Right Panel */}
      <div 
        className="h-full flex-1"
        style={{ width: `${100 - splitPosition}%` }}
      >
        {rightContent}
      </div>
    </div>
  );
}

// Main ResizablePanels component
export function ResizablePanels() {
  const [selectedOption, setSelectedOption] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleDropdownChange = (value) => {
    setSelectedOption(value);
  };

  const handleDropdownDateChange = (value) => {
    setSelectedDate(value);
  };

    const handleAdd = () => {
    console.log('Add button clicked from parent');
    // Implement add logic here
  };

  const handleDelete = (selectedRowIndices) => {
    console.log('Delete button clicked, selected rows:', selectedRowIndices);
    // Implement delete logic here
  };

  const handleFilter = () => {
    console.log('Filter button clicked from parent');
    // Implement filter logic here
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleAddSchedule = () => {
    console.log('Add Schedule button clicked from parent');
    // Implement add schedule logic here
  };

  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const handleRowDoubleClick = (row) => {
    const tabId = `${row.id}-${row.date}`;
    console.log('Row double-clicked:', row, 'Tab ID:', tabId);
    console.log('Tab date:', row.date);
    const temp = row.date
    const temp3 = temp.slice(0, - 5)
    const temp2 = temp.substring(0, row.date.length - 5)
    const tabName = `${row.id}-${temp2}`;
    
    
    // Check if tab is already open
    const existingTab = openTabs.find(tab => tab.id === tabId);
    
    if (!existingTab) {
      // Add new tab
      const newTab = {
        id: tabId,
        name: tabName,
        data: row
      };
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTab(tabId);
    } else {
      // Switch to existing tab
      setActiveTab(tabId);
    }
  };
  const closeTab = (tabId) => {
    setOpenTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      // If closing active tab, switch to another tab or none
      if (activeTab === tabId) {
        setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
      }
      return newTabs;
    });
  };


  return (
    <div className="w-full h-full">
      <HorizontalPanels
        topContent={
          <VerticalPanels
            leftContent={
              <div className="h-full">
                <TopLeftBar 
                  onDropdownChange={handleDropdownChange}
                  onAdd={handleAdd}
                  onDelete={handleDelete}
                  onFilter={handleFilter}
                  onSearch={handleSearch}
                />
                <DataTable 
                  selectedOption={selectedOption}
                  searchValue={searchValue}
                />
              </div>
            }
            rightContent={
              <div className="h-full">
                <span>Placeholder</span>
              </div>
            }
          />
        }
        bottomContent={
          <VerticalPanels
            leftContent={
              <div className="h-full">
                <BottomLeftBar
                  onDropdownDateChange={handleDropdownDateChange}
                  onAddSchedule={handleAddSchedule}
                />
                <ScheduleTable
                  selectedDate={selectedDate}
                  onRowDoubleClick={handleRowDoubleClick}
                />
              </div>
            }
            rightContent={
              <div className="h-full">
                <TabContainer 
                  tabs={openTabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onTabClose={closeTab}
                />
              </div>
            }
          />
        }
      />
    </div>
  );
}