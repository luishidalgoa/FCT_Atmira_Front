import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../service/user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.form.valid) {
      const credentials = {
        email: this.form.value.email,
        password: this.form.value.password
      };

      this.authService.login(credentials).subscribe((loggedIn: boolean) => {
        if (loggedIn) {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            this.router.navigate(['/projects']); // Redirige al usuario a la página de proyectos
          }
        } else {
          this.form.setErrors({ invalidCredentials: true }); // Marca el formulario como inválido debido a credenciales incorrectas
        }
      });
    }
  }
}
