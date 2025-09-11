import { useBoardList } from './model/use-board-list';
import {
  BoardsListLayout,
  BoardsListLayoutContent,
  BoardsListLayoutGroups,
  BoardsListLayoutHeader,
} from './ui/board-list-layout';
import { ViewModeToggle, type ViewMode } from './ui/view-mode-toggle';
import { useState } from 'react';
import { BoardCard } from './compose/board-card';
import { BoardItem } from './compose/board-item';
import { useRecentGroups } from './model/use-recent-groups';
import { BoardsListSidebar } from './ui/board-list-sidebar';

function BoardsListRecentPage() {
  const boardsQuery = useBoardList({});
  const recentGroups = useRecentGroups(boardsQuery.boards);

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <BoardsListLayout
      sidebar={<BoardsListSidebar />}
      header={
        <BoardsListLayoutHeader
          title="Недавние"
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
      >
        <BoardsListLayoutGroups
          groups={recentGroups.map((group) => ({
            items: {
              list: (
                <div className="flex flex-col gap-3">
                  {group.items.map((board) => (
                    <BoardItem board={board} />
                  ))}
                </div>
              ),
              grid: (
                <div className="grid grid-cols-3 gap-3">
                  {group.items.map((board) => (
                    <BoardCard board={board} />
                  ))}
                </div>
              ),
            }[viewMode],
            title: group.title,
          }))}
        />
      </BoardsListLayoutContent>
    </BoardsListLayout>
  );
}

export const Component = BoardsListRecentPage;
