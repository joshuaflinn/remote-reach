"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuickConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (connectionInfo: {
    deviceName: string
    deviceIp: string
    service: string
    newWindow: boolean
  }) => void
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

export function QuickConnectModal({ open, onOpenChange, onConnect }: QuickConnectModalProps) {
  const [formData, setFormData] = useState({
    deviceName: "",
    ipAddress: "",
    service: "",
    port: "",
    comPort: "COM1",
    newWindow: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.ipAddress || !formData.service) {
      return
    }

    let finalService = formData.service
    if (formData.service === "Serial") {
      finalService = formData.comPort
    } else if (formData.port) {
      finalService = `${formData.service}:${formData.port}`
    } else {
      // Use default port
      const serviceConfig = availableServices.find((s) => s.value === formData.service)
      if (serviceConfig && serviceConfig.defaultPort) {
        finalService = `${formData.service}:${serviceConfig.defaultPort}`
      }
    }

    const deviceName = formData.deviceName || `${formData.ipAddress} (Quick Connect)`

    onConnect({
      deviceName,
      deviceIp: formData.ipAddress,
      service: finalService,
      newWindow: formData.newWindow,
    })

    onOpenChange(false)

    // Reset form
    setFormData({
      deviceName: "",
      ipAddress: "",
      service: "",
      port: "",
      comPort: "COM1",
      newWindow: false,
    })
  }

  const handleServiceChange = (service: string) => {
    const serviceConfig = availableServices.find((s) => s.value === service)
    setFormData((prev) => ({
      ...prev,
      service,
      port: serviceConfig?.defaultPort || "",
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quick Connect</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deviceName">Device Name (Optional)</Label>
            <Input
              id="deviceName"
              placeholder="Enter a friendly name"
              value={formData.deviceName}
              onChange={(e) => setFormData((prev) => ({ ...prev, deviceName: e.target.value }))}
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

          <div className="space-y-2">
            <Label htmlFor="service">Service *</Label>
            <Select value={formData.service} onValueChange={handleServiceChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.service && formData.service !== "Serial" && (
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                placeholder="Port number"
                value={formData.port}
                onChange={(e) => setFormData((prev) => ({ ...prev, port: e.target.value }))}
              />
            </div>
          )}

          {formData.service === "Serial" && (
            <div className="space-y-2">
              <Label htmlFor="comPort">COM Port</Label>
              <Select
                value={formData.comPort}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, comPort: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {comPorts.map((port) => (
                    <SelectItem key={port.value} value={port.value}>
                      {port.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="newWindow"
              checked={formData.newWindow}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, newWindow: checked as boolean }))}
            />
            <Label htmlFor="newWindow" className="text-sm">
              Open in new window
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Connect</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
