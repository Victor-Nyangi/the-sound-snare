import React, { useEffect, useRef, useState } from "react";
import { toSpotifyUri } from "@/lib/spotify";

const IFRAME_API_SRC = "https://open.spotify.com/embed/iframe-api/v1";

type SpotifyController = {
  destroy: () => void;
  loadUri: (uri: string) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
};

type SpotifyIFrameApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyController) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void;
    __spotifyIframeApi?: SpotifyIFrameApi;
  }
}

// The Spotify script fires window.onSpotifyIframeApiReady exactly once, so every
// embed on the page shares a single load. Cached on window because module state
// would reset if this chunk were ever evaluated twice.
let apiPromise: Promise<SpotifyIFrameApi> | null = null;

function loadIFrameApi(): Promise<SpotifyIFrameApi> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<SpotifyIFrameApi>((resolve, reject) => {
    if (window.__spotifyIframeApi) {
      resolve(window.__spotifyIframeApi);
      return;
    }

    window.onSpotifyIframeApiReady = (api) => {
      window.__spotifyIframeApi = api;
      resolve(api);
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${IFRAME_API_SRC}"]`
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = IFRAME_API_SRC;
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("Failed to load the Spotify iFrame API"));
    };
    document.body.appendChild(script);
  });

  return apiPromise;
}

export interface SpotifyEmbedProps {
  /** A Spotify share link or `spotify:type:id` URI. */
  url: string;
  /** Accessible name, usually the episode title. */
  title: string;
  /** 152 suits a compact episode row; 232 shows cover art. */
  height?: number;
}

/**
 * Renders a Spotify entity through the iFrame API. Spotify hosts the audio and
 * handles playback, so no credentials, quota or storage are involved. Visitors
 * signed in to Spotify hear the full episode; anonymous visitors get a preview.
 */
export const SpotifyEmbed: React.FC<SpotifyEmbedProps> = ({
  url,
  title,
  height = 152,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const uri = toSpotifyUri(url);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !uri) return;

    let cancelled = false;
    let controller: SpotifyController | undefined;

    // createController replaces the element it is given, so hand it a child that
    // React does not manage rather than the wrapper itself.
    const host = document.createElement("div");
    wrapper.appendChild(host);

    loadIFrameApi()
      .then((api) => {
        if (cancelled) return;
        api.createController(
          host,
          { uri, width: "100%", height },
          (created) => {
            if (cancelled) {
              created.destroy();
              return;
            }
            controller = created;
          }
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      controller?.destroy();
      wrapper.replaceChildren();
    };
  }, [uri, height]);

  if (!uri || failed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:underline"
      >
        Listen to {title} on Spotify
      </a>
    );
  }

  return (
    <div
      ref={wrapperRef}
      style={{ minHeight: height }}
      className="overflow-hidden rounded-xl bg-gray-100"
      aria-label={`Spotify player for ${title}`}
    />
  );
};

export default SpotifyEmbed;
