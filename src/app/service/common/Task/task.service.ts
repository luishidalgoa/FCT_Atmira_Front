import { Injectable } from '@angular/core';

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
    const url: string = `${environment.apiUrl}/task/save/${this._auth.currentUser$().ID_Alias}/${task.Project.id_code}`; //TEMPORAL el id sera el del proyecto
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

  delete(task:Task): Observable<boolean>{
    const url: string = `http://localhost:8080/taskDelete/${task.id_code}`;
    return this._http.delete<boolean>(url);
  }
  
}
