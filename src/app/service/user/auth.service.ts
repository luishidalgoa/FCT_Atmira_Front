import { Injectable, WritableSignal, signal } from '@angular/core';
import { Colaborator } from '../../model/domain/colaborator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$: WritableSignal<Colaborator> = signal<Colaborator>({ //Signal que contiene los datos del usuario actual
    id_alias: 'sampleId',
    Name: 'John',
    Surname: 'Doe',
    Email: '',
    Expense: true,
  });

  public authorization$: WritableSignal<{ //Signal que contiene el token de autenticacion
    token: string | null;
  }>;
  constructor(private _http: HttpClient) {
    if (sessionStorage.getItem('token')) {
      this.authorization$ = signal({
        token: sessionStorage.getItem('token'),
      });
    } else {
      this.authorization$ = signal({
        token: null,
      });
    }
  }
  /**
   * metodo que se encarga de autenticar al usuario en base a las credenciales que se le pasen
   * hace una peticion al servidor para obtener un token de autenticacion y los datos del usuario.
   * Posteriormente guarda el token en el sessionStorage y actualiza la signal authorization$ así como
   * la signal currentUser$ con los datos del usuario
   * @method login
   * @param credentials credenciales basicas del usuario para autenticarse
   * @returns  Observable<boolean> devolvemos true o false en base a si el usuario ha sido autenticado o no
   */
  login(credentials: { email: string; password: string }): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const url: string = `${environment.apiUrl}/auth/login`;

      const header = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const observe = 'response';

      this._http
        .post(url, credentials, { headers: header, observe: observe })
        .subscribe((response: any) => {
          if (response.ok) {
            console.log('response', response);
            sessionStorage.setItem('token', response.body.token);
            this.authorization$.set({ token: response.body.token });
          }
          observer.next(response.ok);
        });
    });
  }
  /**
   * Recive un objeto con las credenciales basicas para registrar un nuevo usuario en la base de datos
   * posteriormente hace una peticion al servidor para registrar al usuario
   * @param credentials credenciales basicas del usuario para registrarse
   * @returns Observable<boolean> devolvemos true o false en base a la respuesta del servidor de si el usuario ha sido registrado o no
   */
  register(credentials: {id_alias: string;surname: string;name: string;email: string;password: string;isActive?:boolean;relaseDate?:Date}): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      credentials.isActive = false;
      credentials.relaseDate = new Date();
      const url: string = `${environment.apiUrl}/auth/register`;

      this._http
        .post<Colaborator>(url, credentials)
        .subscribe((response: any) => {
          observer.next(response.ok);
      });
    });
  }
}
