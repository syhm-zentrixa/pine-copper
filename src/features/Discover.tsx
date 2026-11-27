import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import type { Page } from '../services/types';
import { DramaGrid, Empty, ErrorState, LoadMore, Skeleton } from '../components/common';
import { useLanguage } from '../i18n';
export default function Discover() {
  const { t } = useLanguage();
  const query = useInfiniteQuery({
    queryKey: ['catalog'],
    initialPageParam: '',
    queryFn: ({ pageParam, signal }) =>
      api<Page>(`dramas?cursor=${encodeURIComponent(pageParam)}`, signal),
    getNextPageParam: (last, _, previous, cursors) =>
      last.next && last.next !== previous && !cursors.includes(last.next) ? last.next : undefined,
  });
  const items = [
    ...new Map(
      query.data?.pages.flatMap((page) => page.items).map((item) => [item.id, item]) || [],
    ).values(),
  ];
  return (
    <div className="page-content">
      <section className="catalog-heading">
        <div>
          <p className="eyebrow">{t('A little time, a new story')}</p>
          <h1>{t('Short dramas, lasting feelings.')}</h1>
          <p className="lead">{t('Find your next story and start watching.')}</p>
        </div>
        <Link className="catalog-search" to="/search">
          <Search size={21} />
          <span>{t('Search for a movie')}</span>
        </Link>
      </section>
      <div className="section-heading">
        <h2>{t('Discover movies')}</h2>
        <span>{t('Recommended for you')}</span>
      </div>
      {query.isPending ? (
        <Skeleton />
      ) : query.isError && !items.length ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : items.length ? (
        <DramaGrid items={items} />
      ) : (
        <Empty title="Chưa có phim" description="Vui lòng quay lại sau." />
      )}
      {query.isFetchNextPageError && (
        <ErrorState error={query.error} retry={() => void query.fetchNextPage()} />
      )}
      <LoadMore
        hasNext={!!query.hasNextPage}
        loading={query.isFetchingNextPage}
        onLoad={() => {
          if (!query.isFetching) void query.fetchNextPage();
        }}
      />
    </div>
  );
}
