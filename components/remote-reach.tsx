"use client"

import type React from "react"
import { ScanDevicesModal } from "./scan-devices-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Monitor,
  Smartphone,
  Laptop,
  Wifi,
  Search,
  Settings,
  Plus,
  Terminal,
  Globe,
  Shield,
  Eye,
  Zap,
  GripVertical,
  Radio,
} from "lucide-react"
import { useState } from "react"
import { AddDeviceModal } from "./add-device-modal"
import { EditDeviceModal } from "./edit-device-modal"
import { ConnectionModal } from "./connection-modal"
import { DeviceHistoryModal } from "./device-history-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { QuickConnectModal } from "./quick-connect-modal"

interface ConnectedDevice {
  id: string
  name: string
  type: "desktop" | "laptop" | "mobile" | "router" | "other"
  ipAddress: string
  macAddress: string
  status: "online" | "offline"
  lastSeen: string
  services: string[]
  newWindow?: Record<string, boolean>
}

const mockDevices: ConnectedDevice[] = [
  {
    id: "1",
    name: "Anderson-Desktop",
    type: "desktop",
    ipAddress: "192.168.7.101",
    macAddress: "AA:BB:CC:DD:EE:01",
    status: "online",
    lastSeen: "Active now",
    services: ["SSH:22"],
    newWindow: {},
  },
  {
    id: "2",
    name: "Jillian-Laptop",
    type: "laptop",
    ipAddress: "192.168.7.102",
    macAddress: "AA:BB:CC:DD:EE:02",
    status: "online",
    lastSeen: "2 minutes ago",
    services: ["RDP:3389"],
    newWindow: {},
  },
  {
    id: "4",
    name: "Cisco-Switch-2960",
    type: "other",
    ipAddress: "192.168.7.104",
    macAddress: "AA:BB:CC:DD:EE:04",
    status: "online",
    lastSeen: "1 hour ago",
    services: ["Telnet:23", "COM1"],
    newWindow: {},
  },
  {
    id: "5",
    name: "Security-Camera-01",
    type: "other",
    ipAddress: "192.168.7.105",
    macAddress: "AA:BB:CC:DD:EE:05",
    status: "online",
    lastSeen: "Active now",
    services: ["HTTPS:443"],
    newWindow: {},
  },
]

function getDeviceIcon(type: string) {
  switch (type) {
    case "desktop":
      return <Monitor className="w-4 h-4" />
    case "laptop":
      return <Laptop className="w-4 h-4" />
    case "mobile":
      return <Smartphone className="w-4 h-4" />
    case "router":
      return <Wifi className="w-4 h-4" />
    default:
      return <Monitor className="w-4 h-4" />
  }
}

function getServiceIcon(service: string) {
  const serviceType = service.split(":")[0]
  switch (serviceType) {
    case "SSH":
      return <Terminal className="w-3 h-3 mr-1" />
    case "Telnet":
      return <Terminal className="w-3 h-3 mr-1" />
    case "HTTP":
      return <Globe className="w-3 h-3 mr-1" />
    case "HTTPS":
      return <Shield className="w-3 h-3 mr-1" />
    case "RDP":
      return <Monitor className="w-3 h-3 mr-1" />
    case "VNC":
      return <Eye className="w-3 h-3 mr-1" />
    case "COM1":
    case "COM2":
    case "COM3":
    case "COM4":
    case "COM5":
    case "COM6":
    case "COM7":
    case "COM8":
      return <Zap className="w-3 h-3 mr-1" />
    default:
      return <Terminal className="w-3 h-3 mr-1" />
  }
}

export function RemoteReach() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<ConnectedDevice | null>(null)
  const [selectedService, setSelectedService] = useState<string>("")
  const [devices, setDevices] = useState(mockDevices)
  const [showScanModal, setShowScanModal] = useState(false)
  const [showQuickConnectModal, setShowQuickConnectModal] = useState(false)
  const [draggedDevice, setDraggedDevice] = useState<ConnectedDevice | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const filteredDevices = devices.filter(
    (device) => device.name.toLowerCase().includes(searchTerm.toLowerCase()) || device.ipAddress.includes(searchTerm),
  )

  const handleScan = () => {
    setShowScanModal(true)
  }

  const handleQuickConnect = () => {
    setShowQuickConnectModal(true)
  }

  const handleDragStart = (e: React.DragEvent, device: ConnectedDevice) => {
    setDraggedDevice(device)
    e.dataTransfer.effectAllowed = "move"

    // Add some visual feedback
    const target = e.target as HTMLElement
    target.style.opacity = "0.5"
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = "1"
    setDraggedDevice(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (!draggedDevice) return

    const draggedIndex = filteredDevices.findIndex((device) => device.id === draggedDevice.id)
    if (draggedIndex === dropIndex) return

    // Create new array with reordered items
    const newDevices = [...devices]
    const draggedDeviceInOriginal = newDevices.find((device) => device.id === draggedDevice.id)
    const dropDeviceInOriginal = newDevices.find((device) => device.id === filteredDevices[dropIndex].id)

    if (!draggedDeviceInOriginal || !dropDeviceInOriginal) return

    // Find indices in original array
    const originalDraggedIndex = newDevices.findIndex((device) => device.id === draggedDevice.id)
    const originalDropIndex = newDevices.findIndex((device) => device.id === filteredDevices[dropIndex].id)

    // Remove dragged item and insert at new position
    newDevices.splice(originalDraggedIndex, 1)
    const adjustedDropIndex = originalDraggedIndex < originalDropIndex ? originalDropIndex - 1 : originalDropIndex
    newDevices.splice(adjustedDropIndex, 0, draggedDeviceInOriginal)

    setDevices(newDevices)
    setDragOverIndex(null)
  }

  const handleConnect = (device: ConnectedDevice, service: string) => {
    // Check if this service should open in a new window
    const serviceType = service.split(":")[0]
    const shouldOpenInNewWindow = device.newWindow?.[serviceType] || device.newWindow?.[service]

    if (shouldOpenInNewWindow) {
      // Directly open in new window without showing modal
      handlePopOut(device, service)
    } else {
      // Show modal first
      setSelectedDevice(device)
      setSelectedService(service)
      setShowConnectionModal(true)
    }
  }

  const handleQuickConnectSubmit = (connectionInfo: {
    deviceName: string
    deviceIp: string
    service: string
    newWindow: boolean
  }) => {
    if (connectionInfo.newWindow) {
      // Directly open in new window
      handlePopOut(
        {
          id: "quick-connect",
          name: connectionInfo.deviceName,
          type: "other",
          ipAddress: connectionInfo.deviceIp,
          macAddress: "",
          status: "online",
          lastSeen: "",
          services: [],
          newWindow: {},
        } as ConnectedDevice,
        connectionInfo.service,
      )
    } else {
      // Show modal first
      setSelectedDevice({
        id: "quick-connect",
        name: connectionInfo.deviceName,
        type: "other",
        ipAddress: connectionInfo.deviceIp,
        macAddress: "",
        status: "online",
        lastSeen: "",
        services: [],
        newWindow: {},
      } as ConnectedDevice)
      setSelectedService(connectionInfo.service)
      setShowConnectionModal(true)
    }
  }

  const handlePopOut = (device: ConnectedDevice, service: string) => {
    const [serviceType, port] = service.includes(":")
      ? service.split(":")
      : [service.startsWith("COM") ? "Serial" : service, ""]

    const getPopupInterface = () => {
      switch (serviceType) {
        case "SSH":
        case "Telnet":
          return `<div class="terminal">Connecting to ${device.ipAddress} via ${serviceType}...\nSSH-2.0-OpenSSH_8.9\nAuthenticated to ${device.ipAddress}.\n\n${device.name}:~$ </div>`

        case "Serial":
        case "COM1":
        case "COM2":
        case "COM3":
        case "COM4":
        case "COM5":
        case "COM6":
        case "COM7":
        case "COM8":
          return `<div class="terminal-white">Opening ${service} connection to ${device.name}...\nConnected.\n\n${device.name}> </div>`

        case "HTTP":
        case "HTTPS":
          return `
            <div class="browser">
              <div class="browser-chrome">
                <div class="browser-dots">
                  <div class="browser-dot red"></div>
                  <div class="browser-dot yellow"></div>
                  <div class="browser-dot green"></div>
                </div>
                <div class="address-bar">
                  ${serviceType === "HTTPS" ? "🔒 " : ""}${serviceType.toLowerCase()}://${device.ipAddress}
                </div>
              </div>
              <div class="browser-content">
                <h2>${device.name}</h2>
                <p style="color: #6b7280; margin-bottom: 24px;">Device web interface</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 300px; margin: 0 auto;">
                  <button style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; border-radius: 4px;">Status</button>
                  <button style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; border-radius: 4px;">Configuration</button>
                  <button style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; border-radius: 4px;">Network</button>
                  <button style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; border-radius: 4px;">Security</button>
                </div>
              </div>
            </div>
          `

        case "RDP":
        case "VNC":
          return `
            <div class="desktop">
              <div class="desktop-icon">
                <div class="icon-bg">💻</div>
                <span>Computer</span>
              </div>
              <div class="desktop-icon" style="left: 80px;">
                <div class="icon-bg">⚡</div>
                <span>Terminal</span>
              </div>
              <div class="taskbar">
                <button class="start-button">Start</button>
                <span style="color: white; font-size: 12px;">12:34 PM</span>
              </div>
            </div>
          `

        default:
          return `<div style="text-align: center; padding: 100px;">Unsupported service type: ${serviceType}</div>`
      }
    }

    // Create the HTML content for the popup window
    const popupContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${device.name} - ${service} Connection</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #f9fafb;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            .title {
              font-size: 18px;
              font-weight: 600;
              color: #111827;
            }
            .status {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
            }
            .status-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #10b981;
            }
            .terminal {
              background: #000;
              color: #10b981;
              font-family: 'Courier New', monospace;
              padding: 16px;
              height: 400px;
              overflow: auto;
              border-radius: 6px;
              white-space: pre-wrap;
            }
            .terminal-white {
              background: #000;
              color: #fff;
              font-family: 'Courier New', monospace;
              padding: 16px;
              height: 400px;
              overflow: auto;
              border-radius: 6px;
              white-space: pre-wrap;
            }
            .browser {
              border: 1px solid #d1d5db;
              border-radius: 6px;
              height: 400px;
              display: flex;
              flex-direction: column;
            }
            .browser-chrome {
              background: #f3f4f6;
              padding: 8px;
              border-bottom: 1px solid #d1d5db;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .browser-dots {
              display: flex;
              gap: 4px;
            }
            .browser-dot {
              width: 12px;
              height: 12px;
              border-radius: 50%;
            }
            .browser-dot.red { background: #ef4444; }
            .browser-dot.yellow { background: #f59e0b; }
            .browser-dot.green { background: #10b981; }
            .address-bar {
              flex: 1;
              background: white;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              padding: 4px 8px;
              font-size: 14px;
              margin-left: 8px;
            }
            .browser-content {
              flex: 1;
              background: white;
              padding: 16px;
              text-align: center;
              padding-top: 60px;
            }
            .desktop {
              background: #1e40af;
              height: 400px;
              position: relative;
              border-radius: 6px;
              overflow: hidden;
            }
            .taskbar {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 40px;
              background: #374151;
              display: flex;
              align-items: center;
              padding: 0 16px;
              justify-content: space-between;
            }
            .start-button {
              background: #2563eb;
              color: white;
              border: none;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 12px;
            }
            .desktop-icon {
              position: absolute;
              top: 16px;
              left: 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              color: white;
              font-size: 12px;
            }
            .icon-bg {
              width: 48px;
              height: 48px;
              background: #1e40af;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${device.name} - ${service} Connection</div>
            <div class="status">
              <div class="status-dot"></div>
              <span>Connected</span>
            </div>
          </div>
          ${getPopupInterface()}
        </body>
      </html>
    `

    // Open popup window
    const popup = window.open("", "_blank", "width=800,height=600,scrollbars=yes,resizable=yes")
    if (popup) {
      popup.document.write(popupContent)
      popup.document.close()
    }
  }

  const handleAddDevice = (newDevice: any) => {
    setDevices((prev) => [...prev, newDevice])
  }

  const handleEditDevice = (device: ConnectedDevice) => {
    setSelectedDevice(device)
    setShowEditModal(true)
  }

  const handleShowHistory = (device: ConnectedDevice) => {
    setSelectedDevice(device)
    setShowHistoryModal(true)
  }

  const handleUpdateDevice = (updatedDevice: ConnectedDevice) => {
    setDevices((prev) => prev.map((device) => (device.id === updatedDevice.id ? updatedDevice : device)))
  }

  const handleAddScannedDevices = (scannedDevices: any[]) => {
    // Filter out devices that already exist (by IP or port)
    const newDevices = scannedDevices.filter(
      (scanned) =>
        !devices.some(
          (existing) =>
            (scanned.ipAddress && existing.ipAddress === scanned.ipAddress) ||
            (scanned.port && existing.services.includes(scanned.port)),
        ),
    )

    if (newDevices.length > 0) {
      setDevices((prev) => [...prev, ...newDevices])
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Remote Reach</h2>
          <p className="text-sm text-gray-600 mt-1">Connect to devices on the local network through the router</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleScan}>
            <Radio className="w-4 h-4 mr-2" />
            Scan
          </Button>
          <Button variant="outline" onClick={handleQuickConnect}>
            <Zap className="w-4 h-4 mr-2" />
            Quick Connect
          </Button>
          <Button variant="outline" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Endpoint
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="py-0">
        <CardContent className="p-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search devices by name or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Total: {devices.length}</span>
              <span>•</span>
              <span className="text-green-600">Online: {devices.filter((d) => d.status === "online").length}</span>
              <span>•</span>
              <span className="text-gray-400">Offline: {devices.filter((d) => d.status === "offline").length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device, index) => (
          <Card
            key={device.id}
            className={`hover:shadow-md transition-all border-0 py-0 w-full cursor-move ${
              dragOverIndex === index ? "ring-2 ring-blue-500 ring-opacity-50" : ""
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, device)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardContent className="py-3 px-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-3 h-3 text-gray-400" />
                      {getDeviceIcon(device.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{device.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="truncate">{device.ipAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant={device.status === "online" ? "default" : "secondary"}
                      className={`text-xs ${device.status === "online" ? "bg-green-100 text-green-800" : ""}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-1 ${
                          device.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {device.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDevice(device)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowHistory(device)}>History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="text-sm text-gray-500 truncate">{device.lastSeen}</div>

                {device.status === "online" && device.services.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {device.services.map((service) => {
                      // Parse service to show Service:Port format
                      let displayText = service
                      if (service.includes(":")) {
                        // Already in Service:Port format
                        displayText = service
                      } else if (service.startsWith("COM")) {
                        // COM ports don't need port numbers
                        displayText = service
                      } else {
                        // Add default ports for services without explicit ports
                        const defaultPorts = {
                          SSH: "22",
                          Telnet: "23",
                          HTTP: "80",
                          HTTPS: "443",
                          RDP: "3389",
                          VNC: "5900",
                        }
                        const defaultPort = defaultPorts[service as keyof typeof defaultPorts]
                        displayText = defaultPort ? `${service}:${defaultPort}` : service
                      }

                      return (
                        <Button
                          key={service}
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleConnect(device, service)
                          }}
                          className="text-xs h-7 px-2"
                        >
                          {getServiceIcon(service)}
                          {displayText}
                        </Button>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No devices match your search criteria." : "No devices have been added yet."}
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Endpoint
            </Button>
          </CardContent>
        </Card>
      )}

      <AddDeviceModal open={showAddModal} onOpenChange={setShowAddModal} onAddDevice={handleAddDevice} />
      <EditDeviceModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdateDevice={handleUpdateDevice}
        device={selectedDevice}
      />
      <DeviceHistoryModal open={showHistoryModal} onOpenChange={setShowHistoryModal} device={selectedDevice} />
      {selectedDevice && (
        <ConnectionModal
          open={showConnectionModal}
          onOpenChange={setShowConnectionModal}
          deviceName={selectedDevice.name}
          deviceIp={selectedDevice.ipAddress}
          service={selectedService}
        />
      )}
      <QuickConnectModal
        open={showQuickConnectModal}
        onOpenChange={setShowQuickConnectModal}
        onConnect={handleQuickConnectSubmit}
      />
      <ScanDevicesModal open={showScanModal} onOpenChange={setShowScanModal} onAddDevices={handleAddScannedDevices} />
    </div>
  )
}
