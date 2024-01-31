import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Project } from '../../../model/domain/project';
import { BehaviorSubject, Observable } from 'rxjs';
import { Colaborator } from '../../../model/domain/colaborator';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  constructor(private _http: HttpClient) { }

  save(project: Project): Observable<Project> {
      const header = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      const url: string = `${environment.apiUrl}/project/save`;
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
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/delete/${project.id_code}`;
    return this._http.delete<boolean>(url, header);
  }

}
