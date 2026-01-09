"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Download } from "lucide-react"

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

interface ConnectionHistoryEntry {
  id: string
  user: string
  service: string
  timestamp: Date
  duration: number // in minutes
  status: "completed" | "active"
}

interface DeviceHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: ConnectedDevice | null
}

// Mock history data - in a real app this would come from a database or API
const generateMockHistory = (deviceId: string): ConnectionHistoryEntry[] => {
  const histories: Record<string, ConnectionHistoryEntry[]> = {
    "1": [
      // Anderson-Desktop - More entries with realistic names
      {
        id: "h1",
        user: "jillian.anderson",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        duration: 45,
        status: "completed",
      },
      {
        id: "h2",
        user: "mike.rodriguez",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        duration: 120,
        status: "completed",
      },
      {
        id: "h3",
        user: "sarah.chen",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        duration: 30,
        status: "completed",
      },
      {
        id: "h4",
        user: "jillian.anderson",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        duration: 75,
        status: "completed",
      },
      {
        id: "h5",
        user: "david.kim",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 90,
        status: "completed",
      },
      {
        id: "h6",
        user: "lisa.thompson",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: 25,
        status: "completed",
      },
      {
        id: "h7",
        user: "mike.rodriguez",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        duration: 180,
        status: "completed",
      },
      {
        id: "h8",
        user: "jillian.anderson",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        duration: 60,
        status: "completed",
      },
      {
        id: "h9",
        user: "alex.martinez",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        duration: 45,
        status: "completed",
      },
      {
        id: "h10",
        user: "sarah.chen",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        duration: 35,
        status: "completed",
      },
      {
        id: "h11",
        user: "robert.wilson",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        duration: 120,
        status: "completed",
      },
      {
        id: "h12",
        user: "emily.davis",
        service: "SSH:22",
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        duration: 55,
        status: "completed",
      },
    ],
    "2": [
      // Jillian-Laptop - More entries
      {
        id: "h13",
        user: "jillian.anderson",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        duration: 0,
        status: "active",
      },
      {
        id: "h14",
        user: "tom.garcia",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        duration: 90,
        status: "completed",
      },
      {
        id: "h15",
        user: "jillian.anderson",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        duration: 15,
        status: "completed",
      },
      {
        id: "h16",
        user: "kevin.lee",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        duration: 45,
        status: "completed",
      },
      {
        id: "h17",
        user: "maria.gonzalez",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 120,
        status: "completed",
      },
      {
        id: "h18",
        user: "jillian.anderson",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: 75,
        status: "completed",
      },
      {
        id: "h19",
        user: "james.brown",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        duration: 30,
        status: "completed",
      },
      {
        id: "h20",
        user: "anna.white",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        duration: 95,
        status: "completed",
      },
      {
        id: "h21",
        user: "carlos.rivera",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        duration: 40,
        status: "completed",
      },
      {
        id: "h22",
        user: "jennifer.taylor",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        duration: 85,
        status: "completed",
      },
      {
        id: "h23",
        user: "daniel.moore",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        duration: 65,
        status: "completed",
      },
      {
        id: "h24",
        user: "michelle.clark",
        service: "RDP:3389",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        duration: 110,
        status: "completed",
      },
    ],
    "4": [
      // Cisco-Switch-2960 - More entries
      {
        id: "h25",
        user: "steven.adams",
        service: "Telnet:23",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        duration: 25,
        status: "completed",
      },
      {
        id: "h26",
        user: "jillian.anderson",
        service: "COM1",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        duration: 60,
        status: "completed",
      },
      {
        id: "h27",
        user: "marcus.johnson",
        service: "Telnet:23",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        duration: 45,
        status: "completed",
      },
      {
        id: "h28",
        user: "steven.adams",
        service: "COM1",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 35,
        status: "completed",
      },
      {
        id: "h29",
        user: "steve.johnson",
        service: "Telnet:23",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: 90,
        status: "completed",
      },
      {
        id: "h30",
        user: "rachel.adams",
        service: "COM1",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        duration: 20,
        status: "completed",
      },
      {
        id: "h31",
        user: "steven.adams",
        service: "Telnet:23",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        duration: 75,
        status: "completed",
      },
      {
        id: "h32",
        user: "brian.cooper",
        service: "COM1",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        duration: 50,
        status: "completed",
      },
      {
        id: "h33",
        user: "marcus.johnson",
        service: "Telnet:23",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        duration: 30,
        status: "completed",
      },
      {
        id: "h34",
        user: "amanda.foster",
        service: "COM1",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        duration: 40,
        status: "completed",
      },
      {
        id: "h35",
        user: "steven.adams",
        service: "Telnet:23",
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        duration: 65,
        status: "completed",
      },
      {
        id: "h36",
        user: "tyler.bell",
        service: "COM1",
        timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 days ago
        duration: 85,
        status: "completed",
      },
    ],
    "5": [
      // Security-Camera-01 - More entries
      {
        id: "h37",
        user: "frank.miller",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        duration: 10,
        status: "completed",
      },
      {
        id: "h38",
        user: "jillian.anderson",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        duration: 5,
        status: "completed",
      },
      {
        id: "h39",
        user: "patricia.evans",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        duration: 20,
        status: "completed",
      },
      {
        id: "h40",
        user: "frank.miller",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        duration: 15,
        status: "completed",
      },
      {
        id: "h41",
        user: "gary.wright",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 8,
        status: "completed",
      },
      {
        id: "h42",
        user: "frank.miller",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: 12,
        status: "completed",
      },
      {
        id: "h43",
        user: "nancy.collins",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        duration: 25,
        status: "completed",
      },
      {
        id: "h44",
        user: "patricia.evans",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        duration: 18,
        status: "completed",
      },
      {
        id: "h45",
        user: "patricia.evans",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        duration: 7,
        status: "completed",
      },
      {
        id: "h46",
        user: "frank.miller",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        duration: 22,
        status: "completed",
      },
      {
        id: "h47",
        user: "harold.jones",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        duration: 35,
        status: "completed",
      },
      {
        id: "h48",
        user: "nancy.collins",
        service: "HTTPS:443",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        duration: 14,
        status: "completed",
      },
    ],
  }

  return histories[deviceId] || []
}

function formatDate(timestamp: Date): string {
  return timestamp.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDuration(minutes: number): string {
  if (minutes === 0) return "Active"
  if (minutes < 60) {
    return `${minutes}m`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
}

function exportToCSV(history: ConnectionHistoryEntry[], deviceName: string) {
  const headers = ["User", "Service", "Date", "Duration"]
  const csvContent = [
    headers.join(","),
    ...history.map((entry) =>
      [
        entry.user,
        entry.service,
        formatDate(entry.timestamp),
        entry.status === "active" ? "Active" : formatDuration(entry.duration),
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${deviceName}_connection_history.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function DeviceHistoryModal({ open, onOpenChange, device }: DeviceHistoryModalProps) {
  if (!device) return null

  const history = generateMockHistory(device.id)
  const sortedHistory = history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Connection History - {device.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {sortedHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No connection history found</p>
            </div>
          ) : (
            <>
              {/* Export Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(sortedHistory, device.name)}
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export CSV
                </Button>
              </div>

              {/* Scrollable Table */}
              <ScrollArea className="h-[450px] border rounded-md">
                <div className="space-y-0">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 border-b font-medium text-sm text-gray-700 sticky top-0">
                    <div>User</div>
                    <div>Service</div>
                    <div>Date</div>
                    <div>Duration</div>
                  </div>

                  {/* Table Rows */}
                  {sortedHistory.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-4 gap-4 p-3 border-b hover:bg-gray-50 text-sm">
                      <div className="font-medium">{entry.user}</div>
                      <div className="flex items-center gap-2">
                        <span>{entry.service}</span>
                        {entry.status === "active" && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="text-gray-600">{formatDate(entry.timestamp)}</div>
                      <div>{formatDuration(entry.duration)}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
