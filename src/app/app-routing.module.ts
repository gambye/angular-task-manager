import { TaskListsComponent } from './task-lists/task-lists.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: TaskListsComponent },
  { path: 'task/:id', component: TaskDetailsComponent },
  {
    path: '**',
    redirectTo: '/404'
  }
  // {
  //   path: '404',
  //   component: PageNotFoundComponent
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
