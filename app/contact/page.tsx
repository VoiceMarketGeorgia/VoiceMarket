import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"

export default function ContactPage() {
  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">დაგვიკავშირდით</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          გაქვთ კითხვები ან გჭირდებათ დახმარება? ჩვენ ვართ აქ, რომ დაგეხმაროთ ჩვენი ხმოვანი მსახიობების ბაზარის შესახებ ნებისმიერ კითხვაში.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  )
}
