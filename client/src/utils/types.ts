export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  position: number;
  tags?: string[];
  createdAt?: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  columnId: string;
  tags?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  columnId?: string;
  position?: number;
  tags?: string[];
}
