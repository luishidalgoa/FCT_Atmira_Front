import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../../Login/modals/login/login.component';
import { RegisterComponent } from '../../../Login/modals/register/register.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  constructor( private dialog:MatDialog){

  }

  login(){
    this.dialog.open(LoginComponent, {
      width: 'auto',
      enterAnimationDuration: '200ms',
      maxWidth: '60rem',
      exitAnimationDuration: '200ms',
    });
  }

  signUp(){
    this.dialog.open(RegisterComponent, {
      width: 'auto',
      enterAnimationDuration: '200ms',
      maxWidth: '60rem',
      exitAnimationDuration: '200ms',
    });
  }
}
