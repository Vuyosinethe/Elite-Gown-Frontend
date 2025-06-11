import { Card, CardContent } from "@/components/ui/card"
import { Calendar, FileText, Shield, CheckCircle, AlertCircle, Stethoscope } from "lucide-react"

export default function RentalPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Rental Options</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Graduation Gown Rental */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold">Graduation Gown Rental</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Weekly Rental</span>
                <span className="font-semibold">R200/week</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Rental</span>
                <span className="font-semibold">R600/month</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-semibold">R400</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Celebrate your academic achievements in style with our high-quality graduation gowns.
            </p>
          </CardContent>
        </Card>

        {/* Medical Scrubs Rental */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Stethoscope className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold">Medical Scrubs Rental</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Weekly Rental</span>
                <span className="font-semibold">R150/week</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Rental</span>
                <span className="font-semibold">R500/month</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-semibold">R300</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Perfect for clinical rotations, internships, or short-term medical placements.
            </p>
          </CardContent>
        </Card>

        {/* Equipment Rental */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold">Equipment Rental</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Weekly Rental</span>
                <span className="font-semibold">R300/week</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Rental</span>
                <span className="font-semibold">R800/month</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-semibold">R500</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">Rent our high-quality equipment for your projects and events.</p>
          </CardContent>
        </Card>

        {/* Event Space Rental */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold">Event Space Rental</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Daily Rental</span>
                <span className="font-semibold">R1000/day</span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Rental</span>
                <span className="font-semibold">R5000/week</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-semibold">R2000</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Host your events in our versatile and well-equipped event space.
            </p>
          </CardContent>
        </Card>

        {/* Security Services Rental */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold">Security Services Rental</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Hourly Rate</span>
                <span className="font-semibold">R250/hour</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Rate</span>
                <span className="font-semibold">R2000/day</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-semibold">R1000</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Ensure the safety and security of your events with our professional security services.
            </p>
          </CardContent>
        </Card>

        {/* Emergency Equipment Rental */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold">Emergency Equipment Rental</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Daily Rental</span>
                <span className="font-semibold">R500/day</span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Rental</span>
                <span className="font-semibold">R2500/week</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-semibold">R1500</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Be prepared for any situation with our reliable emergency equipment rental service.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
