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



@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  standalone: true,
  imports: [MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,ReactiveFormsModule,CommonModule,MatSelect,MatOption],
  providers: [provideNativeDateAdapter()]
})
export class TaskDetailsComponent {
 
  @Input() project?: Project;
  @Input() colaborator?: Colaborator;
  form: FormGroup; // formulario para crear un nuevo proyecto
  typeOfServiceValues = Object.values(TypeOfService); // obtiene los valores del enum para mostrarlos en el html a través de un bucle for

  minDate: Date; // fecha mínima para el datepicker
  constructor( private projectService: ProjectService, private formBuilder: FormBuilder) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.minDate = new Date(currentYear - 0, currentMonth, new Date().getDate());

    this.form = this.formBuilder.group({
      id_code: ['',Validators.required],
      name: ['', Validators.maxLength(20)],
      initialDate: ['', Validators.required],
      endDate: ['', Validators.required],
      typeOfService: ['', Validators.required]
    });
  }

  updateProject() {
    if (this.form.valid) {
      this.form.patchValue({
        name: this.project?.name,
        initialDate: this.project?.initialDate,
        endDate: this.project?.endDate,
        typeOfService: this.project?.typeOfService
      });
  
      const project: Project = {
        id_code: this.project?.id_code,
        name: this.form.get('name')?.value,
        initialDate: this.form.get('initialDate')?.value,
        endDate: this.form.get('endDate')?.value,
        typeOfService: this.form.get('typeOfService')?.value,
        active: this.form.get('active')?.value // Obtiene el valor del campo 'active'
      };
  
      // Llama al método del servicio para actualizar el proyecto
      this.projectService.updateProject(project, this.project?.id_code as string).subscribe((data: Project) => {
        if (data) {
          // Realiza alguna acción adicional en función de la respuesta del servicio
          console.log("Proyecto actualizado con éxito:", data);
          // Por ejemplo, puedes mostrar un mensaje de éxito
          alert("El proyecto se actualizó correctamente.");
        } 
      }, (error) => {
        // Maneja cualquier error que pueda ocurrir durante la llamada al servicio
        console.error("Error al actualizar el proyecto:", error);
        // Por ejemplo, puedes mostrar un mensaje de error
        alert("Error al actualizar el proyecto. Por favor, inténtalo de nuevo más tarde.");
      });
    }
  }

}
