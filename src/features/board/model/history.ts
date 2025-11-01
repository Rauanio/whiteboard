import { useReducer } from 'react';
import { useHotkeys } from '../hooks/use-hot-keys';

type HistoryState<Value> = {
  history: Value[];
  currentIndex: number;
  undoStack: Value[][];
  redoStack: Value[][];
};

type HistoryAction<Value> =
  | {
      type: 'SET';
      payload: { value: Value | ((prev: Value) => Value); capacity: number };
    }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET'; payload: { initialValue: Value } };

function stateHistoryReducer<Value>(
  state: HistoryState<Value>,
  action: HistoryAction<Value>
): HistoryState<Value> {
  switch (action.type) {
    case 'SET': {
      const { value, capacity } = action.payload;
      const current = state.history[state.currentIndex];
      const newValue =
        typeof value === 'function' ? (value as (prev: Value) => Value)(current) : value;

      const newHistory = [...state.history.slice(0, state.currentIndex + 1), newValue];
      if (newHistory.length > capacity) {
        newHistory.shift();
      }

      const newUndoStack = [state.history, ...state.undoStack];
      if (newUndoStack.length > capacity) {
        newUndoStack.pop();
      }

      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
        undoStack: newUndoStack,
        redoStack: [],
      };
    }

    case 'UNDO': {
      if (state.currentIndex === 0) return state;

      const newIndex = state.currentIndex - 1;
      const redoStack = [state.history, ...state.redoStack];

      return {
        ...state,
        currentIndex: newIndex,
        redoStack,
      };
    }

    case 'REDO': {
      if (state.currentIndex === state.history.length - 1) return state;

      const newIndex = state.currentIndex + 1;
      return { ...state, currentIndex: newIndex };
    }

    case 'RESET':
      return {
        history: [action.payload.initialValue],
        currentIndex: 0,
        undoStack: [],
        redoStack: [],
      };

    default:
      return state;
  }
}

export function useStateHistory<Value>(initialValue: Value, capacity = 100) {
  const [state, dispatch] = useReducer(stateHistoryReducer<Value>, {
    history: [initialValue],
    currentIndex: 0,
    undoStack: [],
    redoStack: [],
  });

  const set = (value: Value | ((prev: Value) => Value)) =>
    dispatch({ type: 'SET', payload: { value, capacity } });

  const undo = () => dispatch({ type: 'UNDO' });
  const redo = () => dispatch({ type: 'REDO' });
  const reset = (initial: Value) =>
    dispatch({ type: 'RESET', payload: { initialValue: initial } });

  useHotkeys('ctrl+shift+f, control+x', () => redo());
  useHotkeys('control+z', () => undo());

  return {
    state: state.history[state.currentIndex],
    history: state.history,
    set,
    undo,
    redo,
    reset,
    canUndo: state.currentIndex > 0,
    canRedo: state.currentIndex < state.history.length - 1,
  };
}
