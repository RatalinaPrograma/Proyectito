import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterParamedicoPage } from './register-paramedico.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

describe('RegisterParamedicoPage', () => {
  let component: RegisterParamedicoPage;
  let fixture: ComponentFixture<RegisterParamedicoPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceMock: jasmine.SpyObj<AlertasService>;
  let routerMock: jasmine.SpyObj<Router>;
  let navControllerMock: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    // Crear mocks
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['register']);
    alertasServiceMock = jasmine.createSpyObj('AlertasService', ['presentAlert']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    navControllerMock = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);

    // Configurar el módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [RegisterParamedicoPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NavController, useValue: navControllerMock }, // Mock de NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterParamedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería registrar correctamente a un usuario', async () => {
    serviciobdServiceMock.register.and.returnValue(Promise.resolve(true));

    component.persona = {
      nombres: 'Juan',
      apellidos: 'Pérez',
      rut: '12345678-5',
      correo: 'juan.perez@example.com',
      clave: 'Password1!',
      confirmarClave: 'Password1!',
      telefono: '+56912345678',
      foto: '',
      idRol: 2,
    };

    await component.onRegister();

    expect(serviciobdServiceMock.register).toHaveBeenCalledWith({
      nombres: 'Juan',
      apellidos: 'Pérez',
      rut: '12345678-5',
      correo: 'juan.perez@example.com',
      clave: 'Password1!',
      confirmarClave: 'Password1!',
      telefono: '+56912345678',
      foto: '',
      idRol: 2,
    });
    expect(alertasServiceMock.presentAlert).toHaveBeenCalledWith(
      'Registro exitoso',
      'Usuario registrado correctamente.'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login-paramedico']);
  });

  it('debería mostrar un error si el usuario ya está registrado', async () => {
    serviciobdServiceMock.register.and.returnValue(Promise.resolve(false));

    component.persona = {
      nombres: 'Juan',
      apellidos: 'Pérez',
      rut: '12345678-5',
      correo: 'juan.perez@example.com',
      clave: 'Password1!',
      confirmarClave: 'Password1!',
      telefono: '+56912345678',
      foto: '',
      idRol: 2,
    };

    await component.onRegister();

    expect(serviciobdServiceMock.register).toHaveBeenCalledWith({
      nombres: 'Juan',
      apellidos: 'Pérez',
      rut: '12345678-5',
      correo: 'juan.perez@example.com',
      clave: 'Password1!',
      confirmarClave: 'Password1!',
      telefono: '+56912345678',
      foto: '',
      idRol: 2,
    });
    expect(alertasServiceMock.presentAlert).toHaveBeenCalledWith(
      'Error en registro',
      'Este usuario ya está registrado.'
    );
  });

  it('debería mostrar un error si faltan campos obligatorios en el formulario', () => {
    component.persona = {
      nombres: '',
      apellidos: '',
      rut: '',
      correo: '',
      clave: '',
      confirmarClave: '',
      telefono: '',
      foto: '',
      idRol: 2,
    };
    const mensajeError = component['validarFormulario']();
    expect(mensajeError).toBe('Todos los campos son obligatorios.');
  });

  it('debería validar correctamente el formulario cuando está completo', () => {
    component.persona = {
      nombres: 'Juan',
      apellidos: 'Pérez',
      rut: '12345678-5',
      correo: 'juan.perez@example.com',
      clave: 'Password1!',
      confirmarClave: 'Password1!',
      telefono: '+56912345678',
      foto: '',
      idRol: 2,
    };
    const mensajeError = component['validarFormulario']();
    expect(mensajeError).toBe('');
  });
});
