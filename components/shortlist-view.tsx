"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Download, Link2, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceCard, type AudioSample, type Talent } from "@/components/voice-card";
import {
  getAllAudioCategories,
  getAllVoiceActors,
  convertToTalent,
} from "@/lib/supabase-queries";
import { useLanguage } from "@/components/language-provider";
import { ListenAllButton } from "@/components/listen-all-button";
import {
  buildAudioCategoryMap,
  getCategoryIconName,
  getIconElement,
} from "@/lib/category-icons";
import { localizeAudioName } from "@/lib/audio-labels";
import { parseShortlistParam, useShortlist } from "@/hooks/use-shortlist";

/** Turn a sample name into something safe for a file system. */
function toFileName(actorId: string, sampleName: string) {
  const safe = sampleName.replace(/[\\/:*?"<>|]/g, "-").trim();
  return `VoiceMarket-${actorId.padStart(2, "0")}-${safe}.mp3`;
}

/**
 * Fetch to a blob so the file is saved rather than opened in a new tab - the
 * `download` attribute alone is ignored for cross-origin URLs.
 */
async function downloadSample(url: string, fileName: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (downloadError) {
    console.error("Unable to download the sample, opening it instead:", downloadError);
    window.open(url, "_blank", "noopener");
  }
}

export function ShortlistView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tr } = useLanguage();
  const { ids, clear, replace } = useShortlist();

  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // A link with `?ids=` wins over the local list: that is how someone opens a
  // colleague's selection without having marked anything themselves.
  const sharedIds = useMemo(
    () => parseShortlistParam(searchParams.get("ids")),
    [searchParams]
  );
  const isShared = sharedIds.length > 0;
  const activeIds = isShared ? sharedIds : ids;

  useEffect(() => {
    let cancelled = false;

    async function loadTalents() {
      try {
        setLoading(true);
        setError(false);
        const [actors, audioCategories] = await Promise.all([
          getAllVoiceActors(),
          getAllAudioCategories(),
        ]);
        const categoryIconMap = buildAudioCategoryMap(audioCategories);
        const converted = actors.map((actor) => {
          const talent = convertToTalent(actor, categoryIconMap);
          return {
            id: talent.id,
            name: talent.name,
            image: talent.image,
            gradient: talent.gradient,
            pricing: talent.pricing,
            samples: talent.samples.map((sample: AudioSample) => ({
              ...sample,
              icon: getIconElement(
                getCategoryIconName(sample.category, sample.iconName),
                { className: "h-4 w-4" }
              ),
            })),
          } as Talent;
        });
        if (!cancelled) setTalents(converted);
      } catch (loadError) {
        console.error("Error loading shortlisted talents:", loadError);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTalents();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the visitor's own order rather than the roster order.
  const selected = useMemo(
    () =>
      activeIds
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent): talent is Talent => Boolean(talent)),
    [activeIds, talents]
  );

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined" || activeIds.length === 0) return "";
    return `${window.location.origin}/shortlist?ids=${activeIds.join(",")}`;
  }, [activeIds]);

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard blocked (http, old browser): fall back to a prompt so the
      // visitor can still copy the link by hand.
      window.prompt(tr("დააკოპირეთ ბმული", "Copy this link"), shareUrl);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveShared = () => {
    replace(sharedIds);
    setSaved(true);
    setTimeout(() => {
      router.push("/shortlist");
    }, 600);
  };

  const handleDownloadActor = async (talent: Talent) => {
    setDownloadingId(talent.id);
    try {
      for (const sample of talent.samples) {
        if (!sample.url) continue;
        await downloadSample(sample.url, toFileName(talent.id, sample.name));
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="container py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {tr("მონიშნული ხმები", "Marked voices")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isShared
            ? tr(
                "ეს არჩევანი თქვენ გაგიზიარეს. მოისმინეთ და ჩამოტვირთეთ ნიმუშები.",
                "This selection was shared with you. Listen to and download the samples."
              )
            : tr(
                "მონიშნეთ ხმები და გაუზიარეთ ბმული კოლეგებს - ავტორიზაცია არ სჭირდება.",
                "Mark voices and share the link with your colleagues - no sign-in needed."
              )}
        </p>
      </div>

      {isShared && (
        <div className="mx-auto mb-8 flex max-w-2xl flex-col items-center gap-3 rounded-xl border border-orange-300 bg-orange-50 p-4 text-center dark:border-orange-900 dark:bg-orange-950/20 sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            {tr("გაზიარებული სია", "Shared selection")} · {sharedIds.length}
          </p>
          <Button
            type="button"
            onClick={handleSaveShared}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {tr("შენახულია", "Saved")}
              </>
            ) : (
              tr("ჩემს კალათაში შენახვა", "Save to my selection")
            )}
          </Button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: Math.max(activeIds.length, 2) }).map((_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {error && (
        <p className="py-12 text-center text-red-500">
          {tr("მსახიობების ჩატვირთვა ვერ მოხერხდა.", "We could not load the voice actors.")}
        </p>
      )}

      {!loading && !error && selected.length === 0 && (
        <div className="mx-auto max-w-2xl rounded-xl border bg-card px-6 py-10 text-center sm:p-10">
          <p className="text-muted-foreground">
            {tr(
              "ჯერ არცერთი ხმა არ მოგინიშნავთ. დააჭირეთ გულის ღილაკს მსახიობის ფოტოზე.",
              "You have not marked any voices yet. Tap the heart on a voice actor's photo."
            )}
          </p>
          <ListenAllButton className="mt-6" />
        </div>
      )}

      {!loading && !error && selected.length > 0 && (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <Button type="button" variant="outline" onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-orange-500" />
                  {tr("ბმული დაკოპირდა", "Link copied")}
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  {tr("ბმულის გაზიარება", "Share link")}
                </>
              )}
            </Button>

            {!isShared && (
              <Button
                type="button"
                variant="outline"
                onClick={clear}
                className="text-red-600 hover:text-red-700 dark:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {tr("კალათის გასუფთავება", "Clear selection")}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {selected.map((talent) => (
              <div key={talent.id} className="flex flex-col">
                <VoiceCard
                  talent={talent}
                  currentlyPlayingId={currentlyPlayingId}
                  onTogglePlay={(playerId) =>
                    setCurrentlyPlayingId((currentId) =>
                      currentId === playerId ? null : playerId
                    )
                  }
                  onClick={() => router.push(`/talents/${talent.id}`)}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={downloadingId === talent.id || talent.samples.length === 0}
                  onClick={() => handleDownloadActor(talent)}
                  className="mt-2"
                >
                  {downloadingId === talent.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tr("იტვირთება...", "Downloading...")}
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {tr("ნიმუშების ჩამოტვირთვა", "Download samples")}
                      {talent.samples.length > 0 && ` (${talent.samples.length})`}
                    </>
                  )}
                </Button>

                {talent.samples.length > 0 && (
                  <p className="mt-1 px-1 text-xs text-muted-foreground">
                    {talent.samples
                      .map((sample) => localizeAudioName(sample.name, "ka"))
                      .join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default ShortlistView;
