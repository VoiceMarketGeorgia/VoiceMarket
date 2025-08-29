import Link from "next/link"
import { Mic2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Mic2 className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold">VoiceMarket</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find the perfect voice for your project from our curated selection of professional voice actors.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">For Clients</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Find Voice Actors
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">For Voice Actors</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Join as Talent
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Find Work
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-orange-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VoiceMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
