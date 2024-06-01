import { Component, ElementRef, Inject, Input, ViewChild, effect, inject } from '@angular/core';
import { Task } from '../../../model/domain/task';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TypeOfService } from '../../../model/enum/type-of-service';
import { ProjectService } from '../../services/Project/project.service';
import { TaskService } from '../../services/Task/task.service';
import { Colaborator } from '../../../model/domain/colaborator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ObjetiveService } from '../../../shared/services/objetive.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurrentProjectService } from '../../../shared/services/current-project.service';
import { Project } from '../../../model/domain/project';

@Component({
  selector: 'core-update-task',
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: Task, private _currentProject: CurrentProjectService, private formBuilder: FormBuilder, private _project: ProjectService, private _task: TaskService,public dialogRef: MatDialogRef<UpdateTaskComponent>) {
    this.value = data
    this.form = this.formBuilder.group({
      name: ['',],
      objective: ['',],
      colaborator: ['',],
    });
    if (this.value) {
      this.selected = this.value.objective.valueOf()
      this.selectedColaborator = this.value.colaborator?.id_alias as string
      this.selectedClose = this.value.closed ? 'true' : 'false'
      if(this.value.project.colaboratorProjects == undefined)this.getColaborators()
    }
  }
  private type!: MatSelect;
  @ViewChild('type') set contentType(content: MatSelect) {
    if (content) { // initially setter gets called with undefined
      this.type = content;
      this.type.value = this.value.objective.valueOf()
    }
  }
  private title!: ElementRef
  @ViewChild('title') set contentTitle(content: ElementRef) {
    if(content) { // initially setter gets called with undefined
      this.title = content
      this.title.nativeElement.value = this.value.description
    }
 };
  private colaborator!: MatSelect;
  @ViewChild('colaborator') set content(content: MatSelect) {
    if (content) { // initially setter gets called with undefined
      this.colaborator = content;
      this.colaborator.value = this.value.colaborator?.id_alias as string
    }
  }

  getColaborators(): void {
    this._currentProject.getColaboratorsByProject(this.value.project).then((data: Project) => {
      this.value.project = data
    })
    
  }
  _objective: ObjetiveService = inject(ObjetiveService);
  updateProject() {
    this.value.description = this.title.nativeElement.value;
    this.value.objective = this._objective.convertStringToTypeOfService(this.selected);
    this.value.closed = this.selectedClose === 'true';
    this.value.colaborator = this.value.project.colaboratorProjects ? this.value.project.colaboratorProjects.find((colaborator: Colaborator) => colaborator.id_alias === this.selectedColaborator) : this.value.colaborator;


    this._task.update(this.value).subscribe((data: Task) => {
      //this._currentProject.overriteTask(data) // automaticamente el BehaviorSubject de projects se actualiza
    });
  }
}