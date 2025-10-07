import React from 'react';
import Tag from '@/src/components/atoms/Tag';
import Button from '../atoms/Button';

export interface ColumnHeaderProps {
  title: string;
  count?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, count = 0, onEdit , onDelete }) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-md border border-base-200 bg-base-100/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 min-w-0">
        <h2 className="font-semibold text-sm truncate" title={title}>{title}</h2>
        <Tag text={String(count)} color="neutral" />
      </div>
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-1">
          {onEdit && (
            <div className="tooltip" data-tip="Editar columna">
              <Button
                className="btn btn-xs btn-ghost btn-square"
                onClick={onEdit}
                title="Editar columna"
                aria-label="Editar columna"
              >
                {/* pencil icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </Button>
            </div>
          )}
          {onDelete && (
            <div className="tooltip" data-tip="Eliminar columna">
              <Button
                className="btn btn-xs btn-ghost btn-square text-error hover:text-error"
                onClick={onDelete}
                title="Eliminar columna"
                aria-label="Eliminar columna"
              >
                {/* trash icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColumnHeader;
