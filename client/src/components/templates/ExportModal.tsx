import React, { useState } from 'react';
import Button from '@/src/components/atoms/Button';
import Input from '@/src/components/atoms/Input';
import { toast } from 'react-toastify';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email?: string) => Promise<void> | void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onConfirm(email);
      toast.success('Backlog exportado correctamente');
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al exportar backlog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Exportar backlog</h3>
        <p className="py-2">Ingresa el email destino para recibir el backlog exportado.</p>
        <div className="py-2">
          <Input
            type="email"
            placeholder="usuario@correo.com"
            label="Email destino"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={() => void handleSubmit()} loading={loading}>Confirmar</Button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default ExportModal;
