import { TestBed } from '@angular/core/testing';
import { AgregarHospitalPage } from './agregar-hospital.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiciobdService } from '../services/serviciobd.service';

describe('AgregarHospitalPage', () => {
  let component: AgregarHospitalPage;

  const SQLiteMock = {
    createConnection: jasmine.createSpy('createConnection').and.returnValue(Promise.resolve({})),
    closeConnection: jasmine.createSpy('closeConnection').and.returnValue(Promise.resolve()),
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: [] })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarHospitalPage],
      providers: [
        { provide: SQLite, useValue: SQLiteMock }, // Mock de SQLite
        { provide: ServiciobdService, useClass: ServiciobdService }, // Servicio a probar
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AgregarHospitalPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
