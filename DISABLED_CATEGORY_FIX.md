# Disabled Category Handling Fix

## Problem

When an audio category was disabled in `/admin/attributes`, it caused UI issues in the Voice Actor admin panel:

1. **Empty Dropdown**: Audio samples with disabled categories showed empty dropdowns
2. **Wrong Icon Display**: Icons disappeared or showed incorrectly
3. **Manual Re-selection Required**: Admins had to manually re-select categories

## Solution

### Changes Made

#### 1. Load ALL Categories (Including Disabled)

**File**: `components/admin/audio-sample-manager.tsx`

- Changed from `getDynamicAudioCategories()` (only active) to `getAllAudioCategories()` (all categories)
- This ensures disabled categories are still available in the UI for samples that already use them

```typescript
// Load ALL categories (including disabled) so existing samples with disabled categories still show
const allCategories = await getAllAudioCategories();
setAudioCategories(allCategories);

// Set default to first ACTIVE category for new samples
const activeCategories = allCategories.filter(cat => cat.is_active);
if (activeCategories.length > 0 && !newSample.category) {
  setNewSample(prev => ({ ...prev, category: activeCategories[0].value }));
}
```

#### 2. Visual Indicators for Disabled Categories

**Dropdown Display**:
- Disabled categories show "(გამორთული)" label
- Disabled categories cannot be selected for new/edited samples
- Existing disabled categories remain visible and editable

```typescript
<SelectItem 
  key={cat.value} 
  value={cat.value}
  disabled={!cat.is_active}
>
  <div className="flex items-center gap-2">
    {cat.icon_name && getIconElement(cat.icon_name, { className: "h-4 w-4" })}
    {cat.label}
    {!cat.is_active && (
      <span className="text-xs text-muted-foreground">(გამორთული)</span>
    )}
  </div>
</SelectItem>
```

**Sample Card Display**:
- Shows warning badge "⚠ კატეგორია გამორთულია" when a sample has a disabled category
- Alerts admins to update the category to an active one

```typescript
{!isCategoryActive(sample.category) && (
  <Badge variant="destructive" className="text-xs">
    ⚠ კატეგორია გამორთულია
  </Badge>
)}
```

### How It Works

1. **Loading**: Component loads ALL categories (active + inactive) from database
2. **Display**: Disabled categories are shown but marked with "(გამორთული)"
3. **Selection**: Only active categories can be selected for new/edited samples
4. **Warning**: Samples with disabled categories show a clear warning badge
5. **Flexibility**: Admins can still see and change disabled categories without data loss

### User Experience

#### Before Fix:
- Disabled category → Empty dropdown
- Lost category information
- Confusing UI state
- Required manual intervention

#### After Fix:
- Disabled category → Shows with warning indicator
- Category information preserved
- Clear visual feedback
- Admin can easily update to active category

### Migration Path

If an admin wants to migrate samples from a disabled category:

1. Go to `/admin/actors`
2. Find actors with samples showing "⚠ კატეგორია გამორთულია" warning
3. Edit the sample
4. Select a new active category from the dropdown (disabled ones are grayed out)
5. Save

### Technical Details

- **State Management**: Added `is_active` field to category state
- **Helper Function**: `isCategoryActive(category)` checks if a category is active
- **Backward Compatibility**: Existing samples continue to work even with disabled categories
- **Data Integrity**: No data loss when categories are disabled/enabled

## Testing

1. ✅ Create audio sample with active category
2. ✅ Disable the category in `/admin/attributes`
3. ✅ Go to `/admin/actors` and edit the actor
4. ✅ Sample shows warning badge "⚠ კატეგორია გამორთულია"
5. ✅ Category dropdown shows disabled category with "(გამორთული)" label
6. ✅ Can select new active category
7. ✅ Cannot select disabled categories for new samples
8. ✅ Re-enabling category removes warning badge

## Files Modified

- `components/admin/audio-sample-manager.tsx`
  - Import `getAllAudioCategories`
  - Load all categories including disabled ones
  - Add `is_active` to state type
  - Add `isCategoryActive()` helper
  - Update dropdown to show disabled state
  - Add warning badge for disabled categories

## No Database Changes Required

This fix is entirely UI-based and requires no database schema changes. It works with the existing `is_active` field in the `attribute_audio_categories` table.

