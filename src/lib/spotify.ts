// Types the Spotify iFrame API can render in an embed.
const EMBEDDABLE_TYPES = [
  "episode",
  "show",
  "track",
  "album",
  "playlist",
  "artist",
] as const;

export type SpotifyEntityType = (typeof EMBEDDABLE_TYPES)[number];

function isEmbeddable(type: string): type is SpotifyEntityType {
  return (EMBEDDABLE_TYPES as readonly string[]).includes(type);
}

/**
 * Normalises a Spotify share link into the `spotify:type:id` URI the iFrame API
 * expects, dropping the `?si=` tracking parameter and any `/intl-xx/` locale
 * prefix. Returns null for anything that isn't an embeddable Spotify entity so
 * callers can fall back to a plain link.
 */
export function toSpotifyUri(input?: string | null): string | null {
  if (!input) return null;
  const value = input.trim();
  if (!value) return null;

  const asUri = value.match(/^spotify:([a-z]+):([A-Za-z0-9]+)$/);
  if (asUri) {
    const [, type, id] = asUri;
    return isEmbeddable(type) ? `spotify:${type}:${id}` : null;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  if (!/(^|\.)spotify\.com$/.test(parsed.hostname)) return null;

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments[0]?.startsWith("intl-")) segments.shift();

  const [type, id] = segments;
  if (!type || !id) return null;
  if (!isEmbeddable(type)) return null;
  if (!/^[A-Za-z0-9]+$/.test(id)) return null;

  return `spotify:${type}:${id}`;
}

/** Formats a duration in seconds as m:ss (or h:mm:ss past an hour). */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}
