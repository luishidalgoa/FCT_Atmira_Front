import { Injectable } from '@angular/core';
import { WorkPlace } from '../../../model/domain/work-place';
import { Observable } from 'rxjs';
import { Expense } from '../../../model/domain/expense';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../Login/services/auth.service';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(private _http: HttpClient, private _auth: AuthService) { }

  filter(objectFilter: Expense): Observable<Expense[]> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    }).set('Authorization', `Bearer ${this._auth.authorization$().token}`)

    const url: string = `${environment.apiUrl}/expense`;
    
    return this._http.post<Expense[]>(url, objectFilter, { headers: headers });
  }

  updateExpensesState(expense: Expense): Observable<Expense> {

    console.log(expense)
    const headers: HttpHeaders = new HttpHeaders({}).set('Authorization', `Bearer ${this._auth.authorization$().token}`)
    const url: string = `${environment.apiUrl}/expensive/state`;
    return this._http.put<Expense>(url, expense, { headers: headers });
  }

}
