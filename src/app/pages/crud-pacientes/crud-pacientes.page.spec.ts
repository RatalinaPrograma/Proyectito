import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudPacientesPage } from './crud-pacientes.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('CrudPacientesPage', () => {
  let component: CrudPacientesPage;
  let fixture: ComponentFixture<CrudPacientesPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceMock: jasmine.SpyObj<AlertasService>;
  let routerMock: jasmine.SpyObj<Router>;
  let navControllerMock: jasmine.SpyObj<NavController>;
  let sqliteMock: any;

  beforeEach(async () => {
    // Mock de ServiciobdService
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', [
      'consultartablaPaciente',
      'agregarPaciente',
      'eliminarPaciente',
      'obtenerPaciente',
    ]);

    // Configuración del mock para `consultartablaPaciente`
    serviciobdServiceMock.consultartablaPaciente.and.returnValue(Promise.resolve([]));

    // Mock de AlertasService
    alertasServiceMock = jasmine.createSpyObj('AlertasService', ['presentAlert']);

    // Mock de Router
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Mock de NavController
    navControllerMock = jasmine.createSpyObj('NavController', ['navigateForward']);

    // Mock de SQLite
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);
    sqliteMock.create.and.returnValue(Promise.resolve({
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: [] })),
    }));

    await TestBed.configureTestingModule({
      declarations: [CrudPacientesPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SQLite, useValue: sqliteMock }, // Mock de SQLite inyectado
        { provide: NavController, useValue: navControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudPacientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
