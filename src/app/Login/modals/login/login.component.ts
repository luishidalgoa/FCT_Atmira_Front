import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form!: FormGroup;
  constructor(public dialogRef: MatDialogRef<LoginComponent>,private _formBuilder: FormBuilder,private _auth:AuthService,private _router:Router){
    this.form = this._formBuilder.group({
      email: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    })
  }
  /**
   * comprobamos si el formulario es valido, si es asi, creamos un objeto con las credenciales del usuario
   * y llamamos al metodo login del servicio de autenticacion, si el resultado es true, redirigimos al usuario a la pagina de proyectos
   * @method login
   */
  login():void{
    if(this.form.valid){
      const credentials: {email:string,password:string} = {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value
      }
      this._auth.login(credentials).subscribe((result:boolean)=>{
        if(result){
          this._router.navigateByUrl('projects');
          this.dialogRef.close();
        }else{
          this.form.setErrors({invalidCredentials:true});
        }
      });
    }
  }
}
