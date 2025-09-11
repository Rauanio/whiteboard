import { create } from 'zustand';

interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  isOpen: boolean;
  resolve: (value: boolean) => void;
}

interface ConfirmDialogStore {
  openConfirmDialog: (options: ConfirmDialogOptions) => Promise<boolean>;
  confirmDialogState: ConfirmDialogState | null;
  handleClose: () => void;
  handleConfirm: () => void;
}

export const useConfirmDialog = create<ConfirmDialogStore>()((set, get) => ({
  confirmDialogState: null,

  handleClose: () => {
    const state = get().confirmDialogState;

    if (state) {
      state.resolve(false);
      set({ confirmDialogState: null });
    }
  },

  handleConfirm: () => {
    const state = get().confirmDialogState;

    if (state) {
      state.resolve(true);
      set({ confirmDialogState: null });
    }
  },

  openConfirmDialog: (options) => {
    return new Promise((resolve) => {
      set({
        confirmDialogState: {
          ...options,
          isOpen: true,
          resolve,
        },
      });
    });
  },
}));
