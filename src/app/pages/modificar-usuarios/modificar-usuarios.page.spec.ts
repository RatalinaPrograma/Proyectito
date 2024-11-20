import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarUsuariosPage } from './modificar-usuarios.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { CamaraService } from '../services/camara.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, IonicModule } from '@ionic/angular';

describe('ModificarUsuariosPage', () => {
  let component: ModificarUsuariosPage;
  let fixture: ComponentFixture<ModificarUsuariosPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceMock: jasmine.SpyObj<AlertasService>;
  let camaraServiceMock: jasmine.SpyObj<CamaraService>;
  let routerMock: jasmine.SpyObj<Router>;
  let navControllerMock: jasmine.SpyObj<NavController>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerUsuario', 'modificarPersona']);
    alertasServiceMock = jasmine.createSpyObj('AlertasService', ['presentAlert']);
    camaraServiceMock = jasmine.createSpyObj('CamaraService', ['tomarFoto', 'seleccionarDesdeGaleria']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    navControllerMock = jasmine.createSpyObj('NavController', ['navigateForward']);
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'), // Simula el ID de usuario desde la URL
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [ModificarUsuariosPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: CamaraService, useValue: camaraServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NavController, useValue: navControllerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
