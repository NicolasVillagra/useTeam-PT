"use client";

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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-base-100 p-5" onClick={(e) => e.stopPropagation()}>
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
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={() => void handleSubmit()} loading={loading}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
