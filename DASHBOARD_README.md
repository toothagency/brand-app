# Dashboard Feature

## Overview

The dashboard page allows users to view, manage, and download their generated brands. It provides a comprehensive interface for brand management with a modern, responsive design.

## Features

### 1. Brand Overview

- **Grid Layout**: Displays all user brands in a responsive card grid
- **Brand Cards**: Each card shows:
  - Brand name
  - Creation date
  - Brand logo preview (if available)
  - Status badge
  - Action buttons (View, Download, Delete)

### 2. Brand Actions

#### View Brand

- Opens a detailed modal showing all brand information:
  - Brand logo (full size)
  - Brand strategy
  - Brand identity
  - Brand communication
  - Marketing & social media strategy
- Modal includes download option for quick access

#### Download Brand

- Downloads brand as PDF file
- Automatic file naming with timestamp
- Handles loading states during download
- Error handling for failed downloads

#### Delete Brand

- Confirmation modal before deletion
- Permanent deletion with warning
- Automatic refresh of brand list after deletion
- Error handling for failed deletions

### 3. User Experience

- **Loading States**: Shows loading spinners during API calls
- **Error Handling**: Displays error messages with retry options
- **Empty State**: Helpful message when no brands exist
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Technical Implementation

### API Endpoints Used

- `POST /user_brands` - Fetch all brands for current user
- `POST /delete_brand` - Delete a specific brand
- `POST /download_brand` - Download brand as PDF

### Hooks Created

- `useUserBrands()` - Fetch user's brands with caching
- `useDeleteBrand()` - Handle brand deletion with cache invalidation
- `useDownloadBrand()` - Handle brand download with file creation

### File Structure

```
app/(protected)/dashboard/
└── page.tsx              # Main dashboard component

app/hooks/
└── hooks.ts              # Updated with new hooks

app/contexts/
└── BrandContext.tsx      # Brand type definitions
```

## Navigation

The dashboard is accessible through:

- User avatar menu in the navbar (desktop)
- Mobile menu (mobile devices)
- Direct URL: `/dashboard`

## Styling

- Uses Tailwind CSS for responsive design
- Consistent with existing app design system
- Dark mode support
- Smooth transitions and hover effects

## Security

- Protected route (requires authentication)
- User-specific data (only shows current user's brands)
- Proper error handling for unauthorized access

## Future Enhancements

- Brand search and filtering
- Brand categories/tags
- Bulk operations (delete multiple brands)
- Brand sharing functionality
- Brand analytics and insights
