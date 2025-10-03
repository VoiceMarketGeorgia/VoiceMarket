import { AllTalents } from "@/components/all-talents"

// Force dynamic rendering to avoid SSR issues with window object
export const dynamic = 'force-dynamic'

export default function TalentsPage() {
  return <AllTalents />
}
