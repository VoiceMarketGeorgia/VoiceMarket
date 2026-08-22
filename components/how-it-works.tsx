"use client";

import { Search, Headphones, CreditCard, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function HowItWorks() {
  const { tr } = useLanguage();
  const steps = [
    {
      icon: <Search className="h-10 w-10" />,
      title: tr("ხმის არჩევა", "Choose a voice"),
      description: tr("აირჩიეთ სასურველი მსახიობი თქვენი პროექტისთვის", "Choose the right voice actor for your project"),
    },
    {
      icon: <Headphones className="h-10 w-10" />,
      title: tr("შეკვეთა", "Place an order"),
      description: tr("შეკვეთის შემდეგ ხდება ხმის ავტორის ოპერატიული მობილიზება", "Once ordered, the voice actor is scheduled promptly"),
    },

    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: tr("ხმის ჩაწერა", "Record"),
      description: tr("რამდენიმე ვერსიის ჩაწერა, სადაც აირჩევთ თქვენთვის სასურველს", "We record multiple takes so you can choose your favorite"),
    },
    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: tr("ჩაბარება", "Delivery"),
      description: tr("საბოლოო ვერსიის დასუფთავება, დამუშავება და ჩაბარება", "We clean, process, and deliver the final version"),
    },
  ];

  return (
    <section className="container">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {tr("როგორ მუშაობს", "How it works")}
        </h2>
        <p className="mt-4 text-muted-foreground p-3">
          {tr(
            "სურვილის შემთხვევაში შეგიძლიათ დაესწროთ ჩაწერას და ცვლილება შეიტანოთ ხასიათში, ინტონაციასა თუ დეტალებში",
            "You can attend the recording session and guide the character, intonation, and details."
          )}
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
