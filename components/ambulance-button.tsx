"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Ambulance } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AmbulanceButtonProps {
  variant?: "default" | "compact" | "floating"
  label?: string
  icon?: React.ReactNode
  ambulanceNumber?: string
}

export default function AmbulanceButton({
  variant = "default",
  label = "Ambulance",
  icon = <Ambulance className="h-6 w-6" />,
  ambulanceNumber = "108", // Default ambulance number for India
}: AmbulanceButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleCall = () => {
    window.location.href = `tel:${ambulanceNumber}`
  }

  const getButtonStyles = () => {
    switch (variant) {
      case "compact":
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-md"
      case "floating":
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-full flex items-center justify-center shadow-lg fixed bottom-6 right-6 z-50"
      default:
        return "bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 shadow-lg"
    }
  }

  return (
    <>
      <Button onClick={() => setShowConfirmation(true)} className={getButtonStyles()}>
        {icon}
        {variant !== "floating" && <span>{label}</span>}
      </Button>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Ambulance className="h-5 w-5" />
              Call Ambulance
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to call emergency ambulance services?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="font-medium">Emergency Ambulance</p>
              <p className="text-2xl font-bold text-red-600">{ambulanceNumber}</p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCall}
            >
              Call Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 