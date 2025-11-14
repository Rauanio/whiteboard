import { type ReactNode } from 'react';

export const Hints = ({ hints }: { hints: ReactNode }) => {
  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none">
      <p className="text-muted-foreground text-xs">{hints}</p>
    </div>
  );
};
