import { TestBed } from '@angular/core/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiciobdService } from '../pages/services/serviciobd.service';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;

  const SQLiteMock = {
    createConnection: jasmine.createSpy('createConnection').and.returnValue(Promise.resolve({})),
    closeConnection: jasmine.createSpy('closeConnection').and.returnValue(Promise.resolve()),
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: [] })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: SQLite, useValue: SQLiteMock }, // Mock de SQLite
        { provide: ServiciobdService, useClass: ServiciobdService }, // Servicio a probar
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
