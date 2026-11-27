import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ListVideo, LockKeyhole } from 'lucide-react';
import { api } from '../services/api';
import type { Detail, VideoSource } from '../services/types';
import { ErrorState, Skeleton } from '../components/common';
import MediaPlayer from '../components/MediaPlayer';
export default function Player() {
  const { id = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const [refresh, setRefresh] = useState(0);
  const [range, setRange] = useState(0);
  const [autoNext, setAutoNext] = useState(true);
  const detail = useQuery({
    queryKey: ['detail', id],
    queryFn: ({ signal }) => api<Detail>(`dramas/${encodeURIComponent(id)}`, signal),
    staleTime: 60_000,
  });
  const drama = detail.data;
  const episode =
    drama?.episodes.find((item) => item.id === params.get('episode')) ||
    drama?.episodes.find((item) => item.available) ||
    drama?.episodes[0];
  const source = useQuery({
    queryKey: ['source', id, episode?.id, refresh],
    enabled: !!episode?.available,
    queryFn: ({ signal }) =>
      api<VideoSource>(
        `dramas/${encodeURIComponent(id)}/episodes/${episode!.id}${refresh ? '?refresh=1' : ''}`,
        signal,
      ),
    staleTime: 30_000,
    retry: false,
  });
  const index = drama?.episodes.findIndex((item) => item.id === episode?.id) ?? -1;
  useEffect(() => {
    if (index >= 0) setRange(Math.floor(index / 30));
  }, [index, id]);
  const previous = drama?.episodes
    .slice(0, index)
    .reverse()
    .find((item) => item.available);
  const next = drama?.episodes.slice(index + 1).find((item) => item.available);
  const changeEpisode = (episodeId: string) => {
    setParams({ episode: episodeId }, { replace: true });
    const idx = drama?.episodes.findIndex((item) => item.id === episodeId) ?? 0;
    setRange(Math.floor(idx / 30));
  };
  return (
    <div className="page-content watch-page">
      <Link className="back-link" to="/discover">
        <ArrowLeft size={19} />
        Danh sách phim
      </Link>
      {detail.isPending ? (
        <Skeleton count={5} />
      ) : detail.isError ? (
        <ErrorState error={detail.error} retry={() => void detail.refetch()} />
      ) : (
        drama && (
          <div className="watch-layout">
            <section className="watch-stage" aria-label="Trình phát phim">
              {episode?.available ? (
                source.isPending ? (
                  <div className="media-shell">
                    <div className="media-loading" role="status" aria-label="Đang tải nguồn phát">
                      <span className="spinner" />
                    </div>
                  </div>
                ) : source.isError ? (
                  <div className="media-shell">
                    <ErrorState error={source.error} retry={() => setRefresh((v) => v + 1)} />
                  </div>
                ) : (
                  source.data && (
                    <MediaPlayer
                      key={`${episode.id}:${refresh}`}
                      source={source.data}
                      poster={drama.cover}
                      autoStart={!!params.get('episode')}
                      onEnded={() => {
                        if (autoNext && next) changeEpisode(next.id);
                      }}
                      onRetry={() => setRefresh((v) => v + 1)}
                    />
                  )
                )
              ) : (
                <div className="media-shell">
                  <p className="unavailable">Tập này chưa được mở cho khách.</p>
                </div>
              )}
              <div className="episode-navigation">
                <button
                  className="button secondary"
                  disabled={!previous}
                  onClick={() => previous && changeEpisode(previous.id)}
                >
                  <ChevronLeft size={18} />
                  Tập trước
                </button>
                <span>Tập {episode?.number || '—'}</span>
                <button
                  className="button secondary"
                  disabled={!next}
                  onClick={() => next && changeEpisode(next.id)}
                >
                  Tập tiếp
                  <ChevronRight size={18} />
                </button>
              </div>
              <label className="autoplay">
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={(e) => setAutoNext(e.target.checked)}
                />
                Tự phát tập tiếp theo
              </label>
            </section>
            <aside className="watch-info">
              <p className="eyebrow">{drama.episodeCount} TẬP · PHIM NGẮN</p>
              <h1>{drama.title}</h1>
              <div className="tags">
                {drama.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              {drama.description && <p className="description">{drama.description}</p>}
              <div className="section-heading">
                <h2>
                  <ListVideo size={20} />
                  Danh sách tập
                </h2>
              </div>
              {drama.episodes.length > 30 && (
                <div className="episode-ranges">
                  {Array.from({ length: Math.ceil(drama.episodes.length / 30) }, (_, i) => (
                    <button
                      className={range === i ? 'active' : ''}
                      key={i}
                      onClick={() => setRange(i)}
                    >
                      {i * 30 + 1}–{Math.min((i + 1) * 30, drama.episodes.length)}
                    </button>
                  ))}
                </div>
              )}
              <div className="episodes-grid">
                {drama.episodes.slice(range * 30, range * 30 + 30).map((item) => (
                  <button
                    key={item.id}
                    className={item.id === episode?.id ? 'active' : ''}
                    aria-label={`Tập ${item.number}${item.available ? '' : ', chưa mở cho khách'}`}
                    aria-current={item.id === episode?.id ? 'true' : undefined}
                    disabled={!item.available}
                    onClick={() => changeEpisode(item.id)}
                  >
                    {!item.available && <LockKeyhole size={12} />}
                    {item.number}
                  </button>
                ))}
              </div>
              {drama.episodes.some((item) => !item.available) && (
                <p className="availability-note">Một số tập chưa được Pine mở cho khách.</p>
              )}
            </aside>
          </div>
        )
      )}
    </div>
  );
}
