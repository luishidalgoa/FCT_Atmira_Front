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

@Component({
  selector: 'app-task-view-all',
  standalone: true,
  imports: [TaskDescriptionComponent, TaskBoardComponent, TaskDetailsComponent, TashBoardComponentSkeleton, MatProgressSpinnerModule],
  templateUrl: './task-view-all.component.html',
  styleUrl: './task-view-all.component.scss'
})
export class TaskViewAllComponent {
  public value!: Task | null;
  private _task: TaskService = inject(TaskService);
  private _userDataWrapper: UserDataWrapperService = inject(UserDataWrapperService);

  public id: string | undefined = undefined;
  constructor(private taskService: TaskService, private route: ActivatedRoute, private dialog: MatDialog) {
    this.route.params.subscribe(params => {
      this.value = null;
      this.id = this.route.snapshot.paramMap.get('taskId') as string;
      console.log(this.id);
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
            }else{
              this._userDataWrapper.setCurrentItem(data)
            }
          })
        }
      }).unsubscribe();
    })
  }

  loadTasks(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.value?.idCode == this.id) {
        this.taskService.getSubTasksByTask(this.value!.idCode as string).subscribe((data: Task[]) => {
          (this.value as Task).tasks = data;
          resolve();
        });
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

}
