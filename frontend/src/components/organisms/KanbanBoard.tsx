"use client";

import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import KanbanColumn from '@/src/components/organisms/KanbanColumn';
import type { BoardState } from '@/src/utils/types';
import { Spinner } from '@/src/components/atoms/Spinner';

export interface KanbanBoardProps {
  state: BoardState;
  onDragEnd: (result: DropResult) => void;
  loading?: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ state, onDragEnd, loading = false }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-base-100/60 backdrop-blur-sm">
            <Spinner size="lg" />
          </div>
        )}
        <div className="flex gap-5 overflow-x-auto p-3">
          {state.columnOrder.map((colId) => {
            const column = state.columns[colId];
            const tasks = column.taskIds.map((id) => state.tasks[id]).filter(Boolean);
            return <KanbanColumn key={column.id} column={column} tasks={tasks} />;
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
