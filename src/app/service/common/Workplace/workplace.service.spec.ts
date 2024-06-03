import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WorkplaceService } from './workplace.service';
import { WorkPlace } from '../../../model/domain/work-place';

describe('WorkplaceService', () => {
  let service: WorkplaceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkplaceService]
    });
    service = TestBed.inject(WorkplaceService);
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
