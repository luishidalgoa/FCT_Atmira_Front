import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Task } from '../../../model/domain/task';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjetiveService } from '../../../shared/services/objetive.service';
import { TaskService } from '../../services/Task/task.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/Project/project.service';
import { Colaborator } from '../../../model/domain/colaborator';
import { Observable } from 'rxjs';
import { UserDataWrapperService } from '../../../shared/services/user-data-wrapper.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskComponent } from '../../modals/update-task/update-task.component';

@Component({
  selector: 'app-task',
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

  selected!: string; // indica si la tarea esta cerrada o no

  constructor(public _objetive: ObjetiveService, private _router: Router, private _project: ProjectService,private dialog:MatDialog) {

  }
  /**
   * inicializa el valor de la variable selected en base a si la tarea esta cerrada o no
   */
  ngOnInit(): void {
    this.selected = this.value.closed ? 'true' : 'false';
    this.getColaborators();
    
  }
  private _task: TaskService = inject(TaskService);

  /**
   * Cambia el estado de la tarea a cerrada o no cerrada en base al valor del parametro status y actualiza el valor de la variable selected
   * los cambios se guardan en la base de datos a traves del servicio de TaskService
   * @param status  indica si la tarea esta cerrada o no
   */
  status(status: boolean) {
    this.value.closed = status;
    this._task.status(this.value).subscribe((data: Task) => {
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
    this._task.delete(this.value).subscribe((data: boolean) => {
      if(data){
        this.delete.emit(this.value);
      }
    });
  }
  private _userDataWrapper: UserDataWrapperService = inject(UserDataWrapperService);
  /**
   * redirige al usuario a la ruta /projects/project/{id}/task/{id} donde id es el id del proyecto y el id de la tarea
   */
  goToTask() {
    //imprimimos el :id de la ruta de navegacion
    this._router.navigateByUrl(`projects/project/${this.value.project.id_code}/task/${this.value.idCode}`);
  }

  getColaborators(): void {
    this._project.getColaboratos(this.value.project.id_code as string).subscribe((data: Colaborator[]) => {
      this.value.project.colaboratorProjects = data
    })
  }

  assigned(colaborator: Colaborator): void{
    this._task.assigned(this.value, colaborator)
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
