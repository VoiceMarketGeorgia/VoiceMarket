import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="container">
      <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 md:p-10 lg:p-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
გსურთ იპოვოთ თქვენთვის სასურველი ხმა?
          </h2>
          <p className="mt-4 text-lg text-white/90">
შეუერთდით ასობით ბიზნესს, რომლებმაც იპოვეს მსახიობები ჩვენი
            პლატფორმის დახმარებით
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-white/90"
            >
მსახიობები
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hover:border-white text-white bg-white/10"
            >
კონტაქტი
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
