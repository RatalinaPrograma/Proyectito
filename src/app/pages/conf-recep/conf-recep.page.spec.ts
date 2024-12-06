import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfRecepPage } from './conf-recep.page';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ServiciobdService } from '../services/serviciobd.service';
import { of, BehaviorSubject } from 'rxjs';
import { IonicModule } from '@ionic/angular';

describe('ConfRecepPage', () => {
  let component: ConfRecepPage;
  let fixture: ComponentFixture<ConfRecepPage>;

  // Mock para servicios
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let routerMock: jasmine.SpyObj<Router>;
  let alertCtrlMock: any;
  let activatedRouteMock: any;
  let navControllerMock: any;

  beforeEach(async () => {
    // Crear mocks de los servicios necesarios
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', [
      'obtenerUltimaEmergencia',
      'obtenerMedicoPorRut',
      'guardarConfirmacion',
    ]);

    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    alertCtrlMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
        present: jasmine.createSpy('present'),
      })),
    };

    activatedRouteMock = {
      params: of({ rut: '12345678-9' }), // Simular parámetros de ruta
    };

    // Mock de NavController
    navControllerMock = jasmine.createSpyObj('NavController', [
      'navigateBack',
      'navigateForward',
    ]);
    navControllerMock.router = new BehaviorSubject(null); // Simula un observable interno

    await TestBed.configureTestingModule({
      declarations: [ConfRecepPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertController, useValue: alertCtrlMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NavController, useValue: navControllerMock }, // Mock para NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfRecepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
