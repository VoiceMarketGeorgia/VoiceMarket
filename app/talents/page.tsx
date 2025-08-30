import { TalentDirectory } from "@/components/talent-directory"
import { TalentFilters } from "@/components/talent-filters"

export default function TalentsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Voice Talent Directory</h1>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <TalentFilters />
        <TalentDirectory />
      </div>
    </div>
  )
}
