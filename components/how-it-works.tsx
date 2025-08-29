import { Search, Headphones, CreditCard, CheckCircle } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-10 w-10" />,
      title: "Search",
      description: "Browse our curated selection of professional voice actors",
    },
    {
      icon: <Headphones className="h-10 w-10" />,
      title: "Listen",
      description: "Preview voice samples to find your perfect match",
    },
    {
      icon: <CreditCard className="h-10 w-10" />,
      title: "Hire",
      description: "Book your chosen talent directly through our platform",
    },
    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: "Receive",
      description: "Get your high-quality voice recording delivered on time",
    },
  ]

  return (
    <section className="container">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
        <p className="mt-4 text-muted-foreground">Find and hire the perfect voice talent in just a few simple steps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-orange-500/10 p-4 text-orange-500">{step.icon}</div>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="mt-2 text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
