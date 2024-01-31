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


  test('deberia retornar un objeto project al menos del usuario sampleId', () => {
    service.save(
      {
        name: "Nombre del Proyecto",
        typeOfService: "DESARROLLO",
        initialDate: new Date("2020-03-01"),
        endDate: new Date("2020-03-02"),
        "active": true,

        colaboratorProjects: [
          {
            ID_Alias: "sampleId",
            Email: "sample@email.com",
            isActive: true,
            relaseDate: new Date("2020-01-31"),
            Hours: 6,
            Guards: true,
            Expense: true,
            Name: "John",
            Surname: "Doe",
            Password: "sample"
          }
        ]
      }
    )

    service.getUserProjects('sampleId').subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
