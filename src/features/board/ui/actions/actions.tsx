import {
  ArrowUpRight,
  Circle,
  Diamond,
  Hand,
  LockKeyholeOpen,
  MousePointer2,
  Pencil,
  Square,
  StickerIcon,
  Type,
} from 'lucide-react';
import type { ViewModel } from '../../view-model/view-model-type';
import { ActionButton } from './action-button';
import { Separator } from '@/shared/ui/kit/separator';

export function Actions({ actions }: { actions: ViewModel['actions'] }) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-1 rounded-lg shadow">
      <ActionButton
        isActive={actions?.lockActions?.isActive}
        onClick={actions?.lockActions?.onClick}
      >
        <LockKeyholeOpen />
      </ActionButton>
      <Separator orientation="vertical" className="mx-1" />
      <ActionButton
        hotKey={1}
        isActive={actions?.idleState?.isActive}
        onClick={actions?.idleState?.onClick}
      >
        <MousePointer2 />
      </ActionButton>
      <ActionButton
        isActive={actions?.canvasDragging?.isActive}
        onClick={actions?.canvasDragging?.onClick}
        hotKey={2}
      >
        <Hand />
      </ActionButton>
      <ActionButton
        isActive={actions?.addSticker?.isActive}
        onClick={actions?.addSticker?.onClick}
        hotKey={3}
      >
        <StickerIcon />
      </ActionButton>
      <ActionButton
        isActive={actions?.addRectangle?.isActive}
        onClick={actions?.addRectangle?.onClick}
        hotKey={4}
      >
        <Square />
      </ActionButton>
      <ActionButton
        isActive={actions?.addCircle?.isActive}
        onClick={actions?.addCircle?.onClick}
        hotKey={5}
      >
        <Circle />
      </ActionButton>
      <ActionButton
        isActive={actions?.addDiamond?.isActive}
        onClick={actions?.addDiamond?.onClick}
        hotKey={6}
      >
        <Diamond />
      </ActionButton>
      <ActionButton
        isActive={actions?.addArrow?.isActive}
        onClick={actions?.addArrow?.onClick}
        hotKey={7}
      >
        <ArrowUpRight />
      </ActionButton>
      <ActionButton isActive={false} onClick={() => {}} hotKey={8}>
        <Type />
      </ActionButton>
      <ActionButton
        isActive={actions?.addFreeHand?.isActive}
        onClick={actions?.addFreeHand?.onClick}
        hotKey={9}
      >
        <Pencil />
      </ActionButton>
    </div>
  );
}
