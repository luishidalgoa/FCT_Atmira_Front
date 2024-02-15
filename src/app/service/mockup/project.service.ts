import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { Project } from '../../model/domain/project';
import { environment } from '../../../environment/environment';
import { UserDataWrapperService } from '../user/user-data-wrapper.service';
import { TypeOfService } from '../../model/enum/type-of-service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  constructor(private _http: HttpClient) { }

  /**
   * 
   * @param project objeto completo del proyecto
   * @param ID_Alias id del usuario que va ha crear el proyecto 
   * @returns 
   */
  save(project: Project,ID_Alias:string): Observable<Project> {
    return new Observable<Project>((observer) => {
      project.colaboratorProjects = [
        {
          Name: 'sampleId',
          Surname: 'John',
          Email: 'sampleId@gmail.com',
          Expense: true,
          Guards: true,
          Hours: 8,
          ID_Alias: ID_Alias,
          isActive: true,
          relaseDate: new Date(),
          Password: '1234',
        }
      ]
      project.id_code = Math.floor(Math.random() * 100);
      observer.next(project);
    });
  }

  /**
   * Haremos un observable que retorno un mockup de proyectos preprogramados
   * @param ID_Alias 
   * @param limit 
   */
  getUserProjects(ID_Alias: string, limit?: number): Observable<Project[]> {
    return new Observable<Project[]>((observer) => {
      observer.next([
        {
          id_code: 1,
          name: 'Proyecto 1',
          active: true,
          endDate: new Date(),
          initialDate: new Date(),
          typeOfService: TypeOfService.DESARROLLO,
          colaboratorProjects: [
            {
              Name: 'sampleId',
              Surname: 'John',
              Email: 'sampleId@gmail.com',
              Expense: true,
              Guards: true,
              Hours: 8,
              ID_Alias: 'sampleId',
              isActive: true,
              relaseDate: new Date(),
              Password: '1234',
            },
            {
              Name: 'sampleId',
              Surname: 'John',
              Email: 'sampleId@gmail.com',
              Expense: true,
              Guards: true,
              Hours: 8,
              ID_Alias: 'sampleId',
              isActive: true,
              relaseDate: new Date(),
              Password: '1234',
            },
            {
              Name: 'sampleId',
              Surname: 'John',
              Email: 'sampleId@gmail.com',
              Expense: true,
              Guards: true,
              Hours: 8,
              ID_Alias: 'sampleId',
              isActive: true,
              relaseDate: new Date(),
              Password: '1234',
            },
            {
              Name: 'sampleId',
              Surname: 'John',
              Email: 'sampleId@gmail.com',
              Expense: true,
              Guards: true,
              Hours: 8,
              ID_Alias: 'sampleId',
              isActive: true,
              relaseDate: new Date(),
              Password: '1234',
            }
          ],
          tasks: [],
          expenses: true
        },
      ]);
    });
  }

  getById(id: number,projects?:Project[]): Observable<Project> {
    return new Observable<Project>((observer) => {
      if (projects !== undefined) {
        observer.next(projects?.filter((project: Project) => project.id_code == id)[0]);
      } else {
        const header = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        const url: string = `${environment.apiUrl}/project/list/${id}`;
        return this._http.get<Project>(url, header).subscribe((data) => {
          observer.next(data);
        });
      }
      return; // Add this line to return a value when projects is undefined
    });
  }

}
