import { useState } from 'react';

export type BoardsSortOption = 'createdAt' | 'updatedAt' | 'lastOpenedAt' | 'name';

export interface BoardsFilters {
  sort: BoardsSortOption;
  search: string;
}

export const useBoardsFilters = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<BoardsSortOption>('lastOpenedAt');

  return {
    search,
    sort,
    setSearch,
    setSort,
  };
};
