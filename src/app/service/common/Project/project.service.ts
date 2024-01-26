import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Project } from '../../../model/domain/project';
import { Observable } from 'rxjs';

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

}
