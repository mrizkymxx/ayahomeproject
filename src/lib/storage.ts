import { supabase } from "@/integrations/supabase/client";

export interface ImageCompressionOptions {
  enabled?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputFormat?: "image/webp" | "image/jpeg";
  minSavingsRatio?: number;
}

export interface UploadOptions {
  folder?: string;
  compression?: ImageCompressionOptions;
}

type UploadOptionsOrFolder = UploadOptions | string;

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  originalSize?: number;
  uploadedSize?: number;
}

const MAX_ORIGINAL_SIZE = 20 * 1024 * 1024;
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const DEFAULT_COMPRESSION: Required<Omit<ImageCompressionOptions, "enabled">> = {
  maxWidth: 2400,
  maxHeight: 2400,
  quality: 0.9,
  outputFormat: "image/webp",
  minSavingsRatio: 0.08,
};

function canCompress(file: File): boolean {
  return /^image\/(jpeg|jpg|png|webp)$/i.test(file.type);
}

function replaceExtension(fileName: string, ext: string): string {
  const idx = fileName.lastIndexOf(".");
  if (idx === -1) return `${fileName}.${ext}`;
  return `${fileName.slice(0, idx)}.${ext}`;
}

function normalizeFolder(folder?: string): string {
  if (!folder) return "";
  return folder
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("/");
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const blobUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image file"));
      img.src = blobUrl;
    });
    return img;
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function calcTargetSize(width: number, height: number, maxWidth: number, maxHeight: number) {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

async function compressImage(file: File, options?: ImageCompressionOptions): Promise<File> {
  const compressionEnabled = options?.enabled ?? true;
  if (!compressionEnabled || !canCompress(file)) return file;

  const resolved = { ...DEFAULT_COMPRESSION, ...options };
  const source = await loadImage(file);
  const target = calcTargetSize(source.naturalWidth, source.naturalHeight, resolved.maxWidth, resolved.maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return file;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, target.width, target.height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, resolved.outputFormat, resolved.quality);
  });

  if (!blob) return file;

  const targetSize = blob.size;
  const minExpectedSize = file.size * (1 - resolved.minSavingsRatio);
  if (targetSize >= minExpectedSize) {
    return file;
  }

  const nextName =
    resolved.outputFormat === "image/webp"
      ? replaceExtension(file.name, "webp")
      : replaceExtension(file.name, "jpg");

  return new File([blob], nextName, {
    type: resolved.outputFormat,
    lastModified: Date.now(),
  });
}

function buildFilePath(fileName: string, folder?: string): string {
  const cleanFolder = normalizeFolder(folder);
  return cleanFolder ? `${cleanFolder}/${fileName}` : fileName;
}

function resolveUploadOptions(optionsOrFolder?: UploadOptionsOrFolder): UploadOptions {
  if (!optionsOrFolder) return {};
  if (typeof optionsOrFolder === "string") return { folder: optionsOrFolder };
  return optionsOrFolder;
}

export async function uploadImage(
  bucket: string,
  file: File,
  optionsOrFolder?: UploadOptionsOrFolder,
): Promise<UploadResult> {
  try {
    const options = resolveUploadOptions(optionsOrFolder);

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image." };
    }

    if (file.size > MAX_ORIGINAL_SIZE) {
      return {
        success: false,
        error: "Original image is too large. Max 20MB before compression.",
      };
    }

    const prepared = await compressImage(file, options?.compression);

    if (prepared.size > MAX_UPLOAD_SIZE) {
      return {
        success: false,
        error: "Compressed image is still too large. Please use an image below 5MB.",
        originalSize: file.size,
        uploadedSize: prepared.size,
      };
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const ext = prepared.name.split(".").pop() || "jpg";
    const fileName = `${timestamp}-${random}.${ext}`;
    const filePath = buildFilePath(fileName, options?.folder);

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, prepared, {
      cacheControl: "3600",
      upsert: false,
      contentType: prepared.type || file.type,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        originalSize: file.size,
        uploadedSize: prepared.size,
      };
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      url: publicData.publicUrl,
      path: data.path,
      originalSize: file.size,
      uploadedSize: prepared.size,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}

export async function uploadMultipleImages(
  bucket: string,
  files: File[],
  optionsOrFolder?: UploadOptionsOrFolder,
): Promise<UploadResult[]> {
  const options = resolveUploadOptions(optionsOrFolder);
  const tasks = files.map((file) => uploadImage(bucket, file, options));
  return Promise.all(tasks);
}

export async function deleteImage(
  bucket: string,
  path: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown delete error",
    };
  }
}

export function extractStoragePathFromPublicUrl(publicUrl: string, bucket: string): string | null {
  const cleanUrl = publicUrl.split("?")[0];
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = cleanUrl.indexOf(marker);
  if (markerIndex === -1) return null;
  return cleanUrl.slice(markerIndex + marker.length);
}

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function listFiles(bucket: string, folder = "") {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) return { files: [], error: error.message };
    return { files: data, error: null };
  } catch (error) {
    return {
      files: [],
      error: error instanceof Error ? error.message : "Unknown list error",
    };
  }
}

export async function checkBucketExists(bucket: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.getBucket(bucket);
    return !error && Boolean(data);
  } catch {
    return false;
  }
}

export async function createBucket(name: string, isPublic = true) {
  try {
    const { data, error } = await supabase.storage.createBucket(name, {
      public: isPublic,
      fileSizeLimit: MAX_UPLOAD_SIZE,
      allowedMimeTypes: ["image/*"],
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown create bucket error",
    };
  }
}
