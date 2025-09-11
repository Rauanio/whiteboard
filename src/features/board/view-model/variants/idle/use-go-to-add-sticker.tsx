import type { ViewModelProps } from '../../view-model';
import { goToAddSticker } from '../add-sticker';

export const useGoToAddSticker = ({ setViewState }: ViewModelProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 's') {
      setViewState(goToAddSticker());
    }
  };

  const handleActionClick = () => {
    setViewState(goToAddSticker());
  };

  return {
    handleKeyDown,
    handleActionClick,
  };
};
