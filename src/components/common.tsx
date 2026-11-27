import { CircleAlert, Play, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../services/api';
import { useLanguage } from '../i18n';
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
      src={mediaUrl(src) || '/assets/img_no_data.webp'}
      alt={title}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/assets/img_no_data.webp';
      }}
    />
  );
}
export function DramaGrid({ items }: { items: Drama[] }) {
  const { t } = useLanguage();
  return (
    <div className="drama-grid">
      {items.map((drama, index) => (
        <article className="drama-card" key={drama.id}>
          <Link to={`/watch/${drama.id}`} className="poster-wrap" aria-label={`Xem ${drama.title}`}>
            <Poster src={drama.cover} title={drama.title} eager={index < 3} />
            <span className="poster-play">
              <Play size={25} fill="currentColor" />
            </span>
            <span className="episode-badge">
              {drama.episodeCount} {t('episodes')}
            </span>
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
  const { t } = useLanguage();
  return (
    <div className="drama-grid" aria-busy="true" aria-label={t('Loading movies')}>
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
  const { t } = useLanguage();
  return (
    <div className="error-state" role="alert">
      <CircleAlert size={28} />
      <h2>{t('Could not load content')}</h2>
      <p>{error instanceof Error ? error.message : 'Vui lòng thử lại.'}</p>
      <button className="button secondary" onClick={retry}>
        <RefreshCw size={17} />
        {t('Try again')}
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
  const { t } = useLanguage();
  return hasNext ? (
    <div className="load-more">
      <button className="button secondary" disabled={loading} onClick={onLoad}>
        {loading ? '…' : t('Load more movies')}
      </button>
    </div>
  ) : null;
}
