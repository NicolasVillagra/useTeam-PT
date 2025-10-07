import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/src/components/atoms/Button';
import Input from '@/src/components/atoms/Input';
import type { Column, Task, UpdateTaskDto } from '@/src/utils/types';
import { toast } from 'react-toastify';

export interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  columns: Column[];
  onSave: (id: string, dto: UpdateTaskDto) => Promise<any> | any;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, columns, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('');
  const [loading, setLoading] = useState(false);

  const orderedColumns = useMemo(() => columns, [columns]);

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setColumnId(task.columnId || orderedColumns[0]?.id || '');
    }
  }, [isOpen, task, orderedColumns]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('El título es requerido');
      return;
    }
    try {
      setLoading(true);
      await onSave(task.id, { title: title.trim(), description: description.trim() || undefined, columnId });
      toast.success('Tarea actualizada');
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al actualizar la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-base-100 p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">Editar tarea</h3>
        <div className="py-3 space-y-3">
          <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="form-control">
            <span className="label-text mb-1">Descripción</span>
            <textarea className="textarea textarea-bordered" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
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
          <Button onClick={() => void handleSave()} loading={loading}>Guardar</Button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
