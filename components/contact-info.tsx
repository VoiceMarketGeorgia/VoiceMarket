"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Globe2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useLanguage } from "@/components/language-provider";

function MapLoading() {
  const { tr } = useLanguage();
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <p className="text-muted-foreground">{tr("რუკის ჩატვირთვა...", "Loading map...")}</p>
    </div>
  );
}

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic<{ position: { lat: number; lng: number } }>(
  () => import("./map"),
  {
    ssr: false,
    loading: () => <MapLoading />,
  }
);

export function ContactInfo() {
  const { tr } = useLanguage();
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
          <h2 className="text-2xl font-bold mb-6">{tr("საკონტაქტო ინფორმაცია", "Contact information")}</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">{tr("მისამართი", "Address")}</h3>
                <p className="text-sm text-muted-foreground">
                  {tr("ვაჟა-ფშაველას III კვარტალი, კორპუსი 23", "23 Vazha-Pshavela III Quarter")}
                  <br />
                  {tr("თბილისი, საქართველო", "Tbilisi, Georgia")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">{tr("ტელეფონი", "Phone")}</h3>
                <p className="text-sm text-muted-foreground">
                  (+995) 597 81 81 88
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">{tr("ელ-ფოსტა", "Email")}</h3>
                <p className="text-sm text-muted-foreground">
                  voicemarket.ge@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium">{tr("სამუშაო საათები", "Business hours")}</h3>
                <p className="text-sm text-muted-foreground">
                  {tr("ორშაბათი – პარასკევი: 10:00 – 19:00", "Monday – Friday: 10:00 – 19:00")}
                  <br />
                  {tr("შაბათი: 10:00 – 15:00", "Saturday: 10:00 – 15:00")}
                  <br />
                  {tr("კვირა: დახურულია", "Sunday: Closed")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe2 className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">{tr("ჩვენ შესახებ", "About us")}</h3>
                <p className="text-sm text-muted-foreground">
                  {tr(
                    "„VoiceMarket“ შეიქმნა 15-წლიანი გამოცდილებისა და ქართულ ბაზარზე გახმოვანების მზარდი მოთხოვნის საფუძველზე. ჩვენ ერთ სივრცეში ვაკავშირებთ პროფესიონალ ხმებს სხვადასხვა მიზნისთვის. ხმის მსახიობების, რეჟისორებისა და უმაღლესი ხარისხის ტექნიკური აღჭურვილობის დახმარებით თქვენს მოთხოვნას ოპერატიულად შევასრულებთ.",
                    "VoiceMarket grew from 15 years of experience and strong demand for voice-over services in Georgia. We bring professional voices together for every kind of project. Our voice actors, directors, and high-quality technical equipment help us deliver your request quickly and professionally."
                  )}
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
