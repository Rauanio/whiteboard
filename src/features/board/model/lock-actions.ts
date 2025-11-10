import { useState } from 'react';

export function useLockActions() {
  const [lock, setLock] = useState<boolean>(false);

  return { lock, setLock };
}

export type LockActionsModel = ReturnType<typeof useLockActions>;
