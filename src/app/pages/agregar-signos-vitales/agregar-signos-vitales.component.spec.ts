import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AgregarSignosVitalesComponent } from './agregar-signos-vitales.component';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ServiciobdService } from '../services/serviciobd.service';

describe('AgregarSignosVitalesComponent', () => {
  let component: AgregarSignosVitalesComponent;

  const SQLiteMock = {
    createConnection: jasmine.createSpy('createConnection').and.returnValue(Promise.resolve({})),
    closeConnection: jasmine.createSpy('closeConnection').and.returnValue(Promise.resolve()),
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: [] })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarSignosVitalesComponent],
      imports: [FormsModule], // Agregar FormsModule
      providers: [
        { provide: SQLite, useValue: SQLiteMock },
        { provide: ServiciobdService, useClass: ServiciobdService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AgregarSignosVitalesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
