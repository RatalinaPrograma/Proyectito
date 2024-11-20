import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiciobdService } from '../pages/services/serviciobd.service';
import { AlertasService } from '../pages/services/alertas.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let serviciobdServiceSpy: jasmine.SpyObj<ServiciobdService>;
  let alertasServiceSpy: jasmine.SpyObj<AlertasService>;

  // Mock para SQLite
  const mockSQLite = {
    createConnection: jasmine.createSpy('createConnection').and.returnValue(Promise.resolve({})),
    closeConnection: jasmine.createSpy('closeConnection').and.returnValue(Promise.resolve()),
    execute: jasmine.createSpy('execute').and.returnValue(Promise.resolve({ rows: [] })),
  };

  beforeEach(async () => {
    // Configuración del TestBed
    serviciobdServiceSpy = jasmine.createSpyObj('ServiciobdService', ['getData', 'executeQuery']);
    alertasServiceSpy = jasmine.createSpyObj('AlertasService', ['presentAlert']);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: SQLite, useValue: mockSQLite }, // Uso del mock para SQLite
        { provide: ServiciobdService, useValue: serviciobdServiceSpy }, // Mock del servicio de BD
        { provide: AlertasService, useValue: alertasServiceSpy }, // Mock de alertas
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
