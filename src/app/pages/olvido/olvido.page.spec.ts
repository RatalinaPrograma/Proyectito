import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OlvidoPage } from './olvido.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';

describe('OlvidoPage', () => {
  let component: OlvidoPage;
  let fixture: ComponentFixture<OlvidoPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceMock: jasmine.SpyObj<AlertasService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Crear mocks
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerUsuarioPorCorreoYRut']);
    alertasServiceMock = jasmine.createSpyObj('AlertasService', ['presentAlert']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Mock para el método obtenerUsuarioPorCorreoYRut
    serviciobdServiceMock.obtenerUsuarioPorCorreoYRut.and.returnValue(
      Promise.resolve({ idPersona: 1 }) // Simula un usuario existente
    );

    // Configurar el módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [OlvidoPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NavController, useValue: {} }, // Mock para NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OlvidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
