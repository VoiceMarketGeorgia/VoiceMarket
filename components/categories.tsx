import { Button } from "@/components/ui/button"
import { Mic2, Radio, Film, BookOpen, Headphones, Tv2 } from "lucide-react"

export function Categories() {
  const categories = [
    {
      icon: <Mic2 className="h-6 w-6" />,
      name: "Commercial",
      description: "TV, radio & online ads",
    },
    {
      icon: <Radio className="h-6 w-6" />,
      name: "Narration",
      description: "Documentaries & explainers",
    },
    {
      icon: <Film className="h-6 w-6" />,
      name: "Animation",
      description: "Characters & cartoons",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      name: "Audiobooks",
      description: "Fiction & non-fiction",
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      name: "Podcasts",
      description: "Intros & segments",
    },
    {
      icon: <Tv2 className="h-6 w-6" />,
      name: "E-Learning",
      description: "Educational content",
    },
  ]

  return (
    <section className="container">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse by Category</h2>
        <p className="mt-4 text-muted-foreground">Find the perfect voice for any project type</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant="outline"
            className="h-auto flex flex-col items-center justify-center gap-2 p-6 hover:border-orange-500 hover:text-orange-500"
          >
            <div className="rounded-full bg-orange-500/10 p-3 text-orange-500">{category.icon}</div>
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-xs text-muted-foreground">{category.description}</p>
          </Button>
        ))}
      </div>
    </section>
  )
}
