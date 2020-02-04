// Модель "Задача"
export interface Task {
  // Идентификатор
  id: number;
  // Идентификатор родителя
  parentId: number;
  // Заголовок
  name: string;
  // Описание
  description: string;
  // Срок задачи
  term: Date;
  // Статус выполнения
  isCompleted: boolean;
}
