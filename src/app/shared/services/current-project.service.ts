import { inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Project } from '../../model/domain/project';
import { Task } from '../../model/domain/task';
import { ProjectService } from '../../Core/services/Project/project.service';
import { AuthService } from '../../Login/services/auth.service';
import { TaskService } from '../../Core/services/Task/task.service';
import { Colaborator } from '../../model/domain/colaborator';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})



export class CurrentProjectService {
  public currentProjectId: string | null = null

  public repository: BehaviorSubject<Project[] | null> = new BehaviorSubject<Project[] | null>(null);

  public _auth: AuthService = inject(AuthService)
  constructor(private _projectS: ProjectService, private _task: TaskService) {
    this._projectS.getUserProjects(this._auth.currentUser$().id_alias).subscribe((data: Project[]) => {
      this.repository.next(data)
    })
  }


  getProjectOnRepository(id: string): Project | undefined {
    if (!this.repositoryValue) return;
    return this.repositoryValue.find(project => project.id_code === id);
  }

  get repositoryValue(): Project[] | null {
    if (!this.repository.value) return null;
    return this.repository.value
  }
  /**
   * Se debe realizar la reconstruccion del arbol y guardar la tarea dentro de la tarea padre
   */
  set task(task: Task) {
    if (task) {
      this.getProjectById(task.project?.id_code as string).then((project: Project | null) => {

        if (task.idCode!.split('_').length > 1) { // si la nueva tarea es hija de un proyecto
          project?.tasks?.push(task)
        } else { // si la nueva tarea es una subtarea
          if (!project) return;
          this.rebuildTaskGenealogic(project, task.task?.idCode as string).then((t: Task | null) => {
            if (t) {
              t.tasks?.push(task)
            }
          })
        }
      })
    }

  }
  /**
   * Recorre un arbol genealogico de tareas y subtareas
   * el modelo de datos es como el siguiente ejemplo:
   * {
      "project": {
        "id_code": "0",
        "typeOfService": "OPERACIONES",
        "name": "Atmira_FTC",
        "initialDate": 1708815600000,
        "endDate": 1709161200000,
        "active": true,
        "tasks": {
          "idCode": "0_1_1",
          "description": "Descripcion de la tarea",
          "objective": "MANTENIMIENTO",
          "task": {
            "idCode": "0_1",
            "description": "Atmira_FTC",
            "objective": "DESARROLLO",
            "task": null,
            "project": {
              ...
            },
            "colaborator": {
                ...
            },
            "closed": false
          }
        }
      }
    }
    como se puede apreciar, una forma para atacar al arbol seria ir navegando a traves del idCode para llegar a la tarea o subtarea correspondiente
   * @param id 
   * @returns 
   */
  getTaskById(id: string): Promise<Task | null> {
    if (!this.repository) return Promise.resolve(null);
    return new Promise((resolve) => {
      this.getProjectById(id.split('_')[0]).then((project: Project | null) => {
        if (!project) resolve(null);
        this.rebuildTaskGenealogic(project as Project, id).then((task: Task | null) => {
          if (!task) resolve(null);
          resolve(task);
        })
      })
    })
  }

  /**
   * Reconstruye un arbol genealogico de tareas y subtareas y devuelve un objeto que apunta a la zona de memoria de repository
   * @param project punto de partida
   * @param task tarea hija sobre la que intentaremos hacer la reconstruccion del arbol
   * @returns nos devuelve la zona de memoria de la tarea que apunta en el objeto repository
   */
  rebuildTaskGenealogic(project: Project, idTask: string): Promise<Task | null> {
    if (!project && !idTask) return Promise.resolve(null);
    const idParts = (idTask as string).split('_');
    let currentValue: Task | null = null;
    let currentId = idParts[0]; // Inicializa con la primera parte del id
    /**
     * Busca una tarea dentro de un proyecto u otra tarea
     * @param parent 
     * @param currentId 
     * @returns 
     */
    const findOrFetchTask = (parent: Project | Task, currentId: string): Promise<Task | null> => {
      return new Promise((resolve) => {
        let foundTask = parent.tasks?.find((t: Task) => t.idCode === currentId) as Task;
        if (foundTask) {
          resolve(foundTask);
        } else {
          this._task.getById(currentId).subscribe((t: Task) => {
            parent.tasks = parent.tasks || [];
            parent.tasks.push(t);
            resolve(t);
          });
        }
      });
    };

    return new Promise(async (resolve) => {
      let parent: Project | Task = project;
      for (let i = 1; i < idParts.length; i++) {
        currentId += `_${idParts[i]}`; // Construimos el id paso a paso

        if (i === 1) { // Buscamos dentro del proyecto
          currentValue = await findOrFetchTask(parent, currentId);
          parent = currentValue as Task
        } else if (currentValue) { // Buscamos dentro de una tarea
          currentValue = await findOrFetchTask(currentValue, currentId);
          parent = currentValue as Task;
        }

        if (!currentValue) {
          resolve(null);
          return;
        }
      }
      resolve(currentValue);
    });
  }

  /**
   * Busca un proyecto por su idCode en el repositorio o en el servicio
   * @param id 
   * @returns 
   */
  getProjectById(id: string): Promise<Project | null> {
    return new Promise<Project | null>((resolve) => {
      const exist: Project | undefined = this.getProjectOnRepository(id)
      if (exist) {
        resolve(exist)
      } else {
        this._projectS.getById(id).subscribe((data: Project) => {
          let aux = this.repositoryValue
          if (aux?.find((p: Project) => p.id_code == data.id_code) == undefined) {
            aux?.push(data)
          }else{
            aux = aux?.map((p: Project) => p.id_code == data.id_code ? data : p)
          }
          this.repository.next(aux)
          resolve(this.getProjectOnRepository(id) as Project | null)
        })
      }
    })
  }

  deleteProject(project: Project): Observable<boolean> {
    return new Observable<boolean>((resolve) => {
      this._projectS.delete(project).subscribe((data: boolean) => {
        if (data) {
          let aux = this.repositoryValue
          aux = aux?.filter((p: Project) => p.id_code != project.id_code) ? aux?.filter((p: Project) => p.id_code != project.id_code) : null
          this.repository.next(aux)
          return true
        }
        return false
      })
    })
  }

  save(project: Project): Promise<boolean> {
    const idAlias = this._auth.currentUser$().id_alias
    return new Promise<boolean>((resolve) => {
      this._projectS.save(project, idAlias).subscribe((data: Project) => {
        if (data) {
          const aux = this.repositoryValue
          aux?.push(data)
          this.repository.next(aux)
          resolve(true)
        }
        resolve(false)
      });
    })
  }

  getColaboratorsByProject(project: Project): Promise<Colaborator[]> {
    return new Promise<Colaborator[]>((resolve) => {
      this.getProjectById(project.id_code as string).then((project: Project | null) => {
        if (project && project.colaboratorProjects) {
          resolve(project.colaboratorProjects)
        }
      })
    })
  }
  getTasksByProject(project: Project): Promise<Task[]> {
    return new Promise<Task[]>((resolve) => {
      this._task.getTaskByProject(project.id_code as string).subscribe((data: Task[]) => {
        resolve(data)
      })
    })
  }
  /**
   * E
   * @param this 
   * @param _currentProject 
   * @param projectValue 
   * @param task 
   */
  deleteTask(project: Project, task: Task): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._task.delete(task).subscribe((data: boolean) => {
        if (data) {
          this.rebuildTaskGenealogic(project, task.task?.idCode as string).then((data: Task | null) => {
            if (data) {
              data.tasks = data.tasks?.filter((t: Task) => t.idCode !== task.idCode)
            }
          })
        }
        resolve(data)
      })
    })
  }

  /**
   * Devuelve la tarea que apunta en el objeto repository
   * @param task 
   * @returns 
   */
  getSubtasksByTask(task: Task): Promise<Task> {
    return new Promise<Task>((resolve) => {
      this._task.getSubTasksByTask(task.idCode as string).subscribe((data: Task[]) => {
        this.getTaskById(task.task?.idCode as string).then((aux: Task | null) => {
          if (aux) {
            aux.tasks = data
            resolve(aux)
          }
        })
      })
    })
  }

  private _router: Router = inject(Router)
  navigateProject(project: Project) {
    this.currentProjectId = project.id_code ? project.id_code : null;
    this._router.navigateByUrl(`projects/project/${project.id_code}`);
  }


  getCurrentProject(): Observable<Project | null> {
    return this.repository.pipe(
      map((data: Project[] | null) => {
        if (!data) return null;
        return data.find((p: Project) => p.id_code === this.currentProjectId) || null;
      })
    );
  }
}
