import React from 'react';
import Tag from '@/src/components/atoms/Tag';
import { Draggable } from '@hello-pangea/dnd';
import type { DraggableProvided } from '@hello-pangea/dnd';
import type { Task } from '@/src/utils/types';
import Button from '../atoms/Button';
import { useTasksContext } from '@/src/context/TasksContext';

export interface TaskCardProps {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit }) => {
  const { deleteTask } = useTasksContext();
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          className="card bg-base-100/80 backdrop-blur border border-base-200 hover:border-base-300 shadow-sm hover:shadow-md transition duration-200"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="card-body p-3 gap-2">
            <div className="flex items-start justify-between gap-2 min-w-0">
              <h3 className="card-title text-sm leading-tight font-medium truncate" title={task.title}>{task.title}</h3>
              {task.createdAt && (
                <Tag text={new Date(task.createdAt).toLocaleDateString()} color="neutral" />
              )}
            </div>
            {task.description && (
              <p className="text-xs text-base-content/80 line-clamp-3">{task.description}</p>
            )}
            {task.tags?.length ? (
              <div className="flex gap-1 flex-wrap">
                {task.tags.map((t) => (
                  <Tag key={t} text={t} color="accent" />
                ))}
              </div>
            ) : null}
            <div className="flex justify-end gap-1 pt-1">
              {onEdit && (
                <div className="tooltip" data-tip="Editar tarea">
                  <Button
                    className="btn btn-ghost btn-xs btn-square"
                    title="Editar tarea"
                    onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                    aria-label="Editar tarea"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </Button>
                </div>
              )}
              <div className="tooltip" data-tip="Eliminar tarea">
                <Button
                  className="btn btn-ghost text-error hover:text-error btn-xs btn-square"
                  title="Eliminar tarea"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await deleteTask(task.id);
                  }}
                  aria-label="Eliminar tarea"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            </div>
            {task.tags?.length ? (
              <div className="flex gap-1 flex-wrap">
                {task.tags.map((t) => (
                  <Tag key={t} text={t} color="accent" />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
