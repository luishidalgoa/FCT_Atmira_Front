import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DepartmentService } from './department.service';
import { WorkPlace } from '../../../model/domain/work-place';

describe('DeparmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DepartmentService]
    });
    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch workplaces from API', () => {
    const dummyWorkplaces: WorkPlace[] = [
      { ID_id: 1, Code: 'Workplace 1' },
      { ID_id: 2, Code: 'Workplace 2' }
    ];

  });
});
