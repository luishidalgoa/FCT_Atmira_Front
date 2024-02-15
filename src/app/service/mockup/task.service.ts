import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { url } from 'node:inspector';
import { environment } from '../../../environment/environment';
import { Task } from '../../model/domain/task';
import { TypeOfService } from '../../model/enum/type-of-service';
import { ProjectService } from '../common/Project/project.service';
import { Project } from '../../model/domain/project';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private _http: HttpClient, private _project: ProjectService) {}

  save(task: Task): Observable<Task> {
    //numero random
    task.id_code = Math.floor(Math.random() * 100);
    return new Observable<Task>((observe) => {
      observe.next(task);
    });
  }

  getSubTasksByProject(id: string | number): Observable<Task[]> {
    return new Observable<Task[]>((observe) => {
      this._project.getById(id as number).subscribe((project: Project) => {
        const task: Task[] = [
          {
            id_code: 1,
            description: 'Tarea 1',
            ID_Code_Project: 1,
            objective: TypeOfService.MANTENIMIENTO,
            closed: false,
            task: 1,
            Project: project,
          },
          {
            id_code: 8,
            description: 'Tarea 2',
            ID_Code_Project: 1,
            objective: TypeOfService.MANTENIMIENTO,
            closed: false,
            task: 1,
            Project: project,
          },
          {
            id_code: 9,
            description: 'Tarea 3',
            ID_Code_Project: 1,
            objective: TypeOfService.MANTENIMIENTO,
            closed: false,
            task: 1,
            Project: project,
          },
          {
            id_code: 10,
            description: 'Tarea 4',
            ID_Code_Project: 1,
            objective: TypeOfService.MANTENIMIENTO,
            closed: false,
            task: 1,
            Project: project,
          },
        ];

        observe.next(task);
      });
    });
  }

  delete(task: Task): Observable<boolean> {
    return new Observable<boolean>((observe) => {
      observe.next(true);
    });
  }

  getTaskByUser(alias_Id: string): Observable<Task[]> {
    return new Observable<Task[]>((observe) => {
      observe.next([
        {
          id_code: 1,
          description: 'Tarea 1',
          ID_Code_Project: 1,
          objective: TypeOfService.MANTENIMIENTO,
          closed: false,
          task: 1,
          Project: {
            id_code: 1,
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
          id_code: 8,
          description: 'Tarea 2',
          ID_Code_Project: 1,
          objective: TypeOfService.MANTENIMIENTO,
          closed: false,
          task: 1,
          Project: {
            id_code: 1,
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
}
