import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface EmitEventArgs<T = any> {
  event: 'taskCreated' | 'taskUpdated' | 'taskMoved' | 'taskDeleted' | 'columnCreated' | 'columnUpdated' | 'columnDeleted' | string;
  payload?: T;
}

// Hook para inicializar y exponer la conexión Socket.IO
export const useSocket = () => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    socket.current = io(url, { transports: ['websocket'] });
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, []);

  // Emite evento tipados hacia el backend
  const emitEvent = useCallback(<T,>({ event, payload }: EmitEventArgs<T>) => {
    socket.current?.emit(event, payload);
  }, []);

  return { socket, emitEvent } as const;
};
