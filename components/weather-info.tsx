import { Cloud, CloudRain, Sun, Wind } from "lucide-react"
import UpdateCard from "./update-card"

export default function WeatherInfo() {
  return (
    <UpdateCard title="Weather Info" icon={<Sun className="h-5 w-5" />} color="bg-brand-blue">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">28°C</h3>
            <p className="text-sm text-gray-600">Mostly Sunny</p>
          </div>
          <Sun className="h-12 w-12 text-yellow-500" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Wind className="h-5 w-5 mx-auto text-gray-500" />
            <p className="text-xs mt-1">10 km/h</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <CloudRain className="h-5 w-5 mx-auto text-gray-500" />
            <p className="text-xs mt-1">0%</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <Cloud className="h-5 w-5 mx-auto text-gray-500" />
            <p className="text-xs mt-1">10%</p>
          </div>
        </div>

        <div className="text-sm">
          <p>Good day for farming activities. No rain expected for the next 24 hours.</p>
        </div>
      </div>
    </UpdateCard>
  )
}
