import { Injectable, WritableSignal, signal } from '@angular/core';
import { Colaborator } from '../../model/domain/colaborator';

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
  constructor() { }
}
