import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../../Core/services/Project/project.service';
import { ConfigurationComponent } from '../../modals/Configuration/configuration.component';
import { NewProjectComponent } from '../../../Core/modals/new-project/new-project.component';
import { Observable, map } from 'rxjs';
import { Project } from '../../../model/domain/project';
import { Item } from '../../../model/domain/item';
import { TaskBoardComponent } from '../../../Core/components/task-board/task-board.component';
import { AuthService } from '../../../Login/services/auth.service';
import { TaskService } from '../../../Core/services/Task/task.service';
import { Task } from '../../../model/domain/task';
import { ObjetiveService } from '../../services/objetive.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CurrentProjectService } from '../../services/current-project.service';
import { ProjectDashboardComponent } from '../../../Core/components/project-dashboard/project-dashboard.component';
@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, MatButtonModule, MatMenuModule,
    MatButtonModule,             TaskBoardComponent,ProjectDashboardComponent, RouterOutlet,RouterModule,BreadcrumbComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss'
})
export class HubComponent{

  public _auth: AuthService = inject(AuthService);

  constructor(public dialog: MatDialog, public _currentProject:CurrentProjectService, public _objetive: ObjetiveService) {
    this.getUserTasks()
  }
  
  /**
   * abre el modal de configuracion
   * @param enterAnimationDuration indica la duracion de la animacion de entrada
   * @param exitAnimationDuration indica la duracion de la animacion de salida
   */
  openConfiguration(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigurationComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration
    });
  }
  public _task:TaskService = inject(TaskService);
  /**
   * Abre el modal para crear un nuevo proyecto
   * @param enterAnimationDuration indica la duracion de la animacion de entrada
   * @param exitAnimationDuration indica la duracion de la animacion de salida
   */
  openNewProject(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(NewProjectComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration
    });
  }

  router: Router = inject(Router);
  /**
   * redirige al usuario a la ruta /projects/project/{id} donde id es el id del proyecto
   * además, guarda el proyecto en la signal "currentItem$" para informar al resto de componentes de la aplicacion de cual
   * es el proyecto actual que se esta visualizando
   * @param project 
   */
  goProject(project: Project): void {
    this.router.navigateByUrl(`projects/project/${project.id_code}`);
  }

  goTask(task: Task): void {
    this.router.navigateByUrl(`projects/project/${task.project.id_code}/task/${task.idCode}`);
  }

  tasksByUser: Task[] = [];
  /**
   * obtiene una lista de tareas a los que un usuario ha sido asignado.
   * Los devuelve en forma de observable para que el componente que lo llame pueda subscribirse a el y 
   * renderice las tareas del usuario en un menu desplegable
   * @returns observable de un array de tareas
   */
  getUserTasks(): void {
    this._task.getTaskByUser(this._auth.currentUser$().id_alias).subscribe((data: Task[]) => {
      this.tasksByUser = data;
    });
  }

  
}