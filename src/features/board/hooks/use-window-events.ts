import { useLayoutEffect, useRef } from 'react';
import { useEffect } from 'react';
import type { ViewModel } from '../view-model/view-model-type';

export function useWindowEvents(viewModel: ViewModel) {
  const viewModelRef = useRef(viewModel);

  useLayoutEffect(() => {
    viewModelRef.current = viewModel;
  }, [viewModel]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      viewModelRef.current.window?.onMouseMove?.(e);
    };
    const onMouseUp = (e: MouseEvent) => {
      viewModelRef.current.window?.onMouseUp?.(e);
    };
    const onMouseWheel = (e: WheelEvent) => {
      viewModelRef.current.window?.onMouseWheel?.(e);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      viewModelRef.current.window?.onKeyDown?.(e);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onMouseWheel);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('wheel', onMouseWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [viewModelRef]);
}
