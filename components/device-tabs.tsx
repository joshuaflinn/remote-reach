"use client"

import { cn } from "@/lib/utils"

const tabs = [
  { id: "dashboard", label: "Dashboard", active: true },
  { id: "device-map", label: "Device Map", active: false },
  { id: "details", label: "Details", active: false },
  { id: "alerts", label: "Alerts and History", active: false },
  { id: "summary", label: "Summary", active: false },
  { id: "metrics", label: "Metrics", active: false },
  { id: "settings", label: "Settings", active: false },
  { id: "files", label: "Files", active: false },
  { id: "event-log", label: "Event Log", active: false },
  { id: "remote-reach", label: "Remote Reach", active: false },
  { id: "console", label: "Console", active: false },
]

interface DeviceTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function DeviceTabs({ activeTab, onTabChange }: DeviceTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
              activeTab === tab.id
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
