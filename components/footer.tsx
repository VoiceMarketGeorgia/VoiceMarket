"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { BrandMark } from "@/components/brand-mark";

export function Footer() {
  const { tr } = useLanguage();
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:justify-items-center">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <BrandMark className="h-7 w-7 text-orange-500" />
              <span className="text-xl font-bold">VoiceMarket</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {tr(
                "იპოვე იდეალური ხმა შენი პროექტისთვის ჩვენი პროფესიონალი გახმოვანების მსახიობების შერჩეული კოლექციიდან",
                "Find the perfect voice for your project from our curated collection of professional voice actors."
              )}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">{tr("სოციალური მედია", "Social media")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://www.facebook.com/profile.php?id=61558226933771&mibextid=LQQJ4d"
                  className="flex items-center gap-2 text-muted-foreground hover:text-orange-500"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/voicemarket.ge/"
                  className="flex items-center gap-2 text-muted-foreground hover:text-orange-500"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Link>
              </li>
              {/* <li>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-muted-foreground hover:text-orange-500"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">{tr("კონტაქტი", "Contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{tr("ვაჟა-ფშაველას III კვარტალი, კორპუსი 23", "23 Vazha-Pshavela III Quarter")}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>voicemarket.ge@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(+995) 597 81 81 88</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VoiceMarket. {tr("ყველა უფლება დაცულია.", "All rights reserved.")}</p>
        </div>
      </div>
    </footer>
  );
}
