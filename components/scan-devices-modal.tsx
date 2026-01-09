"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Radio,
  Wifi,
  Zap,
  Monitor,
  Laptop,
  Router,
  Terminal,
  Globe,
  Shield,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface ScannedDevice {
  id: string
  name: string
  type: "desktop" | "laptop" | "mobile" | "router" | "other"
  ipAddress?: string
  macAddress?: string
  port?: string
  services: string[]
  status: "online" | "offline"
  lastSeen: string
  newWindow: Record<string, boolean>
}

interface ScanDevicesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddDevices: (devices: ScannedDevice[]) => void
}

export function ScanDevicesModal({ open, onOpenChange, onAddDevices }: ScanDevicesModalProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([])
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<Set<string>>(new Set())
  const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null)

  // Mock scan function
  const startScan = async () => {
    setIsScanning(true)
    setProgress(0)
    setScannedDevices([])
    setSelectedDeviceIds(new Set())

    const mockDevices: ScannedDevice[] = [
      {
        id: "scan-1",
        name: "Device-110",
        type: "other",
        ipAddress: "192.168.7.110",
        macAddress: "AA:BB:CC:DD:EE:44",
        services: ["HTTP:80"],
        status: "online",
        lastSeen: "Just now",
        newWindow: {},
      },
      {
        id: "scan-2",
        name: "Device-115",
        type: "laptop",
        ipAddress: "192.168.7.115",
        macAddress: "AA:BB:CC:DD:EE:29",
        services: ["SSH:22", "HTTP:80"],
        status: "online",
        lastSeen: "Just now",
        newWindow: {},
      },
      {
        id: "scan-3",
        name: "Device-125",
        type: "router",
        ipAddress: "192.168.7.125",
        macAddress: "AA:BB:CC:DD:EE:70",
        services: ["SSH:22"],
        status: "online",
        lastSeen: "Just now",
        newWindow: {},
      },
      {
        id: "scan-4",
        name: "Device-130",
        type: "desktop",
        ipAddress: "192.168.7.130",
        macAddress: "AA:BB:CC:DD:EE:70",
        services: ["SSH:22"],
        status: "online",
        lastSeen: "Just now",
        newWindow: {},
      },
      {
        id: "scan-5",
        name: "COM1",
        type: "other",
        port: "COM1",
        services: ["COM1"],
        status: "online",
        lastSeen: "Just now",
        newWindow: {},
      },
    ]

    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setScannedDevices(mockDevices)
    setSelectedDeviceIds(new Set(mockDevices.map((d) => d.id)))
    setIsScanning(false)
  }

  const handleToggleDevice = (deviceId: string) => {
    const newSelected = new Set(selectedDeviceIds)
    if (newSelected.has(deviceId)) {
      newSelected.delete(deviceId)
    } else {
      newSelected.add(deviceId)
    }
    setSelectedDeviceIds(newSelected)
  }

  const handleToggleExpand = (deviceId: string) => {
    setExpandedDeviceId(expandedDeviceId === deviceId ? null : deviceId)
  }

  const handleAddSelected = () => {
    const devicesToAdd = scannedDevices.filter((device) => selectedDeviceIds.has(device.id))
    onAddDevices(devicesToAdd)
    onOpenChange(false)
    setScannedDevices([])
    setSelectedDeviceIds(new Set())
    setExpandedDeviceId(null)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "desktop":
        return <Monitor className="w-4 h-4" />
      case "laptop":
        return <Laptop className="w-4 h-4" />
      case "router":
        return <Router className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const getServiceIcon = (service: string) => {
    const serviceType = service.split(":")[0]
    switch (serviceType) {
      case "SSH":
        return <Terminal className="w-3 h-3" />
      case "HTTP":
        return <Globe className="w-3 h-3" />
      case "HTTPS":
        return <Shield className="w-3 h-3" />
      case "RDP":
        return <Monitor className="w-3 h-3" />
      case "VNC":
        return <Eye className="w-3 h-3" />
      case "COM1":
      case "COM2":
      case "COM3":
      case "COM4":
        return <Zap className="w-3 h-3" />
      default:
        return <Terminal className="w-3 h-3" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Network & Serial Port Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isScanning && scannedDevices.length === 0 && (
            <div className="text-center py-8">
              <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Scan your network for available devices and serial ports</p>
              <Button onClick={startScan}>
                <Radio className="w-4 h-4 mr-2" />
                Start Scan
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Scanning network and ports...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {!isScanning && scannedDevices.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Discovered Devices ({scannedDevices.length})</h3>
                <Button variant="outline" size="sm" onClick={startScan}>
                  <Radio className="w-3 h-3 mr-2" />
                  Rescan
                </Button>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {scannedDevices.map((device) => {
                    const isExpanded = expandedDeviceId === device.id
                    const isSelected = selectedDeviceIds.has(device.id)

                    return (
                      <Card key={device.id} className={isSelected ? "border-blue-500" : ""}>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <Checkbox checked={isSelected} onCheckedChange={() => handleToggleDevice(device.id)} />
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {device.port ? <Zap className="w-4 h-4 text-orange-600" /> : getDeviceIcon(device.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm truncate">{device.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {device.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 truncate">
                                  {device.ipAddress || device.port}
                                  {device.macAddress && ` • ${device.macAddress}`}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleToggleExpand(device.id)}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </div>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t space-y-3">
                              <div>
                                <Label className="text-xs">Device Name</Label>
                                <Input
                                  value={device.name}
                                  onChange={(e) => {
                                    const updated = scannedDevices.map((d) =>
                                      d.id === device.id ? { ...d, name: e.target.value } : d,
                                    )
                                    setScannedDevices(updated)
                                  }}
                                  className="h-8 text-sm mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-xs mb-2 block">Available Services</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  {["SSH", "Telnet", "HTTP", "HTTPS", "RDP", "VNC"].map((service) => (
                                    <div key={service} className="flex items-center gap-2">
                                      <Checkbox
                                        id={`${device.id}-${service}`}
                                        checked={device.services.some((s) => s.startsWith(service))}
                                        onCheckedChange={(checked) => {
                                          const defaultPorts: Record<string, string> = {
                                            SSH: "22",
                                            Telnet: "23",
                                            HTTP: "80",
                                            HTTPS: "443",
                                            RDP: "3389",
                                            VNC: "5900",
                                          }
                                          const serviceWithPort = `${service}:${defaultPorts[service]}`

                                          const updated = scannedDevices.map((d) => {
                                            if (d.id === device.id) {
                                              const services = checked
                                                ? [...d.services, serviceWithPort]
                                                : d.services.filter((s) => !s.startsWith(service))
                                              return { ...d, services }
                                            }
                                            return d
                                          })
                                          setScannedDevices(updated)
                                        }}
                                      />
                                      <Label htmlFor={`${device.id}-${service}`} className="text-xs cursor-pointer">
                                        {service}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-gray-600">{selectedDeviceIds.size} devices selected</span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSelected} disabled={selectedDeviceIds.size === 0}>
                    Add Selected
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
