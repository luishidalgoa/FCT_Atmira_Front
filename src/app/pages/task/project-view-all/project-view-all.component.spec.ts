import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewAllComponent } from './project-view-all.component';

describe('ViewAllComponent', () => {
  let component: ProjectViewAllComponent;
  let fixture: ComponentFixture<ProjectViewAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectViewAllComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
