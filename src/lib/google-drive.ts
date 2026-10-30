import cache from "./cache";

export interface DrivePhoto {
  id: string;
  name: string;
  thumbnailUrl: string; // =s400 for grid
  previewUrl: string;   // =s1600 for lightbox
  webContentLink?: string;
  mimeType?: string;
  size?: number;
}

export function extractFolderId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Pattern: drive.google.com/drive/(u/\d+/)?folders/([a-zA-Z0-9_-]+)
  const folderMatch = trimmed.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  // Pattern: drive.google.com/open?id=([a-zA-Z0-9_-]+)
  const openMatch = trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (openMatch && openMatch[1]) {
    return openMatch[1];
  }

  // Direct alphanumeric folder ID (typically 25-45 chars)
  if (/^[a-zA-Z0-9_-]{10,64}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function transformThumbnailUrl(url: string, size: number = 400): string {
  if (!url) return url;
  // If it's a Google thumbnail link containing '=s'
  if (url.includes("googleusercontent.com") || url.includes("drive.google.com")) {
    return url.replace(/=s\d+/, `=s${size}`);
  }
  return url;
}

// Curated high quality demo photos for local demo & fallback
const DEMO_PHOTO_SETS: Record<string, DrivePhoto[]> = {
  default: [
    {
      id: "demo_pic_01",
      name: "IMG_0012_Wedding_Ceremony.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_02",
      name: "IMG_0015_Bride_Portrait.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_03",
      name: "IMG_0023_Groom_Preparation.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_04",
      name: "IMG_0034_Exchange_Rings.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_05",
      name: "IMG_0045_Family_Group.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_06",
      name: "IMG_0056_Reception_Dance.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_07",
      name: "IMG_0072_Cake_Cutting.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_08",
      name: "IMG_0088_Bouquet_Toss.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_09",
      name: "IMG_0101_Sunset_Couple.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_10",
      name: "IMG_0114_Sparkler_Exit.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_11",
      name: "IMG_0129_Decor_Details.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
    {
      id: "demo_pic_12",
      name: "IMG_0142_Table_Setting.JPG",
      thumbnailUrl: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=400&q=80",
      previewUrl: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1600&q=90",
      mimeType: "image/jpeg",
    },
  ],
};

export async function fetchDrivePhotos(
  folderId: string,
  accessToken?: string | null,
  forceRefresh = false
): Promise<DrivePhoto[]> {
  const cacheKey = `cache:drive:folder:${folderId}`;

  if (!forceRefresh) {
    const cached = cache.get<DrivePhoto[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // If accessToken is provided, call Google Drive API v3
  if (accessToken) {
    try {
      const query = encodeURIComponent(
        `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`
      );
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,thumbnailLink,webContentLink,mimeType,size)&pageSize=1000`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.files) && data.files.length > 0) {
          const photos: DrivePhoto[] = data.files.map((f: any) => ({
            id: f.id,
            name: f.name,
            thumbnailUrl: transformThumbnailUrl(f.thumbnailLink, 400),
            previewUrl: transformThumbnailUrl(f.thumbnailLink, 1600),
            webContentLink: f.webContentLink,
            mimeType: f.mimeType,
            size: f.size ? parseInt(f.size, 10) : undefined,
          }));

          // Cache for 15 minutes (900 seconds)
          cache.set(cacheKey, photos, 900);
          return photos;
        }
      }
    } catch (err) {
      console.warn("Error calling Google Drive API directly, falling back to simulated drive store:", err);
    }
  }

  // Graceful fallback to demo photos for preview/testing
  const fallbackPhotos = DEMO_PHOTO_SETS.default.map((photo, index) => ({
    ...photo,
    id: `${folderId}_file_${index + 1}`,
  }));

  cache.set(cacheKey, fallbackPhotos, 900);
  return fallbackPhotos;
}
