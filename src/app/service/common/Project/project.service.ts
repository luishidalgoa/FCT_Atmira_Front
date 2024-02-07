import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Project } from '../../../model/domain/project';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { UserDataWrapperService } from '../../user/user-data-wrapper.service';

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

  getUserProjects(ID_Alias: string, limit?: number): Observable<Project[]> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/collaborator/${ID_Alias}/projects`;
    return this._http.get<Project[]>(url, header);
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
