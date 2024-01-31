import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, MatButtonModule, MatMenuModule,
    MatButtonModule,             TaskBoardComponent,ProjectDashboardComponent, RouterOutlet],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss'
})
export class HubComponent {
  title = 'FCT_Atmira';

  generateProjectsItems() {
    return [
      {
        title: 'FCT_Atmira',
        callback: () => {
          alert('FCT_Atmira');
        }
      }
    ]
  }

  getUserProjects(): Observable<Item[]> | void {
    return this._ProjectS.getUserProjects(1, 4).pipe(
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

  constructor(public dialog: MatDialog, private _ProjectS: ProjectService) { }
  openConfiguration(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigurationComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration
    });
  }


  openNewProject(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(NewProjectComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration
    });
  }
}