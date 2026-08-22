"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Eye, EyeOff, Plus } from "lucide-react";
import {
  createAudioCategory,
  getAllAudioCategories,
  updateAudioCategory,
} from "@/lib/supabase-queries";
import {
  CATEGORY_ICON_OPTIONS,
  getCategoryIconName,
  getIconElement,
} from "@/lib/category-icons";

interface AudioCategory {
  id: number;
  value: string;
  label: string;
  icon_name: string;
  color_class?: string;
  is_active: boolean;
  sort_order: number;
}

interface CategoryDraft {
  value: string;
  label: string;
  icon_name: string;
}

const EMPTY_DRAFT: CategoryDraft = {
  value: "",
  label: "",
  icon_name: "Music",
};

export default function AudioCategoriesPage() {
  const [categories, setCategories] = useState<AudioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AudioCategory | null>(null);
  const [draft, setDraft] = useState<CategoryDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setError("");
      const data = await getAllAudioCategories();
      setCategories(data);
    } catch (loadError) {
      console.error("Error loading audio categories:", loadError);
      setError("აუდიო კატეგორიების ჩატვირთვა ვერ მოხერხდა.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async () => {
    if (!draft.value.trim() || !draft.label.trim()) return;

    try {
      setSaving(true);
      setError("");
      await createAudioCategory({
        value: draft.value.trim(),
        label: draft.label.trim(),
        icon_name: draft.icon_name,
        sort_order: categories.length + 1,
      });
      setIsCreateOpen(false);
      setDraft(EMPTY_DRAFT);
      await loadCategories();
    } catch (saveError) {
      console.error("Error creating audio category:", saveError);
      setError("კატეგორიის დამატება ვერ მოხერხდა.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !draft.value.trim() || !draft.label.trim()) return;

    try {
      setSaving(true);
      setError("");
      await updateAudioCategory(editingCategory.id, {
        value: draft.value.trim(),
        label: draft.label.trim(),
        icon_name: draft.icon_name,
      });
      setEditingCategory(null);
      setDraft(EMPTY_DRAFT);
      await loadCategories();
    } catch (saveError) {
      console.error("Error updating audio category:", saveError);
      setError("კატეგორიის შენახვა ვერ მოხერხდა.");
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = async (category: AudioCategory) => {
    try {
      setError("");
      await updateAudioCategory(category.id, { is_active: !category.is_active });
      await loadCategories();
    } catch (saveError) {
      console.error("Error toggling audio category:", saveError);
      setError("კატეგორიის სტატუსის შეცვლა ვერ მოხერხდა.");
    }
  };

  const openEdit = (category: AudioCategory) => {
    setDraft({
      value: category.value,
      label: category.label,
      icon_name: getCategoryIconName(category.value, category.icon_name),
    });
    setEditingCategory(category);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">აუდიო კატეგორიები და ხატები</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            აქ არჩეული ხატი გამოჩნდება მსახიობის აუდიო ჩამონათვალში.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDraft(EMPTY_DRAFT)}>
              <Plus className="mr-2 h-4 w-4" />
              კატეგორიის დამატება
            </Button>
          </DialogTrigger>
          <CategoryDialogContent
            title="ახალი აუდიო კატეგორია"
            description="შექმენით კატეგორია და აირჩიეთ მისი ხატი."
            draft={draft}
            onDraftChange={setDraft}
            onSave={handleCreate}
            saving={saving}
          />
        </Dialog>
      </div>

      {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="py-8 text-center text-muted-foreground">იტვირთება...</p>
      ) : (
        <div className="grid gap-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
                    {getIconElement(
                      getCategoryIconName(category.value, category.icon_name),
                      { className: "h-5 w-5" }
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{category.label}</span>
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? "აქტიური" : "გამორთული"}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      მნიშვნელობა: {category.value} · ხატი: {category.icon_name}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleCategory(category)}
                    aria-label={category.is_active ? "კატეგორიის გამორთვა" : "კატეგორიის ჩართვა"}
                  >
                    {category.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(category)}
                    aria-label="კატეგორიის რედაქტირება"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
      >
        <CategoryDialogContent
          title="აუდიო კატეგორიის რედაქტირება"
          description="სახელის ან ხატის შეცვლა ყველა დაკავშირებულ აუდიოზე აისახება."
          draft={draft}
          onDraftChange={setDraft}
          onSave={handleUpdate}
          saving={saving}
        />
      </Dialog>
    </div>
  );
}

function CategoryDialogContent({
  title,
  description,
  draft,
  onDraftChange,
  onSave,
  saving,
}: {
  title: string;
  description: string;
  draft: CategoryDraft;
  onDraftChange: (draft: CategoryDraft) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>კატეგორიის მნიშვნელობა</Label>
          <Input
            value={draft.value}
            onChange={(event) => onDraftChange({ ...draft, value: event.target.value })}
            placeholder="მაგ: კომერციული"
          />
        </div>
        <div className="space-y-2">
          <Label>ადმინში ნაჩვენები სახელი</Label>
          <Input
            value={draft.label}
            onChange={(event) => onDraftChange({ ...draft, label: event.target.value })}
            placeholder="მაგ: კომერციული"
          />
        </div>
        <div className="space-y-2">
          <Label>ხატი</Label>
          <Select
            value={draft.icon_name}
            onValueChange={(icon_name) => onDraftChange({ ...draft, icon_name })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_ICON_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={onSave}
          disabled={saving || !draft.value.trim() || !draft.label.trim()}
        >
          {saving ? "ინახება..." : "შენახვა"}
        </Button>
      </div>
    </DialogContent>
  );
}
