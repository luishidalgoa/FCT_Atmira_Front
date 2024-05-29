import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../services/Project/project.service';
import { Project } from '../../../model/domain/project';
import { CommonModule } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { TypeOfService } from '../../../model/enum/type-of-service';
import { AuthService } from '../../../Login/services/auth.service';
import { CurrentProjectService } from '../../../shared/services/current-project.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'core-new-project',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule,CommonModule,MatSelect,MatOption],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {
  form: FormGroup; // formulario para crear un nuevo proyecto
  typeOfServiceValues = Object.values(TypeOfService); // obtiene los valores del enum para mostrarlos en el html a traves de un bucle for

  minDate: Date; // fecha minima para el datepicker
  constructor(public dialogRef: MatDialogRef<NewProjectComponent>,private _ProjectS:ProjectService, private _formBuilder: FormBuilder) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.minDate = new Date(currentYear - 0, currentMonth, new Date().getDate());

    this.form = this._formBuilder.group({
      title: new FormControl('',Validators.maxLength(20)),
      initialDate: new FormControl('',Validators.required),
      endDate: new FormControl('',Validators.required),
      typeOfService: new FormControl('',Validators.required),
    })
  }

  private _currentProject: CurrentProjectService = inject(CurrentProjectService);
  private _authService: AuthService = inject(AuthService);

  /**
   * crea un nuevo proyecto en base a los datos del formulario y lo guarda en la base de datos a traves del servicio de ProjectService
   * posteriormente lo guarda en el UserDataWrapperService si existe, con el fin de que se actualice la lista de proyectos en la aplicacion y se renderice
   * en el html y se cierre el modal
   * @method create
   */
  create(){
    if(this.form.valid){
      const project:Project = {
        name: this.form.get('title')?.value,
        initialDate: this.form.get('initialDate')?.value,
        endDate: this.form.get('endDate')?.value,
        typeOfService: this.form.get('typeOfService')?.value,
        active: true 
      }
      this._currentProject.save(project).then((result:boolean)=>{
        if(result){
          this.openSnackBar('Project created successfully','app-notification-success');
        }else{
          this.openSnackBar('Error creating project','app-notification-error');
        }
      })
      this.dialogRef.close();
    }else{
    }
  }
  /**
   * cierra el modal
   * @method close
   */
  close(){
    this.dialogRef.close();
  }
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  openSnackBar(message: string, status: 'app-notification-success' | 'app-notification-error') {
    this._snackBar.open(message,'Hidden', {
      duration: 2500,
      panelClass: status
    });
  }
}