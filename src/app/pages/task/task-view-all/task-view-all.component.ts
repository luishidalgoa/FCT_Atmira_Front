import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../service/common/Task/task.service';
import { Task } from '../../../model/domain/task';
import { Project } from '../../../model/domain/project';
import { TaskBoardComponent } from '../../../components/task-board/task-board.component';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../../../components/modals/new-task/new-task.component';
import { of } from 'rxjs';
import { UserDataWrapperService } from '../../../service/user/user-data-wrapper.service';
import { ProjectService } from '../../../service/common/Project/project.service';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [TaskBoardComponent],
  templateUrl: './task-view-all.component.html',
  styleUrl: './task-view-all.component.scss'
})
export class TaskViewAllComponent {
  public parent!: Project;
  public values!: Task[];

  private _task:TaskService = inject(TaskService);
  constructor(private route: ActivatedRoute,private _project: ProjectService, private dialog:MatDialog,private _user_dataWrapper: UserDataWrapperService) {
      effect(()=>{
        this.parent = this._user_dataWrapper.currentItem$() as Project;
        if(this.parent.id_code != undefined){
          this._task.getTaskByProject(this.parent.id_code as number).subscribe((data: Task[]) => {
            this.values = data;
          });
        }
      });
   }

  ngOnInit(): void {
    
    this._project.getById(this.route.snapshot.params['id']).subscribe(
      (data: Project) => {
        this.parent = data;

        /*this._task.getTasksById_Code(this.parent.id_code as number ).subscribe(
          (data: Task[]) => {
            this.values = data;
          }
        );*/

        this._task.getTaskByProject(this.parent.id_code as number).subscribe((data: Task[]) => {
          this.values = data;
        });
      }
    )
    
  }

  saveChildTask(enterAnimationDuration: string, exitAnimationDuration: string){
    this.dialog.open(NewTaskComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration,
      data: this.parent
    });
  }

  deleteTask(task:Task): void{
    this.values = this.values.filter((t:Task)=>t.idCode!=task.idCode);
  }
}
