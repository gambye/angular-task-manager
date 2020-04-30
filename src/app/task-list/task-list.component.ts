import { ListService } from '../core/services/task.service';
import { Task } from '../core/models/task.model';
import { List } from '../core/models/task-list.model';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  @Input() list: List;
  @Output() public deleteListEvent = new EventEmitter();

  model: NgbDateStruct;
  date: { year: number; month: number };

  public tasks: Task[];
  public showTasks = true;
  public newListName: string;
  public notUpdatingList = true;
  public notAddingList = true;
  public newTaskName: string;
  public newTaskTerm: Date;
  public newTaskDescription: string;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private listService: ListService,
    private calendar: NgbCalendar
  ) {}

  ngOnInit() {
    this.newListName = this.list.name;
    this.updateView();
  }

  updateView() {
    this.listService
      .getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.tasks = data.filter(task => task.parentId === this.list.id);
      });
  }

  toggleList() {
    this.showTasks = !this.showTasks;
  }

  editListName() {
    this.notUpdatingList = !this.notUpdatingList;
    this.newListName = this.list.name;
  }

  updateList() {
    this.list.name = this.newListName;
    this.listService
      .updateList(this.list.id, this.list)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    this.editListName();
  }

  deleteList() {
    const ids = [];
    for (const task of this.tasks) {
      ids.push(task.id);
    }

    this.listService
      .deleteList(this.list.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        for (const id of ids) {
          this.listService.deleteTask(id).subscribe(() => {});
        }
        this.deleteListEvent.emit('');
      });
  }

  closeAdding() {
    this.notAddingList = !this.notAddingList;
    this.newTaskDescription = '';
    this.newTaskName = '';
    this.newTaskTerm = null;
  }

  addNewTask() {
    const termArray = [
      this.model.year.toString(),
      this.model.month.toString(),
      this.model.day.toString()
    ];
    for (let i = 0; i < termArray.length; i++) {
      if (termArray[i].length === 1) {
        termArray[i] = '0' + termArray[i];
      }
    }
    this.newTaskTerm = new Date(termArray.join('-'));

    const newTask = {
      parentId: this.list.id,
      name: this.newTaskName,
      description: this.newTaskDescription,
      term: this.newTaskTerm
    };
    this.listService
      .createTask(newTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.listService.getTasks().subscribe(updatedTasks => {
          this.tasks = updatedTasks.filter(
            task => task.parentId === this.list.id
          );

          this.addTask();
          this.newTaskDescription = '';
          this.newTaskName = '';
          this.newTaskTerm = null;
        });
      });
  }

  addTask() {
    this.notAddingList = !this.notAddingList;
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
