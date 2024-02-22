import { Injectable } from '@angular/core';
import { Task } from '../../../model/domain/task';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../../mockup/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _http:HttpClient,private _auth:AuthService) { }
  /**
   * metodo que se encarga de guardar una tarea en la base de datos
   * @param task tarea que se quiere guardar
   * @returns retorna la tarea guardada en la base de datos
   */
  save(task:Task): Observable<Task> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/task/save/${this._auth.currentUser$().ID_Alias}/${task.task == undefined ? task.ID_Code_Project : task.task}`; //TEMPORAL el id sera el del proyecto
    return this._http.post<Task>(url, task, header);
  }
  /**
   * metodo que se encarga de obtener las tareas de un proyecto en base al id del proyecto (IMPORTANTE: solo admite id del proyecto
   * @param id id del proyecto del que se quieren obtener las tareas
   * @returns retorna un array de tareas del proyecto extraidas de la base de datos
   */
  getTaskByProject(id:number): Observable<Task[]>{
    const url: string = `${environment.apiUrl}/task/byProject/${id}`;
    return this._http.get<Task[]>(url);
  }
  /**
   * metodo que se encarga de obtener una tarea en base a su id
   * @param id id de la tarea que se quiere obtener
   * @returns retorna la tarea extraida de la base de datos
   */
  getById(id:string): Observable<Task>{
    const url: string = `${environment.apiUrl}/task/${id}`;
    return this._http.get<Task>(url);
  
  }
  /**
   * metodo que se encarga de obtener las subtareas de una tarea en base a su id (IMPORTANTE: solo admite id de la tarea)
   * @param id id de la tarea de la que se quieren obtener las subtareas
   * @returns retorna un array de subtareas de la tarea extraidas de la base de datos
   */
  getSubTasksByTask(id:string): Observable<Task[]>{
    const url: string = `${environment.apiUrl}/task/bySubTask/${id}`;
    return this._http.get<Task[]>(url);
  }
  /**
   * metodo que se encarga de eliminar una tarea de la base de datos
   * @param task tarea que se quiere eliminar
   * @returns retorna true si la tarea ha sido eliminada correctamente, false en caso contrario
   */
  delete(task:Task): Observable<boolean>{
    const url: string = `http://localhost:8080/taskDelete/${task.idCode}`;
    return this._http.delete<boolean>(url);
  }
  /**
   * este metodo extrae las tareas de un usuario en base a su nombre de usuario
   * @param alias_Id nombre de usuario del que se quieren obtener las tareas
   * @returns retorna un array de tareas del usuario extraidas de la base de datos
   */
  getTaskByUser(alias_Id: string): Observable<Task[]> {
    const url: string = `${environment.apiUrl}/task/byColaborator/${alias_Id}`;
    return this._http.get<Task[]>(url);
  }
}
