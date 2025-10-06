"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/src/components/atoms/Button';
import Input from '@/src/components/atoms/Input';
import type { Column, CreateTaskDto } from '@/src/utils/types';
import { toast } from 'react-toastify';

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (dto: CreateTaskDto) => Promise<any> | any;
  columns: Column[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onCreate, columns }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('');
  const [loading, setLoading] = useState(false);

  const orderedColumns = useMemo(() => columns, [columns]);

  useEffect(() => {
    if (isOpen) {
      const first = orderedColumns[0]?.id ?? '';
      setColumnId(first);
    }
  }, [isOpen, orderedColumns]);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('El título es requerido');
      return;
    }
    if (!columnId) {
      toast.error('Debes seleccionar una columna');
      return;
    }
    try {
      setLoading(true);
      await onCreate({ title: title.trim(), description: description.trim() || undefined, columnId });
      toast.success('Tarea creada');
      onClose();
      setTitle('');
      setDescription('');
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg rounded-lg bg-base-100 p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">Nueva tarea</h3>
        <div className="py-3 space-y-3">
          <Input label="Título" placeholder="Ej: Diseñar landing" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="form-control">
            <span className="label-text mb-1">Descripción</span>
            <textarea className="textarea textarea-bordered" rows={3} placeholder="Opcional" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">Columna</span>
            <select className="select select-bordered" value={columnId} onChange={(e) => setColumnId(e.target.value)}>
              {orderedColumns.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={() => void handleCreate()} loading={loading}>Crear</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
