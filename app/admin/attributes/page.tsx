"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Globe,
  Mic2,
  Music,
  Eye,
  EyeOff,
  GripVertical,
  Megaphone,
  FileText,
  User,
  GraduationCap,
  Film,
  Newspaper,
  Briefcase,
  Sparkles,
  Phone,
} from "lucide-react";
import {
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  getAllVoiceStyles,
  createVoiceStyle,
  updateVoiceStyle,
  deleteVoiceStyle,
  getAllAudioCategories,
  createAudioCategory,
  updateAudioCategory,
  deleteAudioCategory,
} from "@/lib/supabase-queries";
import { clearAttributesCache } from "@/lib/dynamic-attributes";

// Available Lucide icons for categories with Georgian labels
const ICON_OPTIONS = [
  { value: "Music", label: "მუსიკა", icon: Music },
  { value: "Megaphone", label: "მეგაფონი", icon: Megaphone },
  { value: "Mic2", label: "მიკროფონი", icon: Mic2 },
  { value: "FileText", label: "დოკუმენტი", icon: FileText },
  { value: "User", label: "მომხმარებელი", icon: User },
  { value: "GraduationCap", label: "განათლება", icon: GraduationCap },
  { value: "Film", label: "ფილმი", icon: Film },
  { value: "Newspaper", label: "გაზეთი", icon: Newspaper },
  { value: "Briefcase", label: "ბიზნესი", icon: Briefcase },
  { value: "Sparkles", label: "ბრწყინვალება", icon: Sparkles },
  { value: "Phone", label: "ტელეფონი", icon: Phone },
];

// Color options for categories
const COLOR_OPTIONS = [
  { value: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", label: "ლურჯი" },
  { value: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", label: "მწვანე" },
  { value: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400", label: "იისფერი" },
  { value: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400", label: "ვარდისფერი" },
  { value: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400", label: "ნარინჯისფერი" },
  { value: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", label: "ყვითელი" },
  { value: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400", label: "ცისფერი" },
  { value: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400", label: "ინდიგო" },
  { value: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400", label: "წითელი" },
  { value: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", label: "ნაცრისფერი" },
];

interface AttributeItem {
  id: number;
  value: string;
  label: string;
  is_active: boolean;
  sort_order: number;
}

interface AudioCategoryItem extends AttributeItem {
  icon_name: string;
  color_class: string;
}

export default function AttributesPage() {
  const [languages, setLanguages] = useState<AttributeItem[]>([]);
  const [voiceStyles, setVoiceStyles] = useState<AttributeItem[]>([]);
  const [audioCategories, setAudioCategories] = useState<AudioCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("languages");

  const loadData = async () => {
    try {
      setLoading(true);
      const [langs, styles, cats] = await Promise.all([
        getAllLanguages(),
        getAllVoiceStyles(),
        getAllAudioCategories(),
      ]);
      setLanguages(langs);
      setVoiceStyles(styles);
      setAudioCategories(cats);
      
      // Clear cache and notify other components
      clearAttributesCache();
      // Dispatch custom event to notify other components about attribute changes
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('attributesUpdated'));
      }
    } catch (error) {
      console.error("Error loading attributes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">ატრიბუტების მართვა</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground">იტვირთება...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">ატრიბუტების მართვა</h1>
        <p className="text-sm text-muted-foreground mt-1">
          მართეთ ენები, ხმის სტილები და აუდიო კატეგორიები
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="languages">
            <Globe className="h-4 w-4 mr-2" />
            ენები ({languages.length})
          </TabsTrigger>
          <TabsTrigger value="voice-styles">
            <Mic2 className="h-4 w-4 mr-2" />
            ხმის სტილები ({voiceStyles.length})
          </TabsTrigger>
          <TabsTrigger value="audio-categories">
            <Music className="h-4 w-4 mr-2" />
            აუდიო კატეგორიები ({audioCategories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="languages">
          <LanguagesTab languages={languages} onReload={loadData} />
        </TabsContent>

        <TabsContent value="voice-styles">
          <VoiceStylesTab voiceStyles={voiceStyles} onReload={loadData} />
        </TabsContent>

        <TabsContent value="audio-categories">
          <AudioCategoriesTab audioCategories={audioCategories} onReload={loadData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// LANGUAGES TAB
// ============================================================================

interface LanguagesTabProps {
  languages: AttributeItem[];
  onReload: () => void;
}

function LanguagesTab({ languages, onReload }: LanguagesTabProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AttributeItem | null>(null);
  const [formData, setFormData] = useState({ value: "", label: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      await createLanguage({
        value: formData.value,
        label: formData.label,
        sort_order: languages.length + 1,
      });
      setIsCreateOpen(false);
      setFormData({ value: "", label: "" });
      await onReload();
    } catch (error) {
      console.error("Error creating language:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      setIsSubmitting(true);
      await updateLanguage(editingItem.id, {
        value: formData.value,
        label: formData.label,
      });
      setEditingItem(null);
      setFormData({ value: "", label: "" });
      await onReload();
    } catch (error) {
      console.error("Error updating language:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: AttributeItem) => {
    try {
      await updateLanguage(item.id, { is_active: !item.is_active });
      await onReload();
    } catch (error) {
      console.error("Error toggling language:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLanguage(id);
      await onReload();
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  const openEdit = (item: AttributeItem) => {
    setEditingItem(item);
    setFormData({ value: item.value, label: item.label });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          მსახიობების ფორმაში გამოჩნდება მხოლოდ აქტიური ენები
        </p>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({ value: "", label: "" })}>
              <Plus className="mr-2 h-4 w-4" />
              ენის დამატება
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ახალი ენის დამატება</DialogTitle>
              <DialogDescription>
                დაამატეთ ახალი ენა მსახიობების სიისთვის
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ინგლისური დასახელება (Value)</Label>
                <Input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="მაგ: Spanish"
                />
              </div>
              <div className="space-y-2">
                <Label>ქართული დასახელება (Label)</Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="მაგ: ესპანური"
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={isSubmitting || !formData.value || !formData.label}
                className="w-full"
              >
                {isSubmitting ? "დამატება..." : "დამატება"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {languages.map((lang) => (
          <Card key={lang.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{lang.label}</span>
                      <span className="text-sm text-muted-foreground">({lang.value})</span>
                      <Badge variant={lang.is_active ? "default" : "secondary"}>
                        {lang.is_active ? "აქტიური" : "არააქტიური"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(lang)}
                  >
                    {lang.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Dialog
                    open={editingItem?.id === lang.id}
                    onOpenChange={(open) => !open && setEditingItem(null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(lang)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>ენის რედაქტირება</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>ინგლისური დასახელება (Value)</Label>
                          <Input
                            value={formData.value}
                            onChange={(e) =>
                              setFormData({ ...formData, value: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ქართული დასახელება (Label)</Label>
                          <Input
                            value={formData.label}
                            onChange={(e) =>
                              setFormData({ ...formData, label: e.target.value })
                            }
                          />
                        </div>
                        <Button
                          onClick={handleUpdate}
                          disabled={isSubmitting || !formData.value || !formData.label}
                          className="w-full"
                        >
                          {isSubmitting ? "შენახვა..." : "შენახვა"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ენის წაშლა</AlertDialogTitle>
                        <AlertDialogDescription>
                          დარწმუნებული ხართ, რომ გსურთ "{lang.label}"-ის წაშლა? ეს
                          მოქმედება შეუქცევადია.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(lang.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          წაშლა
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// VOICE STYLES TAB
// ============================================================================

interface VoiceStylesTabProps {
  voiceStyles: AttributeItem[];
  onReload: () => void;
}

function VoiceStylesTab({ voiceStyles, onReload }: VoiceStylesTabProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AttributeItem | null>(null);
  const [formData, setFormData] = useState({ value: "", label: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      await createVoiceStyle({
        value: formData.value,
        label: formData.label,
        sort_order: voiceStyles.length + 1,
      });
      setIsCreateOpen(false);
      setFormData({ value: "", label: "" });
      await onReload();
    } catch (error) {
      console.error("Error creating voice style:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      setIsSubmitting(true);
      await updateVoiceStyle(editingItem.id, {
        value: formData.value,
        label: formData.label,
      });
      setEditingItem(null);
      setFormData({ value: "", label: "" });
      await onReload();
    } catch (error) {
      console.error("Error updating voice style:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: AttributeItem) => {
    try {
      await updateVoiceStyle(item.id, { is_active: !item.is_active });
      await onReload();
    } catch (error) {
      console.error("Error toggling voice style:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVoiceStyle(id);
      await onReload();
    } catch (error) {
      console.error("Error deleting voice style:", error);
    }
  };

  const openEdit = (item: AttributeItem) => {
    setEditingItem(item);
    setFormData({ value: item.value, label: item.label });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          მსახიობების ფორმაში გამოჩნდება მხოლოდ აქტიური ხმის სტილები
        </p>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({ value: "", label: "" })}>
              <Plus className="mr-2 h-4 w-4" />
              სტილის დამატება
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ახალი ხმის სტილის დამატება</DialogTitle>
              <DialogDescription>
                დაამატეთ ახალი ხმის სტილი მსახიობების სიისთვის
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ინგლისური დასახელება (Value)</Label>
                <Input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="მაგ: Cheerful"
                />
              </div>
              <div className="space-y-2">
                <Label>ქართული დასახელება (Label)</Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="მაგ: მხიარული"
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={isSubmitting || !formData.value || !formData.label}
                className="w-full"
              >
                {isSubmitting ? "დამატება..." : "დამატება"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {voiceStyles.map((style) => (
          <Card key={style.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{style.label}</span>
                      <span className="text-sm text-muted-foreground">({style.value})</span>
                      <Badge variant={style.is_active ? "default" : "secondary"}>
                        {style.is_active ? "აქტიური" : "არააქტიური"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(style)}
                  >
                    {style.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Dialog
                    open={editingItem?.id === style.id}
                    onOpenChange={(open) => !open && setEditingItem(null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(style)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>სტილის რედაქტირება</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>ინგლისური დასახელება (Value)</Label>
                          <Input
                            value={formData.value}
                            onChange={(e) =>
                              setFormData({ ...formData, value: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ქართული დასახელება (Label)</Label>
                          <Input
                            value={formData.label}
                            onChange={(e) =>
                              setFormData({ ...formData, label: e.target.value })
                            }
                          />
                        </div>
                        <Button
                          onClick={handleUpdate}
                          disabled={isSubmitting || !formData.value || !formData.label}
                          className="w-full"
                        >
                          {isSubmitting ? "შენახვა..." : "შენახვა"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>სტილის წაშლა</AlertDialogTitle>
                        <AlertDialogDescription>
                          დარწმუნებული ხართ, რომ გსურთ "{style.label}"-ის წაშლა? ეს
                          მოქმედება შეუქცევადია.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(style.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          წაშლა
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// AUDIO CATEGORIES TAB
// ============================================================================

interface AudioCategoriesTabProps {
  audioCategories: AudioCategoryItem[];
  onReload: () => void;
}

function AudioCategoriesTab({ audioCategories, onReload }: AudioCategoriesTabProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AudioCategoryItem | null>(null);
  const [formData, setFormData] = useState({
    value: "",
    label: "",
    icon_name: "Music",
    color_class: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      await createAudioCategory({
        value: formData.value,
        label: formData.label,
        icon_name: formData.icon_name,
        color_class: formData.color_class,
        sort_order: audioCategories.length + 1,
      });
      setIsCreateOpen(false);
      setFormData({
        value: "",
        label: "",
        icon_name: "Music",
        color_class: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      });
      await onReload();
    } catch (error) {
      console.error("Error creating audio category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      setIsSubmitting(true);
      await updateAudioCategory(editingItem.id, {
        value: formData.value,
        label: formData.label,
        icon_name: formData.icon_name,
        color_class: formData.color_class,
      });
      setEditingItem(null);
      setFormData({
        value: "",
        label: "",
        icon_name: "Music",
        color_class: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      });
      await onReload();
    } catch (error) {
      console.error("Error updating audio category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: AudioCategoryItem) => {
    try {
      await updateAudioCategory(item.id, { is_active: !item.is_active });
      await onReload();
    } catch (error) {
      console.error("Error toggling audio category:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAudioCategory(id);
      await onReload();
    } catch (error) {
      console.error("Error deleting audio category:", error);
    }
  };

  const openEdit = (item: AudioCategoryItem) => {
    setEditingItem(item);
    setFormData({
      value: item.value,
      label: item.label,
      icon_name: item.icon_name,
      color_class: item.color_class,
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = ICON_OPTIONS.find((opt) => opt.value === iconName);
    if (iconOption) {
      const IconComponent = iconOption.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return <Music className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          აუდიო კატეგორიები აიქონებით გამოჩნდება მსახიობების ბარათებზე
        </p>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() =>
                setFormData({
                  value: "",
                  label: "",
                  icon_name: "Music",
                  color_class:
                    "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              კატეგორიის დამატება
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ახალი კატეგორიის დამატება</DialogTitle>
              <DialogDescription>
                დაამატეთ ახალი აუდიო კატეგორია აიქონით
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>დასახელება (Value)</Label>
                <Input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="მაგ: პოდკასტი"
                />
              </div>
              <div className="space-y-2">
                <Label>ქართული დასახელება (Label)</Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="მაგ: პოდკასტი"
                />
              </div>
              <div className="space-y-2">
                <Label>აიქონი</Label>
                <Select
                  value={formData.icon_name}
                  onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => {
                      const IconComponent = icon.icon;
                      return (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {icon.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ფერი</Label>
                <Select
                  value={formData.color_class}
                  onValueChange={(value) =>
                    setFormData({ ...formData, color_class: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <Badge className={color.value}>{color.label}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 border rounded bg-muted">
                <p className="text-sm mb-2">წინასწარი ნახვა:</p>
                <Badge className={formData.color_class}>
                  <span className="mr-1">{getIconComponent(formData.icon_name)}</span>
                  {formData.label || "კატეგორია"}
                </Badge>
              </div>
              <Button
                onClick={handleCreate}
                disabled={isSubmitting || !formData.value || !formData.label}
                className="w-full"
              >
                {isSubmitting ? "დამატება..." : "დამატება"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {audioCategories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-3">
                    <Badge className={category.color_class}>
                      <span className="mr-1">{getIconComponent(category.icon_name)}</span>
                      {category.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">({category.value})</span>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "აქტიური" : "არააქტიური"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(category)}
                  >
                    {category.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Dialog
                    open={editingItem?.id === category.id}
                    onOpenChange={(open) => !open && setEditingItem(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>კატეგორიის რედაქტირება</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>დასახელება (Value)</Label>
                          <Input
                            value={formData.value}
                            onChange={(e) =>
                              setFormData({ ...formData, value: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ქართული დასახელება (Label)</Label>
                          <Input
                            value={formData.label}
                            onChange={(e) =>
                              setFormData({ ...formData, label: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>აიქონი</Label>
                          <Select
                            value={formData.icon_name}
                            onValueChange={(value) =>
                              setFormData({ ...formData, icon_name: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ICON_OPTIONS.map((icon) => {
                                const IconComponent = icon.icon;
                                return (
                                  <SelectItem key={icon.value} value={icon.value}>
                                    <div className="flex items-center gap-2">
                                      <IconComponent className="h-4 w-4" />
                                      {icon.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>ფერი</Label>
                          <Select
                            value={formData.color_class}
                            onValueChange={(value) =>
                              setFormData({ ...formData, color_class: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COLOR_OPTIONS.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  <Badge className={color.value}>{color.label}</Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="p-3 border rounded bg-muted">
                          <p className="text-sm mb-2">წინასწარი ნახვა:</p>
                          <Badge className={formData.color_class}>
                            <span className="mr-1">
                              {getIconComponent(formData.icon_name)}
                            </span>
                            {formData.label || "კატეგორია"}
                          </Badge>
                        </div>
                        <Button
                          onClick={handleUpdate}
                          disabled={
                            isSubmitting || !formData.value || !formData.label
                          }
                          className="w-full"
                        >
                          {isSubmitting ? "შენახვა..." : "შენახვა"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>კატეგორიის წაშლა</AlertDialogTitle>
                        <AlertDialogDescription>
                          დარწმუნებული ხართ, რომ გსურთ "{category.label}"-ის წაშლა?
                          ეს მოქმედება შეუქცევადია.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          წაშლა
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

