import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../../../model/domain/project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private _http: HttpClient) { }

  save(project: Project): Observable<Project> {
    if (project) {
      const url: string = 'http://localhost:8080/project';
      return this._http.post<Project>(url, project);
    }
    return new Observable<Project>(); // or any other appropriate value or observable
  }

}
