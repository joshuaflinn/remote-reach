import {
  Home,
  Monitor,
  FileText,
  Settings,
  BarChart3,
  Heart,
  AlertTriangle,
  FileCode,
  Cpu,
  Users,
  Database,
  Code,
  Webhook,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

const sidebarItems = [
  { icon: Home, label: "Dashboard", active: true },
  {
    label: "Device Management",
    items: [
      { icon: Monitor, label: "Devices", count: 30, active: false },
      { icon: FileText, label: "Templates", active: false },
      { icon: Settings, label: "Automations", active: false },
    ],
  },
  {
    label: "Insights",
    items: [
      { icon: BarChart3, label: "Reports", active: false },
      { icon: Heart, label: "Health", active: false },
      { icon: AlertTriangle, label: "Alerts", active: false },
    ],
  },
  {
    label: "System",
    items: [
      { icon: FileCode, label: "Logs", active: false },
      { icon: Cpu, label: "Firmware", active: false },
      { icon: Users, label: "Subscriptions", active: false },
    ],
  },
  {
    label: "Developer Tools",
    items: [
      { icon: Database, label: "Data Streams", active: false },
      { icon: Code, label: "API Explorer", active: false },
      { icon: Webhook, label: "Webhooks", active: false },
    ],
  },
]

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 h-full", className)}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-semibold text-gray-800">DIGI</span>
        </div>

        <nav className="space-y-6">
          {sidebarItems.map((section, index) => (
            <div key={index}>
              {typeof section.label === "string" && section.items ? (
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{section.label}</h3>
                  <div className="space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer",
                          item.active
                            ? "bg-green-50 text-green-700 border-r-2 border-green-600"
                            : "text-gray-600 hover:bg-gray-50",
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.count && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer",
                    section.active
                      ? "bg-green-50 text-green-700 border-r-2 border-green-600"
                      : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  {section.icon && <section.icon className="w-4 h-4" />}
                  <span>{section.label}</span>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
