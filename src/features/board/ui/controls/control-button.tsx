import { Button, buttonVariants } from '@/shared/ui/kit/button';
import type { VariantProps } from 'class-variance-authority';

export const ControlButton = ({
  children,
  onClick,
  size = 'icon',
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  return (
    <Button onClick={onClick} variant="ghost" size={size} {...props}>
      {children}
    </Button>
  );
};
