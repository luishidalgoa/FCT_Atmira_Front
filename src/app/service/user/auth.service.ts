import { Injectable, WritableSignal, signal } from '@angular/core';
import { Colaborator } from '../../model/domain/colaborator';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser$: WritableSignal<Colaborator> = signal<Colaborator>(
    {
      ID_Alias: 'sampleId',
      Name: 'John',
      Surname: 'Doe',
      Email: 'sample@email.com',
      Expense: true,
      Guards: true,
      Hours: 8,
      isActive: true,
      relaseDate: new Date()
    }
  );
  public authorization$: WritableSignal<{
    token: string | null;
  }> 
  constructor(private _http: HttpClient) { 
    this.authorization$ = signal({
      token: null
    });
  }

  login(credentials:{email:string,password:string}): void{
    const url: string = 'http://localhost:8080/login';
    this._http.post(url,credentials).subscribe(data=>{
      console.log(data);
    });
  }
}