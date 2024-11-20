import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarUnidadPage } from './editar-unidad.page';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciobdService } from '../services/serviciobd.service';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('EditarUnidadPage', () => {
  let component: EditarUnidadPage;
  let fixture: ComponentFixture<EditarUnidadPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;
  let navControllerMock: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    // Crear mocks
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', [
      'obtenerAmbulanciaPorId',
      'listarEstados',
      'actualizarAmbulancia',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    navControllerMock = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);

    // Mock para ActivatedRoute
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'), // Simula el ID de la unidad desde la URL
        },
      },
    };

    // Mock para los métodos del servicio
    serviciobdServiceMock.obtenerAmbulanciaPorId.and.returnValue(
      Promise.resolve({
        patente: 'AB-123',
        equipada: true,
        fec_mant: '2023-11-01',
        idestado: 1,
      })
    );

    serviciobdServiceMock.listarEstados.and.returnValue(
      Promise.resolve([
        { id: 1, nombre: 'Disponible' },
        { id: 2, nombre: 'En reparación' },
      ])
    );

    serviciobdServiceMock.actualizarAmbulancia.and.returnValue(Promise.resolve());

    // Configurar el módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [EditarUnidadPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NavController, useValue: navControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarUnidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
