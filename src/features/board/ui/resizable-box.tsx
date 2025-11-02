import clsx from 'clsx';

const directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

export type ResizeDirection = (typeof directions)[number];

export const ResizableBox = ({
  onMouseDown,
}: {
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>, dir: ResizeDirection) => void;
}) => {
  const mappedHandlersStyle: Record<ResizeDirection, string> = {
    'top-right': '-top-[5px] -right-[5px] cursor-nesw-resize',
    'top-left': '-top-[5px] -left-[5px] cursor-nwse-resize',
    'bottom-right': '-bottom-[5px] -right-[5px] cursor-nwse-resize',
    'bottom-left': '-bottom-[5px] -left-[5px] cursor-nesw-resize',
  };

  return (
    <>
      {directions.map((dir) => (
        <div
          key={dir}
          className={clsx(
            'absolute w-2 h-2 bg-white outline-2 outline-blue-400 rounded-xs ',
            mappedHandlersStyle[dir]
          )}
          onMouseDown={(e) => onMouseDown?.(e, dir)}
        />
      ))}
    </>
  );
};
