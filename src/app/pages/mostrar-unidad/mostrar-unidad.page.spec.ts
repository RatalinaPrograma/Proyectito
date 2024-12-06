import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostrarUnidadPage } from './mostrar-unidad.page';
import { ServiciobdService } from '../services/serviciobd.service';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

describe('MostrarUnidadPage', () => {
  let component: MostrarUnidadPage;
  let fixture: ComponentFixture<MostrarUnidadPage>;
  let serviciobdServiceMock: jasmine.SpyObj<ServiciobdService>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Mock de ServiciobdService
    serviciobdServiceMock = jasmine.createSpyObj('ServiciobdService', ['obtenerAmbulanciaPorId']);
    serviciobdServiceMock.obtenerAmbulanciaPorId.and.returnValue(Promise.resolve({})); // Retorna una promesa vacía

    // Mock de ActivatedRoute
    activatedRouteMock = {
      snapshot: { paramMap: { get: () => '1' } }, // Devuelve un ID simulado
    };

    await TestBed.configureTestingModule({
      declarations: [MostrarUnidadPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: serviciobdServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MostrarUnidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
