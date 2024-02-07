import { Injectable } from '@angular/core';
import { Task } from '../../../model/domain/task';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { url } from 'node:inspector';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _http:HttpClient) { }

  save(task:Task){
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/task/save`;
    return this._http.post<Task>(url, task, header);
  }

  getSubTasksByProject(id:string | number): Observable<Task[]>{
    const url: string = `${environment.apiUrl}/task/byProject/${id}`;
    return this._http.get<Task[]>(url);
  }

  delete(task:Task): Observable<boolean>{
    const url: string = `http://localhost:8080/taskDelete/${task.id_code}`;
    return this._http.delete<boolean>(url);
  }
  
}
