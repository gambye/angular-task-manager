import { List } from '../core/models/task-list.model';
import { ListService } from '../core/services/task.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-lists',
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.scss']
})
export class TaskListsComponent implements OnInit, OnDestroy {
  public lists: List[];
  public notAddingNewCategory = true;
  public newListName: string;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private listService: ListService) {}

  ngOnInit() {
    this.updateLists();
  }

  addNewCategory() {
    const newList = { name: this.newListName };
    this.listService
      .createList(newList)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateLists();
        this.newCategoryToggle();
      });
  }

  newCategoryToggle() {
    this.notAddingNewCategory = !this.notAddingNewCategory;
    this.newListName = '';
  }

  updateLists() {
    this.listService
      .getLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        this.lists = data;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
