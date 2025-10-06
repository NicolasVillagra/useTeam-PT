"use client";

import React, { useState } from 'react';
import Button from '@/src/components/atoms/Button';
import Input from '@/src/components/atoms/Input';

export interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void> | void;
}

export const CreateColumnModal: React.FC<CreateColumnModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      await onCreate(name.trim());
      onClose();
      setName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-base-100 p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">Nueva columna</h3>
        <div className="py-3">
          <Input label="Nombre" placeholder="Por ejemplo: To Do" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={() => void handleCreate()} loading={loading}>Crear</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateColumnModal;
