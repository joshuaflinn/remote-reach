"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, ChevronLeft, ChevronRight, Lock, Monitor, Terminal, ExternalLink } from "lucide-react"

interface ConnectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deviceName: string
  deviceIp: string
  service: string
}

export function ConnectionModal({ open, onOpenChange, deviceName, deviceIp, service }: ConnectionModalProps) {
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "failed">("connecting")
  const [terminalContent, setTerminalContent] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const modalRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Parse service type and port
  const [serviceType, port] = service.includes(":")
    ? service.split(":")
    : [service.startsWith("COM") ? "Serial" : service, ""]

  useEffect(() => {
    if (open) {
      // Reset position when modal opens
      setPosition({ x: 0, y: 0 })

      // Simulate connection process
      setConnectionStatus("connecting")
      const timer = setTimeout(() => {
        setConnectionStatus("connected")

        // For terminal-like interfaces, add some initial content
        if (["SSH", "Telnet", "Serial"].includes(serviceType)) {
          if (serviceType === "SSH") {
            setTerminalContent(
              `Connecting to ${deviceIp} via SSH...\nSSH-2.0-OpenSSH_8.9\nAuthenticated to ${deviceIp}.\n\n${deviceName}:~$ `,
            )
          } else if (serviceType === "Telnet") {
            setTerminalContent(
              `Connecting to ${deviceIp}...\nConnected to ${deviceIp}.\nEscape character is '^]'.\n\n${deviceName} login: `,
            )
          } else if (serviceType === "Serial") {
            setTerminalContent(`Opening ${service} connection to ${deviceName}...\nConnected.\n\n${deviceName}> `)
          }
        }
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [open, deviceIp, deviceName, service, serviceType])

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [open, onOpenChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-draggable="true"]')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      // Constrain to viewport
      const maxX = window.innerWidth - (modalRef.current?.offsetWidth || 800)
      const maxY = window.innerHeight - (modalRef.current?.offsetHeight || 600)

      setPosition({
        x: Math.max(-400, Math.min(maxX, newX)),
        y: Math.max(-300, Math.min(maxY, newY)),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.userSelect = ""
      }
    }
  }, [isDragging, dragStart, position])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onOpenChange(false)
    }
  }

  const handlePopOut = () => {
    // Create the HTML content for the popup window
    const popupContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${deviceName} - ${service} Connection</title>
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
            <div class="title">${deviceName} - ${service} Connection</div>
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

      // Close the modal after popping out
      onOpenChange(false)
    }
  }

  const getPopupInterface = () => {
    switch (serviceType) {
      case "SSH":
      case "Telnet":
        return `<div class="terminal">${terminalContent}</div>`

      case "Serial":
      case "COM1":
      case "COM2":
      case "COM3":
      case "COM4":
      case "COM5":
      case "COM6":
      case "COM7":
      case "COM8":
        return `<div class="terminal-white">${terminalContent}</div>`

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
                ${serviceType === "HTTPS" ? "🔒 " : ""}${serviceType.toLowerCase()}://${deviceIp}
              </div>
            </div>
            <div class="browser-content">
              <h2>${deviceName}</h2>
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

  // Render different interfaces based on service type
  const renderInterface = () => {
    switch (serviceType) {
      case "SSH":
      case "Telnet":
        return (
          <div className="bg-black text-green-500 font-mono p-4 h-96 overflow-auto">
            {connectionStatus === "connecting" ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse">
                  Connecting to {deviceName} via {serviceType}...
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap">{terminalContent}</pre>
            )}
          </div>
        )

      case "Serial":
      case "COM1":
      case "COM2":
      case "COM3":
      case "COM4":
      case "COM5":
      case "COM6":
      case "COM7":
      case "COM8":
        return (
          <div className="bg-black text-white font-mono p-4 h-96 overflow-auto">
            {connectionStatus === "connecting" ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse">
                  Opening {service} connection to {deviceName}...
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap">{terminalContent}</pre>
            )}
          </div>
        )

      case "HTTP":
      case "HTTPS":
        return (
          <div className="border rounded-md h-96 flex flex-col">
            {/* Browser chrome */}
            <div className="bg-gray-100 p-2 border-b flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <div className="flex-1 flex items-center bg-white rounded-md border px-2 py-1 text-sm">
                  {serviceType === "HTTPS" && <Lock className="h-3 w-3 text-green-600 mr-1" />}
                  {`${serviceType.toLowerCase()}://${deviceIp}`}
                </div>
              </div>
            </div>

            {/* Browser content */}
            <div className="flex-1 bg-white p-4 overflow-auto">
              {connectionStatus === "connecting" ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin mr-2">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <span>Loading {deviceName}...</span>
                </div>
              ) : (
                <div className="text-center py-10">
                  <h2 className="text-xl font-bold mb-4">{deviceName}</h2>
                  <p className="text-gray-600 mb-6">Device web interface</p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button variant="outline">Status</Button>
                    <Button variant="outline">Configuration</Button>
                    <Button variant="outline">Network</Button>
                    <Button variant="outline">Security</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "RDP":
      case "VNC":
        return (
          <div className="border rounded-md h-96 flex flex-col">
            {connectionStatus === "connecting" ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse">
                  Connecting to {deviceName} via {serviceType}...
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-blue-900 p-0 overflow-hidden relative">
                {/* Mock desktop environment */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-800 flex items-center px-4">
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full bg-blue-600 text-white">
                    <span className="text-xs">Start</span>
                  </Button>
                  <div className="flex-1"></div>
                  <div className="text-white text-xs">12:34 PM</div>
                </div>
                <div className="absolute top-4 left-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-700 rounded-md mb-1 flex items-center justify-center">
                    <Monitor className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-white text-xs">Computer</span>
                </div>
                <div className="absolute top-4 left-24 flex flex-col items-center">
                  <div className="w-12 h-12 bg-yellow-600 rounded-md mb-1 flex items-center justify-center">
                    <Terminal className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-white text-xs">Terminal</span>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <p>Unsupported service type: {serviceType}</p>
          </div>
        )
    }
  }

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-[800px] max-h-[90vh] overflow-hidden"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
        }}
      >
        <div
          data-draggable="true"
          onMouseDown={handleMouseDown}
          className="cursor-grab active:cursor-grabbing select-none bg-gray-50 border-b px-6 py-4 flex items-center justify-between"
        >
          <h2 className="text-lg font-semibold">
            {deviceName} - {service} Connection
          </h2>

          <div className="flex items-center gap-1">
            {connectionStatus === "connected" && (
              <Button variant="ghost" size="sm" onClick={handlePopOut} className="h-6 w-6 p-0 hover:bg-gray-200">
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0 hover:bg-gray-200"
            >
              <span className="text-lg font-semibold">×</span>
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connecting"
                  ? "bg-yellow-500"
                  : connectionStatus === "connected"
                    ? "bg-green-500"
                    : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm">
              {connectionStatus === "connecting"
                ? "Connecting..."
                : connectionStatus === "connected"
                  ? "Connected"
                  : "Connection failed"}
            </span>
          </div>

          {renderInterface()}
        </div>
      </div>
    </div>
  )
}
