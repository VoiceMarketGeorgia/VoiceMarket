import { Button } from "@/components/ui/button";
import { Mic2, Radio, Film, BookOpen, Headphones, Tv2 } from "lucide-react";

export function OurServices() {
  const categories = [
    {
      icon: <Headphones className="h-6 w-6" />,
      name: "ავტომოპასუხე",
      description: "ხმოვანი პასუხი",
    },

    {
      icon: <Film className="h-6 w-6" />,

      name: "გახმოვანება",
      description: "ფილმები და სერიალები",
    },
    {
      icon: <Radio className="h-6 w-6" />,

      name: "პოდკასტები",
      description: "ინტერვიუები და სხვა",
    },
    {
      icon: <Mic2 className="h-6 w-6" />,
      name: "კომერციული",
      description: "სარეკლამო რგოლი",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      name: "აუდიოწიგნები",
      description: "ხმოვანი წიგნები",
    },

    {
      icon: <Tv2 className="h-6 w-6" />,
      name: "განათლება",
      description: "ტრენინგები და სხვა",
    },
  ];

  return (
    <section className="container">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          ჩვენი სერვისები
        </h2>
        <p className="mt-4 text-muted-foreground">
          იპოვეთ საუკეთესო ხმა თქვენი პროექტისთვის
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant="outline"
            className="h-auto flex flex-col items-center justify-center gap-2 p-6 hover:border-orange-500 hover:text-orange-500"
          >
            <div className="rounded-full bg-orange-500/10 p-3 text-orange-500">
              {category.icon}
            </div>
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-xs text-muted-foreground">
              {category.description}
            </p>
          </Button>
        ))}
      </div>
    </section>
  );
}
