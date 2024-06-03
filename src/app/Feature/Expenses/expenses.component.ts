import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ProjectSettingsComponent } from '../../Core/components/project-settings/project-settings.component';
import { Project } from '../../model/domain/project';
import { CurrentProjectService } from '../../shared/services/current-project.service';
import { ProjectSettingsModal } from '../../Core/modals/project-settings/project-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [RouterOutlet,ProjectSettingsComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent implements OnInit, OnDestroy {
  currentProject: Project | null = null;
  subscription!: Subscription

  constructor(private _currentProject: CurrentProjectService, private dialog: MatDialog, private route: ActivatedRoute ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  ngOnInit(): void {
    //extraemos el parametro idProject de la url
    const projectId = this.route.snapshot.params['projectId'];
    this._currentProject.currentProjectId = projectId
    this.subscription = this._currentProject.getCurrentProject().subscribe((project: Project | null) => {
      this.currentProject = project
    })
  }

  openSettings(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(ProjectSettingsModal, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration,
      data: this.currentProject
    });
  }

}
