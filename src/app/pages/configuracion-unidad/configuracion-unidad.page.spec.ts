import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguracionUnidadPage } from './configuracion-unidad.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ConfiguracionUnidadPage', () => {
  let component: ConfiguracionUnidadPage;
  let fixture: ComponentFixture<ConfiguracionUnidadPage>;
  let serviciobdMock: jasmine.SpyObj<ServiciobdService>;
  let alertCtrlMock: jasmine.SpyObj<AlertController>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const sqliteMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({})),
    };

    serviciobdMock = jasmine.createSpyObj('ServiciobdService', [
      'listarEstados',
      'verificarAmbulanciaPorPatente',
      'agregarAmbulancia',
    ]);
    alertCtrlMock = jasmine.createSpyObj('AlertController', ['create']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    serviciobdMock.listarEstados.and.returnValue(Promise.resolve([{ idestado: 1, nombre: 'Disponible' }]));
    serviciobdMock.verificarAmbulanciaPorPatente.and.returnValue(Promise.resolve(false));
    serviciobdMock.agregarAmbulancia.and.returnValue(Promise.resolve({ insertId: 1 }));

    alertCtrlMock.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy('present'),
      } as any)
    );

    await TestBed.configureTestingModule({
      declarations: [ConfiguracionUnidadPage],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdMock },
        { provide: AlertController, useValue: alertCtrlMock },
        { provide: Router, useValue: routerMock },
        { provide: 'SQLite', useValue: sqliteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracionUnidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
