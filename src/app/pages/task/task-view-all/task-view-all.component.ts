import { Component,inject, effect } from '@angular/core';
import { TaskDescriptionComponent } from '../../../components/task-description/task-description.component';
import { TaskBoardComponent } from '../../../components/task-board/task-board.component';
import { Task } from '../../../model/domain/task';
import { TaskDetailsComponent } from '../../../components/task-details/task-details.component';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../service/common/Task/task.service';
import { Project } from '../../../model/domain/project';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../../../components/modals/new-task/new-task.component';
import { UserDataWrapperService } from '../../../service/user/user-data-wrapper.service';
import { ProjectService } from '../../../service/common/Project/project.service';

@Component({
  selector: 'app-task-view-all',
  standalone: true,
  imports: [TaskDescriptionComponent,TaskBoardComponent,TaskDetailsComponent],
  templateUrl: './task-view-all.component.html',
  styleUrl: './task-view-all.component.scss'
})
export class TaskViewAllComponent {
  public parent!: Project ;
  public values: Task[] = [];
    selectedProject!:  Project;

  private _task:TaskService = inject(TaskService);
  constructor(   private projectService: ProjectService, private taskService: TaskService, private route: ActivatedRoute, private dialog: MatDialog, private _user_dataWrapper: UserDataWrapperService) {
    effect(()=>{
      this.parent = this._user_dataWrapper.currentItem$() as Project;
      if(this.parent.id_code != undefined){
        this._task.getTaskByProject(this.parent.id_code as number).subscribe((data: Task[]) => {
          this.values = data;
        });
      }
    });
  }
  /**
   * recive del servicio project el proyecto indicado en la ruta con el parametro id y lo guarda en la variable parent
   * posteriormente recive del servicio task las tareas asociadas a ese proyecto y las guarda en la variable values
   */
  ngOnInit(): void {
    // Obtener el ID del proyecto de los parámetros de la ruta
    const projectId = this.route.snapshot.params['id'];

    // Obtener el proyecto por su ID
    this.projectService.getById(projectId).subscribe(
      (data: Project) => {
        // Asignar el proyecto obtenido a la variable parent
        this.parent = data;

        // Obtener las tareas asociadas a este proyecto
        this.taskService.getTaskByProject(this.parent.id_code as number).subscribe(
          (tasks: Task[]) => {
            // Asignar las tareas obtenidas a la variable values
            this.values = tasks;
          },
          (error: any) => {
            console.error('Error fetching tasks:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching project:', error);
      }
    );
  }

  loadTasks(): void {
    if (this.parent.id_code != undefined) {
      this.taskService.getTaskByProject(this.parent.id_code as number).subscribe((data: Task[]) => {
        this.values = data;
      });
    }
  }
  /**
   * abre el modal de nueva tarea al proyecto y le pasa el proyecto actual.
   * @param enterAnimationDuration indica la duracion de la animacion de entrada
   * @param exitAnimationDuration indica la duracion de la animacion de salida
   */
  saveChildTask(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: 'auto',
      maxWidth: '60rem',
      data: this.parent
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If a task was saved, reload the tasks
        this.taskService.getTaskByProject(this.parent.id_code as number).subscribe((data: Task[]) => {
          this.values = data;
        });
      }
    });
  }
  /**
   * Este metodo es llamado por el OutPut del componente hijo TaskBoardComponent. Elimina la tarea del array de tareas
   * para que se deje de renderizar en el html
   * @param task tarea que se desea eliminar del array de tareas
   */
  deleteTask(task:Task): void{
    this.values = this.values.filter((t:Task)=>t.idCode!=task.idCode);
  }


 

}
