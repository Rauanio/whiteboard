import type { ViewModelProps } from '../../view-model';
import { goToCanvasDragging } from '../canvas-dragging';

export const useGoToCanvasDragging = ({ setViewState }: ViewModelProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'h') {
      setViewState(goToCanvasDragging());
    }
  };

  const handleActionClick = () => {
    setViewState(goToCanvasDragging());
  };

  return {
    handleKeyDown,
    handleActionClick,
  };
};
