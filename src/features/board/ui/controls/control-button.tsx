import { Button, buttonVariants } from '@/shared/ui/kit/button';
import type { VariantProps } from 'class-variance-authority';

export const ControlButton = ({
  children,
  onClick,
  size = 'icon',
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: VariantProps<typeof buttonVariants>['size'];
}) => {
  return (
    <Button onClick={onClick} variant="ghost" size={size}>
      {children}
    </Button>
  );
};
