import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesCasoAnteriorPage } from './detalles-caso-anterior.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';

describe('DetallesCasoAnteriorPage', () => {
  let component: DetallesCasoAnteriorPage;
  let fixture: ComponentFixture<DetallesCasoAnteriorPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;

  beforeEach(async () => {
    // Crear mocks
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerUltimaEmergencia']);

    // Mock del método obtenerUltimaEmergencia
    serviciobdServiceMock.obtenerUltimaEmergencia.and.returnValue(
      Promise.resolve({
        fecha_emer: '2023-11-17',
        motivo: 'Accidente',
        estado: 'Resuelto',
        desc_motivo: 'Colisión múltiple',
        observaciones: 'Paciente estable',
        idHospital: 'Hospital Central',
      })
    );

    // Configurar el módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [DetallesCasoAnteriorPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesCasoAnteriorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener la última emergencia correctamente', async () => {
    await component.obtenerUltimaEmergencia();
    expect(serviciobdServiceMock.obtenerUltimaEmergencia).toHaveBeenCalled();
    expect(component.emergencia.motivo).toBe('Accidente');
  });

  it('debería mostrar un error si no hay emergencias registradas', async () => {
    serviciobdServiceMock.obtenerUltimaEmergencia.and.returnValue(Promise.resolve(null));

    spyOn(component, 'presentAlert');
    await component.obtenerUltimaEmergencia();
    expect(component.presentAlert).toHaveBeenCalledWith(
      'Error',
      'No se encontraron emergencias registradas.'
    );
  });
});

