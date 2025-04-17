"use client"

import { useState } from "react"
import MainLayout from "@/components/main-layout"
import EmergencyButton from "@/components/emergency-button"
import { Phone, MessageSquare, AlertTriangle, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function EmergencyPage() {
  const [showFirstAid, setShowFirstAid] = useState(false)

  const handleCallAmbulance = () => {
    // In a real app, this would trigger a phone call
    toast({
      title: "Calling Ambulance",
      description: "Connecting to emergency services...",
      variant: "destructive",
    })
  }

  const handleSendSMS = () => {
    // In a real app, this would send an SMS with location
    toast({
      title: "Emergency SMS Sent",
      description: "Your location has been shared with emergency contacts",
      variant: "destructive",
    })
  }

  const handlePanicButton = () => {
    // In a real app, this would trigger both call and SMS
    toast({
      title: "Emergency Alert Activated",
      description: "Contacting all emergency services and your family",
      variant: "destructive",
    })
  }

  return (
    <MainLayout>
      <div className="py-6">
        <h2 className="text-xl font-bold mb-2">आपातकालीन सहायता (Emergency Help)</h2>
        <p className="text-sm text-muted-foreground mb-6">Tap any button below for immediate assistance</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <EmergencyButton icon={<Phone className="h-6 w-6" />} label="Call Ambulance" onClick={handleCallAmbulance} />
          <EmergencyButton icon={<MessageSquare className="h-6 w-6" />} label="Send SOS SMS" onClick={handleSendSMS} />
        </div>

        <Button
          onClick={handlePanicButton}
          className="w-full py-6 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-xl mb-6 flex items-center justify-center gap-2 pulse-animation"
        >
          <AlertTriangle className="h-6 w-6" />
          PANIC BUTTON
        </Button>

        <Card className="mb-6">
          <CardHeader className="bg-brand-blue text-white py-3">
            <CardTitle className="text-lg font-medium">Nearest Hospitals</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-3">
              <li className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="font-medium">District Hospital</h3>
                  <p className="text-sm text-gray-600">2.5 km away</p>
                </div>
                <Button size="sm" variant="outline" className="h-8">
                  <Phone className="h-4 w-4 mr-1" /> Call
                </Button>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="font-medium">Primary Health Center</h3>
                  <p className="text-sm text-gray-600">1.2 km away</p>
                </div>
                <Button size="sm" variant="outline" className="h-8">
                  <Phone className="h-4 w-4 mr-1" /> Call
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Ayushman Hospital</h3>
                  <p className="text-sm text-gray-600">4.8 km away</p>
                </div>
                <Button size="sm" variant="outline" className="h-8">
                  <Phone className="h-4 w-4 mr-1" /> Call
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Button
          onClick={() => setShowFirstAid(!showFirstAid)}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mb-2"
        >
          <Heart className="h-5 w-5 text-red-500" />
          {showFirstAid ? "Hide First Aid Tips" : "Show First Aid Tips"}
        </Button>

        {showFirstAid && (
          <Card className="mb-6 border-red-200">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Basic First Aid Tips:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <p>For bleeding: Apply direct pressure with clean cloth</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <p>For burns: Cool with running water for 10 minutes</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <p>For snake bite: Keep the person calm, immobilize the limb</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <p>For heart attack: Help them sit, loosen tight clothing</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
