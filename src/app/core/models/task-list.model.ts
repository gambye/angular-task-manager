import { Task } from './task.model';
// Модель "Задачи"
export interface List {
  // Идентификатор
  id: number;
  // Текст: обязательное поле
  name: string;
  // Список задач
  tasks: Task[];
}
