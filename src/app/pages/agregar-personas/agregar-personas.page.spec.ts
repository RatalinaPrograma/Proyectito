import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPersonasPage } from './agregar-personas.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiciobdService } from '../services/serviciobd.service';
import { AlertasService } from '../services/alertas.service';

describe('AgregarPersonasPage', () => {
  let component: AgregarPersonasPage;
  let fixture: ComponentFixture<AgregarPersonasPage>;

  // Mock de los servicios utilizados
  const mockServiciobdService = {
    register: jasmine.createSpy('register').and.returnValue(Promise.resolve(true)),
  };

  const mockAlertasService = {
    presentAlert: jasmine.createSpy('presentAlert').and.returnValue(Promise.resolve()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarPersonasPage],
      imports: [
        FormsModule,
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ServiciobdService, useValue: mockServiciobdService }, // Mock del servicio
        { provide: AlertasService, useValue: mockAlertasService }, // Mock del servicio de alertas
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPersonasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
