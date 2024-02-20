import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

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
import { TaskService } from '../../service/mockup/task.service';
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
  getUserProjects(): Observable<Item[]> | void {
    return this._ProjectS.getUserProjects(this._auth.currentUser$().ID_Alias).pipe(
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

  constructor(public dialog: MatDialog, private _ProjectS: ProjectService, public _user_dataWrapper:UserDataWrapperService, public _objetive: ObjetiveService) { }
  
  openConfiguration(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigurationComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration
    });
  }
  public _task:TaskService = inject(TaskService);

  openNewProject(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(NewProjectComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration
    });
  }

  router: Router = inject(Router);
  goProject(project: Project): void {
    this._user_dataWrapper.currentItem$.set(project);
    this.router.navigateByUrl(`projects/${project.id_code}`);
  }

  getUserTasks(): Observable<Task[]> {
    return new Observable<Task[]>((observable)=>{
      this._task.getTaskByUser(this._auth.currentUser$().ID_Alias).subscribe((data: Task[]) => {
        observable.next(data)
      });
    })
  }

  
}