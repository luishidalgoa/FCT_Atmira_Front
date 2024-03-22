import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { TaskDescriptionComponent } from '../../../components/task-description/task-description.component';
import { TaskBoardComponent } from '../../../components/task-board/task-board.component';
import { Task } from '../../../model/domain/task';
import { TaskDetailsComponent } from '../../../components/task-details/task-details.component';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../service/common/Task/task.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../../../components/modals/new-task/new-task.component';
import { UserDataWrapperService } from '../../../service/user/user-data-wrapper.service';
import { ProjectService } from '../../../service/common/Project/project.service';
import { TashBoardComponentSkeleton } from '../../../components/skeletons/tash-board/tash-board.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Project } from '../../../model/domain/project';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-view-all',
  standalone: true,
  imports: [TaskDescriptionComponent, TaskBoardComponent, TaskDetailsComponent, TashBoardComponentSkeleton, MatProgressSpinnerModule],
  templateUrl: './task-view-all.component.html',
  styleUrl: './task-view-all.component.scss'
})
export class TaskViewAllComponent {
  public value!: Task | null;
  private _userDataWrapper: UserDataWrapperService = inject(UserDataWrapperService);

  public id: string | undefined = undefined;
  constructor(private taskService: TaskService, private route: ActivatedRoute, private dialog: MatDialog) {
    /*this.route.params.subscribe(params => {
      this.value = null;
      this.id = this.route.snapshot.paramMap.get('taskId') as string;
      this._userDataWrapper.currentItem$.subscribe(() => {
        if (this._userDataWrapper.getCurrentItem().value) {
          this.value = this._userDataWrapper.getCurrentItem().value as Task
          if (this.value.tasks == undefined || this.value.tasks?.length == 0) {
            this.loadTasks();
          }
        } else {
          this._task.getById(this.id as string).subscribe((data: Task) => {
            this.value = data
            if (!this.value.tasks) {
              this.loadTasks().then(() => {
                this._userDataWrapper.setCurrentItem(data)
              });
            } else {
              this._userDataWrapper.setCurrentItem(data)
            }
          })
        }
      }).unsubscribe();
    })*/
    this._userDataWrapper.suscribe().subscribe((data: Project[]) => {
      console.log('hola')
      this.id = this.route.snapshot.paramMap.get('taskId') as string;
      this._userDataWrapper.getProjectById(this.route.snapshot.paramMap.get('projectId') as string,false).then((project: Project | null) => {
        if (project == null) {
          this.openSnackBar('Project not found', 'app-notification-error');
        } else if (this.id && project) { //extraemos la tarea de la maqueta local
          console.log('!!!!! constructor')
          this._userDataWrapper.getTaskByProjectAndTaskId(project.id_code as string, this.id as string,false).then((task: Task | null) => {
            if (task == null) {
              this.openSnackBar('Task not found', 'app-notification-error');
            } else {
              this.value = task
              if (!this.value.tasks) {
                this.loadTasks().then(()=>{
                  console.log('se cargaron subtareas. comprobar el observable')
                })
              }
            }
          })
        }
      })

    }).unsubscribe();

  }

  loadTasks(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.value?.idCode == this.id) {
        this._userDataWrapper.getSubtasksByTask(this.value as Task)
        resolve()
      }
    })
  }

  newTask: boolean = false;
  /**
   * abre el modal de nueva tarea al proyecto y le pasa el proyecto actual.
   * @param enterAnimationDuration indica la duracion de la animacion de entrada
   * @param exitAnimationDuration indica la duracion de la animacion de salida
   */
  saveChildTask(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: 'auto',
      maxWidth: '60rem',
      data: this.value
    });
    dialogRef.componentInstance.save.subscribe((data: boolean) => {
      this.newTask = data;
    })
  }
  /**
   * Este metodo es llamado por el OutPut del componente hijo TaskBoardComponent. Elimina la tarea del array de tareas
   * para que se deje de renderizar en el html
   * @param task tarea que se desea eliminar del array de tareas
   */
  deleteTask(task: Task): void {
    (this.value as Task).tasks = (this.value as Task).tasks && ((this.value as Task).tasks as Task[]).length > 0 ? ((this.value as Task).tasks as Task[]).filter((t: Task) => t.idCode != task.idCode) : [];
  }



  private _snackBar: MatSnackBar = inject(MatSnackBar);
  openSnackBar(message: string, status: 'app-notification-success' | 'app-notification-error') {
    this._snackBar.open(message, 'Hidden', {
      duration: 2500,
      panelClass: status
    });
  }
}
