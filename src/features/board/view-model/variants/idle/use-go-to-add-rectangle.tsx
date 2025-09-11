import type { ViewModelProps } from '../../view-model';
import { goToAddRectangle } from '../add-rectangle';

export const useGoToAddRectangle = ({ setViewState }: ViewModelProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'r') {
      setViewState(goToAddRectangle());
    }
  };

  const handleActionClick = () => {
    setViewState(goToAddRectangle());
  };

  return {
    handleKeyDown,
    handleActionClick,
  };
};
