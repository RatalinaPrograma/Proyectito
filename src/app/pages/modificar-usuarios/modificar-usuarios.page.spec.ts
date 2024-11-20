import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarUsuariosPage } from './modificar-usuarios.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { CamaraService } from '../services/camara.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

describe('ModificarUsuariosPage', () => {
  let component: ModificarUsuariosPage;
  let fixture: ComponentFixture<ModificarUsuariosPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceMock: jasmine.SpyObj<AlertasService>;
  let camaraServiceMock: jasmine.SpyObj<CamaraService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Mock de Servicios
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerUsuario', 'modificarPersona']);
    alertasServiceMock = jasmine.createSpyObj('AlertasService', ['presentAlert']);
    camaraServiceMock = jasmine.createSpyObj('CamaraService', ['tomarFoto', 'seleccionarDesdeGaleria']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'), // Simula el ID de usuario en la URL
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
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        {
          provide: 'SQLite', // Mock para SQLite
          useValue: jasmine.createSpyObj('SQLite', ['create']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', async () => {
    const mockUser = {
      idPersona: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
      rut: '12345678-9',
      correo: 'juan@example.com',
      clave: 'password123',
      telefono: '+56912345678',
      foto: null,
      idRol: 2,
    };

    serviciobdServiceMock.obtenerUsuario.and.returnValue(Promise.resolve(mockUser));
    await component.cargarDatosUsuario();
    expect(component.persona).toEqual(mockUser);
    expect(serviciobdServiceMock.obtenerUsuario).toHaveBeenCalledWith(1);
  });
});
