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

    // Configurar mock para consultarTablaHospital
    serviciobdServiceMock.consultarTablaHospital.and.returnValue(Promise.resolve([])); // Retorna una lista vacía como ejemplo

    await TestBed.configureTestingModule({
      declarations: [CrudHospitalPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SQLite, useValue: sqliteMock },
        { provide: NavController, useValue: navControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudHospitalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería listar los hospitales correctamente', async () => {
    const hospitalesMock = [
      { idHospital: 1, nombre: 'Hospital A', direccion: 'Dirección A' },
      { idHospital: 2, nombre: 'Hospital B', direccion: 'Dirección B' },
    ];

    // Configurar el mock para devolver datos simulados
    serviciobdServiceMock.consultarTablaHospital.and.returnValue(Promise.resolve(hospitalesMock));

    await component.listarHospitales(); // Llama al método
    fixture.detectChanges();

    expect(component.hospitales).toEqual(hospitalesMock); // Verifica que los hospitales se asignaron
    expect(serviciobdServiceMock.consultarTablaHospital).toHaveBeenCalled();
  });

  it('debería llamar a listarHospitales en ngOnInit', () => {
    const spyListarHospitales = spyOn(component, 'listarHospitales').and.callThrough();

    component.ngOnInit();

    expect(spyListarHospitales).toHaveBeenCalled();
  });
});
