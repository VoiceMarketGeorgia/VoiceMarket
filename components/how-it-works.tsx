"use client";

import {
  AlertTriangle,
  Calculator,
  CheckCircle,
  Headphones,
  Mic,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function HowItWorks() {
  const { tr } = useLanguage();

  const steps = [
    {
      icon: <Search className="h-10 w-10" />,
      title: tr("ხმის არჩევა", "Choose a voice"),
      description: tr(
        "მოუსმინე ხმების ნიმუშებს და შეარჩიე შენი პროექტისთვის შესაფერისი ტემბრი, ხასიათი და სტილი.",
        "Listen to the samples and pick the timbre, character and style that fit your project."
      ),
      note: null,
    },
    {
      icon: <Headphones className="h-10 w-10" />,
      title: tr("შეკვეთა", "Place an order"),
      description: tr(
        "შეკვეთის შემდეგ ხდება ხმის ავტორის ოპერატიული მობილიზება. ჩვენ ვიზრუნებთ, რომ საბოლოო შედეგი ზუსტად შეესაბამებოდეს შენს იდეას.",
        "Once ordered, the voice actor is scheduled promptly. We make sure the final result matches your idea exactly."
      ),
      note: null,
    },
    {
      icon: <Mic className="h-10 w-10" />,
      title: tr("ხმის ჩაწერა", "Recording"),
      description: tr(
        "ვწერთ რამდენიმე ვერსიას, შენ კი ირჩევ შენთვის სასურველს.",
        "We record several takes and you choose the one you want."
      ),
      note: tr(
        "სურვილის შემთხვევაში შეგიძლიათ დაესწროთ ჩაწერას და ცვლილება შეიტანოთ ხასიათში, ინტონაციასა თუ დეტალებში.",
        "You are welcome to attend the session and adjust the character, intonation or details."
      ),
    },
    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: tr("ჩაბარება", "Delivery"),
      description: tr(
        "დაბალანსებულ, მაღალხარისხიან მასალას მიიღებ შეთანხმებულ ვადაში.",
        "You receive balanced, high-quality material within the agreed deadline."
      ),
      note: null,
    },
  ];

  return (
    <section className="container">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {tr("როგორ მუშაობს", "How it works")}
        </h2>
        <div className="mt-4 flex items-center justify-center">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-orange-500" />
          <div className="mx-2 h-1 w-1 rounded-full bg-orange-500" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-orange-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="relative mb-4 rounded-full bg-orange-500/10 p-4 text-orange-500">
              {step.icon}
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {index + 1}
              </span>
            </div>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="mt-2 px-4 text-muted-foreground sm:px-0">
              {step.description}
            </p>
            {step.note && (
              <p className="mt-2 px-4 text-sm italic text-muted-foreground/80 sm:px-0">
                ({step.note})
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pricing explainer */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-6 dark:border-orange-900/60 dark:bg-orange-950/20">
          <div className="mb-3 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-bold">{tr("გამოთვალე ფასი", "Estimate the price")}</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tr(
              "ფასის კალკულატორი დაგეხმარებათ განსაზღვროთ სავარაუდო ღირებულება. თუმცა საბოლოო ფასი დამოკიდებულია მსახიობის არჩევანზე, ტექსტის მოცულობაზე, პროექტის სირთულესა და გამოყენების პირობებზე.",
              "The price calculator helps you work out an estimate. The final price depends on the chosen actor, the length of the script, the complexity of the project and the usage terms."
            )}
          </p>
          <p className="mt-2 text-sm text-muted-foreground/80">
            {tr(
              "(დიდი პროექტებისთვის ფასი ინდივიდუალურად განისაზღვრება)",
              "(Pricing for large projects is agreed individually.)"
            )}
          </p>
          <Link href="/pricing">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
              {tr("გამოთვალე ფასი", "Estimate the price")}
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-bold">{tr("შენიშვნა", "Please note")}</h3>
          </div>
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
              <span>
                {tr(
                  "დამკვეთის მიერ დამტკიცებულ ტექსტში შემდგომი ცვლილება ან დამატება საჭიროებს განმეორებით ჩაწერას და ექვემდებარება დამატებით ანაზღაურებას.",
                  "Changes or additions to a script the client has already approved require a re-record and are charged separately."
                )}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
              <span>
                {tr(
                  "მსახიობის ან სტუდიის მხრიდან დაშვებული შეცდომის შემთხვევაში განმეორებითი ჩაწერა დამატებით საფასურს არ ითვალისწინებს.",
                  "If the mistake is ours - the actor's or the studio's - the re-record is free of charge."
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
