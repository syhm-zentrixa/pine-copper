import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Page } from '../services/types';
import { DramaGrid, Empty, ErrorState, LoadMore, Skeleton } from '../components/common';

export default function Categories() {
  const [params, setParams] = useSearchParams();
  const selected = params.get('category') || '';
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
  const categories = [...new Set(items.flatMap((item) => item.tags))].sort((a, b) =>
    a.localeCompare(b, 'vi'),
  );
  const filtered = selected ? items.filter((item) => item.tags.includes(selected)) : items;

  return (
    <div className="page-content categories-page">
      <div className="page-heading">
        <p className="eyebrow">PINE COLLECTION</p>
        <h1>Categories</h1>
        <p className="lead">Khám phá phim theo chủ đề.</p>
      </div>
      {query.isPending ? (
        <Skeleton />
      ) : query.isError && !items.length ? (
        <ErrorState error={query.error} retry={() => void query.refetch()} />
      ) : (
        <>
          <div className="category-list" aria-label="Thể loại phim">
            <button
              className={!selected ? 'active' : ''}
              aria-pressed={!selected}
              onClick={() => setParams({})}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={selected === category ? 'active' : ''}
                aria-pressed={selected === category}
                onClick={() => setParams({ category })}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="section-heading">
            <h2>{selected || 'Tất cả phim'}</h2>
            <span>{filtered.length} phim đã tải</span>
          </div>
          {filtered.length ? (
            <DramaGrid items={filtered} />
          ) : (
            <Empty
              title="Chưa có phim trong chủ đề này"
              description="Tải thêm phim để mở rộng danh sách chủ đề."
            />
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
        </>
      )}
    </div>
  );
}
