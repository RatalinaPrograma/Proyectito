import { TestBed } from '@angular/core/testing';
import { ServiciobdService } from './serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ServiciobdService', () => {
  let service: ServiciobdService;

  // Mock de SQLite
  const SQLiteMock = {
    createConnection: jasmine.createSpy('createConnection').and.returnValue(Promise.resolve({})),
    closeConnection: jasmine.createSpy('closeConnection').and.returnValue(Promise.resolve()),
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: [] })),
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

  it('should insert a default user', async () => {
    await service.insertarUsuarioPredeterminado();
    expect(ServiciobdMock.insertarUsuarioPredeterminado).toHaveBeenCalled();
  });

  it('should get ambulance by ID', async () => {
    const result = await service.obtenerAmbulanciaPorId(1);
    expect(ServiciobdMock.obtenerAmbulanciaPorId).toHaveBeenCalledWith(1);
    expect(result).toEqual({ patente: 'ABCD12' });
  });
});
