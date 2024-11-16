import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginParamedicoPage } from './login-paramedico.page';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertasService } from '../services/alertas.service';
import { ServiciobdService } from '../services/serviciobd.service';
import { of } from 'rxjs';

describe('LoginParamedicoPage', () => {
  let component: LoginParamedicoPage;
  let fixture: ComponentFixture<LoginParamedicoPage>;
  let alertasServiceSpy: jasmine.SpyObj<AlertasService>;
  let serviciobdServiceSpy: jasmine.SpyObj<ServiciobdService>;

  beforeEach(async () => {
    const alertasSpy = jasmine.createSpyObj('AlertasService', ['presentAlert']);
    const serviciobdSpy = jasmine.createSpyObj('ServiciobdService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginParamedicoPage],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: AlertasService, useValue: alertasSpy },
        { provide: ServiciobdService, useValue: serviciobdSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginParamedicoPage);
    component = fixture.componentInstance;
    alertasServiceSpy = TestBed.inject(AlertasService) as jasmine.SpyObj<AlertasService>;
    serviciobdServiceSpy = TestBed.inject(ServiciobdService) as jasmine.SpyObj<ServiciobdService>;
    fixture.detectChanges();
  });

  it('debería mostrar un error si el RUT o contraseña no están presentes', async () => {
    component.rut = '';
    component.password = '';
    await component.login();
    expect(alertasServiceSpy.presentAlert).toHaveBeenCalledWith('Error', 'Por favor ingrese su Rut y contraseña.');
  });

  it('debería mostrar un error si el formato del RUT es inválido', async () => {
    component.rut = '12345678';
    component.password = 'password';
    await component.login();
    expect(alertasServiceSpy.presentAlert).toHaveBeenCalledWith('Error', 'El formato del RUT es inválido.');
  });

  it('debería redirigir al home si el usuario es un paramédico', async () => {
    component.rut = '12345678-9';
    component.password = 'password';
    serviciobdServiceSpy.login.and.returnValue(
      Promise.resolve({ idRol: 2, rut: '12345678-9', nombre: 'Paramédico', idPersona: 1 })
    );
    await component.login();
    expect(serviciobdServiceSpy.login).toHaveBeenCalledWith('12345678-9', 'password');
  });

  it('debería redirigir a vista-medico si el usuario es un médico', async () => {
    component.rut = '12345678-9';
    component.password = 'password';
    serviciobdServiceSpy.login.and.returnValue(
      Promise.resolve({ idRol: 3, rut: '12345678-9', nombre: 'Médico', idPersona: 2 })
    );
    await component.login();
    expect(serviciobdServiceSpy.login).toHaveBeenCalledWith('12345678-9', 'password');
  });

  it('debería llamar a presentAlert si las credenciales son incorrectas', async () => {
    component.rut = '12345678-9';
    component.password = 'wrongpassword';
    serviciobdServiceSpy.login.and.returnValue(Promise.resolve(null));
    await component.login();
    expect(alertasServiceSpy.presentAlert).toHaveBeenCalledWith('Error de inicio de sesión', 'Rut o contraseña incorrectos.');
  });

  it('debería guardar los datos del usuario en localStorage al iniciar sesión correctamente', async () => {
    spyOn(localStorage, 'setItem');
    component.rut = '12345678-9';
    component.password = 'password';
    serviciobdServiceSpy.login.and.returnValue(
      Promise.resolve({ idRol: 2, rut: '12345678-9', nombre: 'Paramédico', idPersona: 1 })
    );
    await component.login();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'usuario',
      JSON.stringify({
        rut: '12345678-9',
        idPersona: 1,
        usuario: 'Paramédico',
        rol: 2,
      })
    );
  });

  it('debería manejar errores del servicio correctamente', async () => {
    component.rut = '12345678-9';
    component.password = 'password';
    serviciobdServiceSpy.login.and.returnValue(Promise.reject(new Error('Error en el servidor')));
    await component.login();
    expect(alertasServiceSpy.presentAlert).toHaveBeenCalledWith('Error', 'Error en el servidor');
  });
});
