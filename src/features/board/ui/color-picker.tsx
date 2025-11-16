import type { ColorTuple } from '@/shared/common/colors';
import { Button } from '@/shared/ui/kit/button';
import { Separator } from '@/shared/ui/kit/separator';
import clsx from 'clsx';

interface ColorPickerProps {
  activeColor: string;
  onChange: (color: string) => void;
  topPicks: ColorTuple;
}

export const ColorPicker = ({ activeColor, onChange, topPicks }: ColorPickerProps) => {
  console.log(topPicks);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1.5">
        {topPicks.map((color) => (
          <Button
            key={color}
            size={'icon'}
            style={{
              backgroundColor: color,
              backgroundPosition: 'left center',
            }}
            onClick={() => onChange(color)}
            className={clsx(
              'w-6 h-6 rounded-sm relative hover:scale-105',
              color === 'transparent' && 'is-transparent'
            )}
          >
            {color === activeColor && (
              <div
                style={{ ['--dynamic-color']: color } as React.CSSProperties}
                className="absolute -top-[1px] -left-[1px] -right-[1px] -bottom-[1px] rounded-sm  z-1 flex items-center justify-center     shadow-[0_0_0_1px_var(--dynamic-color)]
    "
              ></div>
            )}
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" className="h-6!" />
      <Button
        style={{ backgroundColor: activeColor, backgroundPosition: 'left center' }}
        className={clsx(
          'w-7 h-7 rounded-sm relative hover:scale-105',
          activeColor === 'transparent' && 'is-transparent'
        )}
        size={'icon'}
      ></Button>
    </div>
  );
};
