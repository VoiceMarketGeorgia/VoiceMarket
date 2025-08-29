"use client"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Heart,
  Share2,
  MessageCircle,
  Languages,
  Clock,
  DollarSign,
  ShoppingBag,
  ThumbsUp,
  Users,
  BarChart3,
  Calendar,
  Mic2,
  Headphones,
  BookOpen,
  FileText,
} from "lucide-react"
import { AudioPlayer } from "@/components/audio-player"

interface TalentProfileProps {
  id: string
}

export function TalentProfile({ id }: TalentProfileProps) {
  const [activeTab, setActiveTab] = useState("demos")

  // This would normally come from an API call using the id
  const talent = {
    id: id,
    name: "Alex Morgan",
    title: "Professional Voice Actor",
    image: "/placeholder.svg?height=600&width=400",
    coverImage: "/placeholder.svg?height=400&width=1200",
    bio: "With over 10 years of experience in voice acting, I specialize in commercial, narration, and character work. My voice has been described as warm, trustworthy, and versatile, making it perfect for a wide range of projects.",
    rating: 4.9,
    reviews: 124,
    languages: ["English", "Spanish"],
    price: "$150-$300",
    turnaround: "24-48 hours",
    categories: ["Commercial", "Narration", "Character", "E-Learning"],
    samples: [
      {
        id: "sample1",
        name: "Commercial Demo",
        category: "Commercial",
        url: "/demo-audio.mp3",
        icon: <Mic2 className="h-5 w-5" />,
        description: "Professional commercial voice over for TV, radio, and online advertisements.",
      },
      {
        id: "sample2",
        name: "Narration Demo",
        category: "Narration",
        url: "/demo-audio.mp3",
        icon: <Headphones className="h-5 w-5" />,
        description: "Engaging narration for documentaries, explainer videos, and corporate presentations.",
      },
      {
        id: "sample3",
        name: "Character Demo",
        category: "Character",
        url: "/demo-audio.mp3",
        icon: <BookOpen className="h-5 w-5" />,
        description: "Versatile character voices for animation, video games, and entertainment.",
      },
      {
        id: "sample4",
        name: "E-Learning Demo",
        category: "E-Learning",
        url: "/demo-audio.mp3",
        icon: <FileText className="h-5 w-5" />,
        description: "Clear and instructional voice for educational content and training materials.",
      },
    ],
    clients: ["Netflix", "Google", "Amazon", "Microsoft"],
    testimonials: [
      {
        text: "Alex was amazing to work with. Professional, quick, and the voice quality was exactly what we needed for our commercial.",
        author: "Jane Smith, Marketing Director",
        company: "TechCorp",
        rating: 5,
      },
      {
        text: "Incredible range and versatility. Alex delivered our narration project ahead of schedule and exceeded our expectations.",
        author: "Michael Brown, Producer",
        company: "MediaWorks",
        rating: 5,
      },
    ],
    stats: {
      completedProjects: 287,
      ongoingProjects: 3,
      satisfactionRate: 98,
      repeatClients: 76,
      memberSince: "January 2018",
      responseRate: 99,
      responseTime: "Under 2 hours",
      lastActive: "Today",
    },
  }

  return (
    <div className="space-y-8">
      <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden rounded-xl">
        <Image src={talent.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10">
          <div className="flex items-end gap-6">
            <div className="relative h-[120px] w-[120px] md:h-[150px] md:w-[150px] overflow-hidden rounded-xl border-4 border-background">
              <Image src={talent.image || "/placeholder.svg"} alt={talent.name} fill className="object-cover" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{talent.name}</h1>
              <p className="text-white/80">{talent.title}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-5 w-5 fill-orange-500 text-orange-500" />
                <span className="text-lg font-medium">{talent.rating}</span>
                <span className="text-white/80">({talent.reviews} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {talent.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Languages className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Languages</h3>
                    <p className="text-sm text-muted-foreground">{talent.languages.join(", ")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Turnaround Time</h3>
                    <p className="text-sm text-muted-foreground">{talent.turnaround}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Price Range</h3>
                    <p className="text-sm text-muted-foreground">{talent.price}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Stats</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <ShoppingBag className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-medium">Completed Projects</span>
                    </div>
                    <span className="font-bold">{talent.stats.completedProjects}</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-medium">Satisfaction Rate</span>
                    </div>
                    <span className="font-bold">{talent.stats.satisfactionRate}%</span>
                  </div>
                  <Progress value={talent.stats.satisfactionRate} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm font-medium">Repeat Clients</span>
                    </div>
                    <span className="font-bold">{talent.stats.repeatClients}</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Response Rate:</span>
                    <p className="font-medium">{talent.stats.responseRate}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response Time:</span>
                    <p className="font-medium">{talent.stats.responseTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current Projects:</span>
                    <p className="font-medium">{talent.stats.ongoingProjects}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Member Since:</span>
                    <p className="font-medium">{talent.stats.memberSince}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button className="w-full bg-orange-500 hover:bg-orange-600">Hire {talent.name.split(" ")[0]}</Button>
            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">{talent.bio}</p>
          </div>

          <Tabs defaultValue="demos" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="demos">Voice Demos</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="demos" className="space-y-6 pt-6">
              {talent.samples.map((sample) => (
                <Card key={sample.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="rounded-full bg-orange-500/10 p-3 text-orange-500">{sample.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{sample.name}</h3>
                        <p className="text-muted-foreground">{sample.description}</p>
                      </div>
                    </div>
                    <AudioPlayer audioUrl={sample.url} />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="stats" className="pt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Performance Statistics</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <ShoppingBag className="h-4 w-4 text-orange-500 mr-2" />
                            <span className="text-sm font-medium">Completed Projects</span>
                          </div>
                          <span className="font-bold">{talent.stats.completedProjects}</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 text-orange-500 mr-2" />
                            <span className="text-sm font-medium">Satisfaction Rate</span>
                          </div>
                          <span className="font-bold">{talent.stats.satisfactionRate}%</span>
                        </div>
                        <Progress value={talent.stats.satisfactionRate} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-orange-500 mr-2" />
                            <span className="text-sm font-medium">Repeat Clients</span>
                          </div>
                          <span className="font-bold">{talent.stats.repeatClients}</span>
                        </div>
                        <Progress value={76} className="h-2" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-3 flex items-center">
                          <BarChart3 className="h-4 w-4 text-orange-500 mr-2" />
                          Activity Metrics
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Response Rate:</span>
                            <span className="font-medium">{talent.stats.responseRate}%</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Response Time:</span>
                            <span className="font-medium">{talent.stats.responseTime}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Current Projects:</span>
                            <span className="font-medium">{talent.stats.ongoingProjects}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Last Active:</span>
                            <span className="font-medium">{talent.stats.lastActive}</span>
                          </li>
                        </ul>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-3 flex items-center">
                          <Calendar className="h-4 w-4 text-orange-500 mr-2" />
                          Account Information
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Member Since:</span>
                            <span className="font-medium">{talent.stats.memberSince}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Verification:</span>
                            <span className="font-medium text-green-500">Verified</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {talent.clients.map((client) => (
                  <div
                    key={client}
                    className="flex items-center justify-center rounded-lg border p-6 h-24 hover:border-orange-500 transition-colors"
                  >
                    <span className="font-medium">{client}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 pt-6">
              {talent.testimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{testimonial.author}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full">
                View All Reviews
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
