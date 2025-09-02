import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Globe2 } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">საკონტაქტო ინფორმაცია</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">მისამართი</h3>
                <p className="text-sm text-muted-foreground">
                  ვაჟა ფშაველას III კვარტალი, კორპუსი 23
                  <br />
                  თბილისი, საქართველო
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">ტელეფონი</h3>
                <p className="text-sm text-muted-foreground">(+995) 597 81 81 88</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">ელ-ფოსტა</h3>
                <p className="text-sm text-muted-foreground">voicemarket.ge@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">სამუშაო საათები</h3>
                <p className="text-sm text-muted-foreground">
                  ორშაბათი - პარასკევი: 10:00 - 19:00
                  <br />
                  შაბათი: 10:00 - 15:00
                  <br />
                  კვირა: დახურულია
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe2 className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">მხარდაჭერა</h3>
                <p className="text-sm text-muted-foreground">
                  ჩვენ გვაქვს მხარდაჭერა ქართულად და ინგლისურად, რომ ვმსახუროთ ჩვენი კლიენტები პროფესიონალური გახმოვანების სერვისებით.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            {/* In a real implementation, you would use a proper map component or embed a Google Map */}
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">ინტერაქტიული რუკა იქნება აქ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
