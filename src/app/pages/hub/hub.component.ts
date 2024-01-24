import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../service/common/Project/project.service';
import { ConfigurationComponent } from '../../components/modals/Configuration/configuration.component';
@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [CommonModule,RouterLinkActive,RouterLink,MatButtonModule, MatMenuModule,
  MatButtonModule],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss'
})
export class HubComponent {
  title = 'FCT_Atmira';

  generateProjectsItems(){
    

    return [
      {
        title: 'FCT_Atmira',
        callback: () => {
          alert('FCT_Atmira');
        }
      }
    ]
  }

  constructor(public dialog: MatDialog){}
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfigurationComponent, {
      width: 'auto',
      enterAnimationDuration,
      maxWidth: '60rem',
      exitAnimationDuration
    });
  }


  
}