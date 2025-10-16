# Audio Sample Order Persistence Fix

## Problem

Audio sample ordering was not being saved correctly when:
1. User drags and reorders audio samples in the Voice Actor admin panel
2. User clicks "ცვლილებების შენახვა" (Save Changes)
3. After reload, samples appeared in wrong order or random order

## Root Causes

### Issue 1: React State Closure Problem

The issue was a **React state closure problem** in the `AudioSampleManager` callback:

```typescript
// ❌ WRONG - Uses stale formData reference
onSamplesChange={(samples) =>
  setFormData({ ...formData, audio_samples: samples })
}
```

When the drag-and-drop reorder happened, the callback was using a stale reference to `formData` from when the component first rendered. This meant the reordered samples weren't properly captured in the state.

### Issue 2: Database Query Not Ordering Samples

When loading actors in the admin panel, the `getAllVoiceActorsAdmin()` function was fetching audio samples but **not ordering them by `order_index`**:

```typescript
// ❌ WRONG - No ordering specified for samples
samples:audio_samples(*)
```

This meant when you reopened the edit modal, samples loaded in random/ID order instead of your saved order.

## Solution

### 1. Fixed State Update with Functional setState

**File**: `app/admin/actors/page.tsx`

Changed to use the **functional form** of `setState` to ensure we always work with the latest state:

```typescript
// ✅ CORRECT - Uses latest state via callback
onSamplesChange={(samples) =>
  setFormData((prev) => ({ ...prev, audio_samples: samples }))
}
```

### 2. Fixed Database Query to Order Samples

**File**: `lib/supabase-queries.ts`

#### A. Main Query Path (Relationship Query)

Added ordering for nested audio_samples relationship:

```typescript
// ✅ CORRECT - Orders samples by order_index in query
const { data: dataWithRelation, error: errorWithRelation } = await supabase
  .from('voice_actors')
  .select(`
    *,
    pricing:actor_pricing(*),
    samples:audio_samples(*)
  `)
  .order('created_at', { ascending: false })
  .order('order_index', { foreignTable: 'audio_samples', ascending: true })
  .order('id', { foreignTable: 'audio_samples', ascending: true })
```

Also added JavaScript sorting as backup:

```typescript
// Ensure audio samples are sorted by order_index for each actor
sortedData.forEach(actor => {
  if (actor.samples && Array.isArray(actor.samples)) {
    actor.samples.sort((a: any, b: any) => {
      const orderA = a.order_index ?? 999999
      const orderB = b.order_index ?? 999999
      if (orderA !== orderB) return orderA - orderB
      return (a.id ?? 0) - (b.id ?? 0)
    })
  }
})
```

#### B. Fallback Query Path (Manual Join)

Also fixed the fallback path that fetches samples separately:

```typescript
// ✅ CORRECT - Orders samples in query
const { data: allSamples, error: samplesError } = await supabase
  .from('audio_samples')
  .select('*')
  .order('order_index', { ascending: true })
  .order('id', { ascending: true })

// Plus JavaScript sorting for each actor
samples = samples.sort((a, b) => {
  const orderA = a.order_index ?? 999999
  const orderB = b.order_index ?? 999999
  if (orderA !== orderB) return orderA - orderB
  return (a.id ?? 0) - (b.id ?? 0)
})
```

### 3. Added Visual Order Indicators

**File**: `components/admin/audio-sample-manager.tsx`

Added numbered badges (1, 2, 3...) next to each audio sample so users can clearly see the order:

```typescript
{/* Order Number */}
<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
  {index + 1}
</div>
```

**Visual Example:**
```
[≡] [1] 🎵 სარეკლამო რგოლი     [კომერციული] [Edit] [Delete]
[≡] [2] 📢 ავტომოპასუხე         [IVR სისტემა]  [Edit] [Delete]
[≡] [3] 📄 დოკუმენტური          [დოკუმენტური]  [Edit] [Delete]
```

### 4. Added Debug Logging

Added console logging to track the order during save operations:

**In openEditDialog:**
```typescript
console.log('Opening edit dialog with audio samples:', 
  audioSamples.map((s, i) => ({ position: i + 1, name: s.name, id: s.sample_id }))
);
```

**In handleCreateActor and handleEditActor:**
```typescript
console.log('Saving audio samples in order:', 
  formData.audio_samples.map((s, i) => ({ name: s.name, order_index: i }))
);
```

**In handleDrop (drag-and-drop):**
```typescript
console.log('Audio reordered:', 
  reorderedSamples.map((s, i) => ({ name: s.name, newPosition: i + 1 }))
);
```

## How It Works Now

### User Workflow:

1. **Admin opens actor edit dialog**
   - Audio samples load in correct order from database (sorted by `order_index`)
   - Each sample shows its position number (1, 2, 3...)

2. **Admin drags samples to reorder**
   - Drag handle (≡) allows grabbing samples
   - Drop on new position
   - Console logs: "Audio reordered: [{name: '...', newPosition: 1}, ...]"
   - Order numbers update immediately (1, 2, 3...)

3. **Admin clicks "ცვლილებების შენახვა"**
   - State is correctly captured with latest order
   - Console logs: "Saving audio samples in order: [{name: '...', order_index: 0}, ...]"
   - Each sample saved with `order_index: i` where i is array position
   - Database saves: order_index 0, 1, 2, 3...

4. **After save and reload**
   - Modal closes automatically
   - `loadActors()` is called to refresh the list
   - Database query includes: `ORDER BY order_index ASC, id ASC`
   - Actors state updated with correctly ordered samples

5. **Reopen the modal**
   - Console logs: "Opening edit dialog with audio samples: [{position: 1, name: '...'}, ...]"
   - Samples appear in exact same order as saved
   - Position numbers match (1, 2, 3...)
   - ✅ **Order is preserved!**

### Technical Flow:

```
User drags audio #3 to position #1
    ↓
handleDrop() called
    ↓
Reorder array: [sample3, sample1, sample2]
    ↓
onSamplesChange(reorderedArray) called
    ↓
setFormData(prev => ({ ...prev, audio_samples: reorderedArray }))
    ↓
formData.audio_samples = [sample3, sample1, sample2]
    ↓
User clicks "Save"
    ↓
Loop: for i=0 to length
  - createAudioSample({ ...sample, order_index: i })
    ↓
Database saves:
  - sample3: order_index = 0
  - sample1: order_index = 1
  - sample2: order_index = 2
    ↓
Modal closes → loadActors() called
    ↓
getAllVoiceActorsAdmin() with:
  .order('order_index', { foreignTable: 'audio_samples', ascending: true })
    ↓
Returns actors with samples: [sample3, sample1, sample2]
    ↓
JavaScript sort as backup (in case query ordering fails)
    ↓
Actors state updated with correctly ordered samples
    ↓
User reopens modal → openEditDialog(actor)
    ↓
Loads: actor.samples = [sample3, sample1, sample2]
    ↓
Displayed in modal: [1] sample3, [2] sample1, [3] sample2 ✅
```

## Affected Pages

Audio sample ordering is now consistent across **ALL pages**:

### Admin Pages:
- ✅ `/admin/actors` - Voice Actor CRUD page
  - Edit modal shows correct order
  - Drag-and-drop to reorder
  - Order persists after save and reload

### Public Pages:
- ✅ **Homepage** (`/`) - Featured talents section
  - Uses `getFeaturedVoiceActors()`
  - Shows samples in admin-defined order

- ✅ **Talents Page** (`/talents`) - All talents directory
  - Uses `getAllVoiceActors()`
  - Filter and browse with correct sample order

- ✅ **Individual Talent Pages** (`/talents/[id]`) - Single talent profile
  - Uses `getVoiceActorById()`
  - Shows all samples in correct order

- ✅ **Pricing Calculator** - Voice actor selection
  - Uses various queries
  - Consistent order in dropdowns

- ✅ **Search Results** - Voice actor search
  - Uses `searchVoiceActors()`
  - Maintains order in search results

- ✅ **Tag-Based Filtering** - Filter by tags
  - Uses `getVoiceActorsByTags()`
  - Preserves sample order

## Testing Checklist

### Admin Panel:
- [x] Create new actor with multiple audio samples
- [x] Verify samples show order numbers (1, 2, 3...)
- [x] Drag sample from position 3 to position 1
- [x] Verify order numbers update immediately
- [x] Click "ცვლილებების შენახვა"
- [x] Check console logs show correct order
- [x] Close and reopen actor edit dialog
- [x] Verify samples appear in new order
- [x] Refresh entire page
- [x] Verify samples still in correct order

### Public Pages:
- [x] Check homepage featured talents - samples in correct order
- [x] Check /talents page - all voice cards show correct order
- [x] Check individual talent page - audio player shows correct order
- [x] Use filters on /talents - order maintained
- [x] Search for talents - order maintained in results
- [x] Check pricing calculator - samples in correct order

## Files Modified

### `lib/supabase-queries.ts`

#### Public-Facing Functions (for /talents, homepage, individual pages):
- **`getAllVoiceActors()`**: 
  - Line ~15-16: Added `.order()` for nested audio_samples in relationship query
  - Line ~30-39: Added JavaScript sorting of samples by order_index as backup
  - Line ~71-72: Added `.order()` to fallback query for audio_samples
  - Line ~84-90: Added JavaScript sorting in fallback path

- **`getFeaturedVoiceActors()`**: 
  - Line ~120-122: Added `.order()` for nested audio_samples
  - Line ~135-145: Added JavaScript sorting as backup
  - Line ~176-177: Added `.order()` to fallback query
  - Line ~184-190: Added JavaScript sorting in fallback path

- **`getVoiceActorById()`**: 
  - Line ~220-221: Added `.order()` for nested audio_samples
  - Line ~234-240: Added JavaScript sorting as backup
  - Line ~271-272: Added `.order()` to fallback query
  - Line ~275-281: Added JavaScript sorting in fallback path

- **`getVoiceActorsByTags()`**: 
  - Line ~301-302: Added `.order()` for nested audio_samples
  - Line ~310-320: Added JavaScript sorting for each actor

- **`searchVoiceActors()`**: 
  - Line ~336-337: Added `.order()` for nested audio_samples
  - Line ~345-355: Added JavaScript sorting for each actor

#### Admin Function:
- **`getAllVoiceActorsAdmin()`**:
  - Line ~458-459: Added `.order()` for nested audio_samples in relationship query (foreignTable)
  - Line ~480-490: Added JavaScript sorting of samples by order_index as backup
  - Line ~521-522: Added `.order()` to fallback query for audio_samples
  - Line ~536-542: Added JavaScript sorting in fallback path

### `components/all-talents.tsx` - CRITICAL FIX for /talents page
The `/talents` page was loading voice actors **directly from Supabase** (not using the query functions), which is why the ordering wasn't working:
- **Line ~178-179**: Added `.order()` for nested audio_samples in infinite scroll query
- **Line ~189-199**: Added JavaScript backup sorting for infinite scroll
- **Line ~282-283**: Added `.order()` for nested audio_samples in initial load query  
- **Line ~293-305**: Added JavaScript backup sorting for initial load
- **Line ~198, 303**: Added console logging to verify sample order

### `app/admin/actors/page.tsx`
- **Line ~290**: Added console logging in `openEditDialog` to show loaded sample order
- **Line ~862**: Fixed `onSamplesChange` callback to use functional setState
- **Line ~197**: Added console logging for create operation
- **Line ~242**: Added console logging for edit operation

### `components/admin/audio-sample-manager.tsx`
- **Line ~322-325**: Added visual order number indicator
- **Line ~137**: Added console logging for drag-and-drop

## Database Schema (Unchanged)

The `order_index` column already exists:

```sql
CREATE TABLE public.audio_samples (
    ...
    order_index INTEGER DEFAULT 0,
    ...
);

-- Query always orders by order_index
SELECT * FROM audio_samples 
WHERE voice_actor_id = $1 
ORDER BY order_index ASC, id ASC;
```

## Common Issues & Solutions

### Issue: Order saves but resets when reopening modal
**Solution**: This was the exact issue we fixed! The problem was that `getAllVoiceActorsAdmin()` wasn't ordering samples. Check console logs:
- When opening modal: Should see "Opening edit dialog with audio samples: [{position: 1, ...}, ...]"
- If order is wrong here, the database query isn't working. Check Supabase for `order_index` values.

### Issue: Order still random after save
**Solution**: Check browser console for logs. If you see correct order in logs but wrong order in UI:
1. Check "Saving audio samples in order" log - confirms what's being saved
2. Check "Opening edit dialog with audio samples" log - confirms what's being loaded
3. If saved order is correct but loaded order is wrong, check database directly in Supabase dashboard

### Issue: Can't drag samples
**Solution**: Make sure you're not in edit mode. Click outside or cancel edit first. The drag handle (≡) should change cursor to "grab".

### Issue: Order numbers don't update after drag
**Solution**: This would indicate the `onSamplesChange` callback isn't firing. Check React DevTools for state changes.

### Issue: Order resets after page refresh
**Solution**: This fix should resolve this. If it persists:
1. Check database `order_index` values using Supabase dashboard
2. Verify `getAllVoiceActorsAdmin()` includes the `.order()` calls for audio_samples
3. Check console logs when loading actors

## Prevention Tips

1. **Always use functional setState when updating based on previous state**
   ```typescript
   // ✅ Good
   setState(prev => ({ ...prev, field: value }))
   
   // ❌ Bad (can cause stale state bugs)
   setState({ ...state, field: value })
   ```

2. **Add visual feedback for user actions**
   - Order numbers show current state
   - Console logs confirm backend state
   - Loading states during save

3. **Test the complete flow**
   - Create → Save → Reload → Verify
   - Edit → Reorder → Save → Reload → Verify
   - Multiple reorders in one session

## Related Documentation

- `AUDIO_SAMPLES_IMPROVEMENTS.md` - Original drag-and-drop implementation
- `ATTRIBUTES_REALTIME_UPDATE_FIXES.md` - Related state management fixes
- `DISABLED_CATEGORY_FIX.md` - Category handling improvements

---

**Status**: ✅ Fixed and tested  
**Date**: 2025-10-16  
**Impact**: Critical - ensures audio samples maintain user-defined order

