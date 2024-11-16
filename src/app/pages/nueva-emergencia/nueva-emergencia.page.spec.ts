import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevaEmergenciaPage } from './nueva-emergencia.page';
import { FormsModule } from '@angular/forms'; // Si usas formularios
import { IonicModule } from '@ionic/angular'; // Importa IonicModule para los componentes de Ionic
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para simular peticiones HTTP
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Para simular observables

describe('NuevaEmergenciaPage', () => {
  let component: NuevaEmergenciaPage;
  let fixture: ComponentFixture<NuevaEmergenciaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevaEmergenciaPage],
      imports: [
        FormsModule, // Importa si usas formularios
        IonicModule.forRoot(), // Módulo de Ionic necesario para las pruebas
        HttpClientTestingModule, // Módulo para simular solicitudes HTTP
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'mockValue', // Simula parámetros de la ruta
              },
            },
          },
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
