import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskService } from './task.service';
import { ProjectService } from '../Project/project.service';
import { inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TypeOfService } from '../../../model/enum/type-of-service';

describe('TaskService', () => {
  let service: TaskService;
  let _project: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Asegúrate de importar todos los módulos necesarios
      providers: [ProjectService,TaskService], // Agrega el servicio a la lista de providers
    });
    
    service = TestBed.inject(TaskService);
    _project = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('deberia poderse guardar una tarea', fakeAsync(() => {
    let data: any;

    _project.getUserProjects('sampleId', 1).subscribe(result => {
      console.log(result);
      data = result;
    });

    tick(); // Completa la ejecución de las operaciones asíncronas

    expect(service.save({
      ID_Code_Project: 1,
      description: "Descripcion de la tarea",
      objective: TypeOfService.DESARROLLO,
      closed: false,
      project: data, // Utiliza los datos obtenidos en el subscribe
      task: {
        idCode: '1',
        description: "Descripcion de la tarea",
        objective: TypeOfService.DESARROLLO,
        closed: false,
        project: data,
        ID_Code_Project: 1,
        task: null,
      },
    })).not.toBeNull();
  }));

  
});
