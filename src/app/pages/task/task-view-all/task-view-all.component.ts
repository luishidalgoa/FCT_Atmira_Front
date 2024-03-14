import { Component, inject} from '@angular/core';
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

@Component({
  selector: 'app-task-view-all',
  standalone: true,
  imports: [TaskDescriptionComponent, TaskBoardComponent, TaskDetailsComponent,TashBoardComponentSkeleton],
  templateUrl: './task-view-all.component.html',
  styleUrl: './task-view-all.component.scss'
})
export class TaskViewAllComponent {
  public value!: Task;
  private _task: TaskService = inject(TaskService);
  private _userDataWrapper: UserDataWrapperService = inject(UserDataWrapperService);
  constructor(private taskService: TaskService, private route: ActivatedRoute, private dialog: MatDialog) {
    this._userDataWrapper.currentItem$.subscribe(() => {
      if (this._userDataWrapper.getCurrentItem().value) {
        this.value = this._userDataWrapper.getCurrentItem().value as Task
        if(this.value.tasks == undefined || this.value.tasks?.length == 0){
          this.loadTasks();
        }
      } else {
        this.route.params.subscribe((params) => {
          const taskId = params['taskId'];
          this._task.getById(taskId).subscribe((data: Task) => {
            this._userDataWrapper.setCurrentItem(data)
            this.value = data
          })
        });
      }
    })
  }


  loadTasks(): void {
    if (this.value) {
      this.taskService.getSubTasksByTask(this.value.idCode as string).subscribe((data: Task[]) => {
        this.value.tasks = data;
      });
    }
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
    this.value.tasks = this.value.tasks && this.value.tasks.length > 0 ? this.value.tasks.filter((t: Task) => t.idCode != task.idCode) : [];
  }

}
