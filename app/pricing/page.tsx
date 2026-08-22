"use client";

import { PricingPageCalculator } from "@/components/pricing-page-calculator";
import { useLanguage } from "@/components/language-provider";
// import { PricingPlans } from "@/components/pricing-plans"

export default function PricingPage() {
  const { tr } = useLanguage();
  return (
    <div className="container py-10 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {tr("მსახიობების ინდივიდუალური ფასები", "Individual voice actor pricing")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {tr(
            "აირჩიეთ მსახიობი, ნახეთ ინდივიდუალური ტარიფები და გამოთვალეთ თქვენი პროექტის ღირებულება.",
            "Choose a voice actor, review their individual rates, and calculate the cost of your project."
          )}
        </p>
      </div>

      {/* Commented out plan sections as requested */}
      {/* <PricingPlans /> */}

      <div className="py-10">
        <div className="mx-auto max-w-5xl rounded-xl overflow-hidden border bg-card text-card-foreground shadow">
          <div className="bg-orange-500 p-6 text-white">
            <h2 className="text-2xl font-bold">
              {tr("მსახიობის ფასის კალკულატორი", "Voice actor price calculator")}
            </h2>
            <p className="mt-2">
              {tr(
                "აირჩიეთ მსახიობი და გამოთვალეთ ფასი მისი ტარიფებისა და თქვენი პროექტის მოთხოვნების მიხედვით.",
                "Choose a voice actor and calculate a price based on their rates and your project requirements."
              )}
            </p>
          </div>
          <div className="p-6">
            <PricingPageCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}
