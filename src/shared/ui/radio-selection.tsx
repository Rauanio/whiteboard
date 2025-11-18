import clsx from 'clsx';

import { Button, buttonVariants } from './kit/button';
import type { LucideIcon } from 'lucide-react';

export const RadioSelection = <T,>(
  props: {
    options: {
      value: T;
      text: string;
      icon: LucideIcon;
      testId?: string;
      active?: boolean;
    }[];
    value: T | null;
    type?: 'radio' | 'button';
  } & (
    | { type?: 'radio'; group: string; onChange: (value: T) => void }
    | {
        type: 'button';
        onClick: (
          value: T,
          event: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => void;
      }
  )
) => (
  <>
    {props.options.map((option) =>
      props.type === 'button' ? (
        <Button
          key={option.text}
          title={option.text}
          size={'icon-sm'}
          variant={option.active ?? props.value === option.value ? 'action' : 'outline'}
          onClick={(event) => props.onClick(option.value, event)}
        >
          <option.icon />
        </Button>
      ) : (
        <label
          key={option.text}
          title={option.text}
          className={clsx(
            buttonVariants({
              size: 'icon-sm',
              variant: props.value === option.value ? 'action' : 'outline',
            })
          )}
        >
          <input
            type="radio"
            name={props.group}
            onChange={() => props.onChange(option.value)}
            checked={props.value === option.value}
          />
          {<option.icon />}
        </label>
      )
    )}
  </>
);
