import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../service/common/Task/task.service';
import { Task } from '../../../model/domain/task';
import { Project } from '../../../model/domain/project';
import { TaskBoardComponent } from '../../../components/task-board/task-board.component';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../../../components/modals/new-task/new-task.component';
import { UserDataWrapperService } from '../../../service/user/user-data-wrapper.service';
import { ProjectService } from '../../../service/common/Project/project.service';
import { TashBoardComponentSkeleton } from '../../../components/skeletons/tash-board/tash-board.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [TaskBoardComponent, TashBoardComponentSkeleton, MatProgressSpinner],
  templateUrl: './project-view-all.component.html',
  styleUrl: './project-view-all.component.scss'
})
export class ProjectViewAllComponent {
  public value!: Project;
  constructor(private route: ActivatedRoute, private _project: ProjectService, private dialog: MatDialog, private _user_dataWrapper: UserDataWrapperService, private router: ActivatedRoute) {
    this._user_dataWrapper.suscribe().subscribe((data: Project[]) => {
      const projectId = this.route.snapshot.params['projectId'];
      this._user_dataWrapper.getProjectById(projectId,false).then((data: Project | null) => {
        if (data != null) this.value = data;
      }).finally(()=>{
        if(this.value && this.value.tasks == undefined){ // si no hay tareas se buscaran
          this._user_dataWrapper.getTasksByProject(this.value)
        }
      })
    })
  }
  /**
   * abre el modal de nueva tarea al proyecto y le pasa el proyecto actual.
   * @param enterAnimationDuration indica la duracion de la animacion de entrada
   * @param exitAnimationDuration indica la duracion de la animacion de salida
   */
  saveChildTask(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(NewTaskComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration,
      data: this.value
    });
  }
  /**
   * Este metodo es llamado por el OutPut del componente hijo TaskBoardComponent. Elimina la tarea del array de tareas
   * para que se deje de renderizar en el html
   * @param task tarea que se desea eliminar del array de tareas
   */
  deleteTask(task: Task): void {
    this._user_dataWrapper.deleteTask(this.value, task).then((result:boolean)=>{
      if(result){
        this.openSnackBar('Task deleted successfully','app-notification-success');
      }else{
        this.openSnackBar('Task could not be deleted','app-notification-error')
      }
    })
  }

  /**
   * Indicara la notificacion de si la tarea se ha creado con exito o no
   * @param message 
   * @param action 
   */
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  openSnackBar(message: string, status: 'app-notification-success' | 'app-notification-error') {
    this._snackBar.open(message,'Hidden', {
      duration: 2500,
      panelClass: status
    });
  }
}
