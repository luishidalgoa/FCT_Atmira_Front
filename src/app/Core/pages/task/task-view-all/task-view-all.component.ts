import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TaskDescriptionComponent } from '../../../components/task-description/task-description.component';
import { TaskBoardComponent } from '../../../components/task-board/task-board.component';
import { Task } from '../../../../model/domain/task';
import { TaskDetailsComponent } from '../../../components/task-details/task-details.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../../../modals/new-task/new-task.component';
import { TaskBoardComponentSkeleton } from '../../../skeletons/task-board/task-board.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Project } from '../../../../model/domain/project';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CurrentProjectService } from '../../../../shared/services/current-project.service';
import { ProjectSettingsComponent } from '../../../components/project-settings/project-settings.component';

@Component({
  selector: 'core-task-view-all',
  standalone: true,
  imports: [TaskDescriptionComponent, TaskBoardComponent, TaskDetailsComponent, TaskBoardComponentSkeleton, MatProgressSpinnerModule,ProjectSettingsComponent],
  templateUrl: './task-view-all.component.html',
  styleUrl: './task-view-all.component.scss'
})
export class TaskViewAllComponent implements OnDestroy, OnInit {
  public value!: Task | null;
  private _currentProject: CurrentProjectService = inject(CurrentProjectService);
  private subscription!: Subscription
  private subscription2!: Subscription

  public id: string | undefined = undefined;
  constructor(private route: ActivatedRoute, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.loadCurrentTask()
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadCurrentTask()
      }
    })
  }

  loadCurrentTask() {
    this.subscription2 = this._currentProject.getCurrentProject().subscribe((data: Project | null) => {
      this.id = this.route.snapshot.paramMap.get('taskId') as string;
      this._currentProject.getProjectById(this.route.snapshot.paramMap.get('projectId') as string).then((project: Project | null) => {
        if (project == null) {
          this.openSnackBar('Project not found', 'app-notification-error');
        } else if (this.id && project) { //extraemos la tarea de la maqueta local
          if (!this._currentProject.currentProjectId) this._currentProject.currentProjectId = project.id_code ? project.id_code : null;
          this._currentProject.getTaskById(this.id as string).then((task: Task | null) => {
            if (task == null) {
              this.openSnackBar('Task not found', 'app-notification-error');
            } else {
              this.value = task
              if (!this.value.tasks) {
                this.loadTasks()
              }
            }
          })
        }
      })

    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.subscription2.unsubscribe()
  }

  loadTasks(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.value?.idCode == this.id) {
        this._currentProject.getSubtasksByTask(this.value as Task).then((task: Task) => {
          this.value = task
          resolve()
        })
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
