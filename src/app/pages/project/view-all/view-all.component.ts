import { Component } from '@angular/core';
import { ProjectDashboardComponent } from '../../../components/project-dashboard/project-dashboard.component';
import { NewProjectComponent } from '../../../components/modals/new-project/new-project.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [ProjectDashboardComponent],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss'
})
export class ViewAllComponent {
  constructor(private dialog: MatDialog) { }
  
  ngOnInit(): void {
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
