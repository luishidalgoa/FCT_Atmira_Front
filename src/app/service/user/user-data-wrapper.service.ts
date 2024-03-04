import { Injectable, WritableSignal, signal } from '@angular/core';
import { Project } from '../../model/domain/project';
import { ProjectService } from '../common/Project/project.service';
import { AuthService } from '../user/auth.service';
import { Task } from '../../model/domain/task';
import { Colaborator } from '../../model/domain/colaborator';
import { switchMap,pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataWrapperService {
  public projects$: WritableSignal<Project[]> = signal<Project[]>([]); //array de proyectos del usuario
  public currentItem$: WritableSignal<Project | Task> = signal<Project | Task>({} as Project | Task); //proyecto o tarea actual (se usa en distintos componentes de la aplicacion para saber cual es el proyecto o tarea actual que se esta visualizando)

  /**
   * al inicializar el servicio se obtienen los proyectos del usuario actual y se guardan en el array de proyectos
   * @param _auth 
   * @param _projectService 
   */
  constructor(private _auth: AuthService, private _projectService: ProjectService, private _) { 
    // Espera a que el usuario esté autenticado y luego obtiene los proyectos del usuario actual
    this.projects$ = this._auth.currentUser$.pipe(
      switchMap(user => {
        if (user.ID_Alias) {
          return this._projectService.getUserProjects(user.ID_Alias);
        } else {
          return of([]); // Devuelve un Observable vacío si el usuario no está autenticado
        }
      })
    );
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
