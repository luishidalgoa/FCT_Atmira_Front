import { Component, Inject, Input, effect, inject } from '@angular/core';
import { Task } from '../../../model/domain/task';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TypeOfService } from '../../../model/enum/type-of-service';
import { UserDataWrapperService } from '../../../service/user/user-data-wrapper.service';
import { ProjectService } from '../../../service/common/Project/project.service';
import { TaskService } from '../../../service/common/Task/task.service';
import { Colaborator } from '../../../model/domain/colaborator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ObjetiveService } from '../../../service/objetive.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, CommonModule, MatSelect, MatOption],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.scss'
})
export class UpdateTaskComponent {
  value!: Task;
  form: FormGroup; // formulario para crear un nuevo proyecto
  typeOfServiceValues = Object.values(TypeOfService); // obtiene los valores del enum para mostrarlos en el html a través de un bucle for

  selected!: string
  selectedColaborator!: string
  selectedClose!: string
  constructor(@Inject(MAT_DIALOG_DATA) public data: Task, private _userDataWrapper: UserDataWrapperService, private formBuilder: FormBuilder, private _project: ProjectService, private _task: TaskService) {
    this.value = data
    this.form = this.formBuilder.group({
      name: ['',],
      objective: ['',],
      colaborator: ['',],
    });
    console.log(this.value);
    this.selected = this.value.objective.valueOf()
    this.selectedColaborator = this.value.colaborator?.id_alias as string
    this.selectedClose = this.value.closed ? 'true' : 'false'
    this.getColaborators()
  }

  getColaborators(): void {
    this._project.getColaboratos(this.value.project.id_code as string).subscribe((data: Colaborator[]) => {
      this.value.project.colaboratorProjects = data
    })
  }
  _objective: ObjetiveService = inject(ObjetiveService);
  updateProject() {

    this.value.objective = this._objective.convertStringToTypeOfService(this.selected);
    this.value.closed = this.selectedClose === 'true';
    this.value.colaborator = this.value.project.colaboratorProjects ? this.value.project.colaboratorProjects.find((colaborator: Colaborator) => colaborator.id_alias === this.selectedColaborator) : this.value.colaborator;
    this.value.description = this.form.get('name')?.value !== '' && this.form.get('name')?.value !== null ? this.form.get('name')?.value : this.value.description;

    this._task.update(this.value).subscribe((data: Task) => {
      this._userDataWrapper.currentItem$.set(data)
    });
  }
}
