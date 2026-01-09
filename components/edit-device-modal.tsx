"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface EditDeviceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateDevice: (device: ConnectedDevice) => void
  device: ConnectedDevice | null
}

const availableServices = [
  { value: "SSH", label: "SSH", defaultPort: "22" },
  { value: "Telnet", label: "Telnet", defaultPort: "23" },
  { value: "HTTP", label: "HTTP", defaultPort: "80" },
  { value: "HTTPS", label: "HTTPS", defaultPort: "443" },
  { value: "RDP", label: "RDP", defaultPort: "3389" },
  { value: "VNC", label: "VNC", defaultPort: "5900" },
  { value: "Serial", label: "Serial", defaultPort: "" },
]

const comPorts = [
  { value: "COM1", label: "COM1" },
  { value: "COM2", label: "COM2" },
  { value: "COM3", label: "COM3" },
  { value: "COM4", label: "COM4" },
  { value: "COM5", label: "COM5" },
  { value: "COM6", label: "COM6" },
  { value: "COM7", label: "COM7" },
  { value: "COM8", label: "COM8" },
]

export function EditDeviceModal({ open, onOpenChange, onUpdateDevice, device }: EditDeviceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    ipAddress: "",
    services: [] as string[],
    comPort: "COM1",
    ports: {} as Record<string, string>,
    newWindow: {} as Record<string, boolean>,
  })

  useEffect(() => {
    if (device) {
      // Check if any service is a COM port
      const comPortService = device.services.find((service) => service.startsWith("COM"))

      // Parse services and ports
      const servicesForForm: string[] = []
      const portsForForm: Record<string, string> = {}

      device.services.forEach((service) => {
        if (service.startsWith("COM")) {
          servicesForForm.push("Serial")
        } else if (service.includes(":")) {
          const [serviceName, port] = service.split(":")
          servicesForForm.push(serviceName)
          portsForForm[serviceName] = port
        } else {
          servicesForForm.push(service)
        }
      })

      setFormData({
        name: device.name,
        ipAddress: device.ipAddress,
        services: servicesForForm,
        comPort: comPortService || "COM1",
        ports: portsForForm,
        newWindow: device.newWindow || {},
      })
    }
  }, [device])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.ipAddress || !device) {
      return
    }

    // Replace "Serial" with the selected COM port in services and add ports to other services
    const finalServices = formData.services.map((service) => {
      if (service === "Serial") {
        return formData.comPort
      } else if (formData.ports[service]) {
        return `${service}:${formData.ports[service]}`
      }
      return service
    })

    const updatedDevice = {
      ...device,
      name: formData.name,
      ipAddress: formData.ipAddress,
      services: finalServices,
      newWindow: formData.newWindow,
    }

    onUpdateDevice(updatedDevice)
    onOpenChange(false)
  }

  const handleServiceChange = (service: string, checked: boolean) => {
    const serviceConfig = availableServices.find((s) => s.value === service)

    setFormData((prev) => {
      const newServices = checked ? [...prev.services, service] : prev.services.filter((s) => s !== service)
      const newPorts = { ...prev.ports }
      const newWindowPrefs = { ...prev.newWindow }

      // Auto-populate default port when service is selected (only if not already set)
      if (checked && serviceConfig && serviceConfig.defaultPort && !prev.ports[service]) {
        newPorts[service] = serviceConfig.defaultPort
      } else if (!checked) {
        delete newPorts[service]
        delete newWindowPrefs[service]
      }

      return {
        ...prev,
        services: newServices,
        ports: newPorts,
        newWindow: newWindowPrefs,
      }
    })
  }

  if (!device) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Device Settings</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Device Name *</Label>
            <Input
              id="name"
              placeholder="Enter device name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipAddress">IP Address *</Label>
            <Input
              id="ipAddress"
              placeholder="192.168.1.100"
              value={formData.ipAddress}
              onChange={(e) => setFormData((prev) => ({ ...prev, ipAddress: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Available Services</Label>
            <div className="grid grid-cols-2 gap-1 max-w-2xl">
              {availableServices.map((service) => (
                <div key={service.value} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={service.value}
                      checked={formData.services.includes(service.value)}
                      onCheckedChange={(checked) => handleServiceChange(service.value, checked as boolean)}
                    />
                    <Label htmlFor={service.value} className="text-sm font-normal min-w-[50px]">
                      {service.label}
                    </Label>
                  </div>

                  {formData.services.includes(service.value) && (
                    <div className="flex items-center space-x-2">
                      {service.value === "Serial" ? (
                        <Select
                          value={formData.comPort}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, comPort: value }))}
                        >
                          <SelectTrigger className="w-20 h-7 text-xs">
                            <SelectValue placeholder="COM" />
                          </SelectTrigger>
                          <SelectContent>
                            {comPorts.map((port) => (
                              <SelectItem key={port.value} value={port.value}>
                                {port.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          placeholder="Port"
                          value={formData.ports[service.value] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ports: { ...prev.ports, [service.value]: e.target.value },
                            }))
                          }
                          className="w-16 h-7 text-xs"
                        />
                      )}

                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`${service.value}-newwindow`}
                          checked={formData.newWindow[service.value] || false}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              newWindow: { ...prev.newWindow, [service.value]: checked as boolean },
                            }))
                          }
                        />
                        <Label
                          htmlFor={`${service.value}-newwindow`}
                          className="text-xs text-gray-600 whitespace-nowrap"
                        >
                          New Window?
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Device</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
