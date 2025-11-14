import { useEffect, useRef, type Ref } from 'react';
import { Selectable } from '../selectable';
import type { ResizeDirection } from '../resizable';

export function Sticker({
  id,
  text,
  x,
  y,
  width,
  height,
  ref,
  isSelected,
  isEditing,
  onClick,
  onTextChange,
  onMouseDown,
  onMouseUp,
  onHandleMouseDown,
}: {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  ref: Ref<SVGRectElement>;
  isSelected?: boolean;
  isEditing?: boolean;
  onTextChange?: (text: string) => void;
  onClick?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<SVGElement>, dir: ResizeDirection) => void;
  onMouseUp?: (e: React.MouseEvent<SVGRectElement>) => void;
}) {
  return (
    <svg
      className="absolute left-0 top-0 pointer-events-none overflow-visible z-1"
      style={{ touchAction: 'none' }}
    >
      <g>
        {isSelected && (
          <Selectable
            height={height}
            width={width}
            x={x}
            y={y}
            onHandleMouseDown={onHandleMouseDown}
          />
        )}

        <rect
          ref={ref}
          data-id={id}
          x={x}
          y={y}
          width={width}
          height={height}
          onMouseDown={onMouseDown}
          fill="#FFEA00"
          rx={4}
          onMouseUp={onMouseUp}
          onClick={onClick}
          className={'cursor-move pointer-events-auto'}
        />
        <TextareaAutoSize
          x={x}
          y={y}
          value={text}
          fHeight={height}
          fWidth={width}
          onChange={onTextChange}
          isEditing={isEditing ?? false}
        />
      </g>
    </svg>
  );
}

export const TextareaAutoSize = ({
  isEditing,
  value,
  fWidth,
  fHeight,
  onChange,
  x,
  y,
}: {
  isEditing: boolean;
  value: string;
  fWidth: number;
  fHeight: number;
  x: number;
  y: number;
  onChange?: (value: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // const [height, setHeight] = useState(0);
  // const [width, setWidth] = useState(0);

  // console.log(ref.current);

  // useLayoutEffect(() => {
  //   if (!ref.current) return;

  //   const { scrollWidth, clientHeight } = ref.current;

  //   console.log(clientHeight, scrollWidth);

  //   setHeight(clientHeight);
  //   setWidth(scrollWidth);
  // }, [value, isEditing]);

  useEffect(() => {
    if (textAreaRef.current && isEditing) {
      const textarea = textAreaRef.current;
      const length = textarea.value.length;

      textarea.setSelectionRange(length, length);
      textarea.focus();
    }
  }, [isEditing]);

  return (
    <>
      {!isEditing && (
        <foreignObject x={x + 4} y={y + 4} width={fWidth - 8} height={fHeight - 8}>
          <div
            ref={ref}
            className="text-center w-full h-full overflow-hidden break-words whitespace-pre-wrap select-none"
          >
            {value}
          </div>
        </foreignObject>
      )}

      {isEditing && (
        <foreignObject x={x + 4} y={y + 4} width={fWidth - 8} height={fHeight - 8}>
          <textarea
            ref={textAreaRef}
            className="w-full h-full text-center resize-none overflow-hidden focus:outline-none "
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </foreignObject>
      )}
    </>
  );
};
