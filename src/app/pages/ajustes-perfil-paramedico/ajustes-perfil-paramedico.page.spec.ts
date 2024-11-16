import { TestBed } from '@angular/core/testing';
import { AjustesPerfilParamedicoPage } from './ajustes-perfil-paramedico.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('AjustesPerfilParamedicoPage', () => {
  let component: AjustesPerfilParamedicoPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjustesPerfilParamedicoPage],
      providers: [
        { provide: ServiciobdService, useValue: {} }, // Mock del servicio
        { provide: SQLite, useValue: {} }, // Mock del SQLite
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AjustesPerfilParamedicoPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
