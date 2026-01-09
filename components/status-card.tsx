import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  title: string
  status: string
  statusColor: "green" | "gray"
  icon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function StatusCard({ title, status, statusColor, icon, children, className }: StatusCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm text-gray-600">{title}</span>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className={cn("w-2 h-2 rounded-full", statusColor === "green" ? "bg-green-500" : "bg-gray-400")} />
          <span className="font-medium">{status}</span>
        </div>

        {children}
      </CardContent>
    </Card>
  )
}
