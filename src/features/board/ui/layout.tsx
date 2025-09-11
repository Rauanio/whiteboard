import clsx from 'clsx';
import type { Ref } from 'react';

export function Layout({
  children,
  className,
  ref,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('grow relative outline-0', className)}
      ref={ref}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
}
