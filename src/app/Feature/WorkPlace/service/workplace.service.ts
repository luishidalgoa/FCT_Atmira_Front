import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkPlace } from '../../../model/domain/work-place';
import { environment } from '../../../../environment/environment';
import { AuthService } from '../../../Login/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkplaceService {
  constructor(private _http: HttpClient, private _auth: AuthService) { }

  guardarTrabajo(workPlace: WorkPlace): Observable<WorkPlace> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url: string = `${environment.apiUrl}/workplace/save/colaboratorId=${this._auth.currentUser$().id_alias}`;
    return this._http.post<WorkPlace>(url, workPlace, header);
  }
}