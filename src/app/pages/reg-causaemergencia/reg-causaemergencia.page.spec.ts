import { TestBed } from '@angular/core/testing';
import { RegCausaEmergenciaPage } from './reg-causaemergencia.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('RegCausaEmergenciaPage', () => {
  let component: RegCausaEmergenciaPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegCausaEmergenciaPage],
      providers: [
        { provide: SQLite, useValue: {} }, // Mock del servicio SQLite
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RegCausaEmergenciaPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
