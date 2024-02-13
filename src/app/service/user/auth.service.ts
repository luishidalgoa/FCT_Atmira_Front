import { Injectable, WritableSignal, signal } from '@angular/core';
import { Colaborator } from '../../model/domain/colaborator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$: WritableSignal<Colaborator> = signal<Colaborator>({
    ID_Alias: 'sampleId',
    Name: 'John',
    Surname: 'Doe',
    Email: 'sample@email.com',
    Expense: true,
    Guards: true,
    Hours: 8,
    isActive: true,
    relaseDate: new Date(),
  });
  public authorization$: WritableSignal<{
    token: string | null;
  }>;
  constructor(private _http: HttpClient) {
    this.authorization$ = signal({
      token: null,
    });
  }

  login(credentials: { email: string; password: string }): void {
    const url: string = `${environment.apiUrl}/colaborator/login`;

    const requestBody = JSON.stringify(credentials);
    const contentLength = requestBody.length;

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      /* 'Content-Length': contentLength.toString(),
      'Host': 'localhost'*/
    });
    const observe = 'response';

    this._http
      .post(url, credentials, { headers: header, observe: observe })
      .subscribe((response) => {
        console.log('respuesta', response.headers.get('Authorization'));
        console.log(response);
        console.log(response.headers.getAll('Authorization'));
      });
  }
  register(credentials: { Name: string, Surname: string;Username: string;email: string; password: string }){
    const url: string = `${environment.apiUrl}/auth/register`;

    this._http.post<Colaborator>(url, credentials).subscribe((response:any) => {
      console.log('respuesta', response);
    });
  }
}
