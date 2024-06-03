import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../model/domain/task';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjetiveService } from '../../../shared/services/objetive.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Colaborator } from '../../../model/domain/colaborator';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskComponent } from '../../modals/update-task/update-task.component';
import { CurrentProjectService } from '../../../shared/services/current-project.service';
import { Project } from '../../../model/domain/project';
import { AuthService } from '../../../Login/services/auth.service';

@Component({
  selector: 'core-task',
  standalone: true,
  imports: [CommonModule, MatSelect, MatOption, MatFormField, MatLabel, ReactiveFormsModule, MatMenuModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input({ required: true })
  value!: Task; // valor de la tarea que se renderizara en el html
  @Input({ required: true })
  index!: number; // indice de la tarea en el array de tareas del componente padre (el objetivo es usarlo como id unico para el html)
  @Output()
  Checkbox: EventEmitter<Task> = new EventEmitter<Task>(); // evento que se dispara cuando se hace click en el checkbox de seleccionar tarea
  @Output()
  delete: EventEmitter<Task> = new EventEmitter<Task>(); // evento que se dispara cuando se hace click en el boton de eliminar tarea
  @Output()
  navigate: EventEmitter<Task> = new EventEmitter<Task>(); // evento que se dispara cuando se hace click en el nombre de la tarea

  selected!: string; // indica si la tarea esta cerrada o no

  constructor(public _auth:AuthService,public _objetive: ObjetiveService, private _router: Router,private _currentProject:CurrentProjectService,private dialog:MatDialog) {}
  /**
   * inicializa el valor de la variable selected en base a si la tarea esta cerrada o no
   */
  ngOnInit(): void {
    this.selected = this.value.closed ? 'true' : 'false';
    this.getColaborators();
    
  }

  /**
   * Cambia el estado de la tarea a cerrada o no cerrada en base al valor del parametro status y actualiza el valor de la variable selected
   * los cambios se guardan en la base de datos a traves del servicio de TaskService
   * @param status  indica si la tarea esta cerrada o no
   */
  status(status: boolean) {
    this.value.closed = status;
    this._currentProject.status(this.value).then((data: Task | null) => {
      if(!data) return
      this.value = data;
      this.selected = data.closed ? 'true' : 'false';
    });
  }
  /**
   * emite el evento Checkbox con el valor de la tarea para indicar que ha sido seleccionada
   */
  check() {
    this.Checkbox.emit(this.value);
  }
  /**
   * emite el evento delete con el valor de la tarea para indicar que ha sido eliminada
   */
  deleteEvent() {
    this._currentProject.deleteTask(this.value).then((data: boolean) => {
      if(data){
        this.delete.emit(this.value);
      }
    });
  }
  /**
   * redirige al usuario a la ruta /projects/project/{id}/task/{id} donde id es el id del proyecto y el id de la tarea
   */
  goToTask() {
    //imprimimos el :id de la ruta de navegacion
    //this._router.navigateByUrl(`projects/project/${this.value.project.id_code}/task/${this.value.idCode}`);
    this.navigate.emit(this.value);
  }

  getColaborators(): void {
    this._currentProject.getColaboratorsByProject(this.value.project).then((data: Project) => {
      this.value.project = data
    })
  }

  assigned(colaborator: Colaborator): void{
    this._currentProject.assigned(this.value, colaborator)
  }

  update():void {
    this.dialog.open(UpdateTaskComponent, {
      width: 'auto',
      enterAnimationDuration: '300ms',
      maxWidth: '60rem',
      exitAnimationDuration: '300ms',
      data: this.value
    });
  }
}
