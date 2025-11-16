import { Button } from '@/shared/ui/kit/button';
import clsx from 'clsx';

export function ActionButton({
  children,
  isActive,
  onClick,
  hotKey,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  hotKey?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={clsx(
        `[&_svg:not([class*='size-'])]:size-5 relative`,
        isActive && 'bg-ring/30 hover:bg-ring/50 text-primary hover:text-primary'
      )}
      onClick={onClick}
    >
      {children}
      {hotKey && (
        <span className="absolute bottom-0.5 right-0.5 text-[10px]">{hotKey}</span>
      )}
    </Button>
  );
}
