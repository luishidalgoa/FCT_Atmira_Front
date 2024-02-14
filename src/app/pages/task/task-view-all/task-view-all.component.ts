import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../service/mockup/task.service';
import { Task } from '../../../model/domain/task';
import { Project } from '../../../model/domain/project';
import { TaskBoardComponent } from '../../../components/task-board/task-board.component';
import { ProjectService } from '../../../service/mockup/project.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../../../components/modals/new-task/new-task.component';
import { of } from 'rxjs';
import { UserDataWrapperService } from '../../../service/user/user-data-wrapper.service';

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
  constructor(private route: ActivatedRoute,private _task:TaskService,private _project: ProjectService, private dialog:MatDialog) { }


  //TEST
    _user_dataWrapper: UserDataWrapperService = inject(UserDataWrapperService); 
  //--------------
  ngOnInit(): void {
    this._project.getById(this.route.snapshot.params['id'],this._user_dataWrapper.projects$()).subscribe(
      (data: Project) => {
        this.parent = data;

        this._task.getSubTasksByProject(this.parent.id_code as number ).subscribe(
          (data: Task[]) => {
            this.values = data;
          }
        );
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

  deleteTask(task:Task){
    this.values = this.values.filter((t:Task)=>t.id_code!=task.id_code);
  }
}
