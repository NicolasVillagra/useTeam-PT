import type { BoardState } from './types';

export const reorderWithinColumn = (
  state: BoardState,
  columnId: string,
  startIndex: number,
  endIndex: number
): BoardState => {
  const column = state.columns[columnId];
  const newTaskIds = Array.from(column.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: { ...column, taskIds: newTaskIds },
    },
  };
};

export const moveBetweenColumns = (
  state: BoardState,
  sourceId: string,
  destId: string,
  sourceIndex: number,
  destIndex: number,
  taskId: string
): BoardState => {
  const source = state.columns[sourceId];
  const dest = state.columns[destId];
  const sourceTaskIds = Array.from(source.taskIds);
  const destTaskIds = Array.from(dest.taskIds);

  sourceTaskIds.splice(sourceIndex, 1);
  destTaskIds.splice(destIndex, 0, taskId);

  return {
    ...state,
    columns: {
      ...state.columns,
      [sourceId]: { ...source, taskIds: sourceTaskIds },
      [destId]: { ...dest, taskIds: destTaskIds },
    },
    tasks: {
      ...state.tasks,
      [taskId]: { ...state.tasks[taskId], columnId: destId },
    },
  };
};
