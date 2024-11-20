import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginParamedicoPage } from './login-paramedico.page';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertasService } from '../services/alertas.service';
import { ServiciobdService } from '../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('LoginParamedicoPage', () => {
  let component: LoginParamedicoPage;
  let fixture: ComponentFixture<LoginParamedicoPage>;
  let alertasServiceSpy: jasmine.SpyObj<AlertasService>;
  let serviciobdServiceSpy: jasmine.SpyObj<ServiciobdService>;

  beforeEach(async () => {
    // Mock de AlertasService
    const alertasSpy = jasmine.createSpyObj('AlertasService', ['presentAlert']);

    // Mock de ServiciobdService
    const mockServiciobdService = {
      login: jasmine.createSpy('login').and.returnValue(Promise.resolve(null)), // Simula login
      someSQLiteMethod: jasmine.createSpy('someSQLiteMethod').and.returnValue(Promise.resolve({})),
    };

    // Mock de SQLite
    const mockSQLite = {
      createConnection: jasmine.createSpy('createConnection').and.returnValue(Promise.resolve({})),
      closeConnection: jasmine.createSpy('closeConnection').and.returnValue(Promise.resolve()),
      execute: jasmine.createSpy('execute').and.returnValue(Promise.resolve({ rows: [] })),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginParamedicoPage],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: AlertasService, useValue: alertasSpy },
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: SQLite, useValue: mockSQLite },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginParamedicoPage);
    component = fixture.componentInstance;
    alertasServiceSpy = TestBed.inject(AlertasService) as jasmine.SpyObj<AlertasService>;
    serviciobdServiceSpy = TestBed.inject(ServiciobdService) as jasmine.SpyObj<ServiciobdService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar un error si el RUT o contraseña no están presentes', async () => {
    component.rut = '';
    component.password = '';
    await component.login();
    expect(alertasServiceSpy.presentAlert).toHaveBeenCalledWith('Error', 'Por favor ingrese su Rut y contraseña.');
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
});
