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
      const header = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      const url: string = `${environment.apiUrl}/project/save/colaboratorId=${ID_Alias}`;
      return this._http.post<Project>(url, project, header);
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
          colaboratorProjects: [],
          tasks: [],
          expenses: true
        }
      ]);
    });
  }

  delete(project: Project): Observable<boolean> {
    const _user_dataWrapper: UserDataWrapperService = inject(UserDataWrapperService);
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/delete/${project.id_code}`;

    return this._http.delete<boolean>(url, header).pipe(
      tap((result: boolean) => {
        if (result) {
          _user_dataWrapper.removeProject(project);
        }
      })
    );
  }

  getById(id: number): Observable<Project> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/project/list/${id}`;
    return this._http.get<Project>(url, header);
  }

}
