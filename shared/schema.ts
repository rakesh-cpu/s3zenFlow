import { z } from "zod";

// S3 Bucket schema
export const s3BucketSchema = z.object({
  name: z.string(),
  creationDate: z.string().optional(),
  region: z.string().optional(),
});

export type S3Bucket = z.infer<typeof s3BucketSchema>;

// S3 Object (file or folder) schema
export const s3ObjectSchema = z.object({
  key: z.string(),
  size: z.number().optional(),
  lastModified: z.string().optional(),
  isFolder: z.boolean(),
  url: z.string().optional(),
  type: z.string().optional(),
});

export type S3Object = z.infer<typeof s3ObjectSchema>;

// Upload file schema
export const uploadFileSchema = z.object({
  bucket: z.string(),
  key: z.string(),
  file: z.any(),
});

export type UploadFile = z.infer<typeof uploadFileSchema>;

// Create folder schema
export const createFolderSchema = z.object({
  bucket: z.string(),
  folderPath: z.string(),
});

export type CreateFolder = z.infer<typeof createFolderSchema>;

// List objects request schema
export const listObjectsSchema = z.object({
  bucket: z.string(),
  prefix: z.string().optional(),
});

export type ListObjectsRequest = z.infer<typeof listObjectsSchema>;

// Presigned URL request schema
export const presignedUrlSchema = z.object({
  bucket: z.string(),
  key: z.string(),
});

export type PresignedUrlRequest = z.infer<typeof presignedUrlSchema>;

// File type utilities
export const getFileType = (key: string): string => {
  const ext = key.split('.').pop()?.toLowerCase() || '';
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  const videoExts = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];
  const documentExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
  const codeExts = ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (documentExts.includes(ext)) return 'document';
  if (codeExts.includes(ext)) return 'code';
  
  return 'file';
};

export const isImageFile = (key: string): boolean => {
  return getFileType(key) === 'image';
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};
