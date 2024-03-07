import { Component,inject, effect, WritableSignal, signal } from '@angular/core';
import { TaskDescriptionComponent } from '../../../components/task-description/task-description.component';
import { TaskBoardComponent } from '../../../components/task-board/task-board.component';
import { Task } from '../../../model/domain/task';
import { TaskDetailsComponent } from '../../../components/task-details/task-details.component';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../service/common/Task/task.service';
import { Project } from '../../../model/domain/project';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../../../components/modals/new-task/new-task.component';
import { UserDataWrapperService } from '../../../service/user/user-data-wrapper.service';
import { ProjectService } from '../../../service/common/Project/project.service';
import { Colaborator } from '../../../model/domain/colaborator';
import { AuthService } from '../../../service/user/auth.service';

@Component({
  selector: 'app-task-view-all',
  standalone: true,
  imports: [TaskDescriptionComponent,TaskBoardComponent,TaskDetailsComponent],
  templateUrl: './task-view-all.component.html',
  styleUrl: './task-view-all.component.scss'
})
export class TaskViewAllComponent {
  public parent!: Project;
  public values: Task[] = [];
  public value!: Task;
  public colaborators$: WritableSignal<Colaborator[]> = signal<Colaborator[]>([]);

  private _task: TaskService = inject(TaskService);
  private _userDataWrapper: UserDataWrapperService = inject(UserDataWrapperService);
  private _auth: AuthService = inject(AuthService);
  constructor(  private userDataWrapper: UserDataWrapperService,  private projectService: ProjectService, private taskService: TaskService, private route: ActivatedRoute, private dialog: MatDialog, private _user_dataWrapper: UserDataWrapperService) {
    effect(() => {
      const colaborators = this._userDataWrapper.currentColaborators$();
      this.colaborators$ = signal(colaborators);
      this.route.params.subscribe((params) => {
        const projectId = params['id'];
        this.projectService.getById(projectId).subscribe((data: Project) => {
          this.parent = data;
          this.loadTasks();
        });
      });
    });
    this.route.params.subscribe((params) => {
      const taskId = params['taskId'];
      this._task.getById(taskId).subscribe((data: Task) => {
        this.value = data;
      })
    });
    
  }

  loadTasks(): void {
    if (this.parent.id_code != undefined) {
      this.taskService.getSubTasksByTask(this.value.idCode as string).subscribe((data: Task[]) => {
        this.values = data;
      });
    }
  }
  /**
   * abre el modal de nueva tarea al proyecto y le pasa el proyecto actual.
   * @param enterAnimationDuration indica la duracion de la animacion de entrada
   * @param exitAnimationDuration indica la duracion de la animacion de salida
   */
  saveChildTask(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: 'auto',
      maxWidth: '60rem',
      data: this.parent
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If a task was saved, reload the tasks
        this.taskService.getTaskByProject(this.parent.id_code as string).subscribe((data: Task[]) => {
          this.values = data;
        });
      }
    });
  }
  /**
   * Este metodo es llamado por el OutPut del componente hijo TaskBoardComponent. Elimina la tarea del array de tareas
   * para que se deje de renderizar en el html
   * @param task tarea que se desea eliminar del array de tareas
   */
  deleteTask(task:Task): void{
    this.values = this.values.filter((t:Task)=>t.idCode!=task.idCode);
  }

}
