import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudHospitalPage } from './crud-hospital.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('CrudHospitalPage', () => {
  let component: CrudHospitalPage;
  let fixture: ComponentFixture<CrudHospitalPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceMock: jasmine.SpyObj<AlertasService>;
  let routerMock: jasmine.SpyObj<Router>;
  let sqliteMock: any;

  const navControllerMock = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);

  beforeEach(async () => {
    // Crear mocks de servicios
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['consultarTablaHospital', 'eliminarHospital']);
    alertasServiceMock = jasmine.createSpyObj('AlertasService', ['presentAlert']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Mock de SQLite
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);
    sqliteMock.create.and.returnValue(Promise.resolve({
      executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve([])),
    }));

    await TestBed.configureTestingModule({
      declarations: [CrudHospitalPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SQLite, useValue: sqliteMock }, // Proveer mock de SQLite
        { provide: NavController, useValue: navControllerMock }, // Proveer mock de NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudHospitalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
