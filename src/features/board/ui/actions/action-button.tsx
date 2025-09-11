import { Button } from '@/shared/ui/kit/button';

export function ActionButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={
        isActive ? 'bg-ring/30 hover:bg-ring/50 text-primary hover:text-primary' : ''
      }
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
