import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { api } from '../services/api';
import type { Page } from '../services/types';
import { DramaGrid, Empty, ErrorState, LoadMore, Skeleton } from '../components/common';
export default function Search() {
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
        <p className="eyebrow">CÂU CHUYỆN NÀO DÀNH CHO BẠN?</p>
        <h1>Tìm kiếm phim</h1>
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
          aria-label="Tên phim"
          autoFocus
          maxLength={150}
          placeholder="Nhập tên phim…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {input && (
          <button
            type="button"
            className="icon-button"
            aria-label="Xóa từ khóa"
            onClick={() => {
              setInput('');
              setParams({});
            }}
          >
            <X size={19} />
          </button>
        )}
        <button className="button" type="submit" disabled={!input.trim()}>
          Tìm kiếm
        </button>
      </form>
      {!q ? (
        <Empty
          title="Bắt đầu với một tên phim"
          description="Nhập từ khóa để tìm những câu chuyện bạn muốn xem."
        />
      ) : (
        <>
          <div className="section-heading">
            <h2>Kết quả cho “{q}”</h2>
          </div>
          {query.isPending ? (
            <Skeleton />
          ) : query.isError && !items.length ? (
            <ErrorState error={query.error} retry={() => void query.refetch()} />
          ) : items.length ? (
            <DramaGrid items={items} />
          ) : (
            <Empty title="Không tìm thấy phim" description="Thử tên phim hoặc từ khóa khác." />
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
