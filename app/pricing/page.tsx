import { PricingCalculator } from "@/components/pricing-calculator"
import { PricingPlans } from "@/components/pricing-plans"

export default function PricingPage() {
  return (
    <div className="container py-10 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose the perfect plan for your project or calculate a custom price based on your specific needs.
        </p>
      </div>

      <PricingPlans />

      <div className="py-10">
        <div className="mx-auto max-w-3xl rounded-xl overflow-hidden border bg-card text-card-foreground shadow">
          <div className="bg-orange-500 p-6 text-white">
            <h2 className="text-2xl font-bold">Custom Price Calculator</h2>
            <p className="mt-2">Calculate the exact price based on your script length and requirements.</p>
          </div>
          <div className="p-6">
            <PricingCalculator />
          </div>
        </div>
      </div>
    </div>
  )
}
