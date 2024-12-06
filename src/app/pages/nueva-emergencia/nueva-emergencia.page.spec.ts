import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevaEmergenciaPage } from './nueva-emergencia.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ServiciobdService } from '../services/serviciobd.service';

describe('NuevaEmergenciaPage', () => {
  let component: NuevaEmergenciaPage;
  let fixture: ComponentFixture<NuevaEmergenciaPage>;

  // Mock para ServiciobdService
  const mockServiciobdService = {
    agregarPaciente: jasmine.createSpy('agregarPaciente').and.returnValue(Promise.resolve(true)),
    listarPacientes: jasmine.createSpy('listarPacientes').and.returnValue(Promise.resolve([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevaEmergenciaPage],
      imports: [
        FormsModule,
        IonicModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'mockValue',
              },
            },
          },
        },
        {
          provide: ServiciobdService,
          useValue: mockServiciobdService, // Usamos el mock del servicio
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaEmergenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
