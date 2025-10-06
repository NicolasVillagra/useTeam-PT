import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { DroppableProvided } from '@hello-pangea/dnd';
import ColumnHeader from '@/src/components/molecules/ColumnHeader';
import TaskCard from '@/src/components/molecules/TaskCard';
import type { Column, Task } from '@/src/utils/types';
import { useModal } from '@/src/hooks/useModal';
import { useTasksContext } from '@/src/context/TasksContext';
import { EditColumnModal } from '@/src/components/templates/EditColumnModal';
import { EditTaskModal } from '@/src/components/templates/EditTaskModal';

export interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks }) => {
  const { updateColumn, updateTask, state } = useTasksContext();
  const editColumnModal = useModal();
  const editTaskModal = useModal();
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const openEditTask = (task: Task) => {
    setSelectedTask(task);
    editTaskModal.open();
  };

  return (
    <div className="w-80 shrink-0 bg-base-200 rounded-lg p-2">
      <ColumnHeader title={column.title} count={tasks.length} onEdit={editColumnModal.open} />
      <Droppable droppableId={column.id}>
        {(provided: DroppableProvided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 min-h-[20px]">
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onEdit={openEditTask} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <EditColumnModal
        isOpen={editColumnModal.isOpen}
        initialName={column.title}
        onClose={editColumnModal.close}
        onSave={async (name) => {
          await updateColumn(column.id, name);
        }}
      />
      <EditTaskModal
        isOpen={editTaskModal.isOpen}
        onClose={() => { editTaskModal.close(); setSelectedTask(null); }}
        task={selectedTask}
        columns={state.columnOrder.map((id) => state.columns[id])}
        onSave={updateTask}
      />
    </div>
  );
};

export default KanbanColumn;
