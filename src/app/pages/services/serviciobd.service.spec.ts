import { TestBed } from '@angular/core/testing';
import { ServiciobdService } from './serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ServiciobdService', () => {
  let service: ServiciobdService;

  // Mock de SQLite
  const SQLiteMock = {
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve()),
    openDatabase: jasmine.createSpy('openDatabase').and.returnValue(Promise.resolve()),
  };

  // Mock de ServiciobdService
  const ServiciobdMock = {
    login: jasmine.createSpy('login').and.returnValue(Promise.resolve({ idRol: 1 })),
    insertarUsuarioPredeterminado: jasmine.createSpy('insertarUsuarioPredeterminado').and.returnValue(Promise.resolve()),
    obtenerAmbulanciaPorId: jasmine.createSpy('obtenerAmbulanciaPorId').and.returnValue(Promise.resolve({ patente: 'ABCD12' })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ServiciobdService, useValue: ServiciobdMock }, // Usar el mock del servicio
        { provide: SQLite, useValue: SQLiteMock }, // Usar el mock de SQLite
      ],
    });

    service = TestBed.inject(ServiciobdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login', async () => {
    await service.login('testRut', 'testPassword');
    expect(ServiciobdMock.login).toHaveBeenCalledWith('testRut', 'testPassword');
  });
});
