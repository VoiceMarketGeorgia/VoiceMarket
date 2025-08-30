import { TalentProfile } from "@/components/talent-profile"

export default function TalentPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <TalentProfile id={params.id} />
    </div>
  )
}
