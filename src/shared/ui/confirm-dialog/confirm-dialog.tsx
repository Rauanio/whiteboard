import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../kit/alert-dialog';
import { Button } from '../kit/button';
import { useConfirmDialog } from './use-confirm-dialog';

export const ConfirmDialog = () => {
  const { confirmDialogState, handleClose, handleConfirm } = useConfirmDialog();

  if (!confirmDialogState) return null;

  const { isOpen, title, cancelText, confirmText, description, confirmVariant } =
    confirmDialogState;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText ?? 'Отменить'}</AlertDialogCancel>
          <Button variant={confirmVariant} onClick={handleConfirm}>
            {confirmText ?? 'ОК'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
