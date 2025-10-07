import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/src/services/api';
import { useSocket } from '@/src/hooks/useSocket';
import type { Task, CreateTaskDto, UpdateTaskDto, Column } from '@/src/utils/types';

type TasksMap = Record<string, Task>;
type ColumnsMap = Record<string, Column>;

export const useTasks = () => {
  const { socket, emitEvent } = useSocket();
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TasksMap>({});
  const [columns, setColumns] = useState<ColumnsMap>({});


  const mapServerTask = useCallback((raw: any): Task => ({
    id: String(raw.id ?? raw._id),
    title: raw.title,
    description: raw.description,
    columnId: String(raw.columnId),
    position: typeof raw.position === 'number' ? raw.position : 0,
    tags: Array.isArray(raw.tags) ? raw.tags : undefined,
    createdAt: raw.createdAt,
  }), []);

  // Obtiene columnas del backend y las mapea a la forma del frontend
  const fetchColumns = useCallback(async (): Promise<Column[]> => {
    const { data } = await api.get<any[]>('/columns');

    return (data || []).map((c: any) => ({ id: String(c._id ?? c.id ?? c.name), title: String(c.name ?? c.title ?? c._id), taskIds: [] }));
  }, []);

  const buildState = useCallback((tasksList: Task[], columnsList: Column[]) => {
    const tMap: TasksMap = {};
    const cMap: ColumnsMap = {};
    // Inicializar columnas desde backend
    for (const c of columnsList) {
      cMap[c.id] = { id: c.id, title: c.title, taskIds: [] };
    }
    for (const t of tasksList) {
      tMap[t.id] = t;
      if (!cMap[t.columnId]) {
        cMap[t.columnId] = { id: t.columnId, title: t.columnId, taskIds: [] };
      }
      cMap[t.columnId].taskIds.push(t.id);
    }
    // Mantener orden por position dentro de cada columna
    Object.values(cMap).forEach((c) => c.taskIds.sort((a, b) => (tMap[a]?.position ?? 0) - (tMap[b]?.position ?? 0)));
    setTasks(tMap);
    setColumns(cMap);
  }, []);

  const getTasks = useCallback(async () => {
    setLoading(true);
    try {

      const [cols, tasksResp] = await Promise.all([
        fetchColumns(),
        api.get<any[]>('/tasks').then((r) => r.data.map(mapServerTask)),
      ]);
      buildState(tasksResp, cols);
      return tasksResp;
    } finally {
      setLoading(false);
    }
  }, [fetchColumns, buildState, mapServerTask]);

  const createTask = useCallback(async (dto: CreateTaskDto) => {
    const { data } = await api.post<any>('/tasks', dto);
    const mapped = mapServerTask(data);
    setTasks((prev) => ({ ...prev, [mapped.id]: mapped }));
    setColumns((prev) => {
      const col = prev[mapped.columnId] || { id: mapped.columnId, title: mapped.columnId, taskIds: [] };
      const alreadyInColumn = col.taskIds.includes(mapped.id);
      return {
        ...prev,
        [mapped.columnId]: { ...col, taskIds: alreadyInColumn ? col.taskIds : [...col.taskIds, mapped.id] },
      };
    });
    emitEvent({ event: 'taskCreated', payload: mapped });
    return mapped;
  }, [emitEvent, mapServerTask]);

  const updateTask = useCallback(async (id: string, dto: UpdateTaskDto) => {
    const { data } = await api.put<any>(`/tasks/${id}`, dto);
    const mapped = mapServerTask(data);
    setTasks((prev) => ({ ...prev, [mapped.id]: mapped }));

    if (dto.columnId !== undefined) {
      void getTasks();
    }
    emitEvent({ event: 'taskUpdated', payload: mapped });
    return mapped;
  }, [emitEvent, getTasks, mapServerTask]);


  const createColumn = useCallback(async (name: string) => {
    await api.post('/columns', { name });
    await getTasks();
    emitEvent({ event: 'columnCreated', payload: { name } });
  }, [getTasks, emitEvent]);

  const deleteColumn = useCallback(async (id: string) => {
    await api.delete(`/columns/${id}`);
    await getTasks();
    emitEvent({ event: 'columnDeleted', payload: id });
  }, [getTasks, emitEvent]);

  const updateColumn = useCallback(async (id: string, name: string) => {
    await api.put(`/columns/${id}`, { name });
    await getTasks();
    emitEvent({ event: 'columnUpdated', payload: { id, name } });
  }, [getTasks, emitEvent]);

  const moveTask = useCallback(async (taskId: string, toColumnId: string, toIndex: number) => {

    setColumns((prev) => {

      const next: ColumnsMap = Object.fromEntries(Object.entries(prev).map(([id, c]) => [id, { ...c, taskIds: c.taskIds.filter((t) => t !== taskId) }]));
      if (!next[toColumnId]) next[toColumnId] = { id: toColumnId, title: toColumnId, taskIds: [] } as Column;
      const dest = next[toColumnId];
      const arr = [...dest.taskIds];
      arr.splice(toIndex, 0, taskId);
      next[toColumnId] = { ...dest, taskIds: arr };
      return next;
    });
    setTasks((prev) => ({ ...prev, [taskId]: { ...prev[taskId], columnId: toColumnId } }));

    await updateTask(taskId, { columnId: toColumnId, position: toIndex });
    emitEvent({ event: 'taskMoved', payload: { taskId, toColumnId, toIndex } });
  }, [emitEvent, updateTask]);

  const deleteTask = useCallback(async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => {
      const { [id]: _omit, ...rest } = prev;
      return rest;
    });
    setColumns((prev) => {
      const next: ColumnsMap = Object.fromEntries(Object.entries(prev).map(([cid, c]) => [cid, { ...c, taskIds: c.taskIds.filter((t) => t !== id) }]));
      return next;
    });
    emitEvent({ event: 'taskDeleted', payload: id });
  }, [emitEvent]);


  useEffect(() => {
    const s = socket.current;
    if (!s) return;
    const onCreated = (raw: any) => {
      const t = mapServerTask(raw);
      setTasks((prev) => ({ ...prev, [t.id]: t }));
      setColumns((prev) => {
        const col = prev[t.columnId] || { id: t.columnId, title: t.columnId, taskIds: [] };
        const alreadyInColumn = col.taskIds.includes(t.id);
        return {
          ...prev,
          [t.columnId]: { ...col, taskIds: alreadyInColumn ? col.taskIds : [...col.taskIds, t.id] },
        };
      });
    };
    const onUpdated = (raw: any) => {
      const t = mapServerTask(raw);
      setTasks((prev) => ({ ...prev, [t.id]: t }));

      void getTasks();
    };
    const onDeleted = (id: string) => {
      setTasks((prev) => { const { [id]: _omit, ...rest } = prev; return rest; });
      setColumns((prev) => Object.fromEntries(Object.entries(prev).map(([cid, c]) => [cid, { ...c, taskIds: c.taskIds.filter((t) => t !== id) }])));
    };
    const onMoved = () => { void getTasks(); };

    s.on('taskCreated', onCreated);
    s.on('taskUpdated', onUpdated);
    s.on('taskDeleted', onDeleted);
    s.on('taskMoved', onMoved);
    // Column events (listen and refresh to stay consistent with backend as source of truth)
    const onColumnChanged = () => { void getTasks(); };
    s.on('columnCreated', onColumnChanged);
    s.on('columnUpdated', onColumnChanged);
    s.on('columnDeleted', onColumnChanged);
    return () => {
      s.off('taskCreated', onCreated);
      s.off('taskUpdated', onUpdated);
      s.off('taskDeleted', onDeleted);
      s.off('taskMoved', onMoved);
      s.off('columnCreated', onColumnChanged);
      s.off('columnUpdated', onColumnChanged);
      s.off('columnDeleted', onColumnChanged);
    };
  }, [socket, getTasks]);

  const tasksList = useMemo(() => Object.values(tasks), [tasks]);
  const columnsList = useMemo(() => Object.values(columns), [columns]);

  return { tasks: tasksList, columns: columnsList, loading, getTasks, createTask, updateTask, moveTask, deleteTask, createColumn, updateColumn, deleteColumn } as const;
};
