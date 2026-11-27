import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import type { Page } from '../services/types';
import { DramaGrid, Empty, ErrorState, LoadMore, Skeleton } from '../components/common';
export default function Discover() {
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
          <p className="eyebrow">MỘT CHÚT THỜI GIAN, MỘT CÂU CHUYỆN MỚI</p>
          <h1>Phim ngắn, cảm xúc dài.</h1>
          <p className="lead">Tìm câu chuyện tiếp theo và bắt đầu xem.</p>
        </div>
        <Link className="catalog-search" to="/search">
          <Search size={21} />
          <span>Tìm tên phim bạn yêu thích</span>
        </Link>
      </section>
      <div className="section-heading">
        <h2>Khám phá phim</h2>
        <span>Được đề xuất cho bạn</span>
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
