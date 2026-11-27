import { CircleAlert, Play, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Drama } from '../services/types';
export function Poster({
  src,
  title,
  eager = false,
}: {
  src: string;
  title: string;
  eager?: boolean;
}) {
  return (
    <img
      src={src || '/assets/img_no_data.webp'}
      alt={title}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/assets/img_no_data.webp';
      }}
    />
  );
}
export function DramaGrid({ items }: { items: Drama[] }) {
  return (
    <div className="drama-grid">
      {items.map((drama) => (
        <article className="drama-card" key={drama.id}>
          <Link to={`/watch/${drama.id}`} className="poster-wrap" aria-label={`Xem ${drama.title}`}>
            <Poster src={drama.cover} title={drama.title} />
            <span className="poster-play">
              <Play size={25} fill="currentColor" />
            </span>
            <span className="episode-badge">{drama.episodeCount} tập</span>
          </Link>
          <Link className="card-title" to={`/watch/${drama.id}`}>
            {drama.title}
          </Link>
          <p className="card-meta">{drama.tags.slice(0, 2).join(' · ') || 'Phim ngắn'}</p>
        </article>
      ))}
    </div>
  );
}
export function Skeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="drama-grid" aria-busy="true" aria-label="Đang tải phim">
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton-card" key={i}>
          <div />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
export function Empty({ title, description }: { title: string; description?: string }) {
  return (
    <div className="empty-state">
      <img src="/assets/img_no_data.webp" alt="" />
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function ErrorState({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="error-state" role="alert">
      <CircleAlert size={28} />
      <h2>Chưa tải được nội dung</h2>
      <p>{error instanceof Error ? error.message : 'Vui lòng thử lại.'}</p>
      <button className="button secondary" onClick={retry}>
        <RefreshCw size={17} />
        Thử lại
      </button>
    </div>
  );
}
export function LoadMore({
  hasNext,
  loading,
  onLoad,
}: {
  hasNext: boolean;
  loading: boolean;
  onLoad: () => void;
}) {
  return hasNext ? (
    <div className="load-more">
      <button className="button secondary" disabled={loading} onClick={onLoad}>
        {loading ? 'Đang tải…' : 'Xem thêm phim'}
      </button>
    </div>
  ) : null;
}
