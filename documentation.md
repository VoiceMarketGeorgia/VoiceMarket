# VoiceMarket.ge - Project Documentation

## Project Overview

VoiceMarket.ge is a modern voice talent marketplace built with Next.js 14, TypeScript, and Tailwind CSS. The platform connects clients with professional voice actors in Georgia, providing a comprehensive solution for finding, auditioning, and hiring voice talent for various projects.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **UI Components**: Radix UI + Custom shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Form Handling**: React Hook Form + Zod validation
- **Audio**: HTML5 Audio API
- **Theme**: Dark/Light mode support with next-themes

## Folder Structure

```
VoiceMarket/
├── app/                          # Next.js App Router pages
│   ├── contact/                  # Contact page
│   │   └── page.tsx             # Contact form and info
│   ├── pricing/                  # Pricing page
│   │   └── page.tsx             # Pricing plans and calculator
│   ├── talents/                  # Voice talents section
│   │   ├── [id]/                # Dynamic talent profile pages
│   │   │   └── page.tsx         # Individual talent profile
│   │   └── page.tsx             # Talent directory/listing
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with header/footer
│   └── page.tsx                 # Homepage
├── components/                   # Reusable React components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   │   ├── accordion.tsx        # Collapsible content
│   │   ├── alert-dialog.tsx     # Modal dialogs
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card container
│   │   ├── input.tsx            # Input fields
│   │   ├── select.tsx           # Dropdown select
│   │   ├── slider.tsx           # Range slider
│   │   ├── textarea.tsx         # Text area
│   │   └── [other ui components]
│   ├── audio-play-button.tsx    # Audio play/pause button
│   ├── audio-player.tsx         # Full-featured audio player
│   ├── call-to-action.tsx       # CTA sections
│   ├── categories.tsx           # Voice category browser
│   ├── contact-form.tsx         # Contact form component
│   ├── contact-info.tsx         # Contact information display
│   ├── featured-talents.tsx     # Featured voice talents showcase
│   ├── footer.tsx               # Site footer
│   ├── header.tsx               # Site navigation header
│   ├── hero-section.tsx         # Homepage hero section
│   ├── how-it-works.tsx         # Process explanation
│   ├── mode-toggle.tsx          # Dark/light theme toggle
│   ├── pricing-calculator.tsx   # Dynamic pricing calculator
│   ├── pricing-plans.tsx        # Pricing plans display
│   ├── random-voice-finder.tsx  # Random talent discovery feature
│   ├── talent-directory.tsx     # Talent listing with filters
│   ├── talent-filters.tsx       # Filtering controls
│   ├── talent-profile.tsx       # Individual talent profile
│   ├── testimonials.tsx         # Client testimonials
│   ├── theme-provider.tsx       # Theme context provider
│   └── voice-carousel.tsx       # Featured voices carousel
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
├── lib/                         # Utility functions
│   └── utils.ts                 # Common utilities (cn function)
├── public/                      # Static assets
│   ├── placeholder-logo.png     # Logo placeholder
│   ├── placeholder-logo.svg     # SVG logo placeholder
│   ├── placeholder-user.jpg     # User avatar placeholder
│   ├── placeholder.jpg          # General image placeholder
│   └── placeholder.svg          # SVG image placeholder
├── styles/                      # Additional styles
│   └── globals.css              # Duplicate global styles
├── components.json              # shadcn/ui configuration
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Key Features & Components

### 1. Homepage (`app/page.tsx`)
- **Hero Section**: Search interface with popular categories
- **Random Voice Finder**: Interactive talent discovery
- **Voice Carousel**: Featured talents with audio samples
- **Categories**: Browse by project type
- **Featured Talents**: Top-rated voice actors
- **How It Works**: Process explanation
- **Testimonials**: Client reviews
- **Call to Action**: Contact prompts

### 2. Voice Talents Directory (`app/talents/page.tsx`)
- **Talent Listing**: Grid of voice actors with filtering
- **Search & Filters**: By language, category, gender, price
- **Audio Samples**: Preview voice recordings
- **Sorting Options**: By rating, price, reviews
- **Pagination**: Browse through results

### 3. Individual Talent Profiles (`app/talents/[id]/page.tsx`)
- **Profile Header**: Cover image, avatar, basic info
- **Tabbed Interface**: Demos, Statistics, Clients, Reviews
- **Audio Samples**: Category-specific voice demonstrations
- **Performance Metrics**: Completion rate, satisfaction, etc.
- **Client Testimonials**: Reviews and ratings
- **Hire/Contact Actions**: Direct hiring options

### 4. Pricing Page (`app/pricing/page.tsx`)
- **Pricing Plans**: Three-tier pricing structure
- **Dynamic Calculator**: Custom quote based on script length
- **Feature Comparison**: What's included in each plan
- **Add-ons**: Background music, sound effects, etc.

### 5. Contact Page (`app/contact/page.tsx`)
- **Contact Form**: Multi-field form with validation
- **Contact Information**: Business details and location
- **Subject Categories**: Organized inquiry types

## Mock Data Locations

**⚠️ IMPORTANT: All data in this application is currently mock data and needs to be replaced with real content and API connections.**

### 1. Voice Talents Data

#### `components/featured-talents.tsx` (Lines 15-73)
```typescript
const talents = [
  {
    id: "01",
    name: "Alex Morgan",
    image: "/placeholder.svg?height=400&width=300",
    samples: [
      { id: "sample1", name: "Commercial", url: "/demo-audio.mp3" },
      // ... more samples
    ],
    rating: 4.9,
    reviews: 124,
    languages: ["English", "Spanish"],
    tags: ["Commercial", "Narration"],
  },
  // ... 3 more talent objects
]
```

#### `components/talent-directory.tsx` (Lines 38-142)
```typescript
const talents = [
  {
    id: "01",
    name: "Alex Morgan",
    image: "/placeholder.svg?height=400&width=300",
    samples: [...],
    rating: 4.9,
    reviews: 124,
    languages: ["English", "Spanish"],
    categories: ["Commercial", "Narration"],
    gender: "Male",
    price: 250,
    tags: ["Commercial", "Narration"],
  },
  // ... 5 more talent objects with full filtering data
]
```

#### `components/talent-profile.tsx` (Lines 37-109)
```typescript
const talent = {
  id: id,
  name: "Alex Morgan",
  title: "Professional Voice Actor",
  image: "/placeholder.svg?height=600&width=400",
  coverImage: "/placeholder.svg?height=400&width=1200",
  bio: "With over 10 years of experience...",
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
      description: "Professional commercial voice over...",
    },
    // ... 3 more samples
  ],
  clients: ["Netflix", "Google", "Amazon", "Microsoft"],
  testimonials: [...],
  stats: {
    completedProjects: 287,
    ongoingProjects: 3,
    satisfactionRate: 98,
    // ... more stats
  },
}
```

#### `components/voice-carousel.tsx` (Lines 23-60)
```typescript
const talents: VoiceTalent[] = [
  {
    id: "01",
    name: "Alex Morgan",
    image: "/placeholder.svg?height=400&width=300",
    samples: [
      { id: "sample1", name: "Commercial Demo", url: "#" },
      { id: "sample2", name: "Narration Demo", url: "#" },
    ],
  },
  // ... 3 more talent objects
]
```

#### `components/random-voice-finder.tsx` (Lines 26-62)
```typescript
const voiceTalents: VoiceTalent[] = [
  {
    id: "01",
    name: "Alex Morgan",
    image: "/placeholder.svg?height=400&width=300",
    sample: "#", // Audio URL
    description: "Warm, authoritative male voice perfect for commercials...",
  },
  // ... 4 more talent objects
]
```

### 2. Testimonials Data

#### `components/testimonials.tsx` (Lines 6-28)
```typescript
const testimonials = [
  {
    quote: "We found the perfect voice for our commercial...",
    author: "Sarah Johnson",
    role: "Marketing Director, TechCorp",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  // ... 2 more testimonials
]
```

### 3. Categories Data

#### `components/categories.tsx` (Lines 5-36)
```typescript
const categories = [
  {
    icon: <Mic2 className="h-6 w-6" />,
    name: "Commercial",
    description: "TV, radio & online ads",
  },
  // ... 5 more categories
]
```

### 4. Pricing Data

#### `components/pricing-plans.tsx` (Lines 5-43)
```typescript
const plans = [
  {
    name: "Basic",
    price: "$99",
    description: "Perfect for small projects...",
    features: ["Up to 150 words", "1 voice talent", ...],
    popular: false,
  },
  // ... 2 more pricing plans
]
```

#### `components/pricing-calculator.tsx` (Lines 22-30)
```typescript
// Pricing constants that need to be configurable
const BASE_PRICE = 50
const PRICE_PER_WORD = 0.1
const FREE_WORD_LIMIT = 100
const EXPRESS_DELIVERY_FEE = 50
const BACKGROUND_MUSIC_FEE = 30
const SOUND_EFFECTS_FEE = 40
const REVISION_PRICE = 15
```

### 5. Navigation & Content Data

#### `components/header.tsx` (Lines 16-37)
```typescript
const routes = [
  { href: "/", label: "Home", active: pathname === "/" },
  { href: "/talents", label: "Voice Talents", active: pathname === "/talents" },
  { href: "/pricing", label: "Pricing", active: pathname === "/pricing" },
  { href: "/contact", label: "Contact", active: pathname === "/contact" },
]
```

### 6. Form Options Data

#### `components/contact-form.tsx` (Lines 79-85)
```typescript
// Contact form subject options
<SelectContent>
  <SelectItem value="general">General Inquiry</SelectItem>
  <SelectItem value="support">Customer Support</SelectItem>
  <SelectItem value="billing">Billing Question</SelectItem>
  <SelectItem value="partnership">Partnership Opportunity</SelectItem>
  <SelectItem value="talent">Becoming a Voice Talent</SelectItem>
</SelectContent>
```

## Audio Files & Media

### Missing Audio Files
All audio sample URLs currently point to:
- `/demo-audio.mp3` - This file doesn't exist
- `#` - Placeholder URLs in some components

### Image Placeholders
All images currently use placeholder URLs:
- `/placeholder.svg` - Generic image placeholder
- `/placeholder.jpg` - Photo placeholder
- `/placeholder-user.jpg` - User avatar placeholder
- `/placeholder-logo.svg` - Logo placeholder

## What Needs to Be Changed

### 1. Replace Mock Data with Real Data
- **Voice Talents**: Create a database/API for talent profiles
- **Audio Samples**: Upload real voice recordings
- **Images**: Replace all placeholder images with real photos
- **Testimonials**: Add genuine client reviews
- **Pricing**: Configure actual pricing structure

### 2. Implement Backend Integration
- **API Routes**: Create Next.js API routes or external API
- **Database**: Set up database for talents, projects, users
- **Authentication**: Add user login/registration system
- **File Upload**: Implement audio/image upload functionality
- **Payment Processing**: Integrate payment gateway

### 3. Dynamic Content Loading
- Replace hardcoded arrays with API calls
- Implement proper data fetching (React Query/SWR)
- Add loading states and error handling
- Implement search and filtering backend

### 4. Content Management
- Add admin panel for managing talents
- Implement content management system
- Add ability to update pricing dynamically
- Enable talent profile self-management

### 5. Functional Features
- **Audio Player**: Connect to real audio files
- **Contact Form**: Implement actual email sending
- **Search**: Add real search functionality
- **Filters**: Connect to backend filtering
- **Booking System**: Implement talent hiring workflow

## Environment Setup

### Dependencies
Key packages used (from `package.json`):
- `next`: 14.2.16 - React framework
- `react`: ^18 - UI library
- `typescript`: ^5 - Type safety
- `tailwindcss`: ^3.4.17 - Styling
- `framer-motion`: latest - Animations
- `@radix-ui/*`: UI primitives
- `lucide-react`: ^0.454.0 - Icons
- `react-hook-form`: ^7.54.1 - Forms
- `zod`: ^3.24.1 - Validation

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint checking

## File Configuration

### `tailwind.config.js`
- Custom orange color scheme (`#ff5500`, `#e64d00`)
- Dark mode support
- Custom container settings
- Extended animations

### `next.config.mjs`
- Basic Next.js configuration
- TypeScript enabled

### `components.json`
- shadcn/ui configuration
- Component path aliases
- Tailwind config integration

## Deployment Considerations

### Current State
The application is a static frontend with no backend functionality. To make it production-ready:

1. **Backend Setup**: Database, API, authentication
2. **Content Management**: Admin interface for content updates
3. **Media Storage**: CDN for audio files and images
4. **Payment Integration**: Stripe/PayPal for transactions
5. **Email Service**: For contact forms and notifications
6. **Analytics**: User behavior tracking
7. **SEO**: Meta tags, sitemap, structured data

### Live Site
Current deployment: [https://voicemarket.ge](https://voicemarket.ge)

---

**Note**: This documentation reflects the current state of the codebase. All data is currently mock data and the application serves as a frontend prototype that needs backend integration to become fully functional.

