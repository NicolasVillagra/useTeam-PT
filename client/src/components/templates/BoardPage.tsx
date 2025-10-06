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
  const { state, loading, moveTask, exportBacklog, createColumn, createTask } = useTasksContext();
  const exportModal = useModal();
  const createColumnModal = useModal();
  const createTaskModal = useModal();

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
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Tablero</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={createColumnModal.open}>Nueva columna</Button>
          <Button onClick={createTaskModal.open}>Nueva tarea</Button>
          <ExportButton onClick={exportModal.open} />
        </div>
      </div>
      <KanbanBoard state={state} onDragEnd={onDragEnd} loading={loading} />
      <ExportModal isOpen={exportModal.isOpen} onClose={exportModal.close} onConfirm={exportBacklog} />
      <CreateColumnModal isOpen={createColumnModal.isOpen} onClose={createColumnModal.close} onCreate={createColumn} />
      <CreateTaskModal isOpen={createTaskModal.isOpen} onClose={createTaskModal.close} onCreate={createTask} columns={state.columnOrder.map((id) => state.columns[id])} />
      <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar theme="colored" />
    </div>
  );
};

export default BoardPage;
