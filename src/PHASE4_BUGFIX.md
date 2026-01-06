# Phase 4 Bug Fix - Import Errors

## Issue
Build failed with 2 errors related to incorrect imports in `useRecentActivity.ts`:

```
ERROR: No matching export in "virtual-fs:file:///lib/data.ts" for import "getAllContacts"
ERROR: No matching export in "virtual-fs:file:///lib/data.ts" for import "getAllDocuments"
```

## Root Cause
The hook was using incorrect function names:
- ❌ `getAllContacts` (doesn't exist)
- ❌ `getAllDocuments` (doesn't exist)

## Available Functions in `/lib/data.ts`
- ✅ `getContacts(agentId?: string, userRole?: string)` - Get contacts with role filtering
- ✅ `getDocuments(propertyId: string)` - Get documents for a specific property

## Solution

### 1. Fixed Contacts Import
Changed from:
```typescript
import { getAllContacts } from '../../../lib/data';
```

To:
```typescript
import { getContacts } from '../../../lib/data';
```

Usage:
```typescript
const allContacts = getContacts(userId, userRole);
```

### 2. Fixed Documents Retrieval
Since `getDocuments` requires a `propertyId` parameter and we need ALL documents, we fetch directly from localStorage:

```typescript
// Load documents (last 7 days)
// Note: getDocuments requires propertyId, so we get all documents directly
const documentsKey = 'estate_documents';
const allDocuments = JSON.parse(localStorage.getItem(documentsKey) || '[]') as Document[];
const recentDocuments = allDocuments.filter(
  d => {
    const createdDate = new Date(d.createdAt || d.uploadedAt || d.uploadDate || 0);
    return createdDate >= oneWeekAgo;
  }
);
setDocuments(recentDocuments);
```

This approach:
- ✅ Fetches all documents directly from localStorage
- ✅ Handles multiple possible date fields (`createdAt`, `uploadedAt`, `uploadDate`)
- ✅ Filters by last 7 days
- ✅ Type-safe with `as Document[]`

## Files Modified
1. `/components/dashboard/hooks/useRecentActivity.ts`
   - Fixed imports
   - Updated contacts call
   - Updated documents retrieval logic

## Testing Checklist
- [x] Build succeeds without errors
- [ ] Contacts load correctly (last 7 days)
- [ ] Documents load correctly (last 7 days)
- [ ] Recent counts display on workflow cards
- [ ] No console errors

## Status
✅ **FIXED** - Build errors resolved

---

*Fix applied: January 5, 2026*
