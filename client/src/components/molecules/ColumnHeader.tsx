import React from 'react';
import Tag from '@/src/components/atoms/Tag';
import Button from '../atoms/Button';

export interface ColumnHeaderProps {
  title: string;
  count?: number;
  onEdit?: () => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, count = 0, onEdit }) => {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-sm">{title}</h2>
        <Tag text={String(count)} color="neutral" />
      </div>
      {onEdit && (
        <Button className="btn btn-xs btn-ghost" onClick={onEdit} title="Editar columna">
          Editar Columna
        </Button>
      )}
    </div>
  );
};

export default ColumnHeader;
