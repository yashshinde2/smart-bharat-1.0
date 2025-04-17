import MainLayout from "@/components/main-layout"
import VoiceAssistant from "@/components/voice-assistant"

export default function HomePage() {
  return (
    <MainLayout>
      <div className="py-6 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">आपका स्वागत है! (Welcome!)</h2>
        <VoiceAssistant />
      </div>
    </MainLayout>
  )
}
