"use client";

import React from 'react';
import { TasksProvider } from '@/src/context/TasksContext';
import BoardPage from '@/src/components/templates/BoardPage';

export default function Board() {
  return (
    <TasksProvider>
      <BoardPage />
    </TasksProvider>
  );
}
