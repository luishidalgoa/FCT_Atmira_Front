import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../service/common/Task/task.service';
import { Task } from '../../../model/domain/task';
import { Project } from '../../../model/domain/project';
import { TaskBoardComponent } from '../../../components/task-board/task-board.component';
import { ProjectService } from '../../../service/common/Project/project.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskComponent } from '../../../components/modals/new-task/new-task.component';

@Component({
  selector: 'app-view-all',
  standalone: true,
  imports: [TaskBoardComponent],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss'
})
export class ViewAllComponent {
  parent!: Project;
  values!: Task[];
  constructor(private route: ActivatedRoute,private _task:TaskService,private _project: ProjectService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this._project.getById(this.route.snapshot.params['id']).subscribe(
      (data: Project) => {
        this.parent = data;
      }
    ).add(()=>{
      this._task.getSubTasksByProject(this.parent.id_code as number).subscribe(
        (data: Task[]) => {
          this.values = data;
        }
      );
    })
    
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
