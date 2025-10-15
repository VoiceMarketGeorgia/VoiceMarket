"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Globe2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic<{ position: { lat: number; lng: number } }>(
  () => import("./map"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">რუკის ჩატვირთვა...</p>
      </div>
    ),
  }
);

export function ContactInfo() {
  const position = useMemo(
    () => ({
      lat: 41.72794,
      lng: 44.74566,
    }),
    []
  );

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
                <p className="text-sm text-muted-foreground">
                  (+995) 597 81 81 88
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">ელ-ფოსტა</h3>
                <p className="text-sm text-muted-foreground">
                  voicemarket.ge@gmail.com
                </p>
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
              <Globe2 className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">ჩვენ შესახებ</h3>
                <p className="text-sm text-muted-foreground">
                “VoiceMarket” გაჩნდა 15 წლიანი გამოცდილების და ქართულ ბაზარზე გახმოვანების მასიური მოთხოვნის საფუძველზე. ჩვენ ერთ სივრცეში ვაკავშირებთ ყველა პროფესიონალ ხმას სხვადასხვა მიზნებისთვის.
                 ხმის ავტორების, რეჟისორებისა და უმაღლესი ხარისხის ტექნიკური აჭურვილობის საშუალებით , თქვენი ნებისმიერი მოთხოვნა ოპერატიულად დაკმაყოფილდება.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <MapComponent position={position} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
