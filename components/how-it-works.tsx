import { Search, Headphones, CreditCard, CheckCircle } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-10 w-10" />,
      title: "ხმის არჩევა",
      description: "აირჩიეთ სასურველი მსახიობი თქვენი პროექტისთვის",
    },
    {
      icon: <Headphones className="h-10 w-10" />,
      title: "შეკვეთა",
      description: "შეკვეთის შემდეგ ხდება ხმის ავტორის ოპერატიული მობილიზება",
    },

    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: "ხმის ჩაწერა",
      description:
        "რამდენიმე ვერსიის ჩაწერა, სადაც აირჩევთ თქვენთვის სასურველს",
    },
    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: "ჩაბარება",
      description: "საბოლოო ვერსიის დასუფთავება, დამუშავება და ჩაბარება",
    },
  ];

  return (
    <section className="container">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          როგორ მუშაობს
        </h2>
        <p className="mt-4 text-muted-foreground p-3">
          სურვილის შემთხვევაში შეგიძლიათ დაესწროთ ჩაწერას და ცვლილება შეიტანოთ
          ხასიათში, ინტონაციასა თუ დეტალებში
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-orange-500/10 p-4 text-orange-500">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="mt-2 text-muted-foreground pl-6 pr-6  sm:pl-0 sm:pr-0">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
