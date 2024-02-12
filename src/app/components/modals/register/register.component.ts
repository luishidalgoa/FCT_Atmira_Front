import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../service/user/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form!: FormGroup;
  constructor(public dialogRef: MatDialogRef<RegisterComponent>,private _formBuilder: FormBuilder,private _auth:AuthService) {
    this.form = this._formBuilder.group({
      email: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    })
  }

  register(){
    if(this.form.valid){
      const credentials: {email:string,password:string} = {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value
      }
      this._auth.login(credentials);
    }
    this.dialogRef.close();
  }
}
