import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { Project } from '../../model/domain/project';
import { ProjectService } from '../mockup/project.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataWrapperService {
  public projects$!: WritableSignal<Project[]>;

  constructor(private _auth: AuthService, private _projectService: ProjectService) { 
    this._projectService.getUserProjects(this._auth.currentUser$().ID_Alias).subscribe((projects: Project[]) => {
      this.projects$ = signal<Project[]>(projects);
    });
  }

  getProjects(): Project[] {
    return this.projects$();
  }

  addProject(projects: Project): void {
    this.projects$.update((currentProjects: Project[]) => currentProjects.concat(projects));
  }

  setProjects(projects: Project[]): void {
    this.projects$.set(projects);
  }

  removeProject(project: Project): void {
    this.projects$.update((currentProjects: Project[]) => currentProjects.filter((currentProject: Project) => currentProject.id_code !== project.id_code));
  }
}
