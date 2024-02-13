import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { url } from 'node:inspector';
import { environment } from '../../../environment/environment';
import { Task } from '../../model/domain/task';
import { TypeOfService } from '../../model/enum/type-of-service';
import { ProjectService } from './project.service';
import { Project } from '../../model/domain/project';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _http:HttpClient, private _project:ProjectService) { }

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
    return new Observable<Task[]>(
      (observe)=>{
        this._project.getById(id as number).subscribe( (project:Project)=>{
          const task: Task[] = [
            {
              id_code: 1,
              description: 'Tarea 1',
              ID_Code_Project: 1,
              objective: TypeOfService.MANTENIMIENTO,
              closed: false,
              task: 1,
              Project: project
            },
            {
              id_code: 1,
              description: 'Tarea 1',
              ID_Code_Project: 1,
              objective: TypeOfService.MANTENIMIENTO,
              closed: false,
              task: 1,
              Project: project
            },
            {
              id_code: 1,
              description: 'Tarea 1',
              ID_Code_Project: 1,
              objective: TypeOfService.MANTENIMIENTO,
              closed: false,
              task: 1,
              Project: project
            },
            {
              id_code: 1,
              description: 'Tarea 1',
              ID_Code_Project: 1,
              objective: TypeOfService.MANTENIMIENTO,
              closed: false,
              task: 1,
              Project: project
            }
          ];

          observe.next(task);
        });
      }
    );
  }

  delete(task:Task): Observable<boolean>{
    return new Observable<boolean>(
      (observe)=>{
        observe.next(true);
      }
    );
  }
  
}
