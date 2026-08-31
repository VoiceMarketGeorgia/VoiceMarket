"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Search, Menu } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { tr } = useLanguage();

  const routes = [
    {
      href: "/",
      label: tr("მთავარი", "Home"),
      active: pathname === "/",
    },
    {
      href: "/talents",
      label: tr("მსახიობები", "Voice actors"),
      active: pathname === "/talents",
    },

    {
      href: "/contact",
      label: tr("კონტაქტი", "Contact"),
      active: pathname === "/contact",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark className="h-7 w-7 text-orange-500" />
            <span className="hidden text-xl font-bold min-[380px]:inline">VoiceMarket</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                route.active ? "text-orange-500" : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <LanguageSwitcher />
          <ModeToggle />

          <Link href="/pricing">
            <Button className="hidden md:inline-flex bg-orange-500 hover:bg-orange-600">
              {tr("შეკვეთა", "Order")}
            </Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{tr("მენიუს გახსნა", "Open menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-orange-500",
                      route.active ? "text-orange-500" : "text-muted-foreground"
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
                <Link href="/pricing" onClick={() => setIsOpen(false)}>
                  <Button className="mt-4 w-full bg-orange-500 hover:bg-orange-600">
                    {tr("შეკვეთა", "Order")}
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
