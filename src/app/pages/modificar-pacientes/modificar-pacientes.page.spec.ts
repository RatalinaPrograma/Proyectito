import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarPacientesPage } from './modificar-pacientes.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ModificarPacientesPage', () => {
  let component: ModificarPacientesPage;
  let fixture: ComponentFixture<ModificarPacientesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificarPacientesPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: ServiciobdService, useValue: {} },
        { provide: AlertController, useValue: {} },
        { provide: Location, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '12345678-9' } } } },
        { provide: SQLite, useValue: {} }, // Mock vacío para SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarPacientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
