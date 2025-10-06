import React from 'react';
import Tag from '@/src/components/atoms/Tag';
import { Draggable } from '@hello-pangea/dnd';
import type { DraggableProvided } from '@hello-pangea/dnd';
import type { Task } from '@/src/utils/types';
import Button from '../atoms/Button';

export interface TaskCardProps {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          className="card bg-base-100 shadow-sm hover:shadow-md transition"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-body p-3 gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="card-title text-sm leading-snug">{task.title}</h3>
              {task.createdAt && (
                <Tag text={new Date(task.createdAt).toLocaleDateString()} color="neutral" />
              )}
            </div>
            {onEdit && (
              <div className="flex justify-end">
                <Button className="btn btn-ghost btn-xs" title="Editar tarea" onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                  Editar
                </Button>
              </div>
            )}
            {task.tags?.length ? (
              <div className="flex gap-1 flex-wrap">
                {task.tags.map((t) => (
                  <Tag key={t} text={t} color="accent" />
                ))}
              </div>
            ) : null}
            {task.description && <p className="text-xs opacity-80">{task.description}</p>}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
