import { StatusCard } from "./status-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Copy } from "lucide-react"

export function DeviceDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Status Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Cloud Status"
          status="Online"
          statusColor="green"
          icon={
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
            </div>
          }
        >
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Connection Type</span>
              <span>Ethernet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IP Address</span>
              <span>192.168.7.19</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cloud Uptime</span>
              <span>11 hours 18 mins 50 secs</span>
            </div>
          </div>
        </StatusCard>

        <StatusCard title="System Status" status="Device" statusColor="gray">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Local Time</span>
              <span>7/31/2025, 8:06:00 PM (UTC)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">System Uptime</span>
              <span>17 days 2 hours 46 mins 20 secs</span>
            </div>
          </div>
        </StatusCard>

        <StatusCard title="Speed Test" status="" statusColor="gray">
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-4">No Speed Test History</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ping Latency</span>
                <span>—</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ping Jitter</span>
                <span>—</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interface</span>
                <span>—</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Server</span>
                <span>—</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Updated</span>
                <span>—</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="text-xs text-gray-500">SPEEDTEST by Ookla</div>
            </div>
          </div>
        </StatusCard>

        <StatusCard
          title="Health Status"
          status="Normal"
          statusColor="green"
          icon={
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
            </div>
          }
        >
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-4">All metrics are within normal ranges</p>
            <Button variant="link" className="text-blue-600 p-0 h-auto">
              View Health Definitions
            </Button>
          </div>
        </StatusCard>
      </div>

      {/* Template Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="font-medium">Template</span>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Template</span>
              <span>—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span>—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Scanned</span>
              <span>—</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium mb-4">Digi IX40</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">MAC Address</span>
                <span>00:04:F3:95:07:C3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Device ID</span>
                <div className="flex items-center gap-2">
                  <span>00000000-00000000-0004F3FF-FF9507C3</span>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Serial Number</span>
                <span>IX401829844824O5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Device Details</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Device Name</span>
                <span>gandersen-IX40</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account</span>
                <span>2899</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Group</span>
                <span>Anderson</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
