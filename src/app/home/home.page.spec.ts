import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiciobdService } from '../pages/services/serviciobd.service';
import { Browser } from '@capacitor/browser';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let navCtrlMock: jasmine.SpyObj<NavController>;
  let routerMock: jasmine.SpyObj<Router>;
  let serviciobdMock: jasmine.SpyObj<ServiciobdService>;
  let browserSpy: jasmine.Spy;

  beforeEach(async () => {
    // Crear mocks para las dependencias
    navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    serviciobdMock = jasmine.createSpyObj('ServiciobdService', [
      'obtenerUltimasEmergenciasActivas',
      'verificarEstadoEmergencia',
      'actualizarEstadoEmergencia',
    ]);

    // Espiar el método Browser.open
    browserSpy = spyOn(Browser, 'open').and.returnValue(Promise.resolve());

    // Configurar el módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: NavController, useValue: navCtrlMock },
        { provide: Router, useValue: routerMock },
        { provide: ServiciobdService, useValue: serviciobdMock },
      ],
    }).compileComponents();

    // Crear instancia del componente
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('debería inicializar correctamente el componente y cargar emergencias activas', async () => {
    const emergenciasMock = [
      { idEmerg: 1, motivo: 'Accidente', desc_motivo: 'Choque múltiple' },
      { idEmerg: 2, motivo: 'Incendio', desc_motivo: 'Casa en llamas' },
    ];

    serviciobdMock.obtenerUltimasEmergenciasActivas.and.returnValue(Promise.resolve(emergenciasMock));
    serviciobdMock.verificarEstadoEmergencia.and.returnValue(Promise.resolve());

    await component.ngOnInit();

    expect(serviciobdMock.obtenerUltimasEmergenciasActivas).toHaveBeenCalled();
    expect(serviciobdMock.verificarEstadoEmergencia).toHaveBeenCalledTimes(2); // Verifica el estado de dos emergencias
    expect(component.emergenciasActivas).toEqual(emergenciasMock);
  });


  it('debería obtener datos de usuario desde localStorage', () => {
    const usuarioMock = { rol: 2, rut: '12345678-9' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(usuarioMock));

    component.obtenerDatosUsuario();

    expect(component.idRolUsuario).toEqual(2);
    expect(component.rutUsuario).toEqual('12345678-9');
  });
});
