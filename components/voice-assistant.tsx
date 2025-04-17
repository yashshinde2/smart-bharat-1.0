"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"

interface Message {
  id: string
  text: string
  isUser: boolean
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ? (Hello! How can I help you today?)",
      isUser: false,
    },
  ])
  const [voiceOutput, setVoiceOutput] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleListening = () => {
    setIsListening(!isListening)

    // Simulate receiving a response after 2 seconds when starting to listen
    if (!isListening) {
      setTimeout(() => {
        const newUserMessage = {
          id: Date.now().toString(),
          text: "मुझे आज का मौसम बताओ (Tell me today's weather)",
          isUser: true,
        }

        setMessages((prev) => [...prev, newUserMessage])

        // Simulate AI response after 1 more second
        setTimeout(() => {
          const newAiMessage = {
            id: (Date.now() + 1).toString(),
            text: "आज का मौसम साफ है, तापमान 28°C है। बारिश की कोई संभावना नहीं है। (Today's weather is clear with a temperature of 28°C. There is no chance of rain.)",
            isUser: false,
          }

          setMessages((prev) => [...prev, newAiMessage])
          setIsListening(false)
        }, 1000)
      }, 2000)
    }
  }

  const toggleVoiceOutput = () => {
    setVoiceOutput(!voiceOutput)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <Card
              className={`p-3 max-w-[80%] rounded-2xl ${
                message.isUser ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-800"
              } slide-in`}
            >
              <p className="text-sm sm:text-base">{message.text}</p>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isListening && (
        <div className="flex justify-center mb-6 fade-in">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 bg-brand-orange rounded-full wave"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        <Button onClick={toggleVoiceOutput} variant="outline" size="sm" className="rounded-full">
          {voiceOutput ? (
            <Volume2 className="h-4 w-4 text-brand-green" />
          ) : (
            <VolumeX className="h-4 w-4 text-gray-400" />
          )}
          <span className="ml-2 text-sm">{voiceOutput ? "Voice Output On" : "Voice Output Off"}</span>
        </Button>

        <Button
          onClick={toggleListening}
          className={`rounded-full w-20 h-20 ${
            isListening ? "bg-red-500 hover:bg-red-600" : "bg-brand-orange hover:bg-brand-orange/90"
          } pulse-animation flex items-center justify-center`}
        >
          {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
        </Button>
        <p className="text-sm text-center text-muted-foreground">{isListening ? "Tap to Stop" : "Tap to Speak"}</p>
      </div>
    </div>
  )
}
