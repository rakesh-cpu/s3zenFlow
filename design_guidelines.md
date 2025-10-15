# S3 Bucket File Manager - Design Guidelines

## Design Approach

**Selected System**: Material Design with Vibrant Customizations
- Material Design provides excellent patterns for file management interfaces with clear hierarchy and feedback
- Enhanced with bold, colorful accents to make the S3 integration visually striking
- Minimalistic approach through generous whitespace and focused color usage

## Core Design Principles

1. **Vibrant Minimalism**: Use bold, saturated colors strategically on white/light backgrounds with ample breathing room
2. **Joyful Functionality**: Make file management delightful through smooth animations and playful color interactions
3. **Instant Clarity**: Every action provides immediate visual feedback with color-coded states
4. **Effortless Navigation**: Clear visual hierarchy guides users naturally through complex file operations

## Color Palette

### Primary Colors (Light Mode)
- **Brand Primary**: 217 91% 60% (vibrant blue) - main actions, active states
- **Brand Accent**: 142 76% 36% (fresh green) - success states, upload zones
- **Highlight**: 271 76% 53% (rich purple) - image previews, special features

### Functional Colors
- **Background**: 0 0% 100% (pure white) - main canvas
- **Surface**: 220 14% 96% (light gray) - cards, elevated surfaces
- **Success**: 142 76% 36% (green) - upload success, confirmations
- **Warning**: 38 92% 50% (amber) - in-progress uploads
- **Error**: 0 84% 60% (red) - failed operations
- **Text Primary**: 222 47% 11% (dark blue-gray)
- **Text Secondary**: 215 16% 47% (medium gray)

### File Type Colors
- **Folders**: 217 91% 60% (blue)
- **Images**: 142 76% 36% (green)
- **Documents**: 215 16% 47% (gray)
- **Videos**: 271 76% 53% (purple)

## Typography

**Font Stack**: 
- Primary: 'Inter' from Google Fonts - clean, modern, excellent readability
- Monospace: 'JetBrains Mono' for file paths and URLs

**Type Scale**:
- Hero/Display: text-4xl md:text-5xl, font-bold (bucket names, empty states)
- H1/Section: text-3xl, font-bold
- H2/Cards: text-xl, font-semibold
- Body: text-base, font-normal
- Small/Meta: text-sm, font-medium (file sizes, dates)
- Micro/Labels: text-xs, font-medium uppercase tracking-wide

## Layout System

**Spacing Foundation**: Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, gap-2 (within components)
- Component padding: p-4, p-6 (cards, buttons)
- Section spacing: p-8, gap-8, my-12 (layout structure)
- Major spacing: p-16, gap-16 (hero areas, feature separation)

**Grid Structure**:
- Sidebar: 280px fixed width (w-70)
- Main content: flex-1 with max-w-7xl container
- File grid: grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4

## Component Library

### Navigation & Structure
- **Top Bar**: Fixed header with breadcrumb navigation, view toggles, search bar - white background with subtle shadow
- **Sidebar**: Tree navigation with nested folders, smooth expand/collapse animations, color-coded icons
- **Breadcrumbs**: Large, clickable path segments with "/" separators and hover states

### File Management
- **Bucket Cards**: Vibrant gradient backgrounds, white text, large icons, hover lift effect (shadow-xl on hover)
- **File Grid Items**: White cards with rounded corners (rounded-xl), file type color accent on top border, thumbnail preview, action buttons on hover
- **List View Items**: Compact rows with icon, name, size, date, hover background color
- **Empty States**: Centered illustrations with playful colors, encouraging copy, primary CTA button

### Upload Experience
- **Drop Zone**: Dashed border (border-dashed border-4) in brand primary color, large upload icon, "Drop files here" text, transforms to solid border on drag-over with background tint
- **Upload Progress**: Individual cards for each file with circular progress indicator, color transitions from amber (uploading) to green (complete)
- **Upload Preview**: Thumbnail grid showing selected files before upload confirmation, colorful "Upload All" button

### Interactive Elements
- **Primary Buttons**: Solid brand primary background, white text, rounded-lg, hover shadow and slight scale (hover:scale-105)
- **Secondary Buttons**: Outlined style with brand primary border, hover fills with primary color
- **Icon Buttons**: Circular, subtle background on hover, colorful icon in brand primary
- **Copy URL Field**: White input with brand primary border, integrated copy button, success animation (green checkmark) on copy

### Overlays & Modals
- **Image Preview Modal**: Dark overlay (bg-black/80), centered white card with image, URL copy field below, close button top-right
- **Create Folder Modal**: Centered white card with clean input, validation feedback, create/cancel buttons
- **Toast Notifications**: Slide in from top-right, color-coded by type (green success, red error), auto-dismiss with progress bar

## Visual Effects & Motion

**Animations** (use sparingly):
- Card hover: translate-y-1 and shadow elevation (transition-all duration-200)
- Button clicks: scale-95 active state
- File upload: fade-in-up for each new file item
- Copy success: checkmark scale-in animation
- Modal open: fade + scale-95 to scale-100

**Micro-interactions**:
- File type icons pulse on hover
- Progress bars smooth fill animation
- Drag-over state: drop zone background tint with scale-102
- URL copy: button transforms to checkmark with green background

## Key Screens Layout

### Bucket Selection Screen
- Full viewport hero with gradient background (brand primary to accent)
- Centered search bar with large, bold heading
- Bucket grid below with 3-4 columns, vibrant cards with metadata
- Each card shows bucket name, region badge, file count

### File Explorer View
- **Left Sidebar (280px)**: Tree navigation, current bucket name at top, "New Folder" button, folder structure with expand/collapse
- **Main Area**: 
  - Top bar: Breadcrumb (large text), view toggle (grid/list), search, upload button (vibrant, prominent)
  - Drop zone: Full-width, collapsible when not in use, expands on drag-over
  - File grid: Colorful thumbnails, file names, hover actions (preview, copy URL, delete)
- **Bottom Toast Area**: Fixed position for upload progress and notifications

### Image Preview
- Centered modal with white card
- Large image preview with zoom controls
- URL copy field below with one-click copy
- File metadata sidebar (name, size, upload date)

## Accessibility & Responsive Design

- All colors meet WCAG AA contrast ratios
- Focus states: 2px solid ring in brand primary
- Mobile (<768px): Single column layout, collapsible sidebar, larger touch targets (min 44px)
- Tablet (768-1024px): Two-column file grid, persistent sidebar
- Desktop (>1024px): Full layout with 4-6 column grid

## Images

**Hero/Empty State Illustrations**: Use abstract, colorful file management illustrations (folders with sparkles, upload clouds, file stacks) from services like unDraw or Storyset with customized brand colors

**File Thumbnails**: Auto-generated for images, colorful icon placeholders for other file types using file type color palette