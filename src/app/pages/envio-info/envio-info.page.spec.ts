import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvioInfoPage } from './envio-info.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of, BehaviorSubject } from 'rxjs';
import { Pacientes } from '../services/pacientes';

describe('EnvioInfoPage', () => {
  let component: EnvioInfoPage;
  let fixture: ComponentFixture<EnvioInfoPage>;

  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;
  let sqliteMock: jasmine.SpyObj<SQLite>;
  let navControllerMock: any;

  beforeEach(async () => {
    // Mock de datos de paciente
    const mockPaciente: Pacientes = {
      nombre: 'Juan Pérez',
      f_nacimiento: new Date('1990-01-01'), // Ahora es de tipo Date
      idGenero: 1,
      rut: '12345678-9',
      telefono_contacto: '+56912345678',
    };

    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerPaciente']);
    serviciobdServiceMock.obtenerPaciente.and.returnValue(Promise.resolve(mockPaciente)); // Simula retorno de Promise

    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('12345678-9'), // Mock del parámetro 'rut'
        },
      },
    };

    navControllerMock = jasmine.createSpyObj('NavController', ['navigateBack', 'navigateForward']);
    navControllerMock.router = new BehaviorSubject(null); // Simula un observable interno

    await TestBed.configureTestingModule({
      declarations: [EnvioInfoPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: SQLite, useValue: sqliteMock },
        { provide: NavController, useValue: navControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvioInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    // Verifica que el método de obtenerPaciente fue llamado
    expect(serviciobdServiceMock.obtenerPaciente).toHaveBeenCalledWith('12345678-9');
  });
});
