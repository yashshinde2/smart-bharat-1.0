import { Heart, AlertTriangle, Pill } from "lucide-react"
import UpdateCard from "./update-card"

export default function HealthAlerts() {
  return (
    <div className="space-y-4">
      <UpdateCard title="Health Alert" icon={<Heart className="h-5 w-5" />} color="bg-red-500">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">Dengue Prevention</h3>
              <p className="text-sm text-gray-600">
                Remove stagnant water around your home to prevent mosquito breeding.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Pill className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium">Vaccination Camp</h3>
              <p className="text-sm text-gray-600">Free vaccination camp at village center on Sunday, 10 AM - 4 PM.</p>
            </div>
          </div>
        </div>
      </UpdateCard>
    </div>
  )
}
