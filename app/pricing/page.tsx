import { PricingPageCalculator } from "@/components/pricing-page-calculator"
// import { PricingPlans } from "@/components/pricing-plans"

export default function PricingPage() {
  return (
    <div className="container py-10 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Actor-Specific Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Select any of our 47 voice actors to see their individual pricing and calculate costs based on your project requirements.
        </p>
      </div>

      {/* Commented out plan sections as requested */}
      {/* <PricingPlans /> */}

      <div className="py-10">
        <div className="mx-auto max-w-5xl rounded-xl overflow-hidden border bg-card text-card-foreground shadow">
          <div className="bg-orange-500 p-6 text-white">
            <h2 className="text-2xl font-bold">Actor-Specific Price Calculator</h2>
            <p className="mt-2">Select an actor and calculate the exact price based on their individual rates and your project requirements.</p>
          </div>
          <div className="p-6">
            <PricingPageCalculator />
          </div>
        </div>
      </div>
    </div>
  )
}
