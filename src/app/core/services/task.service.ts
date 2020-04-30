import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { List } from '../models/task-list.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private apiURL = 'my-json-server.typicode.com';

  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getLists(): Observable<List[]> {
    return this.http
      .get<List[]>(this.apiURL + '/lists')
      .pipe(retry(1), catchError(this.handleError));
  }

  getList(id): Observable<List> {
    return this.http
      .get<List>(this.apiURL + '/lists/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  createList(list): Observable<List> {
    return this.http
      .post<List>(
        this.apiURL + '/lists',
        JSON.stringify(list),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  updateList(id, list): Observable<List> {
    return this.http
      .put<List>(
        this.apiURL + '/lists/' + id,
        JSON.stringify(list),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteList(id): Observable<List> {
    return this.http
      .delete<List>(this.apiURL + '/lists/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiURL + '/tasks')
      .pipe(retry(1), catchError(this.handleError));
  }

  getTask(id): Observable<Task> {
    return this.http
      .get<Task>(this.apiURL + '/tasks/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  createTask(task): Observable<Task> {
    return this.http
      .post<Task>(
        this.apiURL + '/tasks',
        JSON.stringify(task),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  updateTask(id, task): Observable<Task> {
    return this.http
      .put<Task>(
        this.apiURL + '/tasks/' + id,
        JSON.stringify(task),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteTask(id): Observable<Task> {
    return this.http
      .delete<Task>(this.apiURL + '/tasks/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
