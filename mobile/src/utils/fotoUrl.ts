import { getEnvironment } from '../config/env';
import { getAccessToken } from '../auth/tokenStorage';

/**
 * Build the full URL to a person's photo.
 * The API serves photos at: GET /pessoa/foto/uploads/pessoa/{fileName}
 * Requires Bearer token.
 */
export function buildFotoUrl(fotoPath: string | null | undefined): string | null {
  if (!fotoPath) return null;
  const { url } = getEnvironment();
  const base = (url ?? '').replace(/\/$/, '');
  if (!base) return null;

  // If fotoPath already contains the full path
  if (fotoPath.startsWith('http')) return fotoPath;

  // The foto field usually contains just the filename or relative path
  const cleanPath = fotoPath.startsWith('/') ? fotoPath : `/pessoa/foto/uploads/pessoa/${fotoPath}`;
  return `${base}${cleanPath}`;
}

/**
 * Get auth headers for fetching photos.
 */
export async function getFotoHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
