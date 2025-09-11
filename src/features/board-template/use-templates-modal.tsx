import { create } from 'zustand';

interface TemplatesModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useTemplatesModal = create<TemplatesModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
