"use client";

import React, { useCallback } from 'react';
import ExportButton from '@/src/components/molecules/ExportButton';
import KanbanBoard from '@/src/components/organisms/KanbanBoard';
import { useTasksContext } from '@/src/context/TasksContext';
import { useModal } from '@/src/hooks/useModal';
import { ExportModal } from '@/src/components/templates/ExportModal';
import type { DropResult } from '@hello-pangea/dnd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@/src/components/atoms/Button';
import { CreateColumnModal } from '@/src/components/templates/CreateColumnModal';
import { CreateTaskModal } from '@/src/components/templates/CreateTaskModal';

export const BoardPage: React.FC = () => {
  const { state, loading, movingTask, moveTask, exportBacklog, createColumn, createTask } = useTasksContext();
  const exportModal = useModal();
  const createColumnModal = useModal();
  const createTaskModal = useModal();
  const totalColumns = state.columnOrder.length;
  const totalTasks = Object.keys(state.tasks).length;

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index) return;
      moveTask(draggableId, source, destination);
    },
    [moveTask]
  );

  return (
    <div className="min-h-screen bg-base-200/60">
      <div className="container mx-auto p-4 flex flex-col gap-4">
        <div className="bg-base-100/80 backdrop-blur supports-[backdrop-filter]:bg-base-100/60 border rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight">Tablero Kanban</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-base-content/60">
                <span className="inline-flex items-center gap-1 rounded-md border bg-base-100 px-2 py-0.5">{totalColumns} columnas</span>
                <span className="inline-flex items-center gap-1 rounded-md border bg-base-100 px-2 py-0.5">{totalTasks} tareas</span>
                {loading && !movingTask && <span className="inline-flex items-center gap-1 rounded-md border bg-warning/10 text-warning px-2 py-0.5">Cargando…</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={createColumnModal.open}>Nueva columna</Button>
              <Button onClick={createTaskModal.open}>Nueva tarea</Button>
              <Button onClick={exportModal.open}>Exportar backlog</Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-base-100 shadow-sm">
          <div className="p-3 border-b bg-base-100/60 rounded-t-xl flex items-center justify-between">
            <span className="text-sm text-base-content/60">Arrastra y suelta para reorganizar</span>
            <ExportButton onClick={exportModal.open} />
          </div>
          <div className="p-2 md:p-3 overflow-x-auto">
            <KanbanBoard state={state} onDragEnd={onDragEnd} loading={loading && !movingTask} />
          </div>
        </div>

        <ExportModal isOpen={exportModal.isOpen} onClose={exportModal.close} onConfirm={exportBacklog} />
        <CreateColumnModal isOpen={createColumnModal.isOpen} onClose={createColumnModal.close} onCreate={createColumn} />
        <CreateTaskModal isOpen={createTaskModal.isOpen} onClose={createTaskModal.close} onCreate={createTask} columns={state.columnOrder.map((id) => state.columns[id])} />
        <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar theme="colored" />
      </div>
    </div>
  );
};

export default BoardPage;
