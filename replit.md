# S3 Bucket File Manager

A stunning, vibrant S3 bucket file manager with beautiful UI, drag-and-drop uploads, and seamless file management.

## Overview

This application provides an elegant interface for managing AWS S3 buckets with a focus on exceptional user experience and visual design. Built with React, TypeScript, and AWS SDK v3, it offers a modern, colorful, and minimalistic approach to cloud storage management.

## Recent Changes (October 15, 2025)

### Complete S3 File Manager Implementation
- **Vibrant UI Design**: Implemented colorful gradient backgrounds, smooth animations, and glassmorphism effects
- **S3 Integration**: Full AWS SDK v3 integration with bucket listing, object browsing, file uploads, and folder creation
- **File Management**: Drag-and-drop upload zone, image preview modal, one-click URL copying, and folder navigation
- **Theme Support**: Light and dark mode toggle with beautiful color schemes
- **Error Handling**: Comprehensive error handling with toast notifications for all operations

## Features

### Bucket Management
- **Visual Bucket Selection**: Animated cards with gradient backgrounds displaying all available S3 buckets
- **Search & Filter**: Real-time bucket search functionality
- **Metadata Display**: Shows bucket region and creation date

### File Explorer
- **Tree Navigation**: Breadcrumb navigation with clickable path segments
- **View Modes**: Toggle between grid and list views
- **File Search**: Real-time file and folder search
- **Drag & Drop Upload**: Beautiful upload zone with multi-file support and progress tracking
- **Folder Creation**: Modal-based folder creation with validation

### Image Management
- **Image Preview**: Full-screen modal preview for image files
- **URL Copying**: One-click URL copying with success animations
- **Thumbnail Display**: Visual file type indicators with color coding

### File Types & Icons
- **Folders**: Blue primary color
- **Images**: Green accent color
- **Videos**: Purple color
- **Documents**: Gray muted color
- **Code Files**: Warning/amber color

## Architecture

### Frontend Structure
- **Pages**: S3Manager (main application page)
- **Components**:
  - BucketSelector: Gradient hero with bucket grid
  - FileExplorer: Main file browsing interface
  - FileGrid: Grid/list view with file actions
  - UploadZone: Drag-and-drop upload area
  - ImagePreviewModal: Full-screen image preview
  - CreateFolderModal: Folder creation dialog
  - ThemeToggle: Light/dark mode switcher

### Backend Structure
- **API Routes** (`server/routes.ts`):
  - `GET /api/buckets` - List all S3 buckets
  - `GET /api/objects?bucket=X&prefix=Y` - List objects in bucket
  - `POST /api/upload` - Upload file with multipart form data
  - `POST /api/folders` - Create folder in bucket

- **S3 Service** (`server/s3.ts`):
  - AWS SDK v3 client configuration
  - Presigned URL generation for secure file access
  - Multipart upload handling with multer

### Data Models (`shared/schema.ts`)
- `S3Bucket`: Bucket metadata
- `S3Object`: File/folder information with URLs
- Utility functions for file type detection and size formatting

## Design System

### Color Palette
- **Primary**: Vibrant blue (217 91% 60%)
- **Accent**: Fresh green (142 76% 36%)
- **Purple**: Rich purple (271 76% 53%)
- **Warning**: Amber (38 92% 50%)
- **Destructive**: Red (0 84% 60%)

### Typography
- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Responsive Sizing**: Mobile-first with breakpoints

### Interactions
- **Hover Effects**: Subtle elevation with `hover-elevate` utility
- **Active States**: Enhanced elevation with `active-elevate-2`
- **Transitions**: Smooth 200ms transitions for all interactive elements

## Environment Variables

Required AWS credentials:
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region (e.g., us-east-1)

## Running the Project

The workflow "Start application" runs `npm run dev` which:
1. Starts Express server on port 5000
2. Serves Vite development frontend
3. Connects to AWS S3 using provided credentials

## User Preferences

### Design Philosophy
- **Vibrant Minimalism**: Bold colors on clean backgrounds
- **Smooth Animations**: All interactions feel polished
- **Responsive Design**: Works beautifully on all screen sizes
- **Dark Mode**: Full support with optimized color schemes

### User Experience Priorities
1. Visual beauty and modern aesthetics
2. Intuitive file management workflows
3. Fast, responsive interactions
4. Clear error messaging and feedback
