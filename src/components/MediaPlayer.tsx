import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { mediaUrl } from '../services/api';
import type { VideoSource } from '../services/types';
export default function MediaPlayer({
  source,
  poster,
  autoStart,
  onEnded,
  onRetry,
}: {
  source: VideoSource;
  poster: string;
  autoStart: boolean;
  onEnded: () => void;
  onRetry: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    let hls: import('hls.js').default | undefined;
    setError(false);
    setBusy(true);
    const ready = () => {
      setBusy(false);
      if (autoStart) void video.play().catch(() => {});
    };
    const failed = () => {
      setBusy(false);
      setError(true);
    };
    video.addEventListener('loadedmetadata', ready);
    video.addEventListener('error', failed);
    const timer = setTimeout(failed, 30_000);
    const loaded = () => clearTimeout(timer);
    video.addEventListener('loadeddata', loaded);
    async function load() {
      if (
        /\.m3u8(?:\?|$)/i.test(source.url) &&
        !video!.canPlayType('application/vnd.apple.mpegurl')
      ) {
        const { default: Hls } = await import('hls.js');
        if (disposed) return;
        if (!Hls.isSupported()) return failed();
        hls = new Hls({ maxBufferLength: 20, backBufferLength: 10 });
        hls.loadSource(mediaUrl(source.url));
        hls.attachMedia(video!);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) failed();
        });
      } else video!.src = mediaUrl(source.url);
    }
    void load().catch(failed);
    return () => {
      disposed = true;
      clearTimeout(timer);
      video.removeEventListener('loadedmetadata', ready);
      video.removeEventListener('loadeddata', loaded);
      video.removeEventListener('error', failed);
      hls?.destroy();
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [source.id, source.url, autoStart]);
  return (
    <div className="media-shell">
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        poster={source.cover || poster}
        onEnded={onEnded}
        aria-label={`Đang xem tập ${source.number}`}
      />
      {busy && !error && (
        <div className="media-loading" role="status" aria-label="Đang tải video">
          <span className="spinner" />
        </div>
      )}
      {error && (
        <div className="media-error" role="alert">
          <p>Không phát được tập này. Vui lòng tải lại nguồn phát.</p>
          <button className="button secondary" onClick={onRetry}>
            <RefreshCw size={17} />
            Tải lại
          </button>
        </div>
      )}
    </div>
  );
}
