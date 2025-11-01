import { ControlButton } from './control-button';
import { Redo, Undo } from 'lucide-react';

export const HistoryControls = ({
  redo,
  undo,
  canUndo,
  canRedo,
}: {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) => {
  return (
    <div className="shadow-md bg-white p-1 rounded-md">
      <ControlButton disabled={!canUndo} onClick={undo} size={'icon'}>
        <Undo />
      </ControlButton>
      <ControlButton disabled={!canRedo} onClick={redo} size={'icon'}>
        <Redo />
      </ControlButton>
    </div>
  );
};
