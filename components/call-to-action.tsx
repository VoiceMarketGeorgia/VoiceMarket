"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function CallToAction() {
  const { tr } = useLanguage();
  return (
    <section className="container">
      <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 md:p-10 lg:p-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {tr("გსურთ იპოვოთ თქვენთვის სასურველი ხმა?", "Ready to find the right voice?")}
          </h2>
          <p className="mt-4 text-lg text-white/90">
            {tr(
              "შეუერთდით ასობით ბიზნესს, რომლებმაც იპოვეს მსახიობები ჩვენი პლატფორმის დახმარებით",
              "Join hundreds of businesses that found their voice actors through our platform."
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/talents">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-white/90"
              >
                {tr("მსახიობები", "Voice actors")}
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="hover:border-white text-white bg-white/10"
              >
                {tr("კონტაქტი", "Contact")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
