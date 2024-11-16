import { TestBed } from '@angular/core/testing';
import { BuscarAmbulanciaPage } from './buscar-ambulancia.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('BuscarAmbulanciaPage', () => {
  let component: BuscarAmbulanciaPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuscarAmbulanciaPage],
      providers: [
        { provide: ServiciobdService, useValue: {} }, // Mock del servicio
        { provide: SQLite, useValue: {} }, // Mock del SQLite
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BuscarAmbulanciaPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
