import { Injectable } from '@angular/core';
import { Task } from '../../../model/domain/task';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { url } from 'node:inspector';
import { AuthService } from '../../mockup/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _http:HttpClient,private _auth:AuthService) { }

  save(task:Task){
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/task/save/${this._auth.currentUser$().ID_Alias}/${task.task == undefined ? task.ID_Code_Project : task.task}`; //TEMPORAL el id sera el del proyecto
    return this._http.post<Task>(url, task, header);
  }

  getTaskByProject(id:string | number): Observable<Task[]>{
    const url: string = `${environment.apiUrl}/task/byProject/${id}`;
    return this._http.get<Task[]>(url);
  }

  getById(id:string): Observable<Task>{
    const url: string = `${environment.apiUrl}/task/${id}`;
    return this._http.get<Task>(url);
  
  }
  
  getSubTasksByTask(id:string): Observable<Task[]>{
    const url: string = `${environment.apiUrl}/task/bySubTask/${id}`;
    return this._http.get<Task[]>(url);
  }

  delete(task:Task): Observable<boolean>{
    const url: string = `http://localhost:8080/taskDelete/${task.idCode}`;
    return this._http.delete<boolean>(url);
  }
  
  getTaskByUser(alias_Id: string): Observable<Task[]> {
    const url: string = `${environment.apiUrl}/task/byColaborator/${alias_Id}`;
    return this._http.get<Task[]>(url);
  }
}
