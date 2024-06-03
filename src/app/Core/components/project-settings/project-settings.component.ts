import { Component, Input } from '@angular/core';
import { ProjectSettingsModal } from '../../modals/project-settings/project-settings.component';
import { Project } from '../../../model/domain/project';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'core-project-settings',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-settings.component.html',
  styleUrl: './project-settings.component.scss'
})
export class ProjectSettingsComponent {
  @Input({required: true})
  currentProject: Project | null = null;
  constructor(public dialog: MatDialog, private router: Router) { }
  openSettings(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(ProjectSettingsModal, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration,
      data: this.currentProject
    });
  }

  goToExpenses(){
    this.router.navigate(['projects/project', this.currentProject?.id_code, 'expenses'])
  }
}
