import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiciobdService } from '../pages/services/serviciobd.service';
import { Browser } from '@capacitor/browser';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mockNavController: jasmine.SpyObj<NavController>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockServiciobd: jasmine.SpyObj<ServiciobdService>;

  beforeEach(async () => {
    mockNavController = jasmine.createSpyObj('NavController', ['navigateRoot']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockServiciobd = jasmine.createSpyObj('ServiciobdService', [
      'obtenerUltimasEmergenciasActivas',
      'actualizarEstadoEmergencia',
    ]);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      providers: [
        { provide: NavController, useValue: mockNavController },
        { provide: Router, useValue: mockRouter },
        { provide: ServiciobdService, useValue: mockServiciobd },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería abrir un navegador externo con una URL específica', async () => {
    const browserSpy = spyOn(Browser, 'open').and.returnValue(Promise.resolve()); // Mock de Browser.open

    // Llamar al método y verificar la URL
    await component.abrirNavegador();
    expect(browserSpy).toHaveBeenCalledWith({ url: 'https://www.davila.cl' });

    await component.abrirNavegador2();
    expect(browserSpy).toHaveBeenCalledWith({ url: 'https://complejohospitalariosanjose.cl' });
  });
});
