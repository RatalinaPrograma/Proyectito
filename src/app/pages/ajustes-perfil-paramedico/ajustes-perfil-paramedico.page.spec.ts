import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjustesPerfilParamedicoPage } from './ajustes-perfil-paramedico.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CamaraService } from '../services/camara.service';
import { IonicModule, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

describe('AjustesPerfilParamedicoPage', () => {
  let component: AjustesPerfilParamedicoPage;
  let fixture: ComponentFixture<AjustesPerfilParamedicoPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceMock: jasmine.SpyObj<AlertasService>;
  let routerMock: jasmine.SpyObj<Router>;
  let camaraServiceMock: jasmine.SpyObj<CamaraService>;
  let locationMock: jasmine.SpyObj<Location>;
  let navControllerMock: jasmine.SpyObj<NavController>;

  const activatedRouteMock = {
    snapshot: { params: {} },
    params: new BehaviorSubject({}).asObservable(),
  };

  beforeEach(async () => {
    // Crear mocks
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerUsuario', 'modificarPersona']);
    alertasServiceMock = jasmine.createSpyObj('AlertasService', ['presentAlert']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    camaraServiceMock = jasmine.createSpyObj('CamaraService', ['tomarFoto', 'seleccionarDesdeGaleria']);
    locationMock = jasmine.createSpyObj('Location', ['back']);
    navControllerMock = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);

    // Configurar módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [AjustesPerfilParamedicoPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
        { provide: CamaraService, useValue: camaraServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Mock actualizado
        { provide: NavController, useValue: navControllerMock },   // Mock para NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AjustesPerfilParamedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
