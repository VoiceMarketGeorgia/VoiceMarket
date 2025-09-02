import { PricingPageCalculator } from "@/components/pricing-page-calculator"
// import { PricingPlans } from "@/components/pricing-plans"

export default function PricingPage() {
  return (
    <div className="container py-10 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">მსახიობების ინდივიდუალური ფასები</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          აირჩიეთ ჩვენი 47 ხმოვანი მსახიობიდან ნებისმიერი, რათა ნახოთ მათი ინდივიდუალური ფასები და გამოთვალოთ ღირებულება თქვენი პროექტის მოთხოვნების შესაბამისად.
        </p>
      </div>

      {/* Commented out plan sections as requested */}
      {/* <PricingPlans /> */}

      <div className="py-10">
        <div className="mx-auto max-w-5xl rounded-xl overflow-hidden border bg-card text-card-foreground shadow">
          <div className="bg-orange-500 p-6 text-white">
            <h2 className="text-2xl font-bold">მსახიობის ინდივიდუალური ფასების კალკულატორი</h2>
            <p className="mt-2">აირჩიეთ მსახიობი და გამოთვალეთ ზუსტი ფასი მათი ინდივიდუალური ტარიფების და თქვენი პროექტის მოთხოვნების შესაბამისად.</p>
          </div>
          <div className="p-6">
            <PricingPageCalculator />
          </div>
        </div>
      </div>
    </div>
  )
}
