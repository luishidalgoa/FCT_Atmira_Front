import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TashBoardComponent } from './task-board.component';

describe('TashBoardComponent', () => {
  let component: TashBoardComponent;
  let fixture: ComponentFixture<TashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TashBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
