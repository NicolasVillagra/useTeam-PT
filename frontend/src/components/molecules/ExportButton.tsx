import React from 'react';
import Button from '@/src/components/atoms/Button';

export interface ExportButtonProps {
  onClick: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => {
  return (
    <Button variant="secondary" onClick={onClick}>
      Exportar Backlog
    </Button>
  );
};

export default ExportButton;
