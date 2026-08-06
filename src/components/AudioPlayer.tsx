import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatTime } from "@/lib/spotify";

export interface AudioPlayerProps {
  /** Direct URL to an audio file, typically an RSS <enclosure> URL. */
  src: string;
  /** Accessible name, usually the episode title. */
  title: string;
}

/**
 * A self-contained play/pause/scrub player over a plain <audio> element. Used
 * when an episode carries its own audioUrl; episodes that only have a Spotify
 * link fall back to SpotifyEmbed.
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    const onError = () => setFailed(true);

    // Metadata often loads before this effect attaches its listeners, in which
    // case loadedmetadata has already fired and would never set the duration.
    onLoaded();

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      // Autoplay policies reject play() until the user interacts with the page.
      void audio.play().catch(() => setFailed(true));
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number(event.target.value);
    audio.currentTime = next;
    setCurrentTime(next);
  }, []);

  if (failed) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:underline"
      >
        Download audio for {title}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-3 py-2">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={`${playing ? "Pause" : "Play"} ${title}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white transition hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
      >
        {playing ? (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg
            className="ml-0.5 h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
          </svg>
        )}
      </button>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={currentTime}
        onChange={seek}
        disabled={!duration}
        aria-label={`Seek within ${title}`}
        className="h-1 grow cursor-pointer appearance-none rounded-full bg-gray-300 accent-green-600 disabled:cursor-not-allowed"
      />

      <span className="shrink-0 font-mono text-xs tabular-nums text-gray-600">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

export default AudioPlayer;
