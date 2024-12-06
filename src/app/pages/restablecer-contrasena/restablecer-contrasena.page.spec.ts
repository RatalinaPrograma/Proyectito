import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestablecerContrasenaPage } from './restablecer-contrasena.page';
import { Router } from '@angular/router';
import { AlertasService } from '../services/alertas.service';
import { ServiciobdService } from '../services/serviciobd.service';
import { IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';

describe('RestablecerContrasenaPage', () => {
  let component: RestablecerContrasenaPage;
  let fixture: ComponentFixture<RestablecerContrasenaPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceMock: jasmine.SpyObj<AlertasService>;
  let routerMock: jasmine.SpyObj<Router>;
  let navControllerMock: any;

  beforeEach(async () => {
    // Crear mocks para las dependencias
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['modificarClave']);
    alertasServiceMock = jasmine.createSpyObj('AlertasService', ['presentAlert']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    navControllerMock = {
      navigateRoot: jasmine.createSpy('navigateRoot'),
      ionViewWillEnter: of({}), // Mock de un observable para ionViewWillEnter
    };

    await TestBed.configureTestingModule({
      declarations: [RestablecerContrasenaPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NavController, useValue: navControllerMock }, // Mock corregido de NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestablecerContrasenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
