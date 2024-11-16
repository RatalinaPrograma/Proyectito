import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { AgregarPacientesPage } from './agregar-pacientes.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiciobdService } from '../services/serviciobd.service';

describe('AgregarPacientesPage', () => {
  let component: AgregarPacientesPage;

  const SQLiteMock = {
    createConnection: jasmine.createSpy('createConnection').and.returnValue(Promise.resolve({})),
    closeConnection: jasmine.createSpy('closeConnection').and.returnValue(Promise.resolve()),
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: [] })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarPacientesPage],
      imports: [FormsModule], // Asegúrate de agregar FormsModule aquí
      providers: [
        { provide: SQLite, useValue: SQLiteMock }, // Mock de SQLite
        { provide: ServiciobdService, useClass: ServiciobdService }, // Servicio a probar
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AgregarPacientesPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
