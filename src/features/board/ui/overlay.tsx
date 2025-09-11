export function Overlay({
  onClick,
  onMouseDown,
  onMouseUp,
}: {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
      className="absolute inset-0"
    ></div>
  );
}
