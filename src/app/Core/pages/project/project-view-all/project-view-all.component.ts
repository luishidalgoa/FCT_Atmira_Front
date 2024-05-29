import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../../../model/domain/task';
import { Project } from '../../../../model/domain/project';
import { TaskBoardComponent } from '../../../components/task-board/task-board.component';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../../../modals/new-task/new-task.component';
import { ProjectService } from '../../../services/Project/project.service';
import { TaskBoardComponentSkeleton } from '../../../skeletons/task-board/task-board.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentProjectService } from '../../../../shared/services/current-project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'core-project-view-all',
  standalone: true,
  imports: [TaskBoardComponent, TaskBoardComponentSkeleton, MatProgressSpinner],
  templateUrl: './project-view-all.component.html',
  styleUrl: './project-view-all.component.scss'
})
export class ProjectViewAllComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  currentProject: Project | null = null;
  constructor(private route: ActivatedRoute, private _project: ProjectService, private dialog: MatDialog, public _currentProject: CurrentProjectService, private router: ActivatedRoute) { }
  ngOnInit(): void {
    const projectId = this.route.snapshot.params['projectId'];
    this._currentProject.getProjectById(projectId).then((data: Project | null) => {
      this._currentProject.currentProjectId = projectId
      this.subscription = this._currentProject.getCurrentProject().subscribe((project: Project | null) => {
        this.currentProject = project
      })
    }).then(() => {
      if (this.currentProject && this.currentProject.tasks == undefined) { // si no hay tareas se buscaran
        this._currentProject.getTasksByProject(this.currentProject).then((tasks: Task[]) => {
          if(!this.currentProject) return;
          this.currentProject.tasks = tasks
        })
      }
    })




  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
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
      data: this.currentProject
    });
  }
  /**
   * Este metodo es llamado por el OutPut del componente hijo TaskBoardComponent. Elimina la tarea del array de tareas
   * para que se deje de renderizar en el html
   * @param task tarea que se desea eliminar del array de tareas
   */
  deleteTask(task: Task): void {
    if (!this.currentProject) return
    this._currentProject.deleteTask(this.currentProject, task).then((result: boolean) => {
      if (result) {
        this.openSnackBar('Task deleted successfully', 'app-notification-success');
      } else {
        this.openSnackBar('Task could not be deleted', 'app-notification-error')
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
    this._snackBar.open(message, 'Hidden', {
      duration: 2500,
      panelClass: status
    });
  }
}
