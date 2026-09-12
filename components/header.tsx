"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Search, Menu, Heart } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { useShortlist } from "@/hooks/use-shortlist";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { tr } = useLanguage();
  const { count } = useShortlist();

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
            <BrandMark className="h-8 w-8 text-gray-900 dark:text-white" />
            <span className="hidden text-xl font-bold min-[380px]:inline">
              Voice
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                market.ge
              </span>
            </span>
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

          {/* Marked voices (კალათა) */}
          <Link
            href="/shortlist"
            aria-label={tr("მონიშნული ხმები", "Marked voices")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-orange-500"
          >
            <Heart className={`h-5 w-5 ${count > 0 ? "fill-orange-500 text-orange-500" : ""}`} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

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
                <Link
                  href="/shortlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-orange-500"
                >
                  <Heart className={`h-4 w-4 ${count > 0 ? "fill-orange-500 text-orange-500" : ""}`} />
                  {tr("მონიშნული ხმები", "Marked voices")}
                  {count > 0 && (
                    <span className="rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                      {count}
                    </span>
                  )}
                </Link>
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
