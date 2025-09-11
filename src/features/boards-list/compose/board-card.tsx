import type { ApiSchemas } from '@/shared/api/schema';
import { BoardsFavoriteToggle } from '../ui/board-favorite-toggle';
import { BoardsListCard } from '../ui/board-list-card';
import { Button } from '@/shared/ui/kit/button';
import { useUpdateFavorite } from '../model/use-update-favorite';
import { useDeleteBoard } from '../model/use-delete-board';
import { Trash2 } from 'lucide-react';

export function BoardCard({ board }: { board: ApiSchemas['Board'] }) {
  const deleteBoard = useDeleteBoard();
  const updateFavorite = useUpdateFavorite();

  return (
    <BoardsListCard
      key={board.id}
      board={board}
      rightTopActions={
        <BoardsFavoriteToggle
          isFavorite={updateFavorite.isOptimisticFavorite(board)}
          onToggle={() => updateFavorite.toggle(board)}
        />
      }
      bottomActions={
        <Button
          variant="destructive"
          size={'icon'}
          disabled={deleteBoard.getIsPending(board.id)}
          onClick={() => deleteBoard.deleteBoard(board.id)}
        >
          <Trash2 />
        </Button>
      }
    />
  );
}
