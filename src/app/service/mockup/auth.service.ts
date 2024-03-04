import { Injectable, WritableSignal, signal } from '@angular/core';
import { Colaborator } from '../../model/domain/colaborator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import {  map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserKey = 'currentUser'; // Clave para almacenar el usuario actual en el almacenamiento local (puedes cambiar esto a sessionStorage si prefieres)
  private authTokenKey = 'authToken'; // Clave para almacenar el token de autenticación

  constructor(private _http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<boolean> {

    const url: string = `${environment.apiUrl}/auth/login`;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',

    
    return new Observable<boolean>((observer) => {
      this.currentUser$ = signal<Colaborator>({
        id_alias: 'sampleId',
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

    return this._http.post<any>(url, credentials, { headers: header }).pipe(
      map((response: any) => {
        if (response && response.token) {
          // Almacenar el token de autenticación en el almacenamiento local
          localStorage.setItem(this.authTokenKey, response.token);
          return true;
        }
        return false;
      })
    );
  }


  logout() {
    // Eliminar el token de autenticación y los datos del usuario actual
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): Colaborator | null {
    // Obtener el usuario actual del almacenamiento local
    const userData = localStorage.getItem(this.currentUserKey);
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user: Colaborator) {
    // Almacenar los datos del usuario actual en el almacenamiento local
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));

  register(credentials: { Name: string, Surname: string;Username: string;email: string; password: string }): Observable<Colaborator>{
    return new Observable<Colaborator>((observer) => {
      const user: Colaborator = {
        Email: credentials.email,
        Name: credentials.Name,
        Surname: credentials.Surname,
        id_alias: credentials.Username,
        relaseDate: new Date(),
        Password: credentials.password,
        isActive: false,
      };
      this.currentUser$ = signal<Colaborator>(user);
      observer.next(user);
    });

  }
}
