import { ListService } from '../core/services/task.service';
import { Task } from '../core/models/task.model';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  @Output() public updateTaskEvent = new EventEmitter();

  model: NgbDateStruct;
  date: { year: number; month: number };

  taskNotEditing = true;
  updatedName: string;
  updatedTerm: Date;
  deadline = false;
  expired = false;
  taskCompleted = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private listService: ListService,
    private calendar: NgbCalendar
  ) {}

  ngOnInit() {
    this.updatedName = this.task.name;
    this.updatedTerm = this.task.term;
    this.updateTermStatus();
    this.updateTaskCompleted();
    const yearDate = new Date(this.task.term).getFullYear();
    const monthDate = new Date(this.task.term).getMonth();
    const dayDate = new Date(this.task.term).getDay();
    this.model = {
      year: +yearDate,
      month: +monthDate,
      day: +dayDate
    };
  }

  toggleTask() {
    this.taskNotEditing = !this.taskNotEditing;
    const yearDate = new Date(this.task.term).getFullYear();
    const monthDate = new Date(this.task.term).getMonth() + 1;
    const dayDate = new Date(this.task.term).getDate();
    this.model = {
      year: +yearDate,
      month: +monthDate,
      day: +dayDate
    };
  }

  deleteTask() {
    this.listService
      .deleteTask(this.task.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateTaskEvent.emit('');
      });
  }

  updateTermStatus() {
    const date1 = new Date();
    const date2 = new Date(this.task.term);
    const days = Math.ceil(
      Math.abs(date1.getTime() - date2.getTime()) / (1000 * 3600 * 24)
    );

    date2.getTime() < date1.getTime()
      ? (this.expired = true)
      : days <= 3 && days > 0
      ? (this.deadline = true)
      : (this.deadline = false);
    if (date1.getDate() === date2.getDate()) {
      this.expired = false;
      this.deadline = true;
    }
  }

  toggleCompleted() {
    this.task.isCompleted = !this.task.isCompleted;
    this.taskCompleted = this.task.isCompleted;
    this.updateTask(false, false);
  }

  updateTaskCompleted() {
    this.taskCompleted = this.task.isCompleted;
  }

  updateTask(updateView: boolean, toggle: boolean) {
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
    this.updatedTerm = new Date(termArray.join('-'));

    const newTask = this.task;
    newTask.name = this.updatedName;
    newTask.term = this.updatedTerm;
    newTask.isCompleted = this.taskCompleted;

    this.listService
      .updateTask(this.task.id, newTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.listService.getTask(this.task.id).subscribe(dataTask => {
          this.task = dataTask;
          this.task.name = this.updatedName;
          if (toggle) {
            this.toggleTask();
          }
          if (updateView) {
            this.updateTaskEvent.emit('');
          }
        });
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
