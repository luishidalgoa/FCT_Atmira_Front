import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import { Project } from '../../model/domain/project';
import { ProjectService } from '../common/Project/project.service';
import { AuthService } from '../user/auth.service';
import { Task } from '../../model/domain/task';
import { Colaborator } from '../../model/domain/colaborator';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataWrapperService {
  public projects$: WritableSignal<Project[]> = signal<Project[]>([]); //array de proyectos del usuario
  public currentColaborators$: WritableSignal<Colaborator[]> = signal<Colaborator[]>([]); //array de colaboradores del usuario
  public currentItem$: BehaviorSubject<Project | Task | null> = new BehaviorSubject<Project | Task | null>(null); //proyecto o tarea actual (se usa en distintos componentes de la aplicacion para saber cual es el proyecto o tarea actual que se esta visualizando)

  /**
   * al inicializar el servicio se obtienen los proyectos del usuario actual y se guardan en el array de proyectos
   * @param _auth 
   * @param _projectService 
   */
  constructor(private _auth: AuthService, private _projectService: ProjectService) { 
    effect(()=>{
      this._projectService.getUserProjects(this._auth.currentUser$().id_alias).subscribe((projects: Project[]) => {
        this.projects$.update(()=>projects);
      });
    })
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

  setCurrentItem(item: Project | Task | null): void {
    this.currentItem$.next(item);
  }

  getCurrentItem(): BehaviorSubject<Project | Task | null> {
    return this.currentItem$;
  }
}
