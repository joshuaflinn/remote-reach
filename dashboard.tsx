"use client"

import { useState } from "react"
import { Header } from "./components/header"
import { Sidebar } from "./components/sidebar"
import { DeviceTabs } from "./components/device-tabs"
import { DeviceDashboard } from "./components/device-dashboard"
import { RemoteReach } from "./components/remote-reach"
import { Button } from "@/components/ui/button"
import { ChevronRight, RotateCcw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderTabContent = () => {
    switch (activeTab) {
      case "remote-reach":
        return <RemoteReach />
      case "dashboard":
      default:
        return <DeviceDashboard />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          {/* Breadcrumb */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-blue-600 hover:underline cursor-pointer">Devices</span>
              <ChevronRight className="w-4 h-4" />
              <span>gandersen-IX40</span>
            </div>
          </div>

          {/* Device Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">gandersen-IX40</h1>
                <p className="text-sm text-gray-600">Device ID - 00000000-00000000-0004F3FF-FF9507C3</p>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Device Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Reboot Device</DropdownMenuItem>
                    <DropdownMenuItem>Factory Reset</DropdownMenuItem>
                    <DropdownMenuItem>Update Firmware</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <DeviceTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {renderTabContent()}
        </main>
      </div>
    </div>
  )
}
