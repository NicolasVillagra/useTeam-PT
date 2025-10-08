import React, { createContext, useCallback, useContext, useMemo, useEffect } from 'react';
import { useTasks } from '@/src/hooks/useTasks';
import type { BoardState } from '@/src/utils/types';
import { api } from '@/src/services/api';
import { EXPORT_ENDPOINT } from '@/src/utils/constants';
import type { DropResult, DraggableLocation } from '@hello-pangea/dnd';

interface TasksContextValue {
  state: BoardState;
  loading: boolean;
  movingTask: boolean;
  moveTask: (taskId: string, source: DraggableLocation, destination: DraggableLocation) => void;
  refresh: () => Promise<void>;
  exportBacklog: (email?: string) => Promise<void>;
  createTask: (dto: any) => Promise<any>;
  updateTask: (id: string, dto: any) => Promise<any>;
  createColumn: (name: string) => Promise<void>;
  updateColumn: (id: string, name: string) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tasks, columns, loading, movingTask, getTasks, moveTask: moveTaskHook, createTask, updateTask, createColumn, updateColumn, deleteColumn, deleteTask } = useTasks();

  // Cargar datos al montar
  useEffect(() => { void getTasks(); }, [getTasks]);

  const state: BoardState = useMemo(() => {
    const tasksMap = Object.fromEntries(tasks.map((t) => [t.id, t]));
    const columnsMap = Object.fromEntries(columns.map((c) => [c.id, c]));
    const columnOrder = columns.map((c) => c.id);
    return { tasks: tasksMap, columns: columnsMap, columnOrder };
  }, [tasks, columns]);

  const moveTask = useCallback((taskId: string, source: DraggableLocation, destination: DraggableLocation) => {
    void moveTaskHook(taskId, destination.droppableId, destination.index);
  }, [moveTaskHook]);

  const refresh = useCallback(async () => { await getTasks(); }, [getTasks]);

  const exportBacklog = useCallback(async (email?: string) => {
    await api.post(EXPORT_ENDPOINT, { email });
  }, []);

  const value = useMemo(
    () => ({ state, loading, movingTask, moveTask, refresh, exportBacklog, createTask, updateTask, createColumn, updateColumn, deleteColumn, deleteTask }),
    [state, loading, movingTask, moveTask, refresh, exportBacklog, createTask, updateTask, createColumn, updateColumn, deleteColumn, deleteTask]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasksContext = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasksContext must be used within TasksProvider');
  return ctx;
};
