import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'core-modals-project-settings',
  standalone: true,
  imports: [],
  templateUrl: './project-settings.component.html',
  styleUrl: './project-settings.component.scss'
})
export class ProjectSettingsModal {
  sections: {index: number, sections: string[]} = {
    index: 0,
    sections: [
      "General",
      "Invite"
    ]
  }
  constructor(public dialogRef: MatDialogRef<ProjectSettingsModal>) {
    
  }
}
