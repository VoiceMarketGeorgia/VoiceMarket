import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PricingPlans() {
  const plans = [
    {
      name: "Basic",
      price: "$99",
      description: "Perfect for small projects and quick turnarounds.",
      features: ["Up to 150 words", "1 voice talent", "Commercial license", "1 revision", "48-hour delivery"],
      popular: false,
    },
    {
      name: "Professional",
      price: "$199",
      description: "Ideal for medium-sized projects requiring more flexibility.",
      features: [
        "Up to 500 words",
        "2 voice talent options",
        "Commercial license",
        "2 revisions",
        "24-hour delivery",
        "Background music options",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "$349",
      description: "Complete solution for professional and complex projects.",
      features: [
        "Up to 1000 words",
        "3 voice talent options",
        "Commercial license",
        "Unlimited revisions",
        "12-hour delivery",
        "Background music included",
        "Sound effects included",
        "Professional mixing",
      ],
      popular: false,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden ${
            plan.popular ? "border-orange-500 shadow-orange-500/20 shadow-lg" : ""
          }`}
        >
          {plan.popular && (
            <div className="absolute top-0 right-0">
              <div className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">Most Popular</div>
            </div>
          )}
          <div className="p-6">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className="ml-1 text-muted-foreground">/project</span>
            </div>
            <p className="mt-2 text-muted-foreground">{plan.description}</p>
          </div>
          <div className="p-6 bg-muted/50">
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-4 w-4 text-orange-500 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`mt-6 w-full ${plan.popular ? "bg-orange-500 hover:bg-orange-600" : ""}`}
              variant={plan.popular ? "default" : "outline"}
            >
              Choose {plan.name}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
