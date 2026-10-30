import cache from "./cache";

export interface DrivePhoto {
  id: string;
  name: string;
  thumbnailUrl: string; // =s400 for grid
  previewUrl: string;   // =s1600 for lightbox HD
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

  // Pattern: drive.google.com/file/d/([a-zA-Z0-9_-]+)
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return fileMatch[1];
  }

  // Pattern: drive.google.com/open?id=([a-zA-Z0-9_-]+)
  const openMatch = trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (openMatch && openMatch[1]) {
    return openMatch[1];
  }

  // Direct alphanumeric folder ID (typically 10-64 chars)
  if (/^[a-zA-Z0-9_-]{10,64}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function transformThumbnailUrl(url: string, size: number = 400): string {
  if (!url) return url;
  if (url.includes("googleusercontent.com") || url.includes("drive.google.com")) {
    if (url.includes("=s")) {
      return url.replace(/=s\d+/, `=s${size}`);
    }
    return `${url}=s${size}`;
  }
  return url;
}

export function buildGoogleCdnUrl(fileId: string, size: number = 400): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=s${size}`;
}

export async function fetchDrivePhotos(
  folderId: string,
  accessToken?: string | null,
  customApiKey?: string | null,
  forceRefresh = false
): Promise<DrivePhoto[]> {
  const cacheKey = `cache:drive:folder:${folderId}`;

  if (!forceRefresh) {
    const cached = cache.get<DrivePhoto[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const apiKey = customApiKey || process.env.GOOGLE_DRIVE_API_KEY;

  // 1. If accessToken is provided (Google OAuth), query Google Drive API v3
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
            thumbnailUrl: f.thumbnailLink ? transformThumbnailUrl(f.thumbnailLink, 400) : buildGoogleCdnUrl(f.id, 400),
            previewUrl: f.thumbnailLink ? transformThumbnailUrl(f.thumbnailLink, 1600) : buildGoogleCdnUrl(f.id, 1600),
            webContentLink: f.webContentLink,
            mimeType: f.mimeType,
            size: f.size ? parseInt(f.size, 10) : undefined,
          }));

          cache.set(cacheKey, photos, 900); // 15 mins TTL
          return photos;
        }
      }
    } catch (err) {
      console.error("Error fetching Google Drive with OAuth access token:", err);
    }
  }

  // 2. If API Key is provided, query Google Drive API v3 for public shared folder
  if (apiKey) {
    try {
      const query = encodeURIComponent(
        `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`
      );
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}&fields=files(id,name,thumbnailLink,webContentLink,mimeType,size)&pageSize=1000`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.files) && data.files.length > 0) {
          const photos: DrivePhoto[] = data.files.map((f: any) => ({
            id: f.id,
            name: f.name,
            thumbnailUrl: f.thumbnailLink ? transformThumbnailUrl(f.thumbnailLink, 400) : buildGoogleCdnUrl(f.id, 400),
            previewUrl: f.thumbnailLink ? transformThumbnailUrl(f.thumbnailLink, 1600) : buildGoogleCdnUrl(f.id, 1600),
            webContentLink: f.webContentLink,
            mimeType: f.mimeType,
            size: f.size ? parseInt(f.size, 10) : undefined,
          }));

          cache.set(cacheKey, photos, 900);
          return photos;
        }
      }
    } catch (err) {
      console.error("Error fetching Google Drive with API key:", err);
    }
  }

  // No dummy data! Return empty array so caller can handle real situation
  return [];
}
