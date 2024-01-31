import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Project } from '../../../model/domain/project';
import { Observable } from 'rxjs';
import { Colaborator } from '../../../model/domain/colaborator';

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
      const url: string = 'http://localhost:8080/project/save';
      return this._http.post<Project>(url, project, header);
  }

  getUserProjects(id: number, limit: number): Observable<Project[]> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = 'http://localhost:8080/project/user/' + id + '/limit=' + limit;
    return this._http.get<Project[]>(url, header);
  }


  /**
   * @deprecated TEMPORAL
   */
  getAllProjects(ID_Alias:string): Observable<Project[]> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `http://localhost:8080/project/${ID_Alias}/all`;
    return this._http.get<Project[]>(url, header);
  }

}
