import { Injectable, WritableSignal, signal } from '@angular/core';
import { Colaborator } from '../../model/domain/colaborator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$!: WritableSignal<Colaborator>;
  public authorization$: WritableSignal<{
    token: string | null;
  }>;
  constructor(private _http: HttpClient) {
    this.authorization$ = signal({
      token: null,
    });
  }

  login(credentials: { email: string; password: string }): Observable<boolean> {
    
    return new Observable<boolean>((observer) => {
      this.currentUser$ = signal<Colaborator>({
        ID_Alias: 'sampleId',
        Name: 'John',
        Surname: 'Doe',
        Email: credentials.email,
        Expense: true,
        Guards: true,
        Hours: 8,
        isActive: true,
        relaseDate: new Date(),
      });
      observer.next(true);
    });
  }

  register(credentials: { Name: string, Surname: string;Username: string;email: string; password: string }): Observable<Colaborator>{
    return new Observable<Colaborator>((observer) => {
      const user: Colaborator = {
        Email: credentials.email,
        Name: credentials.Name,
        Surname: credentials.Surname,
        ID_Alias: credentials.Username,
        relaseDate: new Date(),
        Password: credentials.password,
        isActive: false,
      };
      this.currentUser$ = signal<Colaborator>(user);
      observer.next(user);
    });
  }
}
