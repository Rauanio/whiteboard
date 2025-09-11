import { Hand, MousePointer2, Square, StickerIcon } from 'lucide-react';
import type { ViewModel } from '../../view-model/view-model-type';
import { ActionButton } from './action-button';

export function Actions({ actions }: { actions: ViewModel['actions'] }) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-1 rounded-md shadow">
      <ActionButton
        isActive={actions?.idleState?.isActive}
        onClick={actions?.idleState?.onClick}
      >
        <MousePointer2 className="size-6" />
      </ActionButton>
      <ActionButton
        isActive={actions?.canvasDragging?.isActive}
        onClick={actions?.canvasDragging?.onClick}
      >
        <Hand className="size-6" />
      </ActionButton>
      <ActionButton
        isActive={actions?.addSticker?.isActive}
        onClick={actions?.addSticker?.onClick}
      >
        <StickerIcon className="size-6" />
      </ActionButton>
      <ActionButton
        isActive={actions?.addRectangle?.isActive}
        onClick={actions?.addRectangle?.onClick}
      >
        <Square className="size-6" />
      </ActionButton>
    </div>
  );
}
