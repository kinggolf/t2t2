export interface TodoModel {
  id: string;
  label: string;
  completed: boolean;
  editingTask?: boolean;
}
