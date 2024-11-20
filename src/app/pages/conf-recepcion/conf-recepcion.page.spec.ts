import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfRecepcionPage } from './conf-recepcion.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

describe('ConfRecepcionPage', () => {
  let component: ConfRecepcionPage;
  let fixture: ComponentFixture<ConfRecepcionPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let routerMock: jasmine.SpyObj<Router>;
  let alertControllerMock: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    // Crear mocks
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', [
      'obtenerMedicoPorRut',
      'obtenerEmergenciaPorId',
      'obtenerMensajeHospitalPorEmergencia',
      'guardarConfirmacion',
    ]);

    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);

    // Configurar respuestas mock
    serviciobdServiceMock.obtenerMedicoPorRut.and.returnValue(
      Promise.resolve({ idPersona: 1, nombres: 'Juan', apellidos: 'Pérez' })
    );
    serviciobdServiceMock.obtenerEmergenciaPorId.and.returnValue(
      Promise.resolve({ motivo: 'Accidente', observaciones: 'Estable' })
    );
    serviciobdServiceMock.obtenerMensajeHospitalPorEmergencia.and.returnValue(
      Promise.resolve('Mensaje del hospital')
    );
    serviciobdServiceMock.guardarConfirmacion.and.returnValue(Promise.resolve());

    alertControllerMock.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy('present'),
      } as any)
    );

    // Configurar el módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [ConfRecepcionPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertController, useValue: alertControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfRecepcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los detalles correctamente', async () => {
    await component.cargarDetalles();
    expect(serviciobdServiceMock.obtenerMedicoPorRut).toHaveBeenCalledWith('12345678-9');
    expect(serviciobdServiceMock.obtenerEmergenciaPorId).toHaveBeenCalledWith(1);
    expect(serviciobdServiceMock.obtenerMensajeHospitalPorEmergencia).toHaveBeenCalledWith(1);
    expect(component.nombreMedico).toBe('Juan');
    expect(component.apellidoMedico).toBe('Pérez');
    expect(component.motivoEmergencia).toBe('Accidente');
    expect(component.observacionesEmergencia).toBe('Estable');
  });
});
