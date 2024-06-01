import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';
import { HttpClientModule } from '@angular/common/http';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Asegúrate de importar todos los módulos necesarios
      providers: [ProjectService], // Agrega el servicio a la lista de providers
    });

    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('deberia poderse guardar un proyecto', () => {
    //devuelve un objeto project completo
    expect(service.save(
      {
        name: "Nombre del Proyecto",
        typeOfService: "DESARROLLO",
        initialDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-02"),
        active: true
      },"sampleId"
    )).not.toBeNull();
  });

  test('deberia retornar un objeto project al menos del usuario sampleId', () => {
    service.getUserProjects('sampleId').subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
    });
  });

  test('deberia poderse eliminar un proyecto', () => {
    //retorna un booleano
    expect(service.delete(
      {
        name: "Nombre del Proyecto",
        typeOfService: "DESARROLLO",
        initialDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-02"),
        "active": true
      }
    )).toBeTruthy();
  });
});
