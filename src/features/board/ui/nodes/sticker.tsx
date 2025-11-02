import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState, type Ref } from 'react';
import { SelectionBox } from '../selection-box';
import { ResizableBox } from '../resizable-box';

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
  ref: Ref<HTMLButtonElement>;
  isSelected?: boolean;
  isEditing?: boolean;
  onTextChange?: (text: string) => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onHandleMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <SelectionBox width={width} height={height} x={x} y={y} isSelected={isSelected}>
      {isSelected && <ResizableBox onMouseDown={onHandleMouseDown} />}
      <button
        data-id={id}
        ref={ref}
        className={clsx(
          'bg-yellow-300 cursor-move px-2 py-4 rounded-xs shadow-md w-full h-full'
        )}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <TextareaAutoSize
          value={text}
          onChange={onTextChange}
          isEditing={isEditing ?? false}
        />
      </button>
    </SelectionBox>
  );
}

export const TextareaAutoSize = ({
  isEditing,
  value,
  onChange,
}: {
  isEditing: boolean;
  value: string;
  onChange?: (value: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const { scrollWidth, clientHeight } = ref.current;

    setHeight(clientHeight);
    setWidth(scrollWidth);
  }, [value, isEditing]);

  useEffect(() => {
    if (textAreaRef.current && isEditing) {
      const textarea = textAreaRef.current;
      const length = textarea.value.length;

      textarea.setSelectionRange(length, length);
      textarea.focus();
    }
  }, [isEditing]);

  return (
    <div className="relative">
      <div ref={ref} className={clsx('whitespace-pre-wrap', isEditing && 'opacity-0')}>
        {value}
      </div>
      {isEditing && (
        <textarea
          ref={textAreaRef}
          className="absolute top-0 left-0 resize-none overflow-hidden focus:outline-none"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: width + 2,
            height: height + 2,
          }}
        />
      )}
    </div>
  );
};
