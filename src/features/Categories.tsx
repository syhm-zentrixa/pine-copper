import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import type { Category, Page } from '../services/types';
import { DramaGrid, Empty, ErrorState, LoadMore, Skeleton } from '../components/common';
import { translateCategory, useLanguage } from '../i18n';

function nextPage(last: Page, _pages: Page[], previous: string, cursors: string[]) {
  return last.next && last.next !== previous && !cursors.includes(last.next)
    ? last.next
    : undefined;
}

export default function Categories() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('category') || '';
  const { language, t } = useLanguage();
  const overview = useInfiniteQuery({
    queryKey: ['catalog', 'category-index'],
    initialPageParam: '',
    queryFn: ({ pageParam, signal }) =>
      api<Page>(`dramas?cursor=${encodeURIComponent(pageParam)}`, signal),
    getNextPageParam: nextPage,
    staleTime: 5 * 60_000,
  });
  const categories = [
    ...new Map(
      overview.data?.pages
        .flatMap((page) => page.categories || [])
        .map((category) => [category.id, category]) || [],
    ).values(),
  ];
  const selected = categories.find((category) => category.id === selectedId);
  const feed = useInfiniteQuery({
    queryKey: ['catalog', 'category', selectedId],
    enabled: !!selectedId,
    initialPageParam: '',
    queryFn: ({ pageParam, signal }) =>
      api<Page>(
        `dramas?category_id=${encodeURIComponent(selectedId)}&cursor=${encodeURIComponent(pageParam)}`,
        signal,
      ),
    getNextPageParam: nextPage,
    staleTime: 60_000,
  });
  const items = [
    ...new Map(
      feed.data?.pages.flatMap((page) => page.items).map((item) => [item.id, item]) || [],
    ).values(),
  ];
  const titleOf = (category: Category) => translateCategory(category.name, language);

  return (
    <div className="page-content categories-page">
      <div className="page-heading">
        <p className="eyebrow">{t('Pine collection')}</p>
        <h1>{selected ? titleOf(selected) : t('Categories')}</h1>
        <p className="lead">{t('Browse by category')}</p>
      </div>
      {overview.isPending ? (
        <Skeleton count={6} />
      ) : overview.isError ? (
        <ErrorState error={overview.error} retry={() => void overview.refetch()} />
      ) : selectedId && !selected ? (
        <ErrorState error={new Error(t('Category is unavailable'))} retry={() => setParams({})} />
      ) : selected ? (
        <>
          <button className="back-link category-back" onClick={() => setParams({})}>
            <ArrowLeft size={18} /> {t('All categories')}
          </button>
          <div className="section-heading">
            <h2>{titleOf(selected)}</h2>
            {items.length > 0 && (
              <span>
                {items.length} {t('movies loaded')}
              </span>
            )}
          </div>
          {feed.isPending ? (
            <Skeleton />
          ) : feed.isError && !items.length ? (
            <ErrorState error={feed.error} retry={() => void feed.refetch()} />
          ) : items.length ? (
            <DramaGrid items={items} />
          ) : (
            <Empty
              title={t('No movies in this category')}
              description={t('Please come back later.')}
            />
          )}
          {feed.isFetchNextPageError && (
            <ErrorState error={feed.error} retry={() => void feed.fetchNextPage()} />
          )}
          <LoadMore
            hasNext={!!feed.hasNextPage}
            loading={feed.isFetchingNextPage}
            onLoad={() => {
              if (!feed.isFetching) void feed.fetchNextPage();
            }}
          />
        </>
      ) : (
        <>
          <div className="category-grid" aria-label={t('Categories')}>
            {categories.map((category, index) => (
              <button
                key={category.id}
                className={`category-tile category-tile-${index % 6}`}
                onClick={() => setParams({ category: category.id })}
              >
                <span className="category-tile-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="category-tile-name">{titleOf(category)}</span>
                <ChevronRight size={19} />
              </button>
            ))}
          </div>
          <LoadMore
            hasNext={!!overview.hasNextPage}
            loading={overview.isFetchingNextPage}
            onLoad={() => {
              if (!overview.isFetching) void overview.fetchNextPage();
            }}
          />
        </>
      )}
    </div>
  );
}
