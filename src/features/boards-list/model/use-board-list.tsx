import { rqClient } from '@/shared/api/instance';
import { keepPreviousData } from '@tanstack/react-query';
import { useCallback, type RefCallback } from 'react';

interface BoardsListParams {
  isFavorite?: boolean;
  sort?: 'createdAt' | 'updatedAt' | 'lastOpenedAt' | 'name';
  limit?: number;
  search?: string;
}

export const useBoardList = ({ isFavorite, sort, limit, search }: BoardsListParams) => {
  const { fetchNextPage, data, isFetchingNextPage, isPending, hasNextPage } =
    rqClient.useInfiniteQuery(
      'get',
      '/boards',
      {
        params: {
          query: {
            page: 1,
            limit,
            isFavorite,
            search,
            sort,
          },
        },
      },
      {
        initialPageParam: 1,
        placeholderData: keepPreviousData,
        pageParamName: 'page',
        getNextPageParam: (lastPage, _, lastPageParams) =>
          Number(lastPageParams) < lastPage.totalPages
            ? Number(lastPageParams) + 1
            : null,
      }
    );

  const cursorRef: RefCallback<HTMLDivElement> = useCallback(
    (el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        { threshold: 0.5 }
      );

      if (el) {
        observer.observe(el);

        return () => {
          observer.disconnect();
        };
      }
    },
    [fetchNextPage]
  );

  const boards = data?.pages.flatMap((page) => page.list) ?? [];

  return {
    cursorRef,
    boards,
    isFetchingNextPage,
    hasNextPage,
    isPending,
  };
};
