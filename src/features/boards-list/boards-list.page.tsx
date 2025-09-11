import { Button } from '@/shared/ui/kit/button';
import { Input } from '@/shared/ui/kit/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/kit/select';
import { useBoardList } from './model/use-board-list';
import { useBoardsFilters, type BoardsSortOption } from './model/use-boards-filters';
import { useDebouncedValue } from '@/shared/lib/react';
import { useCreateBoard } from './model/use-create-board';
import {
  BoardsListLayout,
  BoardsListLayoutContent,
  BoardsListLayoutFilters,
  BoardsListLayoutHeader,
} from './ui/board-list-layout';
import { ViewModeToggle, type ViewMode } from './ui/view-mode-toggle';
import { useState } from 'react';
import { BoardCard } from './compose/board-card';
import { BoardItem } from './compose/board-item';
import { BoardsListSidebar } from './ui/board-list-sidebar';
import { TemplatesGallery } from '@/features/board-template';
import { TemplatesModal, useTemplatesModal } from '@/features/board-template';
import { PlusIcon } from 'lucide-react';

function BoardsListPage() {
  const boardsFilters = useBoardsFilters();
  const createBoard = useCreateBoard();
  const boardsQuery = useBoardList({
    sort: boardsFilters.sort,
    search: useDebouncedValue(boardsFilters.search, 500),
  });

  const templatesModal = useTemplatesModal();

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <>
      <BoardsListLayout
        templates={<TemplatesGallery />}
        sidebar={<BoardsListSidebar />}
        header={
          <BoardsListLayoutHeader
            title="Ваши доски"
            description="Здесь вы можете смотреть доски"
            actions={
              <>
                <Button
                  onClick={() => templatesModal.open()}
                  disabled={createBoard.isPending}
                  variant={'secondary'}
                >
                  Выбрать шаблон
                </Button>
                <Button
                  onClick={() => createBoard.createBoard()}
                  disabled={createBoard.isPending}
                >
                  <PlusIcon />
                  Создать доску
                </Button>
              </>
            }
          />
        }
        filters={
          <BoardsListLayoutFilters
            sort={
              <Select
                value={boardsFilters.sort}
                onValueChange={(value) =>
                  boardsFilters.setSort(value as BoardsSortOption)
                }
              >
                <SelectTrigger id="sort" className="w-full">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastOpenedAt">По дате открытия</SelectItem>
                  <SelectItem value="createdAt">По дате создания</SelectItem>
                  <SelectItem value="updatedAt">По дате обновления</SelectItem>
                  <SelectItem value="name">По имени</SelectItem>
                </SelectContent>
              </Select>
            }
            filters={
              <Input
                id="search"
                placeholder="Введите название доски..."
                value={boardsFilters.search}
                onChange={(e) => boardsFilters.setSearch(e.target.value)}
                className="w-full"
              />
            }
            actions={
              <ViewModeToggle value={viewMode} onChange={(value) => setViewMode(value)} />
            }
          />
        }
      >
        <BoardsListLayoutContent
          cursorRef={boardsQuery.cursorRef}
          hasCursor={boardsQuery.hasNextPage}
          isEmpty={boardsQuery.boards.length === 0}
          isPending={boardsQuery.isPending}
          isPendingNext={boardsQuery.isFetchingNextPage}
          mode={viewMode}
          renderGrid={() =>
            boardsQuery.boards.map((board) => <BoardCard key={board.id} board={board} />)
          }
          renderList={() =>
            boardsQuery.boards.map((board) => <BoardItem key={board.id} board={board} />)
          }
        />
      </BoardsListLayout>

      <TemplatesModal />
    </>
  );
}

export const Component = BoardsListPage;
