import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../service/common/Project/project.service';
import { ConfigurationComponent } from '../../components/modals/Configuration/configuration.component';
import { NewProjectComponent } from '../../components/modals/new-project/new-project.component';
import { Observable, map } from 'rxjs';
import { Project } from '../../model/domain/project';
import { Item } from '../../model/domain/item';
import { TaskBoardComponent } from '../../components/task-board/task-board.component';
import { ProjectDashboardComponent } from '../../components/project-dashboard/project-dashboard.component';
import { AuthService } from '../../service/user/auth.service';
import { UserDataWrapperService } from '../../service/user/user-data-wrapper.service';
import { TaskService } from '../../service/common/Task/task.service';
import { Task } from '../../model/domain/task';
import { ObjetiveService } from '../../service/objetive.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
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
  /**
   * Obtiene los proyectos del usuario actual a traves del servicio de ProjectService
   * @returns retorna un array de proyectos del usuario actual
   */
  getUserProjects(): Observable<Item[]> | void {
    return this._ProjectS.getUserProjects(this._auth.currentUser$().id_alias).pipe(
      map((data: Project[]) => {
        return data.map(project => ({
          title: project.name,
          callback: () => {
            alert('FCT_Atmira');
          }
        }));
      })
    );
  }

  constructor(public dialog: MatDialog, private _ProjectS: ProjectService, public _user_dataWrapper:UserDataWrapperService, public _objetive: ObjetiveService) {
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
    this._user_dataWrapper.setCurrentItem(project);
    this.router.navigateByUrl(`projects/project/${project.id_code}`);
  }

  goTask(task: Task): void {
    this._user_dataWrapper.setCurrentItem(task);
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