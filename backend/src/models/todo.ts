export interface Todo {
    id: number;
    task: string;
    deadline: Date;
    created_by: number;
    assigned_users?: number[];
  }
  