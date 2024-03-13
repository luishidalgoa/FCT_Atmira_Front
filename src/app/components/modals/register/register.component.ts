import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../service/user/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';

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
      password: new FormControl('',Validators.required),
      confirmPassword: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      surname: new FormControl('',Validators.required),
      username: new FormControl('',Validators.required)
    })
  }
  private _router:Router = inject(Router)
  register(){
    if(this.form.valid){
      const credentials: {id_alias: string;surname: string;name: string;email: string;password: string;isActive?:boolean;relaseDate?:Date} = {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
        name: this.form.get('name')?.value,
        surname: this.form.get('surname')?.value,
        id_alias: this.form.get('username')?.value,
        isActive: true,
        relaseDate: new Date()
      }
      this._auth.register(credentials).subscribe((data:boolean)=>{
        this._router.navigateByUrl('/projects')
      })
    }
    this.dialogRef.close();
  }
}
