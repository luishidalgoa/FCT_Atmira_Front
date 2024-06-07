import { Injectable } from '@angular/core';
import { Task } from '../../../model/domain/task';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../../../Login/services/auth.service';
import { Colaborator } from '../../../model/domain/colaborator';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _http: HttpClient, private _auth: AuthService) { }
  /**
   * metodo que se encarga de guardar una tarea en la base de datos
   * @param task tarea que se quiere guardar
   * @returns retorna la tarea guardada en la base de datos
   */
  save(task: Task): Observable<Task> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let taskClone: Task//sustituir por un nuevo objeto

    if (task.task) {
      taskClone = { 
        closed: task.closed,
        description: task.description,
        idCode: task.idCode,
        objective: task.objective,
        project: {
          active: task.project!.active,
          endDate: task.project!.endDate,
          id_code: task.project!.id_code,
          name: task.project!.name,
          initialDate: task.project!.initialDate,
          typeOfService: task.project!.typeOfService,
        },
        task: {
          idCode: task.task?.idCode,
          closed: task.task!.closed,
          description: task.task!.description,
          objective: task.task!.objective,
          project: {
            active: task.task!.project!.active,
            endDate: task.task!.project!.endDate,
            id_code: task.task!.project!.id_code,
            name: task.task!.project!.name,
            initialDate: task.task!.project!.initialDate,
            typeOfService: task.task!.project!.typeOfService,
          },
          task: null
        },
        colaborator: task.colaborator,
      }
    } else {
      taskClone = { //sustituir por un nuevo objeto
        closed:task.closed,
        description:task.description,
        idCode:task.idCode,
        objective:task.objective,
        project:{
          active:task.project!.active,
          endDate:task.project!.endDate,
          id_code:task.project!.id_code,
          name:task.project!.name,
          initialDate:task.project!.initialDate,
          typeOfService:task.project!.typeOfService,
        },
        task:null,
        colaborator: task.colaborator,
      }
    }
    const url: string = `${environment.apiUrl}/task/save/${this._auth.currentUser$().id_alias}`;
    return this._http.post<Task>(url, taskClone, header);
  }

  /**
   * metodo que se encarga de obtener las tareas de un proyecto en base al id del proyecto (IMPORTANTE: solo admite id del proyecto
   * @param id id del proyecto del que se quieren obtener las tareas
   * @returns retorna un array de tareas del proyecto extraidas de la base de datos
   */
  getTaskByProject(id: string): Observable<Task[]> {
    const url: string = `${environment.apiUrl}/task/byProject/${id}`;
    return this._http.get<Task[]>(url);
  }
  /**
   * metodo que se encarga de obtener una tarea en base a su id
   * @param id id de la tarea que se quiere obtener
   * @returns retorna la tarea extraida de la base de datos
   */
  getById(id: string): Observable<Task> {
    const url: string = `${environment.apiUrl}/task/${id}`;
    return this._http.get<Task>(url);

  }
  /**
   * metodo que se encarga de obtener las subtareas de una tarea en base a su id (IMPORTANTE: solo admite id de la tarea)
   * @param id id de la tarea de la que se quieren obtener las subtareas
   * @returns retorna un array de subtareas de la tarea extraidas de la base de datos
   */
  getSubTasksByTask(id: string): Observable<Task[]> {
    const url: string = `${environment.apiUrl}/task/bySubTask/${id}`;
    return this._http.get<Task[]>(url);
  }
  /**
   * metodo que se encarga de eliminar una tarea de la base de datos
   * @param task tarea que se quiere eliminar
   * @returns retorna true si la tarea ha sido eliminada correctamente, false en caso contrario
   */
  delete(task: Task): Observable<boolean> {
    const url: string = `${environment.apiUrl}/taskDelete/${task.idCode}`;
    return this._http.delete<boolean>(url);
  }
  /**
   * este metodo extrae las tareas de un usuario en base a su nombre de usuario
   * @param alias_Id nombre de usuario del que se quieren obtener las tareas
   * @returns retorna un array de tareas del usuario extraidas de la base de datos
   */
  getTaskByUser(alias_Id: string): Observable<Task[]> {
    const url: string = `${environment.apiUrl}/taskAndSubtask/byColaborator/${alias_Id}`;
    return this._http.get<Task[]>(url);
  }



  /**
   * FALSO
   * @param id 
   * @param status 
   * @returns 
   */
  status(idCode: string, closed: boolean): Observable<Task> {
    const url: string = `${environment.apiUrl}/task/${idCode}/${closed}`;
    return this._http.put<Task>(url, { idCode, closed });
  }
  assigned(task: Task, colaborator: Colaborator): Observable<Task> {
    const url: string = `${environment.apiUrl}/task/${task.idCode}/colaborator/${colaborator.id_alias}`;
    return this._http.put<Task>(url, task);
  }

  update(task: Task): Observable<Task> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    console.log(task)
    const url: string = `${environment.apiUrl}/task/update/${task.idCode}`;
    return this._http.put<Task>(url, task, header);
  }

}
