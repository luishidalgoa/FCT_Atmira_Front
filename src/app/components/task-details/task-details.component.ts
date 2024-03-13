import { Component, Input } from '@angular/core';
import { Colaborator } from '../../model/domain/colaborator';
import { Project } from '../../model/domain/project';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Importa FormGroup y FormBuilder
import { ProjectService } from '../../service/common/Project/project.service';
import { provideNativeDateAdapter } from '@angular/material/core';

import { TypeOfService } from '../../model/enum/type-of-service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOption, } from '@angular/material/core';
import {  ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatDialogModule} from '@angular/material/dialog';
import { Task } from '../../model/domain/task';



@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  standalone: true,
  imports: [MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule,CommonModule,MatSelect,MatOption],
  providers: [provideNativeDateAdapter()]
})
export class TaskDetailsComponent {
 
  @Input({required: true}) value?: Task;
  form: FormGroup; // formulario para crear un nuevo proyecto
  typeOfServiceValues = Object.values(TypeOfService); // obtiene los valores del enum para mostrarlos en el html a través de un bucle for
  constructor( private projectService: ProjectService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      id_code: ['',Validators.required],
      name: ['', Validators.maxLength(20)],
      typeOfService: ['', Validators.required]
    });
  }

  updateProject() {
    if (this.form.valid) {
    }
  }

}
