import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { Project } from '../../model/domain/project';
import { ProjectService } from '../common/Project/project.service';
import { AuthService } from '../user/auth.service';
import { Task } from '../../model/domain/task';

@Injectable({
  providedIn: 'root'
})
export class UserDataWrapperService {
  public projects$: WritableSignal<Project[]> = signal<Project[]>([]);
  public currentItem$: WritableSignal<Project | Task> = signal<Project | Task>({} as Project | Task);

  constructor(private _auth: AuthService, private _projectService: ProjectService) { 
    this._projectService.getUserProjects(this._auth.currentUser$().ID_Alias).subscribe((projects: Project[]) => {
      this.projects$.update(()=>projects);
      console.log(projects,'hola')
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
