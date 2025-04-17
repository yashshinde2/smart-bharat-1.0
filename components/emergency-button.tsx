"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

interface EmergencyButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export default function EmergencyButton({ icon, label, onClick }: EmergencyButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-emergency hover:bg-emergency/90 text-white h-auto py-4 w-full flex flex-col items-center gap-2 rounded-xl"
    >
      <div className="bg-white/20 p-3 rounded-full">{icon}</div>
      <span className="text-lg font-medium">{label}</span>
    </Button>
  )
}
