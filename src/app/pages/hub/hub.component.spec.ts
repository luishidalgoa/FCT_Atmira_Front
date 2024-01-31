import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubComponent } from './hub.component';

describe('HubComponent', () => {
  let component: HubComponent;
  let fixture: ComponentFixture<HubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('deberia retornar un array de proyectos del usuario 1, no deberia estar vacio'), () => {
    const projects = component.getUserProjects();
    expect(projects).not.toBeNull();

    expect(projects).not.toHaveLength(0);
  }
});
