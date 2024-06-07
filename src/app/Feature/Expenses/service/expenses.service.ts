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
    const obj: Expense = {
      state: expense.state,
      colaborator: expense.colaborator,
      cost: expense.cost,
      createdDate: expense.createdDate,
      description: expense.description,
      project: {
        active: expense.project!.active,
        endDate: expense.project!.endDate,
        id_code: expense.project!.id_code,
        name: expense.project!.name,
        initialDate: expense.project!.initialDate,
        typeOfService: expense.project!.typeOfService,
      },
      ticketDate: expense.ticketDate,
      ticketId: expense.ticketId,
      typeExpensive: expense.typeExpensive
    }
    const headers: HttpHeaders = new HttpHeaders({}).set('Authorization', `Bearer ${this._auth.authorization$().token}`)
    const url: string = `${environment.apiUrl}/expensive/state`;
    return this._http.put<Expense>(url, obj, { headers: headers });
  }

}
