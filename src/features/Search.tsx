import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { api } from '../services/api';
import type { Page } from '../services/types';
import { DramaGrid, Empty, ErrorState, LoadMore, Skeleton } from '../components/common';
import { useLanguage } from '../i18n';
export default function Search() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const q = params.get('q')?.trim() || '';
  const [input, setInput] = useState(q);
  useEffect(() => setInput(q), [q]);
  const query = useInfiniteQuery({
    queryKey: ['search', q],
    enabled: !!q,
    initialPageParam: '',
    queryFn: ({ pageParam, signal }) =>
      api<Page>(
        `search?q=${encodeURIComponent(q)}&cursor=${encodeURIComponent(pageParam)}`,
        signal,
      ),
    getNextPageParam: (last, _, previous, cursors) =>
      last.next && last.next !== previous && !cursors.includes(last.next) ? last.next : undefined,
  });
  const items = [
    ...new Map(
      query.data?.pages.flatMap((page) => page.items).map((item) => [item.id, item]) || [],
    ).values(),
  ];
  return (
    <div className="page-content search-page">
      <div className="page-heading">
        <p className="eyebrow">{t('Movie search')}</p>
        <h1>{t('Search')}</h1>
      </div>
      <form
        className="search-box"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(input.trim() ? { q: input.trim() } : {});
        }}
      >
        <SearchIcon size={23} />
        <input
          aria-label={t('Movie title')}
          autoFocus
          maxLength={150}
          placeholder={t('Enter a title…')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {input && (
          <button
            type="button"
            className="icon-button"
            aria-label={t('Clear search')}
            onClick={() => {
              setInput('');
              setParams({});
            }}
          >
            <X size={19} />
          </button>
        )}
        <button className="button" type="submit" disabled={!input.trim()}>
          {t('Search movies')}
        </button>
      </form>
      {!q ? (
        <Empty
          title={t('Start with a movie title')}
          description={t('Enter a keyword to find a story.')}
        />
      ) : (
        <>
          <div className="section-heading">
            <h2>
              {t('Results for')} “{q}”
            </h2>
          </div>
          {query.isPending ? (
            <Skeleton />
          ) : query.isError && !items.length ? (
            <ErrorState error={query.error} retry={() => void query.refetch()} />
          ) : items.length ? (
            <DramaGrid items={items} />
          ) : (
            <Empty title={t('No movies found')} description={t('Try another title or keyword.')} />
          )}
          {query.isFetchNextPageError && (
            <ErrorState error={query.error} retry={() => void query.fetchNextPage()} />
          )}
          <LoadMore
            hasNext={!!query.hasNextPage}
            loading={query.isFetchingNextPage}
            onLoad={() => void query.fetchNextPage()}
          />
        </>
      )}
    </div>
  );
}
