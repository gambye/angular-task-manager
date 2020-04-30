import { Task } from './../core/models/task.model';
import { ListService } from '../core/services/task.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  public ngUnsubscribe = new Subject();
  public task: Task;
  public taskNewDescription: string;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private listService: ListService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.getTaskDetails(params.id);
      });
  }

  getTaskDetails(id: number) {
    this.listService
      .getTask(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.task = data;
        this.taskNewDescription = this.task.description;
      });
  }

  updateDescription() {
    const newTask = this.task;
    newTask.description = this.taskNewDescription;
    this.listService
      .updateTask(this.task.id, newTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
