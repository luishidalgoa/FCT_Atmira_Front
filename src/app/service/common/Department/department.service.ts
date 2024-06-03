import { Injectable } from '@angular/core';
import { Departament } from '../../../model/domain/departament';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../../user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private department: Departament | null = null;
  constructor(private _http: HttpClient, private _auth: AuthService) { }

  save(department: Departament): Observable<Departament> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log(department);
    const url: string = `${environment.apiUrl}/deparment/save/${this._auth.currentUser$().id_alias}`;
    return this._http.post<Departament>(url, department, header);
  }

  
  setDepartment(department: Departament) {
    this.department = department;
  }

  getDepartment(): Departament | null {
    return this.department;
  }
}
