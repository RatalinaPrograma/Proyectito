import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Si usas formularios
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para servicios HTTP

import { AgregarSignosVitalesComponent } from './agregar-signos-vitales.component';

describe('AgregarSignosVitalesComponent', () => {
  let component: AgregarSignosVitalesComponent;
  let fixture: ComponentFixture<AgregarSignosVitalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarSignosVitalesComponent],
      imports: [
        IonicModule.forRoot(),
        FormsModule, 
        ReactiveFormsModule, 
        HttpClientTestingModule, 
      ],
      providers: [
        // Agrega servicios necesarios aquí si el componente depende de ellos
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarSignosVitalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
