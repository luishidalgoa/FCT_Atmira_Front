import { Component, effect, inject } from '@angular/core';
import { Colaborator } from '../../model/domain/colaborator';
import { FormGroup, FormBuilder } from '@angular/forms'; // Importa FormGroup y FormBuilder
import { ProjectService } from '../../service/common/Project/project.service';
import { provideNativeDateAdapter } from '@angular/material/core';

import { TypeOfService } from '../../model/enum/type-of-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { Task } from '../../model/domain/task';
import { TaskService } from '../../service/common/Task/task.service';
import { UserDataWrapperService } from '../../service/user/user-data-wrapper.service';
import { MatMenuModule } from '@angular/material/menu';
import { ObjetiveService } from '../../service/objetive.service';
import { AuthService } from '../../service/mockup/auth.service';



@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, CommonModule, MatSelect, MatOption, MatMenuModule],
  providers: [provideNativeDateAdapter()]
})
export class TaskDetailsComponent {

  value!: Task;
  form: FormGroup; // formulario para crear un nuevo proyecto
  typeOfServiceValues = Object.values(TypeOfService); // obtiene los valores del enum para mostrarlos en el html a través de un bucle for

  selected!: string
  selectedColaborator!: string
  selectedClose!: string
  constructor(private _userDataWrapper: UserDataWrapperService, private formBuilder: FormBuilder, private _project: ProjectService, private _task: TaskService) {
    this.form = this.formBuilder.group({
      name: ['',],
      objective: ['',],
      colaborator: ['',],
    });

    effect(() => {
      this.value = this._userDataWrapper.currentItem$() as Task
      if (this.value) {
        this.selected = this.value.objective.valueOf()
        this.selectedColaborator = this.value.colaborator?.id_alias as string
        this.selectedClose = this.value.closed ? 'true' : 'false'
        this.getColaborators()
      }
    })
  }

  _objective: ObjetiveService = inject(ObjetiveService);
  _auth: AuthService = inject(AuthService)
  updateProject() {

    this.value.objective = this._objective.convertStringToTypeOfService(this.selected);
    this.value.closed = this.selectedClose === 'true';
    this.value.colaborator = this.value.project.colaboratorProjects ? this.value.project.colaboratorProjects.find((colaborator: Colaborator) => colaborator.id_alias === this.selectedColaborator) : this.value.colaborator;
    this.value.description = this.form.get('name')?.value !== '' && this.form.get('name')?.value !== null ? this.form.get('name')?.value : this.value.description;

    this._task.update(this.value).subscribe((data: Task) => {
      this._userDataWrapper.currentItem$.set(data)
    });
  }

  getColaborators(): void {
    this._project.getColaboratos(this.value.project.id_code as string).subscribe((data: Colaborator[]) => {
      this.value.project.colaboratorProjects = data
    })
  }

  assigned(colaborator: Colaborator): void {
    this._task.assigned(this.value, colaborator)
  }

}
