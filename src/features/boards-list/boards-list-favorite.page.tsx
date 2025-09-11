import { useBoardList } from './model/use-board-list';
import {
  BoardsListLayout,
  BoardsListLayoutContent,
  BoardsListLayoutHeader,
} from './ui/board-list-layout';
import { ViewModeToggle, type ViewMode } from './ui/view-mode-toggle';
import { useState } from 'react';
import { BoardCard } from './compose/board-card';
import { BoardItem } from './compose/board-item';
import { BoardsListSidebar } from './ui/board-list-sidebar';

function BoardsListFavoritePage() {
  const boardsQuery = useBoardList({
    isFavorite: true,
  });

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <BoardsListLayout
      sidebar={<BoardsListSidebar />}
      header={
        <BoardsListLayoutHeader
          title="Избранные"
          description="Здесь вы можете смотреть доски"
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
  );
}

export const Component = BoardsListFavoritePage;
