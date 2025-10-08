import React, { useState } from 'react';
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
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  progress?: number;
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  index, 
  onEdit, 
  priority = 'medium',
  progress = 0,
  assignee,
  dueDate 
}) => {
  const { deleteTask } = useTasksContext();
  const [isHovered, setIsHovered] = useState(false);



  const isOverdue = dueDate && new Date(dueDate) < new Date();
  const isDueSoon = dueDate && new Date(dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          className="group card bg-base-100/90 backdrop-blur border border-base-200 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-grab active:cursor-grabbing"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          <div className="card-body p-4 gap-3">
            {/* Header with title and priority */}
            <div className="flex items-start justify-between gap-3 min-w-0">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2 opacity-60" />
                <h3 className="card-title text-sm leading-tight font-semibold truncate text-base-content" title={task.title}>
                  {task.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0"> 
                {dueDate && (
                  <div className={`tooltip ${isOverdue ? 'tooltip-error' : isDueSoon ? 'tooltip-warning' : ''}`} 
                       data-tip={`Vence: ${new Date(dueDate).toLocaleDateString()}`}>
                    <div className={`w-2 h-2 rounded-full ${isOverdue ? 'bg-error' : isDueSoon ? 'bg-warning' : 'bg-info'}`} />
                  </div>
                )}
              </div>
            </div>

            {task.description && (
              <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {progress > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-base-content/60">Progreso</span>
                  <span className="text-xs font-medium text-base-content/80">{progress}%</span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {task.tags?.length ? (
              <div className="flex gap-1 flex-wrap">
                {task.tags.map((tag, idx) => (
                  <Tag key={`${tag}-${idx}`} text={tag} color="accent" />
                ))}
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2 border-t border-base-200/50">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {assignee ? (
                  <div className="tooltip" data-tip={assignee.name}>
                    <div className="avatar">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-content text-xs flex items-center justify-center">
                        {assignee.avatar ? (
                          <img src={assignee.avatar} alt={assignee.name} className="w-full h-full rounded-full" />
                        ) : (
                          <span className="font-semibold">{assignee.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tooltip" data-tip="Sin asignar">
                    <div className="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center">
                      <svg className="w-3 h-3 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {task.createdAt && (
                  <span className="text-xs text-base-content/50 truncate">
                    {new Date(task.createdAt).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                )}
              </div>

              <div className={`flex gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
                {onEdit && (
                  <div className="tooltip" data-tip="Editar tarea">
                    <Button
                      className="btn btn-ghost btn-xs btn-square hover:btn-primary"
                      title="Editar tarea"
                      onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                      aria-label="Editar tarea"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                  </div>
                )}
                
                <div className="tooltip" data-tip="Eliminar tarea">
                  <Button
                    className="btn btn-ghost btn-xs btn-square hover:btn-error hover:text-error-content"
                    title="Eliminar tarea"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteTask(task.id);
                    }}
                    aria-label="Eliminar tarea"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
