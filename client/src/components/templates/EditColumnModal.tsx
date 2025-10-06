import React, { useEffect, useState } from 'react';
import Button from '@/src/components/atoms/Button';
import Input from '@/src/components/atoms/Input';

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
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Renombrar columna</h3>
        <div className="py-3">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="modal-action">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={() => void handleSave()} loading={loading}>Guardar</Button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default EditColumnModal;
