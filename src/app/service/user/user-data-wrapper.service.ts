import { Injectable } from '@angular/core';
import { Project } from '../../model/domain/project';
import { ProjectService } from '../common/Project/project.service';
import { AuthService } from '../user/auth.service';
import { Task } from '../../model/domain/task';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../common/Task/task.service';
import { Colaborator } from '../../model/domain/colaborator';

@Injectable({
  providedIn: 'root'
})
export class UserDataWrapperService {
  private projects!: BehaviorSubject<Project[]>;
  /**
   * al inicializar el servicio se obtienen los proyectos del usuario actual y se guardan en el array de proyectos
   * @param _auth 
   * @param _projectService 
   */
  constructor(private _auth: AuthService, private _projectService: ProjectService, private router: ActivatedRoute, private _task: TaskService) {
    this.projects = this.projects = new BehaviorSubject<Project[]>([]);

    if (this._auth.currentUser$()) {
      this._projectService.getUserProjects(this._auth.currentUser$().id_alias).subscribe((projects: Project[]) => {
        this.projects.next(projects);

        const taskId = this.router.snapshot.paramMap.get('taskId')
        const projectId = this.router.snapshot.paramMap.get('id')
        if (projectId && taskId) {
          this._task.getById(taskId).subscribe((task: Task) => {
            // reconstruimos todo el objeto proyecto con el orden jerárquico de tareas y subtareas
            this.overriteProject(this.toTaskTree(task))
          })
        }
      })
    }
  }
  /**
   * Recorre una tarea o subtarea de modo que reconponga todo el arbol de tareas hasta llegar al proyecto
   * @param task 
   */
  toTaskTree(task: Task): Project {
    const project: Project = task.project;
    let aux: Task = task;
    for (let i = 0; aux.task && i >= 0;) {
      if (aux.task) {
        const child = task;
        aux = aux.task;
        aux.tasks?.push(child);
        i++;
      } else {
        project.tasks?.push(aux);
        --i;
      }
    }
    return project;
  }
  /**
   * sobreescribe un proyecto si existe en el BehaviorSubject de Projects. si no existe la crea dependiendo de si save es true o false.
   * Al finalizar el proceso, propagamos el cambio si ha sido exitosa la operación
   * @param project proyecto que se va a sobreescribir
   * @param save [flag = true] si es true guarda el proyecto en caso de no existir previamente en el array. si no, no se guardara.
   * @returns true si el proyecto ha sido sobreescribido, false en caso contrario
   */
  overriteProject(project: Project, save: boolean = false): boolean {
    const copy = this.projects.getValue()
    //reemplazamos el proyecto con id == projectId por el que hemos recibido
    const index = copy.findIndex((project: Project) => project.id_code == project.id_code);
    if (index != -1) {
      copy[index] = project
    } else if (save) {
      copy.push(project);
    }
    if (index != -1 || save) { // propagamos el cambio
      this.projects.next(copy);
      return true;
    }
    return false;
  }
  /**
   *  En primera instancia buscara el objeto proyecto en el BehaviorSubject. Si no lo encuentra, lo obtendra de la base de datos.
   *  en caso de no ser encontrado en la base de datos en el array de proyectos, se retornara null
   * @param id id del proyecto que se quiere obtener
   * @params save [flag = true] si es true se guardara el proyecto en caso de no existir previamente en el array. si no, no se guardara. ¡ADVERTENCIA!: podria entrar en recursividad
   * @returns el proyecto o null
   */
  getProjectById(id: string, save: boolean = false): Promise<Project | null> {
    return new Promise<Project | null>((resolve) => {
      const aux: Project[] = this.projects.getValue();
      const index = aux.findIndex((project: Project) => project.id_code == id);

      if (index == -1) {
        this._projectService.getById(id).subscribe((project: Project) => {
          if (project) {
            this.overriteProject(project,save)
            resolve(project)
          } else {
            resolve(null)
          }
        })
      } else {
        resolve(aux[index])
      }
    })
  }
  /**
   * Buscara la tarea o subtarea dentro de un proyecto. en primer lugar de manera local. hara una busqueda a traves de un pattern. guiandose por las pistas
   * que otorgan los identificadores de las tareas y subtareas. por ejemplo 0_1_1 indica que el proyecto es id_code = 0 y que la tarea 0_1 y dentro de la 0_1 estaria la subtarea 0_1_1
   * si no se encuentra la tarea o la subtarea la busca en la base de datos si no la encuentra retorna null
   * @param projectId idCode del proyecto en el cual se va a buscar
   * @param taskId idCode de la tarea o subtarea que se busca
   * @params save [flag = true] si es true se guardara la tarea en caso de no existir previamente en el array. si no, no se guardara. ¡ADVERTENCIA!: podria entrar en recursividad
   * @returns la tarea o null en base de si existe o no
   */
  getTaskByProjectAndTaskId(projectId: string, taskId: string,save: boolean = false): Promise<Task | null> {
    return new Promise<Task | null>((resolve) => {
      this.getProjectById(projectId).then((project: Project | null) => {
        if (project && project.tasks) {
          const taskIds = taskId.split('_'); // Dividir el taskId en sus componentes
          let currentTask: Task | null = null;

          // Realizar la búsqueda local en el proyecto
          for (let i = 0; i < taskIds.length; i++) {
            const currentId = taskIds.slice(0, i + 1).join('_'); // Obtener el idCode actual
            currentTask = project.tasks.find(task => task.idCode === currentId) || null; // Buscar la tarea actual en el proyecto
            if (!currentTask) break; // Si no se encuentra la tarea, detener la búsqueda
          }
          if (currentTask) resolve(currentTask);
        }
        // Si el proyecto no tiene tareas, buscar directamente en la base de datos
        this._task.getById(taskId).subscribe((task: Task) => {
          if (this.overriteProject(this.toTaskTree(task),save)) {
            resolve(task)
          } else {
            resolve(null)
          }
        });
      });
    });
  }

  /**
   * Guarda o sobreescribe una tarea en el BehaviorSubject. si save es true, la guarda en caso de no existir previamente en el array. si no, no se guardara.
   * al finalizar el proceso, propagamos el cambio si ha sido exitosa la operación
   * @param task tarea que se va a sobreescribir
   * @param save [flag = true] si es true sobreescribe la tarea en caso de no existir previamente en el array. si no, no se sobreescribira.
   * @returns true si la tarea ha sido sobreescribido, false en caso contrario
   */
  overriteTask(task: Task): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      console.log('overriteTask')
      const result = this.overriteProject(this.toTaskTree(task));
      resolve(result)
    })



    /**
     * return new Promise<boolean>((resolve) => {
      * this.getTaskByProjectAndTaskId(task.project.id_code as string, task.task?.idCode as string).then((result: Task | null) => { // buscamos la tarea padre para luego preguntar por el hijo
          if (result) {
            if(result.tasks == undefined){
              result.tasks = [];
              this._task.getById(task.idCode as string).subscribe(()=>{

              })
            }else{
              const aux = result.tasks?.filter((t: Task) => t.idCode == task.idCode)[0]
              this.overriteProject(this.toTaskTree(aux != undefined ? aux : task))
            }
          }
        })
      })
     */
  }


  /**
   * BehaviorSubject que almacena todos los proyectos durante el historial de la aplicacion
   * @returns  el BehaviorSubject de la maqueta de todos los proyectos guardados localmente
   */
  suscribe(): BehaviorSubject<Project[]> {
    return this.projects;
  }
  /**
   * Busca localmente si el BehaviorSubject de los proyectos contiene un array de colaboradores si no, lo obtiene de la base de datos
   * @param project proyecto que se va a buscar sus colaboradores
   * @returns el array de colaboradores
   */
  getColaboratorsByProject(project: Project): Promise<Colaborator[]> {
    return new Promise<Colaborator[]>((resolve) => {
      this.getProjectById(project.id_code as string).then((data: Project | null) => {
        if (data?.colaboratorProjects == undefined) {
          this._projectService.getColaboratos(project.id_code as string).subscribe((result: Colaborator[]) => {
            resolve(result)
          })
        }
        resolve(data?.colaboratorProjects as Colaborator[])
      })
    })
  }

  getTasksByProject(project: Project): Promise<Task[]> {
    return new Promise<Task[]>((resolve) => {
      this.getProjectById(project.id_code as string).then((data: Project | null) => {
        if (data && data?.tasks == undefined) {
          this._task.getTaskByProject(project.id_code as string).subscribe((result: Task[]) => {
            data.tasks = result
            this.overriteProject(data)
            resolve(result)
          })
        }
        resolve(data?.tasks as Task[])
      })
    })
  }
  /**
   * 
   * @param project proyecto donde eliminaremos la tarea
   * @param task_delete tarea que se eliminara del array de tareas de parametro project
   * @returns 
   */
  deleteTask(project: Project, task_delete: Task): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._task.delete(task_delete).subscribe((data: boolean) => {
        if (data) {
          project.tasks = project.tasks?.filter((t: Task) => t.idCode != task_delete.idCode);
          this.overriteProject(project);
        }
        resolve(data)
      })
    })
  }

  deleteProject(project: Project): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._projectService.delete(project).subscribe((data: boolean) => {
        const copy = this.projects.value.filter((p: Project) => p.id_code != project.id_code)
        for (let aux of copy){
          this.overriteProject(aux)
        }
        resolve(data)
      })
    })
  }

  getSubtasksByTask(task: Task): Promise<Task[]> {
    return new Promise<Task[]>((resolve) => {
      resolve( task.tasks as Task[])
    })
  }
}
