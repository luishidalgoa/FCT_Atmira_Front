import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../model/domain/task';
import { TypeOfService } from '../../model/enum/type-of-service';
import { ProjectService } from '../common/Project/project.service';
import { Project } from '../../model/domain/project';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private _http: HttpClient, private _project: ProjectService) {}

  save(task: Task): Observable<Task> {
    //numero random
    task.idCode = Math.floor(Math.random() * 100).toString();
    return new Observable<Task>((observe) => {
      observe.next(task);
    });
  }

  /**
   * Retorna las tareas hijas de una tarea padre o un proyecto
   * @param id 
   * @returns 
   */
  getTasksById_Code(id: string | number): Observable<Task[]> {
    return new Observable<Task[]>((observe) => {
      this._project.getById(1).subscribe((project: Project) => {
        const task: Task[] = [
          {
            idCode: '1_1',
            description: 'Tarea 1',
            ID_Code_Project: '1',
            objective: TypeOfService.FINANZAS,
            closed: true,
            task: {
              idCode: '1_1',
              description: 'Tarea 1',
              ID_Code_Project: '1',
              objective: TypeOfService.MANTENIMIENTO,
              closed: false,
              task: null,
              project: {
                id_code: '1',
                name: 'Proyecto 1',
                active: true,
                endDate: new Date(),
                initialDate: new Date(),
                typeOfService: TypeOfService.DESARROLLO,
                colaboratorProjects: [],
                tasks: [],
                expenses: true,
              },
            },
            project: project,
          },
          {
            idCode: '1_2',
            description: 'Tarea 2',
            ID_Code_Project: '1',
            objective: TypeOfService.MARKETING,
            closed: false,
            task: {
              idCode: '1_1',
              description: 'Tarea 1',
              ID_Code_Project: '1',
              objective: TypeOfService.MANTENIMIENTO,
              closed: false,
              task: null,
              project: {
                id_code: '1',
                name: 'Proyecto 1',
                active: true,
                endDate: new Date(),
                initialDate: new Date(),
                typeOfService: TypeOfService.DESARROLLO,
                colaboratorProjects: [],
                tasks: [],
                expenses: true,
              },
            },
            project: project,
          },
          {
            idCode: '1_3',
            description: 'Tarea 3',
            ID_Code_Project: '1',
            objective: TypeOfService.MANTENIMIENTO,
            closed: false,
            task: {
              idCode: '1_1',
              description: 'Tarea 1',
              ID_Code_Project: '1',
              objective: TypeOfService.MANTENIMIENTO,
              closed: false,
              task: null,
              project: {
                id_code: '1',
                name: 'Proyecto 1',
                active: true,
                endDate: new Date(),
                initialDate: new Date(),
                typeOfService: TypeOfService.DESARROLLO,
                colaboratorProjects: [],
                tasks: [],
                expenses: true,
              },
            },
            project: project,
          },
          {
            idCode: '1_4',
            description: 'Tarea 4',
            ID_Code_Project: '1',
            objective: TypeOfService.OPERACIONES,
            closed: false,
            task: {
              idCode: '1_1',
              description: 'Tarea 1',
              ID_Code_Project: '1',
              objective: TypeOfService.MANTENIMIENTO,
              closed: false,
              task: null,
              project: {
                id_code: '1',
                name: 'Proyecto 1',
                active: true,
                endDate: new Date(),
                initialDate: new Date(),
                typeOfService: TypeOfService.DESARROLLO,
                colaboratorProjects: [],
                tasks: [],
                expenses: true,
              },
            },
            project: project,
          },
        ];

        observe.next(task);
      });
    });
  }

  /*
  delete(task: Task): Observable<boolean> {
    return new Observable<boolean>((observe) => {
      observe.next(true);
    });
  }
  */

  delete(task:Task): Observable<boolean>{
    const url: string = `http://localhost:8080/taskDelete/${task.idCode}`;
    return this._http.delete<boolean>(url);
  }

  getTaskByUser(alias_Id: string): Observable<Task[]> {
    return new Observable<Task[]>((observe) => {
      observe.next([
        {
          idCode: '1_1',
          description: 'Tarea 1',
          ID_Code_Project: '1',
          objective: TypeOfService.MANTENIMIENTO,
          closed: false,
          task: null,
          project: {
            id_code: '1',
            name: 'Proyecto 1',
            active: true,
            endDate: new Date(),
            initialDate: new Date(),
            typeOfService: TypeOfService.DESARROLLO,
            colaboratorProjects: [],
            tasks: [],
            expenses: true,
          },
        },
        {
          idCode: '1_2',
          description: 'Tarea 2',
          ID_Code_Project: '1',
          objective: TypeOfService.MANTENIMIENTO,
          closed: false,
          task: null,
          project: {
            id_code: '1',
            name: 'Proyecto 1',
            active: true,
            endDate: new Date(),
            initialDate: new Date(),
            typeOfService: TypeOfService.DESARROLLO,
            colaboratorProjects: [],
            tasks: [],
            expenses: true,
          },
        },
      ]);
    });
  }
  status(id: string,status:boolean): Observable<Task> {
    return new Observable<Task>((observe) => {
        observe.next(
          {
            idCode: id,
            description: 'Tarea 1',
            ID_Code_Project: '1',
            objective: TypeOfService.FINANZAS,
            closed: status,
            task: {
              idCode: '1_1',
              description: 'Tarea 1',
              ID_Code_Project: '1',
              objective: TypeOfService.MANTENIMIENTO,
              closed: false,
              task: null,
              project: {
                id_code: '1',
                name: 'Proyecto 1',
                active: true,
                endDate: new Date(),
                initialDate: new Date(),
                typeOfService: TypeOfService.DESARROLLO,
                colaboratorProjects: [],
                tasks: [],
                expenses: true,
              },
            },
            project: {
              id_code: '1',
              name: 'Proyecto 1',
              active: true,
              endDate: new Date(),
              initialDate: new Date(),
              typeOfService: TypeOfService.DESARROLLO,
              colaboratorProjects: [],
              tasks: [],
              expenses: true,
            },
          },
        );
    });
  }

}
