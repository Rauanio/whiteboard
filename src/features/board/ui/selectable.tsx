


export const Selectable = ({}:) => {
  return (
    <>
      {/* рамка */}
      <rect
        x={x - 4}
        y={y - 4}
        width={width + 8}
        height={height + 8}
        fill="transparent"
        stroke="#3b82f6"
        strokeWidth={2}
        rx={4}
        ry={4}
      />

      {/* 4 угловых resize-хэндла */}
      {handles.map(({ dir, cx, cy }) => (
        <rect
          key={dir}
          x={cx - half}
          y={cy - half}
          width={HADNLE_SIZE}
          height={HADNLE_SIZE}
          fill="white"
          stroke="#3b82f6"
          strokeWidth={1}
          rx={2}
          className="cursor-pointer pointer-events-auto "
          onMouseDown={(e) => onHandleMouseDown?.(e, dir)}
        />
      ))}
    </>
  );
};
