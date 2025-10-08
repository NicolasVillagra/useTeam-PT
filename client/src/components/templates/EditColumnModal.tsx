import React, { useEffect, useState } from 'react';
import Button from '@/src/components/atoms/Button';
import Input from '@/src/components/atoms/Input';
import { toast } from 'react-toastify';
export interface EditColumnModalProps {
  isOpen: boolean;
  initialName: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void> | void;
}

export const EditColumnModal: React.FC<EditColumnModalProps> = ({ isOpen, initialName, onClose, onSave }) => {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setName(initialName);
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      await onSave(name.trim());
      toast.success('Columna actualizada correctamente');
      onClose();
    } catch (error) {
      toast.error('Error al actualizar la columna');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-base-100 p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg">Renombrar columna</h3>
        <div className="py-3">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={() => void handleSave()} loading={loading}>Guardar</Button>
        </div>
      </div>
    </div>
  );
};

export default EditColumnModal;
